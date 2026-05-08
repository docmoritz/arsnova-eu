# Cloud-Provider-Vergleich fuer arsnova.eu

## Zweck

Dieses Dokument beschreibt die Cloud-Provider und die fuer **arsnova.eu** relevanten Dienstleistungen. Zusaetzlich enthaelt es eine grobe betriebswirtschaftliche Einordnung der zu erwartenden monatlichen Betriebskosten.

Die Darstellung ist bewusst pragmatisch gehalten und dient als Grundlage fuer:

- Infrastrukturentscheidungen
- Lehrveranstaltungen zum Thema Cloud Computing
- Lasttest- und Skalierungsplanung
- Management- und Betriebsdiskussionen

## Ausgangspunkt

Die aktuelle Produktivumgebung von **arsnova.eu** laeuft auf einem einzelnen Hetzner-Host mit:

- 8 Kernen
- 16 GB RAM
- App
- PostgreSQL
- Redis

Die zentrale Cloud-Frage lautet daher nicht nur, ob mehr Leistung benoetigt wird, sondern auch, **welcher Anbieter und welches Betriebsmodell fuer den naechsten Ausbauschritt sinnvoll sind**.

## Fuer arsnova.eu relevante Dienstklassen

Unabhaengig vom Anbieter sind fuer **arsnova.eu** vor allem diese Cloud-Dienste relevant:

- **Compute / Virtual Machines**
  fuer Frontend, Backend, Reverse Proxy und selbst betriebene Datenbankdienste

- **PostgreSQL**
  entweder selbst betrieben auf einer VM oder als Managed Database

- **Redis / Valkey**
  fuer Cache, Rate Limiting, Session-/Presence-Zustaende und Live-Daten

- **Load Balancer**
  fuer horizontale Skalierung, TLS-Terminierung und bessere Verfuegbarkeit

- **Block Storage**
  fuer persistente Daten, Datenbankspeicher und Snapshots

- **Object Storage**
  fuer Backups, Exporte und statische Artefakte

- **CDN / WAF / Edge-Schutz**
  optional fuer statische Inhalte, DDoS-Abwehr und Web-Schutz

- **Monitoring / Logging / Observability**
  fuer Produktionsbetrieb, Lasttests und Stoerungsanalyse

## Bewertungskriterien

Die Anbieter werden aus Sicht von **arsnova.eu** nach folgenden Kriterien betrachtet:

- technische Eignung fuer den aktuellen Stack
- Eignung fuer Live- und Lastszenarien
- Betriebsaufwand
- DSGVO-/Europa-Bezug
- Preisniveau
- Eignung fuer einen schrittweisen Ausbau

## Provider 1: Hetzner

### Relevante Dienste

Fuer **arsnova.eu** sind bei Hetzner besonders relevant:

- Cloud Server
- Primary IPs
- Private Networks
- Load Balancer
- Volumes / Block Storage
- Object Storage
- Firewalls

### Einordnung fuer arsnova.eu

Hetzner ist fuer **arsnova.eu** die naheliegendste IaaS-Option, weil das aktuelle Betriebsmodell bereits in diese Richtung geht.

Vorteile:

- sehr gutes Preis-Leistungs-Verhaeltnis
- Datenhaltung in Europa
- einfache Infrastruktur
- gut geeignet fuer kleine bis mittlere Produktivumgebungen
- sehr attraktiv fuer Lehrbetrieb, Prototyping und Forschungskontexte

Nachteile:

- weniger ausgepraegtes Managed-Service-Angebot als bei Hyperscalern
- mehr Eigenverantwortung fuer Betrieb, Backups und Hochverfuegbarkeit
- bei wachsender Komplexitaet steigt der Betriebsaufwand deutlich

### Typisches Zielbild fuer arsnova.eu

Kurzfristig:

- eine staerkere einzelne VM
- PostgreSQL und Redis weiterhin selbst betrieben

Mittelfristig:

- separater App-Server
- separate DB-VM
- separater Redis-Dienst oder eigene Redis-VM
- Load Balancer vor mehreren App-Instanzen

### Grobe Kostenabschaetzung

Die folgenden Werte sind **grobe Monatswerte** und dienen nur der Orientierung:

#### Variante A: heutiges Minimalmodell

- 1 Cloud-Server in der Groessenordnung 8 vCPU / 16 GB RAM
- 1 IPv4

Erwartbarer Bereich:

- **ca. 16 bis 25 EUR / Monat**

#### Variante B: kleine produktive Trennung

- 1 App-VM
- 1 DB-VM
- 1 Load Balancer
- 1 IPv4 fuer App oder Eingangspunkt
- kleines Object Storage fuer Backups

Erwartbarer Bereich:

- **ca. 45 bis 80 EUR / Monat**

#### Variante C: robusterer Produktivbetrieb

- 2 App-VMs
- 1 DB-VM
- 1 Redis-VM
- 1 Load Balancer
- Volumes / Backups / Object Storage

Erwartbarer Bereich:

- **ca. 90 bis 180 EUR / Monat**

### Bewertung

Hetzner ist die beste Option, wenn **arsnova.eu** weiterhin kosteneffizient, europaeisch und vergleichsweise einfach betrieben werden soll.

## Provider 2: Google Cloud

### Relevante Dienste

Fuer **arsnova.eu** sind bei Google Cloud besonders relevant:

- Compute Engine
- Cloud SQL for PostgreSQL
- Memorystore for Valkey
- Cloud Load Balancing
- Cloud Storage
- Cloud CDN
- Cloud Armor
- Cloud Monitoring / Logging

### Einordnung fuer arsnova.eu

Google Cloud ist fuer **arsnova.eu** besonders interessant, wenn der naechste Schritt nicht nur mehr Rechenleistung, sondern **mehr Managed Services** sein soll.

Vorteile:

- sehr gute Managed-Datenbank-Option mit Cloud SQL
- Redis-/Valkey-Betrieb als Managed Service
- gute Observability- und Betriebswerkzeuge
- klarer Pfad zu skalierbarerem Betrieb

Nachteile:

- deutlich hoehere Kosten als bei Hetzner
- groessere Plattformkomplexitaet
- fuer kleine Teams oft administrativ aufwendiger

### Typisches Zielbild fuer arsnova.eu

- App auf einer oder mehreren Compute-Engine-Instanzen
- PostgreSQL auf Cloud SQL
- Redis / Valkey auf Memorystore
- optional CDN und WAF fuer besseren Randstellenschutz

### Grobe Kostenabschaetzung

#### Variante A: kleine Managed-Produktionsumgebung

- 1 App-VM
- 1 kleine Cloud-SQL-Instanz
- optional kleiner Memorystore

Erwartbarer Bereich:

- **ca. 250 bis 500 USD / Monat**

#### Variante B: robustere produktive Trennung

- 2 App-Instanzen
- Cloud SQL mit hoeherer Groesse oder HA
- Memorystore
- Load Balancing
- Logging / Monitoring / Storage

Erwartbarer Bereich:

- **ca. 450 bis 900 USD / Monat**

### Bewertung

Google Cloud ist fuer **arsnova.eu** eine sehr gute Option, wenn **DB und Redis nicht mehr selbst betrieben** werden sollen und ein professioneller Managed-Betrieb wichtiger ist als Minimalpreis.

## Provider 3: AWS

### Relevante Dienste

Fuer **arsnova.eu** sind bei AWS besonders relevant:

- EC2
- RDS for PostgreSQL
- ElastiCache for Valkey
- Elastic Load Balancing
- EBS
- S3
- CloudFront
- AWS WAF
- CloudWatch

### Einordnung fuer arsnova.eu

AWS ist technisch sehr leistungsfaehig und deckt alle relevanten Betriebsmodelle ab.

Vorteile:

