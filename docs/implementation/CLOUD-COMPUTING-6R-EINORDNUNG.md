# Cloud-Computing-Einordnung mit 6R-Aspekten

## Zweck

Dieses Dokument ordnet die Fragestellung zur Skalierung und Betriebsfaehigkeit von **arsnova.eu** auch unter dem Blickwinkel der **6R-Aspekte** des Cloud Computing ein.

Gemeint sind die typischen **6R-Strategien der Cloud-Migration und Cloud-Transformation**:

- Rehost
- Replatform
- Repurchase
- Refactor
- Retire
- Retain

## Einordnung

Die bisherigen Dokumente ordnen den 500er-Lasttest vor allem ueber Skalierbarkeit, Observability, Resilience und Infrastrukturfragen in das Cloud Computing ein.

Die **6R-Perspektive** ergaenzt diese Sicht um eine strategische Frage:

> **Welche Art von Veraenderung ist fuer das System sinnvoll, um es cloud-geeignet, skalierbar und wirtschaftlich betreibbar zu machen?**

Damit geht es nicht nur um Lasttest und Performance, sondern auch um die grundsaetzliche Transformationsstrategie des Systems.

## Die 6R und ihre Bedeutung fuer arsnova.eu

### 1. Rehost

`Rehost` bedeutet, eine bestehende Anwendung weitgehend unveraendert in eine andere Infrastruktur zu verschieben.

Typische Form:

- "Lift and Shift"
- gleicher Anwendungsstack
- neue virtuelle Maschine oder neuer Cloud-Host

Bezug zu arsnova.eu:

- Ein Wechsel von einem einzelnen Hetzner-Host auf einen staerkeren oder anders betriebenen Cloud-Host waere ein klassischer Rehost-Schritt.
- Auch das Verpacken und Betreiben auf einer anderen IaaS-Umgebung ohne groessere Codeaenderungen faellt darunter.

Bewertung:

- **kurzfristig realistisch**
- verbessert Betriebsbedingungen
- loest aber strukturelle Lastprobleme nur begrenzt

### 2. Replatform

`Replatform` bedeutet, die Anwendung technisch leicht anzupassen, ohne sie grundsaetzlich neu zu bauen.

Typische Form:

- gleiche Anwendung
- aber andere Betriebsdienste
- moderate Anpassungen an Infrastruktur oder Laufzeit

Bezug zu arsnova.eu:

- PostgreSQL als Managed Service betreiben
- Redis als separaten Dienst auslagern
- Reverse Proxy oder Load Balancer verbessern
- App-Container professioneller orchestrieren

Bewertung:

- **fuer arsnova.eu sehr relevant**
- guter Mittelweg zwischen Aufwand und Wirkung
- wahrscheinlich die sinnvollste mittelfristige Cloud-Strategie

### 3. Repurchase

`Repurchase` bedeutet, eine bestehende Eigenentwicklung ganz oder teilweise durch ein externes Produkt oder einen SaaS-Dienst zu ersetzen.

Bezug zu arsnova.eu:

- fuer den Kern der Plattform eher unpassend, da arsnova.eu selbst das Produkt ist
- teilweise denkbar fuer Randbereiche wie:
  - Monitoring
  - Logging
  - Managed Datenbank
  - Managed Redis
  - CDN oder Edge-Services

Bewertung:

- **fuer das Kernsystem nicht zentral**
- **fuer Betriebsbausteine aber sinnvoll**

### 4. Refactor

`Refactor` bedeutet, die Anwendung oder Architektur gezielt so umzubauen, dass sie cloud-native und besser skalierbar wird.

Typische Form:

- Architekturveraenderungen
- staerkere Entkopplung
- eventgetriebene Kommunikation
- skalierbare Zustandsverwaltung

Bezug zu arsnova.eu:

- Polling in Live-Pfaden reduzieren
- Redis staerker fuer Live-Zustand und Aggregationen nutzen
- DB-lastige Live-Berechnungen auslagern
- App horizontal skalierbar machen
- Host- und Teilnehmerpfade sauber trennen

