# Lasttest 500 Teilnehmende

## Zweck

Dieses Dokument beschreibt Vorbereitung, Durchfuehrung, Auswertung und Freigabekriterien fuer einen produktionsnahen Lasttest von **arsnova.eu** mit **500 gleichzeitigen Teilnehmenden** in einer einzelnen Live-Session.

Ziel ist die belastbare Beantwortung der Frage, ob die aktuell bei Hetzner betriebene Infrastruktur fuer ein Konferenzszenario dieser Groessenordnung geeignet ist oder ob vor einem produktiven Einsatz technische oder infrastrukturelle Massnahmen erforderlich sind.

## Ausgangslage

Die Produktionsumgebung basiert aktuell auf einem einzelnen Hetzner-Server mit:

- 16 GB RAM
- 8 vCPU
- einem App-Prozess bzw. App-Container
- PostgreSQL
- Redis
- Reverse Proxy / TLS-Termination

arsnova.eu nutzt:

- Angular-Frontend
- Node.js-/tRPC-Backend
- WebSockets fuer Live-Kommunikation
- Redis fuer Rate-Limiting, Presence und Telemetrie
- PostgreSQL fuer persistente Daten

Der aktuelle Entwicklungsstand enthaelt erste Lasttest-Skripte, aber noch keine abgeschlossene, durchgaengige Absicherung fuer 500 gleichzeitige Teilnehmende in einem realitaetsnahen Live-Szenario.

## Ziel des Lasttests

Geprueft werden soll, ob eine Session mit 500 gleichzeitigen Teilnehmenden unter produktionsnahen Bedingungen stabil betrieben werden kann.

Der Test gilt als erfolgreich, wenn:

- 500 Teilnehmende innerhalb kurzer Zeit erfolgreich joinen koennen
- Host-Aktionen weiter bedienbar bleiben
- Statuswechsel und Fragenwechsel zuverlaessig ankommen
- Abstimmungen unter Last mit akzeptabler Latenz verarbeitet werden
- keine systematischen Fehler, Timeouts oder Neustarts auftreten

## Scope

Im Scope:

- eine einzelne Session mit 500 gleichzeitigen Teilnehmenden
- Join-Phase
- Lobby-Phase
- Start einer Frage
- gleichzeitige Abstimmung
- Ergebnisanzeige
- mehrere aufeinanderfolgende Fragewechsel
- Beobachtung von Host-, Teilnehmer- und Backend-Verhalten

Nicht im ersten Scope:

- mehrere parallele 500er-Sessions
- extreme Freitext-Szenarien
- parallele Yjs-Synchronisation auf vielen Geraeten
- vollstaendige Browser-E2E-Realismus-Simulation fuer alle 500 Clients
- Chaos- oder Failover-Szenarien

## Testumgebung

Der Lasttest ist auf einer produktionsnahen Umgebung durchzufuehren, nicht ausschliesslich lokal.

Vorgaben:

- gleiche oder sehr aehnliche Servergroesse wie Produktion
- identische oder nahezu identische Compose- oder Container-Konfiguration
- gleiche Node-, Postgres- und Redis-Versionen wie Produktion
- Reverse Proxy analog Produktion
- getrennte Testdomain oder geschuetzter Testzugang
- keine produktiven Nutzerdaten

Vor Testbeginn sicherstellen:

- aktueller Deploy-Stand ist dokumentiert
- Git-Commit oder Release-Stand ist festgehalten
- Testsystem ist exklusiv fuer den Lasttest reserviert
- Monitoring und Log-Erfassung laufen vor Start

## Rollen und Verantwortlichkeiten

`Technische Leitung`

- entscheidet ueber Start, Abbruch und Freigabe
- bewertet Testergebnisse
- verantwortet die finale Aussage zur 500er-Eignung

`Durchfuehrung`

- startet Lasttests
- ueberwacht Laufzeit und Logs
- dokumentiert Auffaelligkeiten

`Systembeobachtung`

