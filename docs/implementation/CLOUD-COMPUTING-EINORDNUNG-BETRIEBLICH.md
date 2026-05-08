# Cloud-Computing-Einordnung (betriebliche Fassung)

## Zweck

Dieses Dokument ordnet die Fragestellung zur Einsatzfaehigkeit von **arsnova.eu** fuer Konferenzszenarien mit hoher gleichzeitiger Nutzerzahl in das Themenfeld **Cloud Computing** ein.

Die Einordnung ist bewusst sachlich-betrieblich formuliert und eignet sich fuer interne Dokumentation, Architekturentscheidungen, Betriebsunterlagen und technische Abstimmungen.

## Einordnung

Die Frage, ob **arsnova.eu** mit der aktuell betriebenen Infrastruktur fuer eine Veranstaltung mit **500 gleichzeitigen Teilnehmenden** geeignet ist, gehoert fachlich in den Bereich **Cloud Computing**.

Im Kern geht es nicht nur um eine einzelne Performance-Frage, sondern um die Bereitstellung, Skalierung, Beobachtung und betriebliche Absicherung einer internetbasierten Anwendung unter wechselnder Last.

## Bezug zu Cloud Computing

Die Fragestellung beruehrt mehrere zentrale Themen des Cloud Computing:

- **Elasticity**
  Die Infrastruktur muss Lastspitzen aufnehmen koennen oder gezielt darauf vorbereitet werden.

- **Resource Provisioning**
  Es ist zu bewerten, ob CPU, RAM, Speicher, Netzwerk und Verbindungen in ausreichendem Umfang bereitgestellt sind.

- **Vertical Scaling**
  Eine moegliche Reaktion besteht in der Vergroesserung eines einzelnen Hosts.

- **Horizontal Scaling**
  Alternativ kann die Anwendung ueber mehrere Instanzen verteilt werden.

- **Service Separation**
  Die Trennung von App, Datenbank und Redis auf getrennte Ressourcen ist ein typisches Cloud-Architekturprinzip.

- **Observability**
  Monitoring, Alerting, Metriken und Lasttests sind zentrale Bestandteile eines professionellen Cloud-Betriebs.

- **Resilience**
  Die Frage nach Ausfallsicherheit, Lastverteilung und Betriebsstabilitaet ist unmittelbar mit Cloud-Computing-Prinzipien verbunden.

## Relevanz fuer arsnova.eu

Fuer **arsnova.eu** bedeutet dies konkret:

- Die Anwendung laeuft als webbasiertes System mit Live-Kommunikation und ist damit stark lastabhaengig.
- Die Anzahl gleichzeitiger Teilnehmender wirkt sich direkt auf Backend, Datenbank, Redis und Netzwerk aus.
- Die Eignung fuer Grossveranstaltungen haengt nicht nur vom Anwendungscode, sondern ebenso von der Infrastrukturarchitektur ab.
- Ein Lasttest mit 500 Teilnehmenden ist damit auch ein Test der Cloud-Faehigkeit des Gesamtsystems.

## Betriebliche Schlussfolgerung

Die Anfrage nach einem Einsatz von **arsnova.eu** fuer 500 gleichzeitige Teilnehmende ist daher nicht nur als Produkt- oder Performance-Frage zu behandeln, sondern als klassische **Cloud-Computing- und Betriebsfrage**.

Zu bewerten sind insbesondere:

- die Skalierbarkeit der Infrastruktur
- die Lastverteilung im Gesamtsystem
- die Entkopplung zentraler Dienste
- die Messbarkeit des Systemverhaltens unter Last
- die betriebliche Absicherung eines Live-Einsatzes

## Kurzform fuer interne Verwendung

Die Fragestellung ist dem Bereich **Cloud Computing** zuzuordnen, weil sie die bedarfsgerechte Bereitstellung, Skalierung, Ueberwachung und Absicherung von Ressourcen fuer eine webbasierte Live-Anwendung unter Last untersucht.
