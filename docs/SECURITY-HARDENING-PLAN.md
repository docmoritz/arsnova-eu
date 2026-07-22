<!-- markdownlint-disable MD013 MD060 -->

# Sicherheits-Härtungsplan — arsnova.eu

**Status:** Planungsdokument / vor Implementierung  
**Stand:** 2026-07-22  
**Bezug:** externes Security-Review (Produktion + `main` `13f8c27b`, passiv, ohne Ausnutzung) inkl. UX-Follow-up und NAT-/Hörsaal-Nachtrag; interne Einordnung in derselben Session  
**Kurzreferenz Ist-Kontrollen:** [SECURITY-OVERVIEW.md](SECURITY-OVERVIEW.md)

---

## 1. Kontext und Gesamturteil

`arsnova.eu` besitzt bereits eine **überdurchschnittlich gute Sicherheitsbasis** für eine accountfreie Live-Quiz-App (Host-/Admin-Tokens serverseitig, DTO-Data-Stripping, Redis-Rate-Limits für Create/Join/Votes, CI mit Prod-Audit/Trivy/CodeQL/Dependabot). Gegen gezielte Ressourcen- und Anwendungsangriffe ist die Oberfläche jedoch **noch nicht ausreichend gehärtet**.

| Aussage                     | Bewertung                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| Externe vorläufige Note     | **5 von 10** — mittleres Niveau mit mehreren dringenden Befunden                         |
| Interne Einordnung          | **Fair** für Produktstadium und Bedrohungsmodell; kein Shutdown                          |
| Incident / Kompromittierung | **Kein Hinweis** — handfeste Todos, kein Notfallbetrieb                                  |
| Ziel nach Wochen 1–2 (Kern) | spürbar solider, grob **7–8 / 10** für den vorgesehenen Bildungsbetrieb                  |
| Produktgrenzen              | bewusst kein Enterprise-IAM; Session-Code kennt der Raum; Host-Token in `sessionStorage` |

Geprüft wurden die öffentlich erreichbare Produktion und der damalige `main`-Stand. Dieses Dokument **implementiert nichts** — es konsolidiert Befunde, Prinzipien und einen phasierten Umsetzungsplan.

---

## 2. Leitprinzipien

1. **Accountfrei und sofort nutzbar bleiben.** Keine Login-Pflicht für Lehrende oder Teilnehmende; Härtung darf das Kernversprechen (kostenlos, accountfrei, unmittelbar) nicht aufgeben.
2. **Hörsaal-NAT zuerst denken.** Bis zu ~500 Geräte können dieselbe öffentliche IP teilen. **Enge IP-Limits auf Teilnehmerpfaden sind verboten** (Join, Vote, Q&A, Blitzlicht, WebSocket).
3. **„Proxy“ = lokaler Nginx auf demselben Host.** Kein separates CDN/WAF vor der App. `TRUST_PROXY_HOPS=1` und korrekte IP-Ermittlung dienen Logs und groben Host-/Admin-Grenzen — **nicht** als Hebel für enge Participant-IP-Lockouts.
4. **Teilnehmerverkehr nach Session / Client-ID / Participant-ID; teure Host-Funktionen nach Token, Größe und globalem Budget.**
5. **UX-neutrale Fixes zuerst**, sichtbare Tradeoffs (Image-Proxy, Sync-Rotation, `accessProof`-Migration, PDF-Queue) bewusst später und mit Migration/Fortschritt.
6. **Severity und UX parallelisieren, nicht gegeneinander ausspielen.** „Node zuerst“ (UX) und „PDF-SSRF zuerst“ (Severity) sind beide Woche‑1 — parallel.

---

## 3. Befundtabelle (HIGH / MEDIUM)

Code-Pointer beziehen sich auf den Review-Stand `13f8c27b` / aktuelles `main`; Pfade können leicht wandern.