- ueberwacht CPU, RAM, Load, Container, DB, Redis, Netzwerk
- markiert Engpaesse und Ausfaelle

`Anwendungsbeobachtung`

- prueft Host-Ansicht
- prueft Teilnehmerfluss stichprobenartig
- dokumentiert sichtbare Reaktionszeiten und Fehlerbilder

## Testwerkzeuge

Empfohlen:

- `k6` fuer HTTP- oder tRPC-nahe Lasttests
- ergaenzend ein Realtime- oder WebSocket-Werkzeug fuer Subscription-Szenarien
- Systemmetriken ueber Host- oder Container-Monitoring
- Auswertung ueber Server-Logs und Anwendungsmetriken

Die Tests muessen reproduzierbar sein. Alle Skripte, Parameter und Laufzeiten sind zu protokollieren.

## Testdaten und Vorbedingungen

Vorbereitung:

- dedizierte Test-Session anlegen
- Quiz mit realistischem Umfang verwenden
- bevorzugt Single-Choice oder Multiple-Choice fuer den Haupttest
- optional ein zweiter Lauf mit Q&A oder Quick-Feedback
- Datenbank vor jedem grossen Lauf in definierten Zustand bringen
- alte Testteilnehmende und alte Sessions entfernen oder neue Session verwenden

Vor jedem Lauf dokumentieren:

- Datum und Uhrzeit
- Testsystem
- Commit oder Build-Stand
- Testskript und Parameter
- Session-Code
- Anzahl geplanter virtueller Nutzer

## Teststufen

### Stufe 1: Basis-Sanity

- 50 Teilnehmende
- Ziel: offensichtliche Fehler ausschliessen

### Stufe 2: Vorlast

- 100 Teilnehmende
- Ziel: erste Engpaesse sichtbar machen

### Stufe 3: Mittlere Last

- 250 Teilnehmende
- Ziel: Uebergang von normaler Last zu Grenzlast bewerten

### Stufe 4: Zieltest

- 500 Teilnehmende
- Ziel: reale Konferenzgroesse bewerten

### Stufe 5: Wiederholung

- zweiter 500er-Lauf nach kurzer Abkuehlphase
- Ziel: Reproduzierbarkeit pruefen

## Testszenarien

### Szenario A: Join-Welle

- 500 Teilnehmende joinen innerhalb von 120 Sekunden
- Messung:
  - Erfolgsquote
  - Fehlerquote
  - Latenz Join
  - CPU-, RAM- und DB-Last

### Szenario B: Lobby-Stabilitaet

- nach erfolgreichem Join verbleiben 500 Teilnehmende in der Session
- Dauer: 2 bis 5 Minuten
- Messung:
  - Stabilitaet
  - Polling- oder Subscription-Verhalten
  - Host-Reaktionsfaehigkeit

### Szenario C: Frage starten

- Host startet erste Frage
- Beobachtung:
  - Zeit bis Teilnehmeransicht aktualisiert ist
  - Fehlerquote
  - Lastspitze im Backend

### Szenario D: Vote-Spike

- 80 Prozent oder mehr der Teilnehmenden stimmen innerhalb von 10 Sekunden ab
- Messung:
  - Latenz `vote.submit`
  - Fehlerquote
  - DB- und Redis-Last
  - Host-Wahrnehmung

### Szenario E: Ergebnisphase

- Host zeigt Ergebnisse
- Beobachtung:
  - Aktualisierung bei Teilnehmern
  - Reaktionszeit Host
  - Auswirkung auf Backend und DB

### Szenario F: Mehrere Fragen hintereinander

- mindestens 3 bis 5 komplette Zyklen:
  - Frage oeffnen
  - abstimmen
  - Ergebnis anzeigen
  - naechste Frage
- Ziel:
  - Stabilitaet ueber Zeit
  - kein schleichender Ressourcenverlust

## Zu erfassende Metriken

Anwendung:

- Erfolgsquote Join
- Erfolgsquote Vote
- Erfolgsquote Statuswechsel
- HTTP-Fehlerquote
- tRPC-Fehlerquote
- `p50`, `p95`, `p99` fuer:
  - `session.join`
  - `session.getInfo`
  - `session.getCurrentQuestionForStudent`
  - `vote.submit`

System:

- CPU-Auslastung
- RAM-Auslastung
- Load Average
- Container-Restarts
- offene Dateideskriptoren oder Verbindungen
- Netzwerkdurchsatz

PostgreSQL:

- aktive Verbindungen
- langsame Queries
- Query-Latenzen
- CPU- oder IO-Anteil

Redis:

- Speicherverbrauch
- Command-Rate
- Latenzen
- Verbindungsanzahl

Anwendungswahrnehmung:

- Zeit vom Host-Klick bis zur sichtbaren Teilnehmeraktualisierung
- sichtbare Haenger, Timeouts oder UI-Stoerungen

## Abnahmekriterien

Ein Lauf mit 500 Teilnehmenden gilt als bestanden, wenn alle folgenden Punkte erfuellt sind:

- keine Container-Neustarts oder OOM-Ereignisse
- keine dauerhaften Fehlerraten oberhalb des akzeptablen Bereichs
- Join-Welle weitgehend vollstaendig erfolgreich
- Host bleibt waehrend des gesamten Tests steuerbar
- Abstimmungen werden zuverlaessig verarbeitet
- keine laenger anhaltenden Ausfaelle von DB oder Redis
- `p95` und `p99` bleiben im akzeptablen Bereich

Pragmatische Zielwerte:

- Join `p95 < 2s`
- Vote `p95 < 1.5s`
- Vote `p99 < 3s`
- Fehlerquote unter 1 Prozent im stabilen Betrieb

Wenn diese Werte klar ueberschritten werden oder die Bedienbarkeit sichtbar leidet, gilt der Test als nicht bestanden.

## Abbruchkriterien

Der Test ist sofort abzubrechen bei:

- App-Container-Restart
- OOM oder Speicherschoepfung
- PostgreSQL nicht mehr erreichbar
- Redis nicht mehr erreichbar
- systematischem Fehleranstieg
- Host kann Session nicht mehr zuverlaessig steuern
- massiven Verzoegerungen ohne Erholung

Jeder Abbruch ist mit Uhrzeit, Symptom und vermuteter Ursache zu protokollieren.

## Dokumentation des Laufs

Fuer jeden Testlauf ist festzuhalten:

- Test-ID
- Datum oder Uhrzeit
- Version oder Commit
- Umgebung
- Anzahl virtueller Nutzer
- Testdauer
- Szenario
- Ergebnis bestanden oder nicht bestanden
- wichtigste Kennzahlen
- Auffaelligkeiten
- Screenshots oder Logauszuege bei Fehlern
- erste technische Bewertung

## Bewertung und Entscheidungsregel

Nach Abschluss aller Teststufen erfolgt eine Einstufung in drei Klassen:

`Freigegeben`

- 500 Teilnehmende produktionsnah stabil moeglich

`Bedingt freigegeben`

- 500 nur mit Randbedingungen moeglich
- zum Beispiel ohne Zusatzkanaele oder nur mit Infrastruktur-Upgrade

`Nicht freigegeben`

- 500 mit aktueller Architektur oder Infrastruktur nicht belastbar

Wenn 250 stabil laufen, 500 aber nicht, darf extern nicht mit "500 sicher moeglich" kommuniziert werden.

## Wahrscheinlichste technische Risiken

- pollingbasierte Live-Pfade erzeugen hohe DB-Last
- zusaetzliche Fallback-Polls in den Clients verstaerken die Last
- Live-Aggregationen pro Request sind bei 500 teuer
- Single-Host-Betrieb ohne horizontale Entlastung
- gleichzeitige Lastspitzen beim Vote-Submit

## Massnahmen nach dem Test

Bei bestandenem Test:

- Freigabe dokumentieren
- maximale empfohlene Rahmenbedingungen notieren
- Ergebnisse archivieren

Bei nicht bestandenem Test:

