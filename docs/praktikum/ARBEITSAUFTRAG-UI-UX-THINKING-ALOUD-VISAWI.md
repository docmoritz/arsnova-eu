<!-- markdownlint-disable MD013 MD022 MD032 -->

# Arbeitsauftrag: Remote-UI/UX-Test mit Thinking Aloud und VisAWI für arsnova.eu

## 1. Titel

**Remote-UI/UX-Test der Web-App arsnova.eu mit Thinking Aloud und anschließender VisAWI-Befragung**

## 2. Ziel des UI/UX-Tests

Vor der offiziellen Markteinführung von **arsnova.eu** soll die Web-App in einem kleinen explorativen UI/UX-Test geprüft werden. Ziel ist es, frühzeitig konkrete Hinweise auf Probleme und Stärken der Benutzeroberfläche zu gewinnen.

Im Mittelpunkt stehen:

- Usability-Probleme bei zentralen Nutzungsschritten,
- Verständnisprobleme bei Navigation, Begriffen, Rückmeldungen und Rollenlogik,
- Frustrationsmomente, Unsicherheiten und Umwege,
- positive Nutzungserlebnisse und gut funktionierende UI-Elemente,
- visuelle Wirkung der Oberfläche aus Sicht der Testpersonen.

Der Test ist bewusst als **explorativer Pilot-Test** angelegt. Pro Rolle wird eine passende Testperson rekrutiert. Die Ergebnisse liefern qualitative Hinweise für Verbesserungen, ersetzen aber keine statistisch belastbare Vollstudie.

## 3. Testdesign und Begründung der Methodenwahl

Der Test kombiniert zwei Methoden:

1. **Thinking Aloud** während realistischer Nutzungsszenarien
2. **VisAWI-Befragung** nach der Nutzung

Beim simultanen Thinking Aloud sprechen Testpersonen während der Nutzung laut aus, was sie denken, erwarten, suchen, verstehen, nicht verstehen oder als störend empfinden. Dadurch werden Denkprozesse sichtbar, die durch reine Beobachtung oft verborgen bleiben.

Die VisAWI-Befragung ergänzt den qualitativen Test um eine standardisierte Bewertung der wahrgenommenen visuellen Ästhetik. VisAWI misst nicht die gesamte Usability und nicht die fachliche Nützlichkeit der App, sondern vor allem den visuellen Eindruck der Oberfläche, unter anderem Einfachheit, Vielfalt, Farbigkeit und handwerkliche Ausführung.

Die Kombination ist für diesen Auftrag geeignet, weil:

- Thinking Aloud erklärt, **warum** Testpersonen an bestimmten Stellen irritiert sind.
- VisAWI erfasst strukturiert, **wie** die visuelle Gestaltung wahrgenommen wird.
- Qualitative Beobachtungen und standardisierte Befragung zusammen eine bessere Grundlage für konkrete UI/UX-Verbesserungen liefern.

## 4. Remote-Durchführung per Teams oder Zoom

Die Probandensitzungen werden vollständig remote durchgeführt, entweder mit **Microsoft Teams** oder **Zoom**.

Vorgaben für das Remote-Setup:

- Die Testperson nutzt nach Möglichkeit ihr eigenes Gerät und einen aktuellen Browser.
- Die Testperson teilt während der Aufgabenbearbeitung ihren Bildschirm.
- Die Testleitung zeichnet die Sitzung **ausschließlich als Audio** auf.
- Videoaufzeichnung ist nicht Bestandteil dieses Auftrags.
- Die Testleitung prüft vor Beginn, ob Audio, Bildschirmfreigabe und Zugriff auf arsnova.eu funktionieren.
- Störungen, technische Probleme oder Abbrüche werden im Protokoll notiert.

## 5. Rollen und Rekrutierung der Testpersonen

Es sollen zwei Testpersonen rekrutiert werden:

| Rolle             | Testperson | Ziel der Rekrutierung                                                                   |
| ----------------- | ---------- | --------------------------------------------------------------------------------------- |
| Quizmaster        | 1 Person   | Person, die eine Lehr-, Moderations- oder Veranstaltungsrolle plausibel übernehmen kann |
| Quizteilnehmer/in | 1 Person   | Person, die an einem Quiz oder einer Live-Abstimmung teilnehmen kann                    |

