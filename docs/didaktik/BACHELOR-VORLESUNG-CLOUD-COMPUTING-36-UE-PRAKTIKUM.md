<!-- markdownlint-disable MD013 MD022 MD032 -->

# Konzept: Bachelor-Vorlesung "Cloud Computing" mit Praktikum (36 Unterrichtseinheiten)

## 1. Kurzprofil

**Modultitel:** Cloud Computing  
**Studienniveau:** Bachelor  
**Format:** Vorlesung mit integriertem Praktikum  
**Umfang:** **36 Unterrichtseinheiten (UE)**  
**Annahme:** 1 UE = 45 Minuten  
**Empfohlenes Raster:** **12 Termine à 3 UE** oder **18 Termine à 2 UE**  
**Zielgruppe:** Studierende der Informatik, Medieninformatik, Wirtschaftsinformatik oder verwandter Studiengänge ab mittlerem Bachelor-Niveau

## 2. Leitidee

Die Veranstaltung verbindet **Cloud-Computing-Grundlagen**, **Architekturentscheidungen**, **Betrieb** und **praktische Umsetzung** anhand einer realistischen Webanwendung. Die Studierenden sollen Cloud Computing nicht nur begrifflich verstehen, sondern als Zusammenspiel aus:

- Infrastruktur
- Plattformdiensten
- Softwarearchitektur
- Skalierung
- Beobachtbarkeit
- Sicherheit
- Wirtschaftlichkeit
- Betriebsverantwortung

**arsnova.eu** dient dabei in **Vorlesung und Praktikum als durchgehendes Lehrvehikel**. Die Veranstaltung arbeitet also nicht primär mit losen Toy-Beispielen, sondern mit einer realen, dokumentierten und bereits betriebenen Webanwendung aus dem Repository.

Didaktische Konsequenz:

- Vorlesungsbegriffe werden direkt an **arsnova.eu** erklärt
- Praktikumsaufgaben werden direkt aus Architektur, Betrieb und Skalierungsfragen von **arsnova.eu** abgeleitet
- Dokumente aus dem Repo werden als verbindliche Lehr- und Arbeitsgrundlage verwendet

Zentrale Einstiegsdokumente fuer das Lehrvehikel:

- [README.md](../../README.md)
- [Backlog.md](../../Backlog.md)
- [docs/architecture/handbook.md](../architecture/handbook.md)
- [docs/deployment-debian-root-server.md](../deployment-debian-root-server.md)
- [docs/praktikum/PRAKTIKUM.md](../praktikum/PRAKTIKUM.md)
- [docs/praktikum/PRAKTIKUM-SQM.md](../praktikum/PRAKTIKUM-SQM.md)
- [docs/didaktik/greenfield-demo-1-7a-vorlesung.md](./greenfield-demo-1-7a-vorlesung.md)

## 3. Lernziele

Nach erfolgreichem Abschluss der Veranstaltung können die Studierenden:

- zentrale Begriffe des Cloud Computing fachlich korrekt erläutern
- Service-Modelle wie `IaaS`, `PaaS` und `SaaS` unterscheiden und einordnen
- Deployment-Modelle wie `Public`, `Private`, `Hybrid` und `Multi-Cloud` vergleichen
- die Eigenschaften cloudbasierter Systeme anhand von Skalierbarkeit, Elastizität, Verfügbarkeit und Kosten bewerten
- typische Cloud-Architekturen für Webanwendungen analysieren
- Last, Ressourcenverbrauch und Engpässe in verteilten Systemen nachvollziehen
- den Einsatz von Containern, Reverse Proxies, Datenbanken, Caches und Message- oder State-Diensten begründen
- Observability-Konzepte wie Monitoring, Logging, Metriken, Tracing und Alerting anwenden
- Sicherheits- und Datenschutzfragen im Cloud-Betrieb diskutieren
- die **6R-Aspekte** von Cloud-Migrationen auf konkrete Systeme anwenden
- eine Cloud-Architektur oder Betriebsstrategie für einen gegebenen Anwendungsfall entwerfen und begründen

## 4. Didaktische Leitprinzipien

Die Veranstaltung folgt fünf Leitprinzipien:

### 4.1 Theorie mit direktem Systembezug

Begriffe und Modelle werden nicht isoliert vermittelt, sondern immer mit Bezug auf **arsnova.eu** als konkretes Anwendungssystem.

### 4.2 Architektur vor Tool-Mode

Nicht das einzelne Cloud-Produkt steht im Zentrum, sondern das zugrunde liegende Architektur- und Betriebsverständnis.