| Prio            | Befund                                                                                                                                                                                 | Folge                                                    | Code / Ort                                                                                                                                                                   | UX                                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **HIGH**        | Unsichere externe Bildverarbeitung beim PDF-Export (SSRF, Redirects, Size erst nach Vollladen, Asset-Pfad ohne Root-Containment; Chromium `--no-sandbox`; kein PDF-Parallelitätslimit) | Blind-SSRF, Speicher-/CPU-DoS, lokaler Dateizugriff      | `apps/backend/src/lib/session-results-report-pdf.ts`, `libs/session-export-report/src/markdown-export-images.util.ts`, `apps/backend/src/lib/session-export-asset-reader.ts` | UX-neutral: Stream-Cap, Private-IP-Block, Redirect-Policy, Path-Containment. Später: Image-Proxy (nicht Abschalten) |
| **HIGH**        | Öffentliche Erzeugungsendpunkte unzureichend begrenzt (`quiz.upload`, `quickFeedback.create`, Exportwege; Fragen-Array ohne `.max()`; verwaiste Uploads ohne Cleanup)                  | PostgreSQL/Redis füllen, Last, Dienstunterbrechung       | `apps/backend/src/routers/quiz.ts`, `apps/backend/src/routers/quickFeedback.ts`, Zod-Upload-Schemas in `libs/shared-types`                                                   | UX-neutral bei großzügigen Caps + klaren Fehlermeldungen                                                            |
| **HIGH**        | Produktion auf Node.js 20 (`node:20-alpine`) — seit April 2026 EOL                                                                                                                     | Keine regulären Security-Updates der Runtime             | `Dockerfile` (Builder + Production)                                                                                                                                          | UX-neutral nach Testmatrix                                                                                          |
| **MEDIUM–HIGH** | Yjs-Sync ohne serverseitige Autorisierung/Limits (Raum-UUID ≈ Bearer; kein Payload-/Conn-Limit)                                                                                        | Manipulation bei geleaktem Link; WS-/Speicher-Missbrauch | Yjs-/y-websocket-Child, Sync-UI; Story **1.6c**, [architecture/quiz-library-sync.md](architecture/quiz-library-sync.md)                                                      | Lange Tokens + manuelle Rotation; nicht Kurz-TTL                                                                    |
| **MEDIUM**      | IP-basierte Limits über Proxy-Header umgehbar (`CF-Connecting-IP`, `True-Client-IP`, erster `X-Forwarded-For`)                                                                         | Rate-Limit-Bypass                                        | `resolveClientIp` in `apps/backend/src/trpc.ts`; Nutzung in `rateLimit.ts` / Session-Join                                                                                    | Fix IP-Quelle; **keine** engeren Participant-IP-Limits danach                                                       |
| **MEDIUM**      | Session-Code-Lockout **pro IP**                                                                                                                                                        | Ein Gerät kann im Hörsaal-NAT den ganzen Saal sperren    | `isSessionCodeLockedOut` / `recordFailedSessionCodeAttempt` in `apps/backend/src/lib/rateLimit.ts`                                                                           | Auf anonyme Client-ID + globales Soft-Cap umstellen                                                                 |
| **MEDIUM**      | Container/Chromium unnötig privilegiert (root, keine `cap_drop` / `no-new-privileges`, `--no-sandbox`)                                                                                 | Größeres Blast-Radius nach Compromise                    | `Dockerfile`, Compose/Deploy-Docs                                                                                                                                            | UX-neutral; technisches Risiko bei Chromium/Prisma/`/tmp`                                                           |
| **MEDIUM**      | CSP zu weit (`script-src 'self' 'unsafe-inline' 'unsafe-eval' https:`); CORS `*` inkl. Token-Header                                                                                    | Schwacher XSS-Zusatzschutz; Cross-Origin-API-Missbrauch  | Nginx/App-Header-Auslieferung                                                                                                                                                | Zuerst Report-Only; CORS same-origin                                                                                |
| **MEDIUM**      | Legacy-`accessProof` = Content-Hash (kein Besitzbeweis)                                                                                                                                | Historie/Bonus/PDF mit Quizinhalt+ID rekonstruierbar     | `createLegacyQuizHistoryAccessProof` in `libs/shared-types`; Quiz-Historien-Endpunkte                                                                                        | Migration mit Übergangsfrist, kein Sofort-Cutover                                                                   |
| **MEDIUM**      | Backups primär lokal auf demselben Host dokumentiert                                                                                                                                   | Wenig Schutz bei Hostverlust/Ransomware                  | [deployment-debian-root-server.md](deployment-debian-root-server.md)                                                                                                         | UX-neutral (Betrieb)                                                                                                |

### Bereits stark (nicht „neu erfinden“)

- Starke zufällige Host-/Admin-Token, Hash + konstante Vergleiche, Redis-TTLs
- Zentrale `hostProcedure` / `adminProcedure`
- Data-Stripping (`isCorrect` nicht in `ACTIVE`) — [implementation/DATA-STRIPPING-CHECKLIST.md](implementation/DATA-STRIPPING-CHECKLIST.md)
- Vote-Limit **pro Teilnehmer-ID** (Hörsaal-tauglich)
- PostgreSQL/Redis nicht öffentlich; dokumentierte Host-Härtung
- CI: Dependabot, CodeQL, Trivy, SBOM, Dependency Review, `npm audit --omit=dev` (Prod grün)

