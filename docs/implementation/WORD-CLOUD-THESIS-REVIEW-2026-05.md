<!-- markdownlint-disable MD013 -->

# Review einer aelteren frag.jetzt-Arbeit zu Wortwolken und spaCy

**Status:** interne Einordnung, Mai 2026  
**Quelle:** Bachelorarbeit "KI-basierte Stichwort-Extraktion aus Online-Texten und Visualisierung als interaktive Stichwortwolke" (frag.jetzt, 2022)  
**Ziel:** ableiten, welche Erkenntnisse davon fuer `arsnova.eu` heute noch tragfaehig sind

---

## Kurzurteil

Die Arbeit ist als **Problem- und Erfahrungsanalyse** weiterhin wertvoll, aber **nicht** als direkte Architekturvorlage fuer den heutigen Produktstand.

Der groesste bleibende Nutzen liegt in vier Einsichten:

1. Wortwolken fuer Q&A und Freitext funktionieren am besten als **Inhaltsradar mit Rueckbezug auf konkrete Fragen/Antworten**.
2. **Nomen, Eigennamen und sprachliche Glattung** sind ein sinnvoller Verdichtungskern, aber nur mit Vorsicht bei Namen, Komposita und Mehrwortbegriffen.
3. **Determinismus, Lesbarkeit und Wiederauffindbarkeit** sind wichtiger als eine dekorative, zufaellige Wolkenoptik.
4. Themen sollten bei dynamischen Filtern und Sortierungen **nicht als starre Datenbank-Entitaeten** persistiert werden, sondern aus dem aktuellen Snapshot berechnet werden.

---

## Was fuer arsnova.eu heute noch klar brauchbar ist

### 1. Wortwolke als Navigationswerkzeug

Die Arbeit beschreibt die Wolke nicht als Deko, sondern als "Inhaltsradar". Das bleibt fuer `arsnova.eu` richtig:

- Freitext: schnelle Verdichtung vieler kurzer Rueckmeldungen
- Q&A: Einstieg in sichtbare Fragefelder statt nur Listenlesen
- Host-Nutzen: Themen sehen, Quellen pruefen, gezielt moderieren

Das passt zum heutigen Produktpfad mit `members`, `variants`, Tooltips, Quellenbezug und Sortiermodi.

### 2. Vorverarbeitung ist ein echter Qualitaetshebel

Die Arbeit zeigt plausibel, dass unbereinigte Inhalte wie URLs, Emojis, Code, Formatierungsreste und sonstiges Rauschen die Wolke schnell verschlechtern.

Das bleibt produktiv relevant:

- technische Begriffe muessen geschuetzt werden
- offensichtliches Rauschen muss vor der Aggregation raus
- die eigentliche Visualisierung sollte nie Rohtexte selbst analysieren

### 3. Namen und Komposita brauchen Sonderbehandlung

Der staerkste linguistische Teil der Arbeit ist nicht "alles lemmatisieren", sondern die Vorsicht:

- Namen nicht blind lemmatisieren
- Namen moeglichst als Verbund erhalten
- Komposita nicht naiv zerlegen
- Mehrwort-Nomen nur begrenzt expandieren, sonst explodiert die Kandidatenmenge

Diese Warnung ist fuer Deutsch weiterhin zentral.

### 4. Determinismus schlaegt Zufallswolke

Die Arbeit priorisiert Wiederauffindbarkeit, A11y und vorhersehbare Relayouts ueber eine "wolkigere" Zufallsoptik. Das ist fuer `arsnova.eu` weiterhin die richtige UX-Leitplanke.

Konsequenz:

- gleiche Daten sollten moeglichst aehnlich aussehen
- Relayouts duerfen nicht wie ein visuelles Durchmischen wirken
- Host und Presenter brauchen Stabilitaet, nicht Show-Effekte

### 5. Themen nicht als feste DB-Objekte speichern

Die Arbeit argumentiert richtig gegen das Persistieren bereits aggregierter Themen, wenn Filter, Gewichtungen und Modi zur Laufzeit variieren.

Das gilt fuer `arsnova.eu` heute noch:

- Frage-/Antwortsnapshots aendern sich laufend
- Sortiermodi aendern die Wichtigkeit
- Analysemodi aendern die Gruppierung
- persistierte Themenobjekte wuerden schnell veralten oder Permutationsmuell erzeugen

---

## Was bereits durch den heutigen Produktstand besser geloest ist

Der aktuelle `Word Cloud 2.5`-Stand geht in mehreren Punkten ueber die Arbeit hinaus:

- Document-Frequency statt roher Worthaeufigkeit
- Titel-/Tag-Gewichtung bei Q&A-Dokumenten
- Unigramme, Bigramme und Trigramme statt nur einzelner Nomen
- geschuetzte technische Begriffe wie `C++`, `C#`, `npm install`, `docker compose`, `HTTP 404`
- locale-spezifische Stopwortlisten und Forum-Stopwoerter
- regelbasierte Wortfamilien-Gruppierung
- explainable Rueckbezuege ueber `members`, `variants`, `basisLabel`, `confidence`
- d3-cloud als bewaehrte Layout-Engine statt Eigenlayout

Damit ist ein Grossteil des praktischen Nutzens der damaligen spaCy-Idee bereits **ohne spaCy im Livepfad** erreicht.

---

## Was man aus der Arbeit heute nur noch eingeschraenkt uebernehmen sollte

### MAYBE: spaCy als spaetere Host-Analyse