### 4.3 Praktikum als Erkenntnisraum

Das Praktikum dient nicht nur dem "Nachbauen", sondern dem Beobachten, Messen, Begruenden und Reflektieren am Lehrvehikel **arsnova.eu**.

### 4.4 Betriebsrealismus

Skalierung, Ausfälle, Kosten, Fehlkonfigurationen und Trade-offs werden ausdrücklich thematisiert.

### 4.5 Wissenschaftliche Anschlussfähigkeit

Die Inhalte sollen sowohl für die Praxis als auch für Hausarbeiten, Projektberichte und Abschlussarbeiten anschlussfähig sein.

## 5. Vorkenntnisse

Empfohlen werden:

- grundlegende Webentwicklung
- HTTP- und Client-Server-Verständnis
- Basiswissen zu Datenbanken
- Grundkenntnisse in Linux oder Shell
- erste Erfahrungen mit Git

Nicht zwingend vorausgesetzt, aber hilfreich:

- Docker
- CI/CD
- verteilte Systeme

## 6. Modulstruktur

Die 36 UE werden in **6 Themenblöcke** gegliedert, die Vorlesung und Praktikum jeweils verbinden.

| Block | Thema                                          | Umfang |
| ----- | ---------------------------------------------- | ------ |
| 1     | Grundlagen und Service-Modelle                 | 6 UE   |
| 2     | Cloud-Architekturen und Betriebsmodelle        | 6 UE   |
| 3     | Container, Plattformen und Deployment          | 6 UE   |
| 4     | Skalierung, Performance und Resilience         | 6 UE   |
| 5     | Sicherheit, Datenschutz und Wirtschaftlichkeit | 6 UE   |
| 6     | Migration, 6R, Projektarbeit und Abschluss     | 6 UE   |

Jeder Block nutzt **arsnova.eu** unter einer anderen Perspektive:

- als Produkt
- als Monorepo
- als Container-Deployment
- als Cloud-Betriebsfall
- als Last- und Observability-Fall
- als Transformationsobjekt unter 6R-Aspekten

## 7. Verzahnung von Vorlesung und Praktikum

Jeder Themenblock besteht aus zwei Perspektiven:

- **Vorlesung:** Begriffe, Modelle, Methoden, Architekturprinzipien am Beispiel von **arsnova.eu**
- **Praktikum:** Anwendung auf **arsnova.eu** als Fallstudie, Messung, Design-Entscheidung oder Betriebsaufgabe

Typisches 3-UE-Format pro Termin:

- **UE 1:** Einführung, Theorie, Modellbildung
- **UE 2:** Vertiefung, Fallanalyse, Diskussion
- **UE 3:** Praktische Aufgabe, Laborphase, Auswertung

Empfohlene begleitende Repo-Dokumente fuer die gesamte Veranstaltung:

- [docs/didaktik/vorlesungsplan-10-wochen-arsnova-eu.md](./vorlesungsplan-10-wochen-arsnova-eu.md)
- [docs/didaktik/vorlesungen-90-minuten-arsnova-eu.md](./vorlesungen-90-minuten-arsnova-eu.md)
- [docs/didaktik/dozenten-quickstart.md](./dozenten-quickstart.md)
- [docs/praktikum/EINSTIEG-TOOLS-UND-STACK.md](../praktikum/EINSTIEG-TOOLS-UND-STACK.md)
- [docs/architecture/decisions/0013-use-k6-and-artillery-for-load-and-performance-testing.md](../architecture/decisions/0013-use-k6-and-artillery-for-load-and-performance-testing.md)
- [docs/architecture/decisions/0021-separate-service-status-from-load-status-with-live-slo-telemetry.md](../architecture/decisions/0021-separate-service-status-from-load-status-with-live-slo-telemetry.md)
- [docs/implementation/LASTTEST-500-TEILNEHMENDE.md](../implementation/LASTTEST-500-TEILNEHMENDE.md)
- [docs/implementation/CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md](../implementation/CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md)
- [docs/implementation/CLOUD-COMPUTING-EINORDNUNG-AKADEMISCH.md](../implementation/CLOUD-COMPUTING-EINORDNUNG-AKADEMISCH.md)
- [docs/implementation/CLOUD-COMPUTING-6R-EINORDNUNG.md](../implementation/CLOUD-COMPUTING-6R-EINORDNUNG.md)
- [docs/implementation/CLOUD-PROVIDER-VERGLEICH-ARSNOVA-EU.md](../implementation/CLOUD-PROVIDER-VERGLEICH-ARSNOVA-EU.md)