- Hotspots priorisieren
- Massnahmenplan erstellen, zum Beispiel:
  - Polling reduzieren
  - Live-Aggregate in Redis vorhalten
  - DB-Zugriffe auf kritischen Pfaden senken
  - Infrastruktur vergroessern oder entkoppeln
- nach Umsetzung erneuten Lasttest planen

## Massnahmenkatalog fuer eine performance-optimierte Infrastruktur und technische Optimierungen

Die folgenden Massnahmen dienen als technischer Katalog fuer den Fall, dass der 500er-Lasttest nicht oder nur eingeschraenkt bestanden wird. Sie sind bewusst in Infrastruktur-, Architektur- und Code-Massnahmen getrennt, damit Entscheidungen priorisiert umgesetzt werden koennen.

### 1. Infrastrukturmassnahmen

#### 1.1 Vertikale Skalierung des App-Hosts

Kurzfristig ist die einfachste Massnahme die Vergroesserung des bestehenden Hetzner-Hosts.

Geeignete Optionen:

- mehr vCPU fuer parallele Request-Verarbeitung
- mehr RAM fuer Node.js, Redis, Query-Caches und Betriebspuffer
- schnellere lokale NVMe- oder Block-Storage-Anbindung fuer PostgreSQL

Einsatz:

- sinnvoll als Sofortmassnahme vor einem erneuten Lasttest
- besonders wirksam, wenn CPU-Saettigung oder Speicherdruck der dominante Engpass ist

#### 1.2 Entkopplung von App, Datenbank und Redis

Mittelfristig sollte geprueft werden, ob App, PostgreSQL und Redis nicht mehr auf demselben Host laufen.

Ziele:

- weniger Ressourcenkonkurrenz zwischen Node.js und PostgreSQL
- stabilere Redis-Latenzen unter Last
- bessere Isolation bei Lastspitzen

Empfohlene Zielarchitektur:

- separater App-Host
- separater PostgreSQL-Host oder Managed-DB
- separater Redis-Host oder Managed-Redis

#### 1.3 Horizontale Skalierung des App-Layers

Wenn 500 Teilnehmende nachhaltig und mit Reserve getragen werden sollen, ist eine horizontale Skalierung des App-Layers zu pruefen.

Voraussetzungen:

- mehrere App-Instanzen hinter einem Reverse Proxy oder Load Balancer
- saubere Shared-State-Nutzung ueber Redis und PostgreSQL
- WebSocket-kompatibles Routing mit stabiler Session-Verbindung

Ziele:

- bessere Lastverteilung
- hoehere Resilienz
- geringere Auswirkung einzelner CPU-Spitzen

#### 1.4 Reverse Proxy und Netzwerk optimieren

Der Reverse Proxy sollte explizit fuer viele gleichzeitige Verbindungen und WebSockets konfiguriert sein.

Pruefpunkte:

- ausreichend hohe Limits fuer offene Verbindungen
- korrekte WebSocket-Upgrade-Konfiguration
- sinnvolle Timeouts fuer HTTP und WebSocket
- Gzip oder Brotli fuer statische Assets
- konsequentes Caching fuer unveraenderliche Frontend-Dateien

### 2. Observability- und Betriebsoptimierung

#### 2.1 Metriken dauerhaft etablieren

Vor produktiver Freigabe fuer grosse Events sollten Basis-Metriken dauerhaft sichtbar sein.

Minimalumfang:

- CPU, RAM, Load
- Request-Rate und Fehlerquote
- p95 und p99 fuer kritische Endpunkte
- DB-Query-Zeit und Verbindungszahl
- Redis-Latenz und Speicher
- Anzahl aktiver WebSocket-Verbindungen

#### 2.2 Alarmierung einfuehren

Bei Live-Events muss frueh erkennbar sein, wenn sich das System in Richtung Grenzlast bewegt.

Empfohlene Alarmregeln:

- CPU ueber definiertem Schwellenwert fuer mehrere Minuten
- RAM kritisch
- Fehlerquote ueber Schwellenwert
- p95- oder p99-Latenz ueber Grenzwert
- Redis oder PostgreSQL nicht erreichbar

#### 2.3 Betriebsmodus fuer Grossveranstaltungen definieren

Fuer grosse Sessions sollte ein klarer Event-Modus festgelegt werden.

Beispiele:

- keine Deployments waehrend des Events
- keine schweren Admin- oder Export-Jobs parallel
- optional Deaktivierung nicht zwingend benoetigter Zusatzkanaele
- Vorab-Pruefung der Infrastruktur am selben Tag

### 3. Backend- und Architekturmassnahmen

#### 3.1 Polling in Live-Pfaden reduzieren

Ein wesentlicher Engpass sind pollingartige Live-Pfade, die wiederholt Datenbankabfragen ausloesen.

Ziele:

- weniger wiederholte Reads auf `session.getInfo`
- weniger serverseitiges Polling fuer Status- und Teilnehmeraenderungen
- staerkere Entkopplung von "Verbindung offen" und "DB regelmaessig abfragen"

Massnahmen:

- echte Push-Events statt Polling, wo moeglich
- Aenderungsereignisse im App-Layer oder Redis publizieren
- Clients nur bei echtem Zustandswechsel informieren

#### 3.2 Live-Aggregationen aus der Datenbank herausziehen

Teure Aggregationen sollten fuer Live-Szenarien nicht bei jedem Request neu aus PostgreSQL berechnet werden.

Geeignete Kandidaten:

- aktuelle Teilnehmerzahl
- aktuelle Vote-Zahl pro Frage
- Antwortverteilungen
- laufende Freitext-Aggregationen

Zielbild:

- inkrementelle Pflege im Speicher oder in Redis
- Datenbank als Quelle fuer Persistenz, nicht fuer jede Live-Anzeige

#### 3.3 Read- und Write-Pfade trennen

Kritische Schreibpfade wie `vote.submit` sollten moeglichst schlank bleiben.

Massnahmen:

- Validierung und minimal notwendige Persistenz zuerst
- abgeleitete Statistiken asynchron oder inkrementell verarbeiten
- schwere Folgeabfragen aus dem direkten Response-Pfad entfernen

#### 3.4 Host- und Teilnehmerpfade differenziert behandeln

Host-Ansicht und Teilnehmeransicht haben unterschiedliche Anforderungen.

Empfehlung:

- Host erhaelt hochwertige, schnelle Statusdaten
- Teilnehmer erhalten auf Massenpfaden stark optimierte, reduzierte Payloads
- Zusatzdaten nur bei Bedarf nachladen

### 4. PostgreSQL-Optimierungen

#### 4.1 Query-Analyse und Index-Pruefung

Vor einem erneuten 500er-Test sind die kritischen Queries zu profilieren.

Pruefpunkte:

- fehlende Indizes
- ineffiziente `count(*)`-Abfragen unter Last
- wiederholte Aggregationen ueber grosse Mengen
- unnoetige Includes oder Selects

Massnahmen:

- gezielte Indizes fuer Session-, Participant- und Vote-Zugriffe
- Explain-Analyse fuer Hotspot-Queries
- Query-Reduktion statt nur Hardware-Erhoehung

#### 4.2 Connection-Handling verbessern

Unter Last kann nicht nur Query-Zeit, sondern auch Connection-Management problematisch werden.

Massnahmen:

- sinnvolle Begrenzung von DB-Verbindungen
- Pruefung eines Connection-Poolers
- Beobachtung von Wartezeiten auf freie Verbindungen

#### 4.3 Schreibintensive und leseintensive Pfade entlasten

Wenn Vote-Last steigt, sollte PostgreSQL nicht gleichzeitig unnoetig viele Live-Reads bedienen muessen.

Ziele:

- Lesezugriffe im Live-Betrieb reduzieren
- moeglichst wenig Aggregation direkt auf den Vote-Tabellen
- klare Trennung zwischen Persistenz und Live-Anzeige

