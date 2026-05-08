# Cloud-Computing-Einordnung (akademische Fassung)

## Zweck

Dieses Dokument formuliert die Einordnung der Skalierungs- und Lasttest-Fragestellung von **arsnova.eu** in das Themenfeld **Cloud Computing** in einer wissenschaftlich anschlussfaehigen Form.

Die Fassung eignet sich fuer Seminararbeiten, Hausarbeiten, Vortraege, Projektberichte und akademische Diskussionen.

## Wissenschaftliche Einordnung

Die Untersuchung der Frage, ob **arsnova.eu** mit der aktuell betriebenen Infrastruktur fuer eine Veranstaltung mit **500 gleichzeitigen Teilnehmenden** geeignet ist, laesst sich dem Bereich **Cloud Computing** zuordnen.

Begruendet ist dies dadurch, dass nicht nur die funktionale Korrektheit der Anwendung betrachtet wird, sondern vor allem deren skalierbare Bereitstellung und stabiler Betrieb unter dynamischer Last.

## Theoretischer Bezug

Die Fragestellung beruehrt mehrere klassische Konzepte des Cloud Computing:

- **Elasticity**
  IT-Ressourcen muessen an veraenderliche Lastprofile angepasst werden koennen.

- **Resource Provisioning**
  Rechenleistung, Hauptspeicher, Speicherplatz und Netzwerkressourcen muessen in angemessenem Umfang bereitgestellt werden.

- **Scalability**
  Es ist zu untersuchen, ob die Anwendung durch vertikale oder horizontale Skalierung an steigende Nutzerzahlen angepasst werden kann.

- **Service Decomposition**
  Die Aufteilung von Anwendungslogik, Datenhaltung und In-Memory-Komponenten auf getrennte Dienste entspricht einem typischen Cloud-Architekturmuster.

- **Observability**
  Metriken, Monitoring, Alerting und Lasttests sind notwendig, um das Verhalten verteilter Systeme unter Last systematisch zu analysieren.

- **Resilience**
  Stabilitaet, Fehlertoleranz und kontrollierter Umgang mit Lastspitzen sind zentrale Eigenschaften cloudfaehiger Systeme.

## Bezug auf den konkreten Fall

Im Fall von **arsnova.eu** steht eine internetbasierte Anwendung mit Live-Interaktion im Mittelpunkt. Die Zahl gleichzeitiger Teilnehmender beeinflusst direkt:

- die Last auf dem Backend
- die Zugriffsmuster auf die Datenbank
- die Nutzung von Redis als schnellen Zustands- und Telemetriedienst
- die Zahl gleichzeitiger Verbindungen und Statusaenderungen

Damit verschiebt sich die Analyse von einer rein funktionalen Betrachtung hin zu einer infrastrukturellen und betriebsorientierten Perspektive. Der Lasttest ist somit nicht nur eine Performance-Pruefung, sondern zugleich eine Untersuchung der Skalierbarkeit und Cloud-Eignung des Gesamtsystems.

## Akademische Schlussfolgerung

Die Fragestellung ist als **Cloud-Computing-relevantes Problem** einzuordnen, da sie sich mit der skalierbaren Bereitstellung, der performanten Verarbeitung gleichzeitiger Zugriffe sowie der resilienten Betriebsfaehigkeit einer verteilten Webanwendung befasst.

Ein Lasttest mit 500 Teilnehmenden dient in diesem Zusammenhang als empirisches Mittel, um die praktische Tragfaehigkeit der zugrunde liegenden Infrastruktur- und Architekturentscheidungen zu bewerten.

## Kurzform fuer wissenschaftliche Arbeiten

Die Untersuchung laesst sich dem Bereich **Cloud Computing** zuordnen, da sie die skalierbare Bereitstellung, Ueberwachung und betriebliche Absicherung einer internetbasierten Anwendung unter dynamischer Last analysiert. Im Mittelpunkt stehen dabei Konzepte wie **Elasticity**, **Resource Provisioning**, **vertikale und horizontale Skalierung**, **Dienstentkopplung**, **Observability** und **Resilience**.