## 8. Empfohlene Prüfungsform

Für eine Bachelor-Veranstaltung mit Praktikumsanteil eignet sich eine Kombination aus:

- **schriftlicher Ausarbeitung oder Kurzdokumentation**
- **praktischem Artefakt**
- **Präsentation oder Abschlussvortrag**

Beispiel:

- 40 % Projekt- oder Praktikumsleistung
- 30 % schriftliche Ausarbeitung
- 30 % Präsentation oder mündliche Leistung

Alternativ:

- Klausur plus benotetes Praktikum

## 9. Semesterplan (12 Termine à 3 UE)

## Termin 1: Einführung in Cloud Computing

**Vorlesungsinhalte**

- Was ist Cloud Computing?
- Historische Entwicklung
- Virtualisierung, On-Demand-Nutzung, Self-Service
- Abgrenzung zu klassischem Hosting

**Praktikum**

- Einstieg in **arsnova.eu** als Lehrvehikel
- Systemüberblick: Anwendung, Dienste, Infrastruktur
- erste Architektur-Landkarte erstellen

**Lernprodukt**

- Kurzprotokoll: "Warum ist dieses System ein Cloud-Computing-Fall?"

**Repo-Grundlage**

- [README.md](../../README.md)
- [docs/architecture/handbook.md](../architecture/handbook.md)
- [docs/praktikum/EINSTIEG-TOOLS-UND-STACK.md](../praktikum/EINSTIEG-TOOLS-UND-STACK.md)

## Termin 2: Service- und Deployment-Modelle

**Vorlesungsinhalte**

- `IaaS`, `PaaS`, `SaaS`
- Public, Private, Hybrid und Multi-Cloud
- Verantwortungsverschiebung zwischen Anbieter und Betreiber

**Praktikum**

- Einordnung von **arsnova.eu** in Service- und Deployment-Modelle
- Betriebsgrenzen und Betreiberverantwortung diskutieren

**Lernprodukt**

- tabellarische Zuordnung des Systems zu den Cloud-Modellen

**Repo-Grundlage**

- [README.md](../../README.md)
- [docs/deployment-debian-root-server.md](../deployment-debian-root-server.md)

## Termin 3: Cloud-Architektur für Webanwendungen

**Vorlesungsinhalte**

- typische Architekturbausteine
- Web-Frontend, API, Datenbank, Cache, Queue, Object Storage
- Zustandslosigkeit und Stateful Components

**Praktikum**

- Architekturdiagramm fuer **arsnova.eu** erstellen
- Single Host versus entkoppelte Architektur diskutieren

**Lernprodukt**

- Architekturdiagramm mit Begründung

**Repo-Grundlage**

- [docs/architecture/handbook.md](../architecture/handbook.md)
- [docs/diagrams/architecture-overview.md](../diagrams/architecture-overview.md)
- [docs/diagrams/diagrams.md](../diagrams/diagrams.md)

## Termin 4: Container und Laufzeitumgebungen

**Vorlesungsinhalte**

- Container versus virtuelle Maschinen
- Docker-Grundlagen
- Images, Container, Netzwerke, Volumes

**Praktikum**

- lokale oder produktionsnahe Container-Struktur analysieren
- Dienste und deren Abhängigkeiten kartieren

**Lernprodukt**

- Kurzbericht: "Welche Vorteile und Grenzen hat die Containerisierung in diesem Fall?"

**Repo-Grundlage**

- [Dockerfile](../../Dockerfile)
- [docker-compose.yml](../../docker-compose.yml)
- [docker-compose.prod.yml](../../docker-compose.prod.yml)

## Termin 5: Reverse Proxy, Routing und Deployment

**Vorlesungsinhalte**

- Reverse Proxy
- TLS-Terminierung
- Routing und Port-Konzept
- Zero-Downtime-Ideen

**Praktikum**

- Analyse des Produktions- oder Zieldeployments von **arsnova.eu**
- Identifikation von Engpässen im aktuellen Betriebsmodell

**Lernprodukt**

- Deployment-Skizze mit Datenfluss

**Repo-Grundlage**

- [docs/deployment-debian-root-server.md](../deployment-debian-root-server.md)
- [scripts/deploy.sh](../../scripts/deploy.sh)
- [docs/implementation/POST-DEPLOY-CHECKLIST.md](../implementation/POST-DEPLOY-CHECKLIST.md)