- sehr breite Dienstpalette
- ausgereifte Managed Services
- gute Skalierungsoptionen
- starke Sicherheits- und Netzwerkfunktionen

Nachteile:

- hoehere Komplexitaet
- Kosten meist deutlich ueber Hetzner
- Preisstruktur fuer kleine Teams schwerer ueberschaubar

### Typisches Zielbild fuer arsnova.eu

- App auf EC2
- PostgreSQL auf RDS
- Redis / Valkey auf ElastiCache
- CloudFront fuer statische Inhalte
- optional WAF und weitere Sicherheitsdienste

### Grobe Kostenabschaetzung

#### Kleine produktive Managed-Umgebung

- 1 bis 2 EC2-Instanzen
- 1 RDS-PostgreSQL-Instanz
- 1 kleiner ElastiCache-Dienst
- Storage und Traffic

Erwartbarer Bereich:

- **ca. 250 bis 600 EUR / Monat**

#### Erweiterte produktive Umgebung

- 2 App-Instanzen
- RDS mit hoeherer Groesse oder Multi-AZ
- ElastiCache
- Load Balancer
- S3 / CloudFront / WAF

Erwartbarer Bereich:

- **ca. 500 bis 1.200 EUR / Monat**

### Bewertung

AWS ist fuer **arsnova.eu** sinnvoll, wenn langfristig ein breites Managed- und Enterprise-Oekosystem benoetigt wird. Fuer ein kostensensitives Hochschul- oder Forschungsumfeld ist AWS haeufig ueberdimensioniert.

## Provider 4: Microsoft Azure

### Relevante Dienste

Fuer **arsnova.eu** sind bei Azure besonders relevant:

- Linux Virtual Machines
- Azure Database for PostgreSQL Flexible Server
- Azure Cache for Redis
- Load Balancer
- Managed Disks
- Azure Storage
- Front Door
- Azure Monitor

### Einordnung fuer arsnova.eu

Azure ist technisch ebenfalls gut geeignet, ist aber besonders dann attraktiv, wenn eine organisatorische oder strategische Naehe zum Microsoft-Oekosystem besteht.

Vorteile:

- gute Managed-PostgreSQL-Option
- etablierte Cache-, Netzwerk- und Monitoring-Dienste
- starke Enterprise- und Governance-Funktionen

Nachteile:

- Preisniveau meist deutlich ueber Hetzner
- fuer kleine unabhaengige Teams oft komplex
- wirtschaftlich vor allem sinnvoll bei bestehendem Azure-Bezug

### Typisches Zielbild fuer arsnova.eu

- App auf Linux-VMs
- PostgreSQL auf Flexible Server
- Redis als Managed Cache
- Front Door oder Load Balancer fuer verteilten Zugang

### Grobe Kostenabschaetzung

#### Kleine produktive Managed-Umgebung

- 1 bis 2 Linux-VMs
- 1 PostgreSQL Flexible Server
- 1 kleiner Redis-Dienst

Erwartbarer Bereich:

- **ca. 250 bis 650 EUR / Monat**

#### Erweiterte produktive Umgebung

- 2 App-Instanzen
- groessere oder hochverfuegbare PostgreSQL-Instanz
- Redis
- Front Door / WAF / Monitoring

Erwartbarer Bereich:

- **ca. 500 bis 1.300 EUR / Monat**

### Bewertung

Azure ist fuer **arsnova.eu** nur dann die erste Wahl, wenn Azure bereits institutionell gesetzt ist oder wenn Governance- und Enterprise-Anforderungen dominieren.

## Vergleich nach Betriebsmodell

### 1. Minimaler und kostensensitiver Betrieb

Geeignetster Anbieter:

- **Hetzner**

Begruendung:

- niedrigste Kosten
- einfache Infrastruktur
- ausreichende Flexibilitaet fuer das aktuelle System

### 2. Professioneller Managed-Betrieb fuer DB und Redis

Geeignetster Anbieter:

- **Google Cloud**

Begruendung:

- sauberer Pfad zu Managed PostgreSQL und Managed Valkey
- gute Balance aus Technik und Plattformreife

### 3. Enterprise- und Plattformstrategie

Geeignetste Anbieter:

- **AWS**
- **Azure**

Begruendung:

- sehr breites Oekosystem
- starke Governance-, Sicherheits- und Skalierungsoptionen
- wirtschaftlich aber meist erst bei groesserem organisatorischem Kontext attraktiv

## Zusammenfassende Kostenlogik

Die Anbieter lassen sich fuer **arsnova.eu** grob so einordnen:

- **Hetzner**
  guenstigste Option, besonders fuer IaaS und Self-Managed-Betrieb

- **Google Cloud**
  teurer, aber deutlich komfortabler fuer Managed Database und Managed Cache

- **AWS / Azure**
  meist teuerste Optionen, dafuer mit grosser Diensttiefe und starkem Plattform-Oekosystem

## Pragmatische Empfehlung fuer arsnova.eu

### Kurzfristig

Falls **arsnova.eu** zeitnah fuer groessere Veranstaltungen vorbereitet werden soll, ist der pragmatischste Weg:

- bei **Hetzner** bleiben
- Infrastruktur sauberer trennen
- App, PostgreSQL und Redis nicht mehr auf einem einzelnen Host konzentrieren
- Lasttests auf produktionsnaher Zielarchitektur durchfuehren

### Mittelfristig

Wenn der Betriebsaufwand gesenkt werden soll, ist ein Wechsel in Richtung:

- **Google Cloud mit Compute Engine + Cloud SQL + Memorystore**

ein realistischer Replatform-Schritt.

### Langfristig

Falls **arsnova.eu** staerker in Richtung professioneller Plattformbetrieb, Multi-Instanz-Architektur und Managed Security / Governance wachsen soll, kommen auch folgende Optionen in Betracht:

- **AWS**
- **Azure**

## Grenzen der Kostenschaetzung

Die genannten Kosten sind **bewusst grobe Orientierungswerte**. Die tatsaechlichen Betriebskosten haengen insbesondere ab von:

- Region
- Traffic
- Anzahl gleichzeitiger Nutzer
- Backup-Volumen
- High-Availability-Konfiguration
- Monitoring- und Logging-Umfang
- Storage-Bedarf
- Zahl der App-Instanzen

Fuer eine verbindliche Entscheidung ist immer ein detaillierter Soll-Aufbau mit Preisrechnern oder konkreten Angeboten notwendig.

## Bezug zu den weiteren Dokumenten

Dieses Dokument ergaenzt insbesondere:

- [LASTTEST-500-TEILNEHMENDE.md](./LASTTEST-500-TEILNEHMENDE.md)
- [CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md](./CLOUD-COMPUTING-EINORDNUNG-BETRIEBLICH.md)
- [CLOUD-COMPUTING-EINORDNUNG-AKADEMISCH.md](./CLOUD-COMPUTING-EINORDNUNG-AKADEMISCH.md)
- [CLOUD-COMPUTING-6R-EINORDNUNG.md](./CLOUD-COMPUTING-6R-EINORDNUNG.md)
- [BACHELOR-VORLESUNG-CLOUD-COMPUTING-36-UE-PRAKTIKUM.md](../didaktik/BACHELOR-VORLESUNG-CLOUD-COMPUTING-36-UE-PRAKTIKUM.md)

## Kurzform

Fuer **arsnova.eu** ist **Hetzner** die naheliegendste kostenoptimierte IaaS-Loesung. **Google Cloud** ist der wahrscheinlich sinnvollste naechste Schritt, wenn PostgreSQL und Redis staerker als Managed Services betrieben werden sollen. **AWS** und **Azure** sind technisch leistungsfaehig, fuer das aktuelle Szenario aber eher Optionen fuer groessere organisatorische oder strategische Zielbilder.