Bewertung:

- **technisch sehr relevant**
- **langfristig wahrscheinlich notwendig**, wenn Grossveranstaltungen robust unterstuetzt werden sollen
- hoeherer Aufwand, aber groesster nachhaltiger Nutzen

### 5. Retire

`Retire` bedeutet, nicht mehr benoetigte Komponenten oder Funktionen abzuschalten.

Bezug zu arsnova.eu:

- fuer Event-Szenarien kann geprueft werden, ob bestimmte Zusatzfunktionen im Grosslastbetrieb deaktiviert werden sollten
- Beispiele:
  - optionale Zusatzkanaele
  - besonders teure Live-Funktionen
  - selten genutzte, aber lastkritische Features

Bewertung:

- **nicht als Gesamtstrategie**, aber als Teil eines Event-Betriebsmodus sinnvoll
- hilft, Last und Komplexitaet zu reduzieren

### 6. Retain

`Retain` bedeutet, Teile eines Systems zunaechst bewusst unveraendert zu belassen.

Bezug zu arsnova.eu:

- nicht jede Komponente muss sofort cloud-native umgebaut werden
- stabile und unkritische Teile koennen vorerst bestehen bleiben
- die Transformation kann schrittweise erfolgen

Beispiele:

- Frontend-Build-Pipeline vorerst beibehalten
- bestimmte Admin- oder Hilfsfunktionen zunaechst unveraendert lassen
- nur die echten Last-Hotspots zuerst angehen

Bewertung:

- **fuer arsnova.eu sehr realistisch**
- sinnvoll, um Aufwand zu begrenzen
- erlaubt fokussierte Optimierung statt Komplettumbau

## Zusammenfassende Bewertung fuer arsnova.eu

Fuer **arsnova.eu** sind im Kontext der 500er-Frage vor allem diese 6R-Strategien relevant:

### Kurzfristig sinnvoll

- `Rehost`
  - wenn kurzfristig mehr Leistung durch staerkere Infrastruktur benoetigt wird
- `Replatform`
  - wenn Datenbank, Redis oder Betriebsdienste professioneller ausgelagert werden

### Mittelfristig besonders sinnvoll

- `Replatform`
  - als pragmatische Cloud-Optimierung ohne Komplettumbau
- `Retain`
  - um stabile Teile bewusst unveraendert zu lassen

### Langfristig strategisch wichtig

- `Refactor`
  - wenn arsnova.eu fuer groessere und haeufigere Live-Last cloud-native weiterentwickelt werden soll

### Nur teilweise relevant

- `Repurchase`
  - fuer Betriebsbausteine moeglich, fuer das Kernprodukt eher nicht
- `Retire`
  - eher fuer einzelne Funktionen oder Event-Modi als fuer das Gesamtsystem

## Fachliche Schlussfolgerung

Die 500er-Fragestellung laesst sich daher nicht nur allgemein in das **Cloud Computing** einordnen, sondern auch konkret als **6R-Transformationsfrage**:

Die zentrale Frage lautet nicht nur, ob die aktuelle Infrastruktur ausreicht, sondern **welche Transformationsstrategie fuer arsnova.eu am sinnvollsten ist**.

Fuer den aktuellen Stand ergibt sich folgende Tendenz:

- **Rehost** als kurzfristige Betriebsoption
- **Replatform** als realistischer naechster Schritt
- **Refactor** als langfristige Skalierungsstrategie
- **Retain** fuer nicht-kritische oder bereits stabile Teile

## Kurzform fuer Vortrag oder Hausarbeit

Unter den **6R-Aspekten des Cloud Computing** ist die Fragestellung von arsnova.eu vor allem den Strategien **Rehost**, **Replatform**, **Refactor** und **Retain** zuzuordnen. Kurzfristig kann die Plattform durch staerkere oder besser getrennte Infrastruktur verbessert werden. Langfristig wird jedoch vor allem eine architektonische Weiterentwicklung in Richtung cloud-nativer, skalierbarer Live-Kommunikation relevant.