## Termin 6: Datenhaltung in Cloud-Systemen

**Vorlesungsinhalte**

- relationale Datenbanken im Cloud-Betrieb
- In-Memory-Dienste wie Redis
- Persistenz versus Live-State
- Backup, Recovery, Datenkonsistenz

**Praktikum**

- Datenflüsse und Zuständigkeiten zwischen PostgreSQL und Redis einordnen
- Stateful und Stateless Komponenten markieren

**Lernprodukt**

- Datenhaltungs-Matrix

**Repo-Grundlage**

- [prisma/schema.prisma](../../prisma/schema.prisma)
- [apps/backend/src/db.ts](../../apps/backend/src/db.ts)
- [apps/backend/src/redis.ts](../../apps/backend/src/redis.ts)

## Termin 7: Skalierung und Elastizität

**Vorlesungsinhalte**

- vertikale und horizontale Skalierung
- Auto-Scaling als Konzept
- Lastprofile, Peak-Last, Burst-Szenarien

**Praktikum**

- **arsnova.eu** fuer ein 500-Nutzer-Szenario analysieren
- Skalierungsoptionen entwerfen

**Lernprodukt**

- Maßnahmenkatalog für Lastspitzen

**Repo-Grundlage**

- [docs/implementation/LASTTEST-500-TEILNEHMENDE.md](../implementation/LASTTEST-500-TEILNEHMENDE.md)
- [docs/implementation/CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md](../implementation/CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md)
- [docs/implementation/CLOUD-PROVIDER-VERGLEICH-ARSNOVA-EU.md](../implementation/CLOUD-PROVIDER-VERGLEICH-ARSNOVA-EU.md)

## Termin 8: Performance und Lasttests

**Vorlesungsinhalte**

- Performance-Metriken
- p50, p95, p99
- Throughput, Error Rate, Saturation
- Lasttests als Architekturwerkzeug

**Praktikum**

- Lasttest-Konzept für eine Live-Anwendung erstellen
- Join-, Vote- und Statuswechsel-Szenarien modellieren

**Lernprodukt**

- Lasttest-Plan mit Messgrößen und Abnahmekriterien

**Repo-Grundlage**

- [docs/architecture/decisions/0013-use-k6-and-artillery-for-load-and-performance-testing.md](../architecture/decisions/0013-use-k6-and-artillery-for-load-and-performance-testing.md)
- [scripts/load/k6-trpc-health-50vu.js](../../scripts/load/k6-trpc-health-50vu.js)
- [scripts/load/k6-trpc-session-50vu.js](../../scripts/load/k6-trpc-session-50vu.js)
- [scripts/load/session-participants-50.mjs](../../scripts/load/session-participants-50.mjs)

## Termin 9: Observability und Betrieb

**Vorlesungsinhalte**

- Monitoring
- Logging
- Metriken
- Alerting
- SLO, SLA, SLI

**Praktikum**

- Monitoring- und Alarmierungsbedarf für die Fallstudie definieren
- Mindestmetriken für Live-Betrieb festlegen

**Lernprodukt**

- Observability-Konzept

**Repo-Grundlage**

- [docs/architecture/decisions/0021-separate-service-status-from-load-status-with-live-slo-telemetry.md](../architecture/decisions/0021-separate-service-status-from-load-status-with-live-slo-telemetry.md)
- [docs/features/server-status-widget.md](../features/server-status-widget.md)
- [apps/backend/src/lib/sloTelemetry.ts](../../apps/backend/src/lib/sloTelemetry.ts)
- [apps/backend/src/lib/loadSignal.ts](../../apps/backend/src/lib/loadSignal.ts)

## Termin 10: Sicherheit, Datenschutz und Compliance

**Vorlesungsinhalte**

- Identity und Access Management
- Secrets Management
- Netzwerkgrenzen
- Datenschutz im Cloud-Betrieb
- Multi-Tenancy und Datenminimierung

**Praktikum**

- Sicherheits- und Datenschutzrisiken von **arsnova.eu** analysieren
- Betreiber- und Nutzerperspektive unterscheiden

**Lernprodukt**

- Risikoübersicht mit Gegenmaßnahmen

**Repo-Grundlage**

- [docs/SECURITY-OVERVIEW.md](../SECURITY-OVERVIEW.md)
- [docs/ENVIRONMENT.md](../ENVIRONMENT.md)
- [docs/features/motd.md](../features/motd.md)

## Termin 11: Cloud-Migration und 6R-Aspekte

**Vorlesungsinhalte**