Anforderungen an beide Testpersonen:

- Die Person soll nicht direkt an der Entwicklung der getesteten UI beteiligt sein.
- Die Person soll bereit sein, während der Nutzung laut zu denken.
- Die Person soll der Audioaufzeichnung und der KI-gestützten Transkription ausdrücklich zustimmen.
- Die Person soll ausreichend Zeit für Session, Nachbefragung und VisAWI-Fragebogen haben.

Die geringe Anzahl von zwei Testpersonen ist für diesen Auftrag akzeptiert, weil es sich um einen Pilot-Test handelt. Die Ergebnisse sind als qualitative Hinweise zu interpretieren.

## 6. Vorbereitung durch das Team

Vor den Sitzungen bereitet das Team folgende Materialien und Rahmenbedingungen vor:

- Testlink oder lauffähige Zielumgebung von arsnova.eu
- Teams- oder Zoom-Termin mit funktionierender Audioaufnahme
- kurze Begrüßungs- und Einwilligungsvorlage
- rollenbezogene Aufgaben für Quizmaster und Quizteilnehmer/in
- Protokollvorlage für Beobachtungen
- Link zum VisAWI-Online-Fragebogen
- Speicherort für Audiodatei, Transkript und Auswertung
- klares Dateinamensschema

Empfohlenes Dateinamensschema:

```text
YYYY-MM-DD_rolle_testperson-audio.mp3
YYYY-MM-DD_rolle_transkript.md
YYYY-MM-DD_rolle_ui-ux-issues-moscow.md
```

Beispiel:

```text
2026-06-18_quizmaster_transkript.md
2026-06-18_quizmaster_ui-ux-issues-moscow.md
```

## 7. Einwilligung, Datenschutz und Audioaufzeichnung

Vor Beginn der eigentlichen Testsitzung muss die Testleitung die Einwilligung der Testperson einholen.

Die Testperson ist verständlich darüber zu informieren:

- dass die Sitzung remote per Teams oder Zoom stattfindet,
- dass nur Audio aufgezeichnet wird,
- dass keine Videoaufzeichnung vorgesehen ist,
- dass die Audiodatei an ein aktuelles LLM bzw. KI-Transkriptionssystem übergeben wird,
- dass aus der Audiodatei ein lesbares Transkript erstellt wird,
- dass aus dem Transkript UI/UX-Issues abgeleitet werden,
- dass Transkript und Issue-Liste an den Kursleiter gesendet werden,
- dass personenbezogene Angaben soweit möglich vermieden oder anonymisiert werden sollen.

Die Testperson muss vor der Aufzeichnung ausdrücklich zustimmen. Ohne Zustimmung darf keine Aufzeichnung erfolgen.

Vorschlag für die Einwilligungsfrage:

> Sind Sie damit einverstanden, dass diese Testsitzung ausschließlich als Audio aufgezeichnet wird und dass die Audiodatei anschließend zur Transkription und UI/UX-Auswertung an ein aktuelles KI-Transkriptionssystem bzw. LLM übergeben wird?

Die Zustimmung wird zu Beginn der Audioaufnahme noch einmal mündlich bestätigt.

## 8. Ablauf der Testsitzung

Eine Sitzung dauert in der Regel 30 bis 60 Minuten.

Empfohlener Ablauf:

1. Begrüßung und kurzer Zweck der Sitzung
2. Hinweis: Getestet wird die Web-App, nicht die Testperson
3. Einwilligung zur Audioaufzeichnung und KI-gestützten Verarbeitung
4. kurzer Technikcheck: Audio, Bildschirmfreigabe, Browser, Link
5. Warm-up zum lauten Denken mit einer einfachen Beispielaufgabe
6. Durchführung der rollenbezogenen Aufgaben
7. neutrale Beobachtung und Protokollierung durch das Team
8. Abschlussfrage: "Gab es etwas, das besonders verwirrend, störend oder positiv war?"
9. Ausfüllen des VisAWI-Online-Fragebogens
10. Dank und Hinweis auf die weitere Auswertung