---

## 4. UX-neutrale vs. Tradeoff-Maßnahmen

### 4.1 Praktisch ohne UX-Einbußen (Woche 1–2 priorisieren)

| Maßnahme                                                                         | Hinweis                                          |
| -------------------------------------------------------------------------------- | ------------------------------------------------ |
| Node.js 20 → 22 (ggf. später 24)                                                 | CI prüft bereits 22; Prod-Image nachziehen       |
| `resolveClientIp` → nur `req.ip` / Trust-Proxy                                   | CF-/True-Client-IP ignorieren                    |
| Session-Code-Fehlversuche → Client-ID + globales Soft-Cap                        | IP-Lockout entfernen                             |
| Rate-Limits für `quiz.upload`, `quickFeedback.create`, PDF, Admin-Login          | Großzügige Bursts; Host-Token/global wo sinnvoll |
| Quiz-Größenlimits (Fragen, Optionen, Payload-MB)                                 | UI-Hinweis vor Upload                            |
| PDF: Stream-Cap, Private-IP/DNS-Rebind-Schutz, Redirect-Policy, Path-Containment | **Ohne** externe Bilder abzuschalten             |
| Non-Root-Container, `cap_drop`, `no-new-privileges`                              | Chromium/`/tmp`/Migrationen mittesten            |
| CORS auf eigene Origins / entfernen in Prod                                      | Same-Origin-App                                  |
| `X-Powered-By` entfernen                                                         | trivial                                          |
| CSP **Report-Only** verschärfen                                                  | Noch nicht enforce                               |
| Externe verschlüsselte Backups + Restore-Test                                    | Betrieb                                          |
| Monitoring-/Alarm-Schwellen für Create/PDF/WS                                    | Betrieb                                          |

### 4.2 Sichtbare Tradeoffs (ab Woche 2–4)

| Maßnahme                                  | UX-Wirkung                                    | Sinnvolle Umsetzung                                     |
| ----------------------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| PDF-Queue / Parallelität (z. B. 1–2)      | Kurze Wartezeit bei Last                      | Fortschrittsanzeige; Cache fertiger Berichte            |
| Sicherer Bild-Proxy für PDF               | Langsamer/Fehler → Platzhalter                | Proxy statt Abschalten; Cache; Timeouts                 |
| Yjs: signierte Tokens + manuelle Rotation | Längerer Link; „Link ungültig machen“         | Lange Gültigkeit; keine Kurz-TTL; Story 1.6c gestaffelt |
| Legacy-`accessProof` abschalten           | Alte Karten verlieren Historie ohne Migration | Auto-Migration → Cutover-Datum → Hilfetext              |
| CSP enforce                               | Bei Fehlern leere Seite/Assets                | Erst Report-Only, dann schrittweise                     |

### 4.3 Bewusste Produktentscheidungen (nicht „Bugs“)

- Sync-Link ≈ Capability („wer den Link hat, darf“) — fehlt Relay-Härtung, nicht Login
- Accountfrei: verlorenes `accessProof`/Sync-Token hat keine Kontowiederherstellung
- CORS bei Token-Headern ohne Cookies ist weniger kritisch als bei Cookie-Sessions — trotzdem Prod einschränken

---

## 5. Schutzmodell für ~500 Teilnehmende (Limit-by)

Kernsatz:

> **Teilnehmerverkehr wird pro Session, Teilnehmer und Verbindung kontrolliert – nicht eng pro öffentlicher IP. Teure Host-/Serverfunktionen werden über Token, Größenlimits und globale Ressourcenbudgets geschützt.**