- Rehost
- Replatform
- Repurchase
- Refactor
- Retire
- Retain

**Praktikum**

- Einordnung von **arsnova.eu** unter den 6R-Aspekten
- Transformationsstrategie formulieren

**Lernprodukt**

- 6R-Einordnung mit begründeter Zielstrategie

**Repo-Grundlage**

- [docs/implementation/CLOUD-COMPUTING-6R-EINORDNUNG.md](../implementation/CLOUD-COMPUTING-6R-EINORDNUNG.md)
- [docs/implementation/CLOUD-COMPUTING-EINORDNUNG-AKADEMISCH.md](../implementation/CLOUD-COMPUTING-EINORDNUNG-AKADEMISCH.md)

## Termin 12: Abschluss und Projektpräsentationen

**Vorlesungsinhalte**

- Synthese der Veranstaltung
- Trade-offs zwischen Technik, Betrieb und Kosten
- Cloud Readiness als Gesamtbewertung

**Praktikum**

- Kurzpräsentationen oder Abschlussvorträge
- Diskussion der Architektur- und Betriebsentwürfe

**Lernprodukt**

- Abschlusspräsentation und Schlussreflexion

**Repo-Grundlage**

- [docs/praktikum/Fallstudie-Software-Engineering-Beschreibung-6-Abschlussvortraege.md](../praktikum/Fallstudie-Software-Engineering-Beschreibung-6-Abschlussvortraege.md)
- [docs/didaktik/folienskizzen-arsnova-eu.md](./folienskizzen-arsnova-eu.md)

## 10. Praktikumskonzept im Detail

Das Praktikum soll nicht als lose Sammlung kleiner Aufgaben organisiert werden, sondern als zusammenhaengende Fallarbeit an **arsnova.eu**.

### 10.1 Empfohlenes Praxisformat

Jede Person oder Kleingruppe bearbeitet über das Semester hinweg ein konsistentes Thema, zum Beispiel:

- Cloud-Architektur einer Live-Webanwendung
- Lasttest- und Skalierungskonzept
- Observability- und Betriebsmodell
- Sicherheits- und Datenschutzkonzept
- 6R-Transformationsstrategie

Alle Themen sind ausdruecklich auf das Lehrvehikel **arsnova.eu** bezogen. Die Studierenden arbeiten also nicht an frei erfundenen Cloud-Szenarien, sondern an realen Repo-Artefakten, bestehenden Dokumenten und beobachtbaren Betriebsfragen.

### 10.2 Geeignete Praktikumsartefakte

- Architekturdiagramm
- Deployment-Diagramm
- Lasttest-Konzept
- Betriebsdokument
- Monitoring-Konzept
- Sicherheitsanalyse
- Migrationsstrategie
- Abschlusspräsentation

### 10.3 Praxisnähe

Die Aufgaben sollen so formuliert sein, dass die Studierenden immer an einem realistischen Betreiberproblem arbeiten:

- Kann **arsnova.eu** 500 gleichzeitige Nutzer tragen?
- Wie müsste die Architektur für höhere Last angepasst werden?
- Welche Dienste sollten entkoppelt werden?
- Welche Metriken braucht ein Betreiber?
- Wie laesst sich **arsnova.eu** unter 6R-Aspekten einordnen?

Empfohlene repo-nahe Arbeitsgrundlagen fuer das Praktikum:

- [docs/implementation/LASTTEST-500-TEILNEHMENDE.md](../implementation/LASTTEST-500-TEILNEHMENDE.md)
- [docs/implementation/CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md](../implementation/CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md)
- [docs/implementation/CLOUD-COMPUTING-6R-EINORDNUNG.md](../implementation/CLOUD-COMPUTING-6R-EINORDNUNG.md)
- [docs/implementation/CLOUD-PROVIDER-VERGLEICH-ARSNOVA-EU.md](../implementation/CLOUD-PROVIDER-VERGLEICH-ARSNOVA-EU.md)
- [docs/praktikum/PRAKTIKUM.md](../praktikum/PRAKTIKUM.md)
- [docs/praktikum/PRAKTIKUM-SQM.md](../praktikum/PRAKTIKUM-SQM.md)

## 11. Vorschlag für Leistungsnachweise

### Variante A: Projektorientiert

- Konzeptpapier: 30 %
- Praktikumsartefakte: 40 %
- Abschlusspräsentation: 30 %

### Variante B: Klausur plus Praktikum

- Klausur: 50 %
- Praktikum: 30 %
- Präsentation oder mündliche Verteidigung: 20 %

