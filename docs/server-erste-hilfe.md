<!-- markdownlint-disable MD013 -->

# Server-Erste-Hilfe: In Case of Fire

Dieses Runbook ist für akute serverseitige Probleme gedacht: 500er, 404, kaputtes TLS-Zertifikat, volle Platte, Nginx-/Docker-Probleme oder nicht erreichbare App.

Es ergänzt [deployment-debian-root-server.md](deployment-debian-root-server.md) und nutzt dessen Produktionsannahmen:

- Repo auf dem Server, typischerweise: `/home/deploy/arsnova.eu`
- Compose-Datei: `docker-compose.prod.yml`
- Env-Datei: `.env.production`
- Container: `arsnova-v3-app`, `arsnova-v3-postgres`, `arsnova-v3-redis`
- App lokal: `127.0.0.1:3000`
- tRPC-WebSocket: `127.0.0.1:3001`
- Yjs-WebSocket: `127.0.0.1:3002`
- Nginx als einziger öffentlicher Einstieg auf 80/443

## 0. Sofortregeln

1. In einer zweiten SSH-Session arbeiten, bevor Dienste neu gestartet werden.
2. Erst Diagnose, dann Neustart. Uhrzeit, Symptom und letzte Änderung notieren.
3. Nie `docker volume prune`, `docker compose down -v`, `rm -rf /var/lib/docker` oder manuelles Löschen im PostgreSQL-Volume ausführen, solange kein aktuelles Backup und Restore-Plan vorliegen.
4. Bei Zertifikats- oder Nginx-Änderungen immer zuerst `sudo nginx -t`.
5. Bei DB-/Volume-Problemen zuerst ein Backup versuchen, auch wenn es nur teilweise gelingt.

## 1. Standard-Triage in 2 Minuten

Auf dem Server:

```bash
cd /home/deploy/arsnova.eu
COMPOSE='docker compose -f docker-compose.prod.yml --env-file .env.production'

date -Is
git log -1 --oneline
uptime
free -h
df -h

$COMPOSE ps
sudo systemctl status nginx --no-pager
sudo nginx -t

curl -I https://arsnova.eu/
curl -fsS http://127.0.0.1:3000/trpc/health.check
curl -fsS http://127.0.0.1:3000/de/ | head
```

Direkt danach die letzten Logs sichern:

```bash
$COMPOSE logs --tail=200 app
$COMPOSE logs --tail=100 postgres
$COMPOSE logs --tail=100 redis
sudo journalctl -u nginx -n 100 --no-pager
sudo tail -n 100 /var/log/nginx/arsnova_click_error.log
```

## 2. Häufigste Ursachen zuerst

Diese Reihenfolge ist nach erwartbarer Eintrittswahrscheinlichkeit sortiert. Nutze sie nach der Standard-Triage, wenn noch keine klare Ursache sichtbar ist.