Während der Aufgabenbearbeitung greift die Testleitung nicht aktiv ein. Sie erklärt keine Funktionen, führt die Testperson nicht zur richtigen Lösung und bewertet keine Aussagen.

Erlaubte neutrale Erinnerungen:

- "Bitte denken Sie weiter laut."
- "Was geht Ihnen gerade durch den Kopf?"
- "Bitte sagen Sie einfach, was Sie erwarten, suchen oder vermuten."

Nicht geeignet sind leitende Fragen wie:

- "War dieser Button verwirrend?"
- "Haben Sie gesehen, dass Sie oben rechts klicken müssen?"
- "Finden Sie diese Ansicht nicht zu unübersichtlich?"

## 9. Aufgaben für Quizmaster

Die Aufgaben sollen als realistische Szenarien formuliert werden. Sie dürfen keine UI-spezifischen Lösungshinweise enthalten.

### Szenario

Sie möchten in einer Lehrveranstaltung ein kurzes Live-Quiz mit Ihren Studierenden durchführen. Bereiten Sie die Sitzung so vor, dass Teilnehmende dem Quiz beitreten und eine Frage beantworten können.

### Aufgaben

1. Verschaffen Sie sich einen ersten Eindruck von der Web-App und finden Sie heraus, wie Sie eine neue Quiz- oder Abstimmungssitzung starten können.
2. Legen Sie eine einfache Frage an, die sich für eine Live-Situation in einer Lehrveranstaltung eignet.
3. Bereiten Sie die Sitzung so vor, dass Teilnehmende beitreten können.
4. Prüfen Sie, welche Informationen Sie den Teilnehmenden geben würden, damit sie teilnehmen können.
5. Starten Sie die Interaktion so, wie Sie es in einer echten Veranstaltung tun würden.
6. Beobachten Sie, ob und wie Ergebnisse oder Rückmeldungen für Sie sichtbar werden.
7. Beenden oder verlassen Sie die Sitzung so, wie es Ihnen nach Abschluss des Quiz sinnvoll erscheint.

### Beobachtungsschwerpunkte

- Versteht die Person den Einstieg in die Quizmaster-Rolle?
- Sind Begriffe, Statusanzeigen und nächste Schritte klar?
- Wird deutlich, wie Teilnehmende eingeladen werden?
- Wirkt die Steuerung der Session sicher und nachvollziehbar?
- Gibt es Unsicherheiten beim Starten, Anzeigen oder Beenden?

## 10. Aufgaben für Quizteilnehmer/in

Auch für die teilnehmende Rolle werden realistische Szenarien verwendet. Die Testperson soll die App aus Sicht einer Person erleben, die an einer Veranstaltung teilnimmt.

### Szenario

Sie nehmen an einer Lehrveranstaltung teil. Die Lehrperson möchte ein Live-Quiz mit arsnova.eu durchführen. Sie erhalten die notwendigen Zugangsinformationen und sollen am Quiz teilnehmen.

### Aufgaben

1. Öffnen Sie die Web-App und finden Sie heraus, wie Sie einer laufenden Sitzung beitreten können.
2. Treten Sie der Sitzung mit den bereitgestellten Zugangsinformationen bei.
3. Orientieren Sie sich in der Ansicht und sagen Sie laut, was Sie als nächsten Schritt erwarten.
4. Beantworten Sie die bereitgestellte Frage so, wie Sie es in einer echten Lehrveranstaltung tun würden.
5. Prüfen Sie, ob Sie eine Rückmeldung zu Ihrer Eingabe erkennen können.
6. Beobachten Sie, ob für Sie klar ist, ob Ihre Antwort gespeichert, gesendet oder abgeschlossen ist.
7. Verlassen Sie die Sitzung so, wie es Ihnen nach Abschluss der Teilnahme sinnvoll erscheint.

### Beobachtungsschwerpunkte

- Findet die Person den Einstieg in die Teilnahme?
- Ist der Beitritt mit Code oder Link verständlich?
- Sind Frage, Antwortmöglichkeiten und Absenden klar erkennbar?
- Gibt es ausreichend Rückmeldung nach der Antwort?
- Fühlt sich die visuelle Gestaltung übersichtlich, glaubwürdig und professionell an?