### Variante C: Studienleistung mit Portfolio

- laufendes Portfolio aus 4 bis 6 Artefakten
- Abschlussreflexion
- kurze Ergebnispräsentation

## 12. Bezug zu arsnova.eu als Fallstudie

**arsnova.eu** ist in diesem Konzept nicht nur eine optionale Fallstudie, sondern das **zentrale Lehrvehikel** fuer Vorlesung und Praktikum. Das System eignet sich besonders gut fuer eine Bachelor-Vorlesung zu Cloud Computing, weil dort viele typische Cloud-Fragen zusammenkommen:

- Live-Webanwendung mit gleichzeitigen Nutzerzugriffen
- Node.js-Backend, PostgreSQL, Redis, WebSockets
- Containerbetrieb
- Skalierungs- und Lastfragen
- Monitoring- und SLO-Perspektive
- Datenschutz und Betreiberverantwortung
- Einordnung in die 6R-Strategien

Didaktischer Vorteil:

- Studierende arbeiten an einem System, das nicht künstlich vereinfacht ist
- theoretische Begriffe lassen sich sofort an realen Strukturen festmachen
- Last, Betrieb und Architektur sind nicht abstrakt, sondern konkret beobachtbar

Repo-Dokumente, die diesen Einsatz als Lehrvehikel besonders stuetzen:

- [README.md](../../README.md)
- [Backlog.md](../../Backlog.md)
- [docs/architecture/handbook.md](../architecture/handbook.md)
- [docs/deployment-debian-root-server.md](../deployment-debian-root-server.md)
- [docs/SECURITY-OVERVIEW.md](../SECURITY-OVERVIEW.md)
- [docs/TESTING.md](../TESTING.md)
- [docs/didaktik/dozenten-quickstart.md](./dozenten-quickstart.md)
- [docs/didaktik/greenfield-demo-1-7a-vorlesung.md](./greenfield-demo-1-7a-vorlesung.md)
- [docs/praktikum/EINSTIEG-TOOLS-UND-STACK.md](../praktikum/EINSTIEG-TOOLS-UND-STACK.md)

## 13. Empfohlene Lehrmethoden

- kurze Input-Phasen statt langer Frontalblöcke
- Architektur- und Betriebsdiskussionen im Plenum
- Whiteboard- oder Diagrammarbeit
- kleine Analysegruppen
- Laborphasen mit klaren Arbeitsaufträgen
- Abschluss jeder Sitzung mit kurzem Ergebnisartefakt

## 14. Erwartete Kompetenzentwicklung

Die Studierenden sollen am Ende nicht nur "Cloud-Dienste kennen", sondern in der Lage sein:

- ein reales System cloudbezogen zu analysieren
- Skalierungs- und Betriebsfragen sauber zu formulieren
- technische Optionen mit Trade-offs zu vergleichen
- Architekturen nicht nur nach Technologie, sondern nach Betriebsfolgen zu bewerten

## 15. Ergebnis der Veranstaltung

Am Ende der Veranstaltung liegt idealerweise pro Gruppe oder Person ein konsistentes Set aus:

- Cloud-Architektur-Einordnung
- Skalierungs- oder Lasttest-Konzept
- Betriebs- und Observability-Modell
- Sicherheits- und Datenschutzbewertung
- 6R-Transformationsperspektive
- Abschlusspräsentation

Damit eignet sich die Veranstaltung zugleich als:

- fachliche Einführung in Cloud Computing
- methodische Vorbereitung auf Projektarbeit
- Brücke zu DevOps, Software Engineering, verteilten Systemen und IT-Betrieb

## 16. Kurzfassung für Modulhandbuch oder Studiengangsplanung

Die Lehrveranstaltung "Cloud Computing" vermittelt Grundlagen, Architekturmuster, Betriebsmodelle und Skalierungsprinzipien cloudbasierter Systeme. Als durchgehendes Lehrvehikel dient die Webanwendung **arsnova.eu**. Im integrierten Praktikum analysieren die Studierenden **arsnova.eu** unter den Perspektiven Infrastruktur, Deployment, Performance, Observability, Sicherheit und Cloud-Transformation. Der Fokus liegt auf dem Verständnis von Cloud Computing als Zusammenspiel aus Technik, Betrieb und Architekturentscheidung.

---

**Stand:** 2026-05-08  
**Einsatz:** Lehrkonzept, Modulplanung, Vorlesungsentwurf, didaktische Abstimmung