| Priorität | Verdacht                                     | Schnell prüfen                                                        | Nächster Abschnitt                                        |
| --------- | -------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| 1         | App-/Containerproblem, 500/502/504           | `$COMPOSE ps`, `$COMPOSE logs --tail=200 app`, lokaler `health.check` | [HTTP 500 / 502 / 504](#http-500-502-504)                 |
| 2         | Nginx-/Reverse-Proxy-Problem                 | `sudo nginx -t`, Nginx-Logs, lokal 3000 ok aber extern kaputt         | [Nginx neu laden oder neu starten](#nginx-restart)        |
| 3         | Stack hängt nach Deploy oder Neustart        | Container fehlen, App nicht healthy, `docker compose ps` auffällig    | [App oder Stack neu starten](#app-stack-neustarten)       |
| 4         | 404 durch Build-, Asset- oder Routingproblem | `/de/`, `/assets/...`, App-Logs, letzter Deploy                       | [HTTP 404](#http-404)                                     |
| 5         | Platte voll, Docker-Logs oder Build-Layer    | `df -h`, `docker system df`, `/var/lib/docker` groß                   | [Server-Platte vollgelaufen](#platte-voll)                |
| 6         | Redis-Problem                                | Redis-Container, `redis-cli ping`, Admin-/Host-Sessions auffällig     | [Redis-Probleme](#redis)                                  |
| 7         | WebSockets oder Live-Sync kaputt             | App lädt, aber Host/Presenter/Vote aktualisieren nicht live           | [WebSockets oder Live-Sync kaputt](#websockets-live-sync) |
| 8         | Admin-Login oder Admin-Flows kaputt          | `ADMIN_SECRET`, Redis, App-Logs                                       | [Admin-Login oder Admin-Flows kaputt](#admin-login)       |
| 9         | PostgreSQL-Problem                           | Postgres nicht healthy, Prisma-/DB-Fehler in App-Logs                 | [PostgreSQL-Probleme](#postgresql)                        |
| 10        | Zertifikat ungültig oder abgelaufen          | `certbot certificates`, `curl -Iv`, DNS                               | [Zertifikat ungültig oder abgelaufen](#tls-zertifikat)    |

## 3. Was ist betroffen?

| Symptom                                        | Schnelltest                                                   | Wahrscheinliche Ebene                              |
| ---------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| `https://arsnova.eu` komplett nicht erreichbar | `curl -I https://arsnova.eu/` scheitert                       | DNS, TLS, Nginx, Firewall, Server down             |
| `https://arsnova.eu` liefert 502/504           | `curl -fsS http://127.0.0.1:3000/trpc/health.check` scheitert | App-Container oder Backend                         |
| Extern 500, lokal 3000 ok                      | Nginx-Logs prüfen                                             | Reverse Proxy, Pfad, Header, TLS                   |
| `/de/` 404 oder leere App                      | `curl -fsS http://127.0.0.1:3000/de/`                         | Frontend-Build, Static Serving, Deploy             |
| Nur Live-Updates/Quiz-Sync kaputt              | Host/Present/Vote laden, aber Live-Sync hängt                 | WebSocket-Proxy 3001/3002, Redis, Client-Reconnect |
| Admin-Login kaputt                             | App läuft, `/admin` Login scheitert                           | `.env.production`, `ADMIN_SECRET`, Redis           |
| Zertifikat ungültig                            | Browser warnt, `certbot certificates` prüfen                  | Let's Encrypt, Nginx, DNS, Zeit                    |
| Fehler nach Deploy                             | `git log -1`, App-Logs, Migrationen                           | Code/Build/Migration/Env                           |

<a id="app-stack-neustarten" name="app-stack-neustarten"></a>

## 4. App oder Stack neu starten

### Nur App neu starten

Bevorzugt, wenn DB und Redis gesund sind:

```bash
cd /home/deploy/arsnova.eu
COMPOSE='docker compose -f docker-compose.prod.yml --env-file .env.production'

$COMPOSE restart app
$COMPOSE ps
$COMPOSE logs -f --tail=100 app
```

Danach prüfen:

```bash
curl -fsS http://127.0.0.1:3000/trpc/health.check
curl -I https://arsnova.eu/de/
```

### Stack kontrolliert hochziehen

Wenn Container fehlen oder ein Deploy unvollständig war:

```bash
cd /home/deploy/arsnova.eu
COMPOSE='docker compose -f docker-compose.prod.yml --env-file .env.production'

$COMPOSE up -d postgres redis
$COMPOSE up -d app
$COMPOSE ps
```

### Voller Compose-Neustart

Nur wenn App-Neustart nicht reicht. Das erzeugt kurze Downtime; Redis-Zustand ist bei Redis-Neustart für flüchtige Live-Daten relevant.

```bash
cd /home/deploy/arsnova.eu
COMPOSE='docker compose -f docker-compose.prod.yml --env-file .env.production'

$COMPOSE restart
$COMPOSE ps
$COMPOSE logs --tail=100 app
```

Nicht verwenden, außer bewusst geplant:

```bash
# Nicht im Incident ausführen:
docker compose -f docker-compose.prod.yml --env-file .env.production down -v
docker volume prune
```

<a id="nginx-restart" name="nginx-restart"></a>

## 5. Nginx neu laden oder neu starten

Nach Konfigurations- oder Zertifikatsänderungen:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
```

Wenn Reload nicht reicht:

```bash
sudo nginx -t
sudo systemctl restart nginx
sudo journalctl -u nginx -n 100 --no-pager
```

Typische Ursachen:

- Syntaxfehler in `/etc/nginx/sites-available/arsnova-click`
- Zertifikatspfad fehlt oder zeigt auf falsche Domain
- Port 80/443 bereits durch anderen Dienst belegt
- WebSocket-Proxy-Header für `/trpc-ws` oder `/yjs-ws` fehlen

<a id="http-500-502-504" name="http-500-502-504"></a>

## 6. HTTP 500 / 502 / 504

### Diagnose

```bash
cd /home/deploy/arsnova.eu
COMPOSE='docker compose -f docker-compose.prod.yml --env-file .env.production'

curl -i https://arsnova.eu/trpc/health.check
curl -i http://127.0.0.1:3000/trpc/health.check

$COMPOSE ps
$COMPOSE logs --tail=200 app
sudo tail -n 100 /var/log/nginx/arsnova_click_error.log
```

Interpretation:

- Lokal 3000 kaputt: Backend/App prüfen.
- Lokal 3000 ok, extern kaputt: Nginx, TLS, Proxy oder Firewall prüfen.
- App restartet wiederholt: `docker inspect arsnova-v3-app --format '{{.State.Health.Status}} {{.RestartCount}}'` und App-Logs lesen.
- Fehler nach Migration: Postgres-Logs und Prisma-Migrationsstand prüfen.

### Sofortmaßnahmen

```bash
$COMPOSE restart app
curl -fsS http://127.0.0.1:3000/trpc/health.check
```

Wenn der Fehler direkt nach einem Deploy kam:

```bash
git log --oneline -5
$COMPOSE logs --tail=200 app
```

Ein Rollback sollte nur auf einen bekannten guten Commit/Tag erfolgen und danach Migrationen/Schema beachten. Bei Datenbankmigrationen ist Rückrollen ohne expliziten Plan riskant.

<a id="http-404" name="http-404"></a>

## 7. HTTP 404

### Frontend-Shell fehlt

```bash
curl -i https://arsnova.eu/de/
curl -i http://127.0.0.1:3000/de/
$COMPOSE logs --tail=120 app
```

Wenn lokal `/de/` nicht ausgeliefert wird:

```bash
cd /home/deploy/arsnova.eu
npm run build:prod
$COMPOSE up -d app
```

Auf dem Server ist normalerweise `./scripts/deploy.sh` der bessere Weg, weil Build, Migrationen und Healthcheck zusammenlaufen:

```bash
DEPLOY_BRANCH=main ./scripts/deploy.sh
```

### Assets oder Locale-Dateien 404

Prüfen:

```bash
curl -I https://arsnova.eu/de/
curl -I https://arsnova.eu/de/assets/icons/favicon.svg
curl -I https://arsnova.eu/assets/icons/favicon.svg
```

Mögliche Ursachen:

- falscher Frontend-Build oder unvollständiges `dist/browser`
- Nginx leitet nicht auf die App, sondern auf altes Static-Verzeichnis
- Locale-/Base-Href-Problem nach Build-Änderung
- Browser-/Service-Worker-Cache; mit privatem Fenster gegenprüfen

<a id="tls-zertifikat" name="tls-zertifikat"></a>

## 8. Zertifikat ungültig oder abgelaufen

### Diagnose

```bash
date -Is
timedatectl
sudo certbot certificates
sudo systemctl status certbot.timer --no-pager
sudo nginx -t
curl -Iv https://arsnova.eu/
```

Zusätzlich DNS prüfen:

```bash
dig +short arsnova.eu A
dig +short arsnova.eu AAAA
dig +short www.arsnova.eu A
dig +short www.arsnova.eu AAAA
```

### Erneuern

```bash
sudo certbot renew --dry-run
sudo certbot renew
sudo nginx -t
sudo systemctl reload nginx
```

Wenn Certbot scheitert:

- DNS zeigt noch auf falsche IP.
- Port 80 ist von Firewall oder Nginx-Regel blockiert.
- Nginx-Konfiguration für `/.well-known/acme-challenge/` fehlt oder wird nicht erreicht.
- Zertifikat wurde für andere Domain ausgestellt als Nginx `server_name`.

<a id="platte-voll" name="platte-voll"></a>

## 9. Server-Platte vollgelaufen

### Diagnose

```bash
df -h
df -ih
sudo du -xh --max-depth=1 / | sort -h
sudo du -xh --max-depth=1 /var | sort -h
sudo du -xh --max-depth=1 /var/lib | sort -h
sudo du -xh --max-depth=1 /var/lib/docker | sort -h
sudo du -xh --max-depth=1 /var/lib/containerd | sort -h
docker info | grep -i "Docker Root Dir"
docker system df
```

Typische große Bereiche:

- `/var/lib/docker/containers` - Container-Logs
- `/var/lib/docker/overlay2` - Images/Build-Layer
- `/var/lib/docker/volumes` - PostgreSQL/Redis-Daten; nicht blind löschen
- `/var/lib/containerd` - häufig BuildKit-/containerd-Cache, wenn Docker-Builds lokal laufen
- `/var/log` - System- und Nginx-Logs
- `/home/deploy/arsnova.eu` - Repo, Build-Artefakte, lokale Backups

### Docker BuildKit-/containerd-Cache sehr groß

Dieser Fall ist wahrscheinlich, wenn `/var/lib/containerd` sehr groß ist und `docker system df` bei `Build Cache` viel reclaimable Speicher zeigt.

Sichere Sofortmaßnahme:

```bash
docker builder prune -af
df -h
docker system df
sudo du -xh --max-depth=1 /var/lib | sort -h
```

Für regelmäßige Pflege mit Zielgröße:

```bash
docker builder prune -af --reserved-space 10GB
```

Hinweis: Ältere Docker-Beispiele nutzen `--keep-storage`; das Flag ist veraltet und heißt inzwischen `--reserved-space`. Das Löschen des Build-Caches entfernt keine PostgreSQL-/Redis-Volumes. Der nächste Docker-Build kann danach länger dauern.

### Regelmäßige Prävention

Zuerst prüfen, ob bereits Cronjobs oder systemd Timer für Wartung existieren:

```bash
sudo crontab -l
crontab -l
sudo ls -la /etc/cron.d /etc/cron.daily /etc/cron.weekly
systemctl list-timers
systemctl list-timers --all | grep -Ei 'docker|build|prune|containerd|cleanup'
```

Wenn kein Docker-/BuildKit-Cleanup vorhanden ist, einen systemd Timer einrichten. Ein gemeinsamer `flock` verhindert parallele Docker-Build-/Prune-Läufe, sofern Deploys denselben Lock verwenden.

Lock-Datei für `root` und den Deploy-User vorbereiten:

```bash
sudo install -o deploy -g deploy -m 0664 /dev/null /var/tmp/arsnova-docker-build.lock
```

Service anlegen:

```bash
sudo tee /etc/systemd/system/docker-build-cache-prune.service >/dev/null <<'EOF'
[Unit]
Description=Prune Docker BuildKit cache
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=/usr/bin/flock -w 1800 /var/tmp/arsnova-docker-build.lock /usr/bin/docker builder prune -af --reserved-space 10GB
EOF
```

Timer anlegen:

```bash
sudo tee /etc/systemd/system/docker-build-cache-prune.timer >/dev/null <<'EOF'
[Unit]
Description=Weekly Docker BuildKit cache prune

[Timer]
OnCalendar=Sun 04:15
Persistent=true
RandomizedDelaySec=30m

[Install]
WantedBy=timers.target
EOF
```

Aktivieren und prüfen:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now docker-build-cache-prune.timer
systemctl list-timers docker-build-cache-prune.timer
systemctl status docker-build-cache-prune.timer --no-pager
```

Deploys sollten denselben Lock verwenden, sonst kann der Timer nicht gegen einen parallel laufenden Deploy schützen:

```bash
cd /home/deploy/arsnova.eu
flock -w 1800 /var/tmp/arsnova-docker-build.lock env DEPLOY_BRANCH=main ./scripts/deploy.sh
```

Nach dem ersten Timer-Lauf prüfen:

```bash
sudo journalctl -u docker-build-cache-prune.service -n 50 --no-pager
docker system df
df -h
```

### Risikoarme Freigabe

```bash
sudo journalctl --vacuum-time=7d
sudo find /var/log -type f -name "*.gz" -mtime +14 -print
docker builder prune
docker image prune
```

Vor dem Löschen erst anzeigen lassen:

```bash
sudo du -xh --max-depth=1 /var/log | sort -h
sudo du -xh --max-depth=1 /home/deploy | sort -h
docker system df -v
```

### Docker-Logs sehr groß

```bash
sudo du -xh /var/lib/docker/containers | sort -h | tail -20
```

Logs können im Notfall pro Container trunciert werden. Vorher Container-ID ermitteln:

```bash
docker ps --no-trunc
```

Dann gezielt:

```bash
sudo truncate -s 0 /var/lib/docker/containers/<container-id>/<container-id>-json.log
```

Nicht ausführen:

```bash
# Zerstört Daten, wenn Volumes betroffen sind:
docker volume prune
docker compose -f docker-compose.prod.yml --env-file .env.production down -v
sudo rm -rf /var/lib/docker/volumes
```

<a id="postgresql" name="postgresql"></a>

## 10. PostgreSQL-Probleme

### Diagnose

```bash
cd /home/deploy/arsnova.eu
COMPOSE='docker compose -f docker-compose.prod.yml --env-file .env.production'

$COMPOSE ps postgres
$COMPOSE logs --tail=200 postgres
$COMPOSE exec postgres pg_isready -U arsnova_user -d arsnova_v3
```

Wenn Postgres nicht healthy wird:

- Platte voll?
- Passwort/DB-Name in `.env.production` und `DATABASE_URL` konsistent?
- Volume beschädigt?
- Migration hängt oder ist fehlgeschlagen?

### Backup versuchen

Wenn die DB noch erreichbar ist:

```bash
mkdir -p backups
$COMPOSE exec -T postgres pg_dump -U arsnova_user arsnova_v3 > "backups/arsnova-$(date +%F-%H%M%S).sql"
```

Danach erst invasive Maßnahmen planen.

<a id="redis" name="redis"></a>

## 11. Redis-Probleme

Redis wird für Rate-Limits, Host-/Admin-Session-Tokens und flüchtige Live-Zustände genutzt.

```bash
cd /home/deploy/arsnova.eu
COMPOSE='docker compose -f docker-compose.prod.yml --env-file .env.production'

$COMPOSE ps redis
$COMPOSE logs --tail=100 redis
$COMPOSE exec redis redis-cli ping
```

Sofortmaßnahme:

```bash
$COMPOSE restart redis
$COMPOSE restart app
```

Erwartete Wirkung: aktive Host-/Admin-Sessions oder flüchtige Live-Zustände können verloren gehen. Persistente Quiz-/Session-Daten liegen in PostgreSQL.

<a id="websockets-live-sync" name="websockets-live-sync"></a>

## 12. WebSockets oder Live-Sync kaputt

Symptome:

- Host sieht keine Live-Änderungen.
- Presenter/Vote aktualisieren erst nach Reload.
- Quiz-Sync zwischen Geräten hängt.

Prüfen:

```bash
sudo tail -n 120 /var/log/nginx/arsnova_click_error.log
$COMPOSE logs --tail=200 app
curl -I https://arsnova.eu/de/
curl -fsS http://127.0.0.1:3000/trpc/health.check
```

Dann in der Nginx-Konfiguration prüfen:

- `/trpc-ws` proxyt auf `127.0.0.1:3001`
- `/yjs-ws` proxyt auf `127.0.0.1:3002`
- `Upgrade` und `Connection` Header sind gesetzt
- Timeouts sind nicht zu niedrig

Wenn nur WebSockets betroffen sind, zuerst Nginx reloaden, dann App neu starten:

```bash
sudo nginx -t && sudo systemctl reload nginx
$COMPOSE restart app
```

<a id="admin-login" name="admin-login"></a>

## 13. Admin-Login oder Admin-Flows kaputt

```bash
cd /home/deploy/arsnova.eu
grep -n '^ADMIN_' .env.production
$COMPOSE logs --tail=120 app
$COMPOSE exec redis redis-cli ping
```

Prüfen:

- `ADMIN_SECRET` ist gesetzt und entspricht der Eingabe.
- `.env.production` wird wirklich per `env_file` geladen.
- Redis ist erreichbar, weil Admin-Sessions dort liegen.
- Nach Env-Änderungen App neu starten:

```bash
$COMPOSE restart app
```

## 14. Deploy erneut ausführen

Wenn der Server gesund ist, aber der Stand inkonsistent wirkt:

```bash
cd /home/deploy/arsnova.eu
DEPLOY_BRANCH=main ./scripts/deploy.sh
```

Das Skript führt aus:

1. Git-Sync auf den Zielbranch.
2. App-Image bauen.
3. Postgres und Redis starten.
4. Prisma-Migrationen ausführen.
5. App starten.
6. Container-Healthcheck und HTTP-Verifikation.

## 15. Nach dem Incident

Nach Stabilisierung dokumentieren:

- Zeitpunkt, Symptom, betroffene Nutzer:innen
- letzter Deploy/letzte Infrastruktur-Änderung
- Root Cause oder wahrscheinlichste Ursache
- ausgeführte Befehle
- Datenverlust ja/nein
- Follow-up: Monitoring, Backup, Logrotation, Rate-Limits, Nginx-/Compose-Anpassung, Testfall

Empfohlene Nachprüfung:

```bash
npm run verify:production-serving -- https://arsnova.eu
curl -I https://arsnova.eu/de/
curl -fsS http://127.0.0.1:3000/trpc/health.check
```

## 16. Verwandte Dokumente

- [deployment-debian-root-server.md](deployment-debian-root-server.md) - vollständiges Produktions-Setup
- [ENVIRONMENT.md](ENVIRONMENT.md) - Env-Variablen und Schnelldiagnose
- [TESTING.md](TESTING.md) - Produktions-/Smoke-Checks
- [SECURITY-OVERVIEW.md](SECURITY-OVERVIEW.md) - Sicherheits- und Datenschutzüberblick