| Vorgang                   | Limitierung nach                                    | **Nicht** nach                   |
| ------------------------- | --------------------------------------------------- | -------------------------------- |
| Gültiger Session-Beitritt | Sessionkapazität + anonyme Client-ID                | öffentlicher IP                  |
| Ungültige Session-Codes   | anonyme Client-ID + sehr großzügiges globales Limit | enger IP-Lockout                 |
| Abstimmung                | Teilnehmer-ID, Frage, Runde                         | IP                               |
| Q&A-Beitrag               | Teilnehmer-ID + Session                             | IP                               |
| Blitzlicht-Vote           | anonyme Voter-ID + Session                          | IP                               |
| WebSocket                 | Session, Teilnehmer, globale Serverkapazität        | enge IP-Conn-Limits              |
| Quiz-Upload               | Host-/Browser-Instanz, Größe, globales Limit        | primär IP (IP nur grob/optional) |
| PDF-Erstellung            | Host-Token, Session, globale Parallelität           | IP                               |
| Admin-Login               | progressive Verzögerung + globales Limit            | sperrender Hörsaal-IP-Lockout    |
| Session-Erstellung        | großzügiges Limit (ggf. grob IP + global)           | enge IP-Werte nach Header-Fix    |

### Kapazitäts-Richtwerte (keine finalen Prod-Zahlen)

Aus 500er-Lasttests und gezielter Reconnect-Messung ableiten; grobe Planung:

| Größe                                             | Richtwert                              |
| ------------------------------------------------- | -------------------------------------- |
| Registrierte Teilnehmer / Session                 | 600–650                                |
| Gleichzeitige WS (Burst)                          | ≥ 800                                  |
| Reconnect-Welle                                   | ~500 Geräte, **jittered**              |
| Vote-Burst                                        | 500 Votes in wenigen Sekunden          |
| Zusätzliche Host-/Present-/Moderator-Verbindungen | einplanen                              |
| PDF parallel                                      | z. B. 2 (nur Host; Hörsaal-irrelevant) |

### WebSocket ohne Hörsaalprobleme

Statt „max. 20 Verbindungen pro IP“:

- z. B. max. **2** Verbindungen pro Teilnehmer-ID
- großzügige Session-Obergrenze + globale Serverkapazität
- begrenzte Nachrichtengröße und -rate pro Verbindung
- Reconnect mit **zufälliger Verzögerung** (Reconnect-Welle)

### Anonyme Client-ID

- Beim ersten Aufruf zufällig erzeugen, lokal im Browser speichern
- Kein Nutzerkonto, keine PII
- Allein unzureichend (Angreifer kann IDs rotieren) → immer mit Session- und Global-Caps kombinieren

### IP-Ermittlung (trotzdem korrigieren)

- `TRUST_PROXY_HOPS=1` beibehalten
- Backend: **nur** Express-`req.ip`
- `CF-Connecting-IP` / `True-Client-IP` **ignorieren**
- Nginx überschreibt Client-IP, übernimmt sie nicht blind
- Keine Sicherheitsentscheidung anhand eines beliebigen ersten `X-Forwarded-For`-Eintrags
- Zweck: korrekte Logs und **selten** grobe Host-/Admin-Grenzen — **nicht** enge Participant-Limits

---

## 6. Phasenplan Woche 1–4

### Woche 1 — HIGH-Kern + NAT-taugliche Limits (UX-neutral)

| #    | Arbeitspaket                                                                                                                                                                                                                                                                        | Akzeptanzkriterien                                                                               |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| W1.1 | **Node 22** im Produktionsimage (+ CI ohne Node-20-Prod-Pfad)                                                                                                                                                                                                                       | Image baut/läuft auf 22; Smoke + relevante Tests grün; `.nvmrc`/Docs abgestimmt                  |
| W1.2 | **PDF-SSRF-Kern** ohne Image-Proxy-UI: Private/Loopback/Link-Local (inkl. IPv6) nach DNS blockieren; Redirects deaktivieren oder nach jeder Hop erneut prüfen; Antwort **streamend** begrenzen (nicht erst nach `arrayBuffer`); Asset-Pfad nach `resolve()` strikt unter Asset-Root | Unit-/Integrationstests für Blocklisten und Size-Cap; kein Abruf von `file://` / RFC1918         |
| W1.3 | **Public Creates:** Rate-Limits für `quiz.upload` und `quickFeedback.create`; Zod `.max()` für Fragen/Optionen; Payload-Größenlimit; Cleanup verwaister Uploads                                                                                                                     | Missbrauchsszenario in Tests; normale Classroom-Quizze unter Caps                                |
| W1.4 | **`resolveClientIp`:** nur `req.ip`; Spoof-Header ignorieren; Nginx/Docs                                                                                                                                                                                                            | Tests: gefälschte CF-/XFF-Header ändern Bucket nicht                                             |
| W1.5 | **Session-Code-Lockout** von IP → anonyme Client-ID + globales Soft-Cap; gültige Joins zählen nicht als Fehlversuche                                                                                                                                                                | Zwei Clients hinter gleicher IP blockieren sich nicht gegenseitig; Enumeration global gedrosselt |
| W1.6 | Grobe Limits Session-Create / Admin-Login (progressive Delay), **ohne** Participant-IP-Tightening                                                                                                                                                                                   | Create-Spam begrenzt; Admin-Brute-Force erschwert                                                |