spaCy bleibt als spaetere Option interessant, aber nur in enger Form:

- nicht im Participant-Livepfad
- nicht bei jeder neuen Eingabe
- nur host-ausgeloest
- nur als optionale sprachliche Glattung
- bevorzugt fuer `NOUN + PROPN + protected technical terms`

Fachlich waere das keine semantische Begriffswolke, sondern eine kontrollierte Vorverarbeitung innerhalb der bestehenden Pipeline.

### MAYBE: statistische Kontexteinordnung

Die Arbeit nutzt Listen, Blacklists und Kontextvokabular. Als Lightweight-Idee bleibt davon interessant:

- produktnahe Blacklists
- kanal- oder kursbezogene Zusatz-Stopwoerter
- spaetere adaptive Abwertung sehr kontexttypischer, aber inhaltsarmer Begriffe

Nicht sinnvoll ist dagegen ein schwerer Suchmaschinen- oder Wissensgraph-Stack nur fuer diese Aufgabe.

### MAYBE: Themenverlauf als eigener Modus

Die Arbeit nennt einen Verlauf von Themen ueber die Zeit. Das ist fuer spaeter interessant:

- nicht als Ersatz der aktuellen Wolke
- eher als eigener Analysemodus fuer Hosts
- nur mit sauberem Session- und Zeitfensterbezug

---

## Was fuer arsnova.eu heute eher No-Go ist

### NO-GO: DeepL und LanguageTool vor der Extraktion

Das ist fuer den heutigen Produktkontext zu schwer:

- zusaetzliche Latenz
- externe Abhaengigkeiten
- Datenschutz-/Betriebsaufwand
- geringe Verhaeltnisverbesserung gegenueber lokalem Cleaning

### NO-GO: Elasticsearch plus Wikipedia/Wikidata als Kern des Analysepfads

Die Arbeit ging stark in Richtung Kontextklassifikation ueber Zusatzinfrastruktur. Fuer `arsnova.eu` ist das heute kein guter Trade-off:

- zu viel Betriebsgewicht
- zu viel Modellierungsaufwand
- zu wenig Zusatznutzen gegenueber gezielten Heuristiken

### NO-GO: reine Nomenwolke als Standardmodus

Die Arbeit zeigt, warum Nomen stark sind. Der heutige Produktstand zeigt aber auch, warum das als Default nicht reicht:

- wichtige Mehrwortbegriffe gehen verloren
- technische Phrasen leiden
- Q&A-Fragen profitieren stark von Phrasenbildung

Darum ist "nur Nomen" hoechstens spaeter ein Analysemodus, nicht der Standard.

### NO-GO: eigene Layout-Engine statt d3-cloud

Die Arbeit dokumentiert selbst den Trade-off: eigene deterministische Layouts koennen UX-seitig sinnvoll sein, skalieren aber schlechter als etablierte Bibliotheken.

Fuer `arsnova.eu` ist die richtige Entscheidung bereits gefallen:

- fachliche Analyse selbst kontrollieren
- Layout nicht neu erfinden

---

## Go / Maybe / No-Go

| Bewertung | Thema                                                | Einordnung fuer arsnova.eu                |
| --------- | ---------------------------------------------------- | ----------------------------------------- |
| **GO**    | Inhaltsradar mit Quellenbezug                        | bleibt Kernnutzen der Wortwolke           |
| **GO**    | starke Vorreinigung und Rauschfilter                 | hoher Effekt, geringe Komplexitaet        |
| **GO**    | Vorsicht bei Namen und Komposita                     | weiter gueltig, besonders fuer Deutsch    |
| **GO**    | deterministische, stabile Relayouts                  | klare UX- und A11y-Leitplanke             |
| **GO**    | Snapshot-basierte statt persistierter Themenbildung  | passt zu dynamischen Modi und Filtern     |
| **MAYBE** | spaCy als host-ausgeloeste Glattung                  | nur optional, nicht im Livepfad           |
| **MAYBE** | statistische Kontexteinordnung / adaptive Blacklists | leichtgewichtig denkbar                   |
| **MAYBE** | Verlauf von Themen ueber die Zeit                    | sinnvoll als spaeterer Host-Modus         |
| **NO-GO** | DeepL/LanguageTool im Standardpfad                   | zu schwer fuer den Nutzen                 |
| **NO-GO** | Elasticsearch/Wikidata als Pflichtarchitektur        | zu komplex fuer den Kernwert              |
| **NO-GO** | reine Nomenwolke als Produktstandard                 | zu eng, verliert Phrasen und Fachbegriffe |
| **NO-GO** | komplette Eigen-Layout-Engine                        | kein guter Trade-off gegen `d3-cloud`     |

---

## Empfohlene Produktlinie

Die Arbeit bestaetigt rueckblickend den heutigen Kurs:

- `Word Cloud 2.x` bleibt **lexikalisch, explainable und leichtgewichtig**
- spaetere NLP-Schritte muessen **optional, host-ausgeloest und fallback-faehig** sein
- echte Semantik bleibt ein **eigener 3.x-Pfad**, nicht das versteckte Versprechen von Lemmatisierung

Die beste Lehre aus der Arbeit ist daher nicht "spaCy ueberall einsetzen", sondern:

> Erst die robuste lexikalische Verdichtung sauber bauen, dann spaetere NLP-Schritte nur dort einsetzen, wo sie den Produktnutzen klar und messbar erhoehen.