## 11. Durchführung der VisAWI-Befragung

Nach Abschluss der Aufgaben füllt die Testperson den VisAWI-Online-Fragebogen aus.

Link zum Fragebogen:

<https://esurvey.uid.com/survey/#468e011e-6cc4-4ff4-8e1a-69895523e19e>

Hinweise für die Testleitung:

- Die Befragung erfolgt direkt nach der Nutzung, damit der visuelle Eindruck noch frisch ist.
- Die Testperson soll den Fragebogen eigenständig ausfüllen.
- Die Testleitung erklärt keine einzelnen Items, außer technische Hilfe ist notwendig.
- Falls die Testperson Anmerkungen zum Fragebogen oder zur visuellen Wirkung macht, werden diese im Protokoll notiert.

VisAWI dient in diesem Auftrag zur Bewertung der wahrgenommenen visuellen Ästhetik. Die Ergebnisse sollen deshalb nicht isoliert als Gesamturteil über die App verstanden werden, sondern zusammen mit den Thinking-Aloud-Beobachtungen interpretiert werden.

## 12. KI-gestützte Transkription

Nach der Sitzung wird die Audiodatei einem aktuellen LLM bzw. KI-Transkriptionssystem übergeben.

Ziel ist eine gut lesbare Transkriptionsdatei im Markdown-Format.

Anforderungen an das Transkript:

- klare Sprecherkennzeichnung, z. B. `Testleitung:` und `Testperson:`
- lesbare Satzstruktur statt roher Wort-für-Wort-Ausgabe
- keine inhaltliche Verfälschung der Aussagen
- Kennzeichnung unklarer Stellen, z. B. `[unverständlich]`
- Entfernung oder Anonymisierung personenbezogener Angaben, soweit sie für die UI/UX-Auswertung nicht notwendig sind
- kurze Metadaten am Anfang des Dokuments

Empfohlener Aufbau der Transkriptionsdatei:

```markdown
# Transkript: UI/UX-Test arsnova.eu - [Rolle]

- Datum:
- Rolle:
- Tool: Teams/Zoom
- Aufzeichnung: Audio
- Transkriptionssystem:
- Testleitung:
- Testperson: anonymisiert

## Transkript

**Testleitung:** ...

**Testperson:** ...
```

## 13. Auswertung der UI/UX-Issues nach MoSCoW

Aus der Transkription wird eine Markdown-Liste der identifizierten UI/UX-Issues erstellt. Die Issues werden nach der MoSCoW-Methode priorisiert.

Priorisierung:

| Kategorie           | Bedeutung für diesen Auftrag                                                            |
| ------------------- | --------------------------------------------------------------------------------------- |
| Must have           | Kritisches Problem, das zentrale Nutzungsschritte blockiert oder stark gefährdet        |
| Should have         | Wichtiges Problem, das die Nutzung merklich erschwert, aber nicht vollständig blockiert |
| Could have          | Verbesserungswünsche oder kleinere Irritationen mit begrenzter Auswirkung               |
| Won't have / später | Beobachtung wird dokumentiert, aber nicht für die nächste Umsetzung priorisiert         |

Jedes Issue soll mindestens enthalten:

- eindeutige Kurzbeschreibung
- betroffene Rolle: Quizmaster oder Quizteilnehmer/in
- beobachtete Situation oder Zitat aus dem Transkript
- vermutete Ursache
- Auswirkung auf UI/UX
- MoSCoW-Priorität
- konkreter Verbesserungsvorschlag

Empfohlene Struktur der Issue-Datei:

```markdown
# UI/UX-Issues aus Thinking-Aloud-Test - arsnova.eu

## Must have

- **[Kurzname des Problems]**
  - Rolle:
  - Beobachtung/Zitat:
  - Ursache:
  - Auswirkung:
  - Verbesserungsvorschlag:

## Should have

## Could have

## Won't have / später
```

## 14. Ergebnisdateien und E-Mail-Versand an den Kursleiter

Pro getesteter Rolle sollen mindestens zwei Markdown-Dateien entstehen:

1. **Transkriptionsdatei**
   - Format: Markdown
   - Inhalt: lesbares Transkript der Audioaufnahme
   - Beispielname: `2026-06-18_quizmaster_transkript.md`

2. **UI/UX-Issue-Liste**
   - Format: Markdown
   - Inhalt: priorisierte Liste der UI/UX-Issues nach MoSCoW
   - Beispielname: `2026-06-18_quizmaster_ui-ux-issues-moscow.md`

Wenn beide Rollen getrennt ausgewertet werden, entstehen entsprechend vier Dateien:

- Transkript Quizmaster
- UI/UX-Issues Quizmaster
- Transkript Quizteilnehmer/in
- UI/UX-Issues Quizteilnehmer/in

Die Dateien werden per E-Mail an den Kursleiter gesendet.

Vorgeschlagener E-Mail-Betreff:

```text
UI/UX-Test arsnova.eu - Thinking Aloud und VisAWI - Abgabe [Team/Name]
```

Vorgeschlagener E-Mail-Text:

```text
Sehr geehrter Herr [Name],

anbei senden wir die Ergebnisse unseres remote durchgeführten UI/UX-Tests zu arsnova.eu.

Enthalten sind:
- Transkript(e) der Thinking-Aloud-Sitzung(en) als Markdown
- priorisierte UI/UX-Issue-Liste(n) nach MoSCoW als Markdown

Die Sitzungen wurden remote per Teams oder Zoom durchgeführt, ausschließlich als Audio aufgezeichnet und anschließend KI-gestützt transkribiert.

Mit freundlichen Grüßen
[Team/Name]
```

## 15. Deadline und konkrete Deliverables für das Team

Alle Ergebnisse müssen spätestens am **24. Juni 2026** beim Kursleiter eingegangen sein.

### Deliverables

- [ ] Eine Testperson für die Rolle **Quizmaster** rekrutieren
- [ ] Eine Testperson für die Rolle **Quizteilnehmer/in** rekrutieren
- [ ] Remote-Sitzung per Teams oder Zoom vorbereiten
- [ ] Einwilligung zur Audioaufzeichnung und KI-gestützten Transkription einholen
- [ ] Thinking-Aloud-Session für Quizmaster durchführen
- [ ] Thinking-Aloud-Session für Quizteilnehmer/in durchführen
- [ ] Audioaufnahmen sichern
- [ ] VisAWI-Fragebogen nach jeder Sitzung ausfüllen lassen
- [ ] Audiodateien mit einem aktuellen LLM bzw. Transkriptionssystem transkribieren
- [ ] Transkripte als Markdown-Dateien erstellen
- [ ] UI/UX-Issues aus den Transkripten ableiten
- [ ] UI/UX-Issues nach MoSCoW priorisieren
- [ ] Markdown-Dateien prüfen und anonymisieren
- [ ] Transkriptionsdateien und UI/UX-Issue-Listen per E-Mail an den Kursleiter senden

### Mindestqualität der Abgabe

Die Abgabe ist nur dann vollständig, wenn:

- beide Rollen der App berücksichtigt wurden,
- die Testpersonen der Aufzeichnung und KI-gestützten Verarbeitung zugestimmt haben,
- die Transkripte lesbar und nachvollziehbar sind,
- die UI/UX-Issues konkrete Beobachtungen aus den Sitzungen referenzieren,
- jedes Issue eine MoSCoW-Priorität hat,
- die Dateien im Markdown-Format vorliegen,
- die Abgabe fristgerecht bis zum 24. Juni 2026 erfolgt.

## Quellenbasis

Dieser Arbeitsauftrag basiert auf den bereitgestellten Unterlagen:

1. **Einführung in UX-Testmethoden: Fokus auf Thinking Aloud**
2. **UI/UX-Normen und Online-Fragebögen: SUS, AttrakDiff, VisAWI und UEQ im Überblick**

Die methodischen Kernpunkte daraus sind: realistische Aufgaben statt UI-Anweisungen, neutraler Moderationsstil, Warm-up zum lauten Denken, sorgfältige Protokollierung, anschließende Auswertung beobachteter Probleme sowie die Kombination qualitativer Usability-Beobachtung mit einem standardisierten Fragebogen zur visuellen Ästhetik.