**Out-of-scope Woche 1:** Image-Proxy-Produktisierung, PDF-Queue-UI, Yjs-Token-Rotation gebaut, `accessProof`-Cutover, CSP enforce, OWASP ZAP als PR-Gate.

### Woche 2 — Defense-in-Depth + Sync-Konzept

| #    | Arbeitspaket                                                                                                                     | Akzeptanzkriterien                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| W2.1 | Container **Non-Root**, `cap_drop`, `no-new-privileges`; Chromium-Pfade/`/tmp` geprüft                                           | Deploy + PDF-Export in CI/Staging grün                                     |
| W2.2 | **Story 1.6c Slice A:** Yjs-Relay Rate-Limit / Conn-/Payload-Grenzen; ADR/Konzept für signierte Share-Tokens + manuelle Rotation | Backlog-AKs Rate-Limit + dokumentierter Härtungspfad; Local-First-Smoke ok |
| W2.3 | WS: Limits pro Participant-ID / Session / global; Message-Size/Rate; Client **jittered Reconnect**                               | Reconnect-Welle in Lasttest ohne Totalausfall                              |
| W2.4 | CSP **Report-Only** verschärfen (`unsafe-eval`/`https:` in script-src beobachten)                                                | Reports sammeln; App ungebrochen                                           |
| W2.5 | CORS in Produktion auf eigene Origins beschränken oder entfernen                                                                 | Same-Origin-Flows ok                                                       |

### Woche 3–4 — Tradeoffs bewusst + Hygiene

| #    | Arbeitspaket                                                                                                               | Akzeptanzkriterien                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| W3.1 | **Sicherer Bild-Proxy** für PDF (Formate, Size ~2 MB Cap, Resize, Cache, Timeout, Platzhalter)                             | Bildfragen im PDF weiterhin nutzbar; SSRF-Tests weiter grün                   |
| W3.2 | Optional **PDF-Queue** (Parallelität 1–2) + Fortschritt + Cache                                                            | Host sieht Wartehinweis unter Last; Live-Vote unberührt                       |
| W3.3 | **`accessProof`-Migration:** Legacy akzeptieren → Server stellt random Capability aus → Frontend speichert → Cutover-Datum | Aktive Nutzer behalten Historie; Cutover dokumentiert                         |
| W3.4 | **Story 1.6c Slice B (optional/teilweise):** signierte Sync-Tokens + UI „Sync-Link ungültig machen“; lange TTL             | Workflow „Link kopieren / zweites Gerät“ bleibt; alte Links nach Rotation tot |
| W3.5 | **Story 0.9** Astro 6→7 (Landing XSS-Advisories) — parallel, nach Security-Deps                                            | Landing build/axe grün; Dependabot-XSS schließbar                             |
| W3.6 | Externe verschlüsselte Backups + Restore-Übung                                                                             | Dokumentierter Restore-Erfolg                                                 |
| W3.7 | Monitoring-Alarme (Create-Rate, PDF-Queue-Tiefe, WS-Conn, 429-Muster)                                                      | Alarmierung getestet                                                          |

### Übergreifende Akzeptanz (Ende Phase)

- [ ] Drei HIGH-Befunde adressiert (Node, PDF-SSRF-Kern, Public Creates)
- [ ] Kein enges IP-Limit auf Join/Vote/Q&A/Blitzlicht/WS
- [ ] 500er-Classroom-Lastprofil / Reconnect nicht regressiert
- [ ] SECURITY-OVERVIEW + ENVIRONMENT um neue Limits/IP-Annahmen aktualisiert
- [ ] Kein `npm audit fix --force`; Prod-`npm audit --omit=dev` bleibt Steuerungsgröße

---

## 7. Was ausdrücklich **nicht** tun