### 5. Redis-Optimierungen

#### 5.1 Redis staerker als Live-State-Layer nutzen

Redis ist bereits vorhanden und sollte konsequenter als Low-Latency-Layer fuer Live-Daten genutzt werden.

Moegliche Inhalte:

- Presence
- Teilnehmerzaehler
- Vote-Zwischenstaende
- Antwortverteilungen
- Statuswechsel oder Event-Broadcasts

Nutzen:

- weniger DB-Last
- schnellere Live-Antworten
- bessere Eignung fuer horizontale Skalierung

#### 5.2 Pub/Sub oder Streams fuer Zustandswechsel pruefen

Statt regelmaessigem Polling koennen Statuswechsel ueber Redis verteilt werden.

Einsatz:

- Start oder Ende einer Frage
- Ergebnisfreigabe
- Teilnehmer- oder Host-relevante Event-Signale

### 6. Frontend- und Client-Massnahmen

#### 6.1 HTTP-Fallback-Polling begrenzen

Clientseitige Fallback-Mechanismen sind sinnvoll, duerfen aber nicht zum Dauerlasttreiber werden.

Massnahmen:

- Polling-Intervalle adaptiv gestalten
- bei stabiler WebSocket-Verbindung Fallback-Requests weiter reduzieren
- Polling nur fuer wirklich kritische Daten

#### 6.2 Payloads verkleinern

Bei 500 Teilnehmenden ist nicht nur die Anzahl Requests relevant, sondern auch deren Nutzlast.

Massnahmen:

- nur benoetigte Felder ausliefern
- grosse Payloads vermeiden
- Ergebnis- und Statusdaten getrennt und gezielt laden

#### 6.3 Zusatzfunktionen fuer Eventbetrieb optional abschalten

Fuer Grossveranstaltungen kann ein reduzierter Betriebsmodus sinnvoll sein.

Beispiele:

- Q&A deaktivieren
- Quick-Feedback deaktivieren
- Freitext nur in separaten Sessions
- visuelle Zusatzfeatures nur wenn sie keine relevante Mehrlast erzeugen

### 7. Test- und Freigabemassnahmen

#### 7.1 Lasttests in Stufen institutionalisieren

Die Lasttests sollten nicht als Einmalaktion betrachtet werden.

Empfehlung:

- feste Teststufen fuer 50, 100, 250 und 500 Teilnehmende
- Wiederholung nach groesseren Architektur- oder Infrastruktur-Aenderungen
- dokumentierte Vergleichswerte zwischen Laeufen

#### 7.2 Regressionsschutz fuer Performance einbauen

Kritische Lastprofile sollten regelmaessig wiederholbar sein.

Ziele:

- keine unbemerkte Verschlechterung im Live-Pfad
- klare Baselines fuer Join, Vote und Statuswechsel
- fruehes Erkennen neuer Hotspots

### 8. Priorisierung der Massnahmen

#### 8.1 Kurzfristig

- produktionsnahen 250er- und 500er-Test aufsetzen
- Monitoring und Alarmierung vervollstaendigen
- App-Host vertikal vergroessern, falls CPU oder RAM limitieren
- offensichtliche Hotspot-Queries identifizieren

#### 8.2 Mittelfristig

- Polling in Live-Pfaden reduzieren
- Redis konsequenter als Live-State- und Aggregations-Layer einsetzen
- Reverse Proxy und WebSocket-Handling fuer Eventlast absichern
- Teilnehmer- und Host-Payloads verschlanken

#### 8.3 Langfristig

- App, PostgreSQL und Redis infrastrukturell entkoppeln
- horizontale Skalierung des App-Layers vorbereiten
- echtes Event-getriebenes Live-Modell statt pollingzentrierter Synchronisation etablieren

## Freigabevermerk

Die Freigabe fuer Konferenzszenarien mit 500 Teilnehmenden darf erst erfolgen, wenn dieses Dokument mit realen Messergebnissen ergaenzt und von der technischen Leitung ausdruecklich abgenommen wurde.