| Nicht tun                                                        | Warum                                                                         |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Externe PDF-Bilder **vollständig abschalten**                    | Zerstört Bildfragen/Diagramme im Bericht; Image-Proxy ist der UX-konforme Weg |
| Enge **IP-Lockouts / `limit_conn` pro IP** auf Teilnehmerpfaden  | 500 Geräte hinter NAT → Veranstaltung tot                                     |
| Nach IP-Fix die **alten engen IP-Zahlen** unverändert übernehmen | Erhöht False-Positive-Sperren im Campus-NAT                                   |
| **`npm audit fix --force`**                                      | Zerlegt oft Astro/Angular/Artillery; Astro-XSS bewusst an Story 0.9 koppeln   |
| Blind einzelne Astro-6-XSS-Advisories closen                     | Major-Bump Story **0.9**                                                      |
| OWASP Dependency-Check als zusätzliches PR-Gate                  | Dupliziert npm audit/Trivy/Dependabot; Noise                                  |
| OWASP ZAP als blockierendes PR-Gate                              | Optional später Nightly gegen Staging                                         |
| Sehr kurze Yjs-Token-TTLs / erzwungene Re-Auth                   | Bricht Local-First/Offline/Reconnect                                          |
| Sofortiger Legacy-`accessProof`-Cutover                          | Historienverlust auf ungenutzten Geräten                                      |
| CSP sofort enforce mit harter `script-src`                       | Risiko leerer App; erst Report-Only                                           |
| Accounts „nur kurz“ einführen für Sync/Historie                  | Produktbruch                                                                  |
| Alles von Stufe-B-Sync in einem PR                               | Erst 1.6c Rate-Limit+Konzept, dann Tokens                                     |

---

## 8. Backlog- und Dokumentbezüge

| Thema                    | Bezug                                                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Sync-Sicherheit          | **Story 1.6c** ([Backlog.md](../Backlog.md)); [architecture/quiz-library-sync.md](architecture/quiz-library-sync.md); ADR-0019               |
| Landing XSS / Astro      | **Story 0.9** (Astro ≥ 7.1; geplant nach Security-Deps #121)                                                                                 |
| Ist-Kontrollen           | [SECURITY-OVERVIEW.md](SECURITY-OVERVIEW.md)                                                                                                 |
| Env / Trust-Proxy        | [ENVIRONMENT.md](ENVIRONMENT.md), `TRUST_PROXY_HOPS`                                                                                         |
| Deploy / Nginx / Backups | [deployment-debian-root-server.md](deployment-debian-root-server.md)                                                                         |
| PDF-Export               | [features/session-export-pdf.md](features/session-export-pdf.md)                                                                             |
| Host-Härtung             | [ADR-0019](architecture/decisions/0019-host-hardening-and-owner-bound-session-access.md)                                                     |
| Data-Stripping           | [implementation/DATA-STRIPPING-CHECKLIST.md](implementation/DATA-STRIPPING-CHECKLIST.md)                                                     |
| Last / 500 TN            | [implementation/LASTTEST-500-TEILNEHMENDE.md](implementation/LASTTEST-500-TEILNEHMENDE.md), [PERFORMANCE-TESTING.md](PERFORMANCE-TESTING.md) |
| CI-Security              | [CI-WORKFLOW.md](CI-WORKFLOW.md), [TESTING.md](TESTING.md)                                                                                   |
| Dependabot / Overrides   | PR #121 (sharp/shell-quote/…); Prod-Audit `--omit=dev`                                                                                       |

---

## 9. Empfohlene Umsetzungsreihenfolge (Kurz)

**Woche 1 parallel:** Node 22 · PDF-SSRF-Guardrails (ohne Proxy-UI) · Create-/Größenlimits · `resolveClientIp` · Client-ID-Code-Lockout

**Woche 2:** Non-Root · 1.6c Rate-Limit + Token-Konzept · WS-Caps + jittered Reconnect · CSP Report-Only · CORS

**Woche 3–4:** Image-Proxy · optional PDF-Queue · `accessProof`-Migration · Sync-Rotation (Slice) · Astro 0.9 · externe Backups · Monitoring

Danach sinnvoll: gezielter Penetrationstest mit Serverzugriff, Logs und kontrollierten Szenarien — nicht als Ersatz für die oben genannten Fixes.

---

## 10. Änderungsnotiz

| Datum      | Änderung                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------- |
| 2026-07-22 | Erstfassung: externes Audit + UX-Follow-up + NAT/Hörsaal-Rate-Limit-Nachtrag konsolidiert |

**Dieses Dokument ist ein Umsetzungsplan.** Konkrete Code-Fixes gehören in eigene PRs pro Slice; dieses File nur bei Planänderungen anpassen und [docs/README.md](README.md) / [SECURITY-OVERVIEW.md](SECURITY-OVERVIEW.md) verlinkt halten.
