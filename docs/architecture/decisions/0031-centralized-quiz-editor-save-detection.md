<!-- markdownlint-disable MD013 -->

# ADR-0031: Quiz-Editor-Aenderungserkennung zentralisieren

**Status:** Accepted
**Datum:** 2026-06-18
**Entscheider:** Projektteam

**Letzter Repo-Abgleich:** 2026-06-18

## Kontext

Der Quiz-Editor buendelt mehrere speicherbare Bereiche:

- Quiz-Metadaten: Titel, Beschreibung, Motivbild
- Quiz-Einstellungen: Presets, Timer, Teilnahme-/Pseudonym-Modus, Teams, Sound, Bonus-Codes
- Fragen und Fragetyp-Parameter: Fragetext, Fragetyp, Schwierigkeit, Timer, Antwortoptionen,
  Bewertungsparameter, Rating-Skala, Kurzantwort-Einstellungen und numerische Schaetzfragen

Beim Einfuehren des Frageformats `NUMERIC_ESTIMATE` wurde sichtbar, dass nicht jede UI-Aenderung
zuverlaessig den globalen Speichern-Button aktivierte oder ueber den globalen Speicherpfad
uebernommen wurde. Ursache war, dass Teile der UI nicht ausschliesslich ueber Angulars
`FormGroup.dirty` erkannt werden koennen:

- Handler wie Timer- oder Pseudonym-Umschalter setzen Werte direkt per `setValue`.
- Select-/Radio-aehnliche Controls koennen Folgefelder normalisieren.
- Bedingte Felder werden ein- und ausgeblendet, bleiben aber fachlich Teil der gespeicherten
  Quiz-Konfiguration.
- Einzeilige Sonderpfade fuer Metadaten, Settings oder Fragen koennen leicht von der globalen
  Save-Logik abweichen.

Die Gefahr bei kuenftigen Erweiterungen ist, dass neue Optionen zwar sichtbar und technisch
speicherbar sind, aber die zentrale Aktivierung des Speichern-Buttons oder der tatsaechliche
Speicherpfad uebersehen werden.

## Entscheidung

Der Quiz-Editor verwendet fuer speicherpflichtige Aenderungen einen zentralen Speichervertrag:

1. Der globale Speichern-Button wird ausschliesslich ueber `hasPendingChanges()` aktiviert.
2. `hasPendingChanges()` darf sich fuer Metadaten und Quiz-Einstellungen nicht allein auf
   `FormGroup.dirty` verlassen.
3. Metadaten und Quiz-Einstellungen werden vor dem Vergleich in eine kanonische Speicherform
   normalisiert und gegen den aktuellen Quizstand verglichen.
4. Der oeffentliche Speicherpfad fuer den Editor ist `saveAll()`.
5. Abschnittsspezifische Speicherpfade wie `saveMetadata()` oder `saveSettings()` werden nicht
   parallel gepflegt.
6. Fragen werden ebenfalls ueber `saveAll()` gespeichert. Bestehende Entwurfslogik darf intern
   weiter zwischen aktiver Formularfrage und gespeicherten Drafts unterscheiden, aber nicht als
   zweiter oeffentlicher Save-Pfad auftreten.
7. Die Quiz-Preview aus dem Editor heraus darf nicht an `saveAll()` vorbei arbeiten. Wenn lokale
   Editor-Aenderungen offen sind, muss der Preview-Wechsel zuerst ueber `saveAll()` speichern und
   bei Validierungs- oder Speicherfehlern im Editor bleiben.
8. Eine erfolgreiche Speicherung muss eine sichtbare, assistive erfassbare Bestaetigung ausloesen.
   Im Quiz-Editor muss diese Bestaetigung deutlich machen, dass die Aenderungen nun in der
   Vorschau und im Live-Quiz uebernommen sind. Preview-Inline-Edits folgen demselben UX-Vertrag:
   Wenn `QuizPreviewComponent.finishInlineEditMode()` echte Aenderungen persistiert, muss die
   Preview ebenfalls eine entsprechende Snackbar-Bestaetigung anzeigen.
9. Neue speicherbare Felder im Quiz-Editor muessen im selben Change:
   - in die entsprechende Normalisierung/Vergleichslogik aufgenommen werden,
   - von `saveAll()` persistiert werden,
   - vor dem Preview-Wechsel ueber denselben zentralen Save-Pfad im Store landen, falls sie in der
     Editor-Preview sichtbar oder fuer den Preview-Live-Start relevant sind,
   - mit einem fokussierten Test abgesichert werden, der mindestens eine Aenderung ohne
     verlaesslichen `FormGroup.dirty`-Status abdeckt, falls das Feld ueber Handler, Select,
     Toggle oder bedingte UI gesetzt wird.

Explizit ausgenommen sind bewusst sofort wirksame Listenaktionen wie Frage aktivieren/deaktivieren,
Frage loeschen oder Frage verschieben. Solche Aktionen muessen im Code und in Tests weiterhin klar
als Immediate-Commit-Aktionen erkennbar bleiben. Wenn sie kuenftig in den globalen Save-Flow wandern
sollen, ist diese ADR entsprechend zu erweitern.

## Konsequenzen

### Positiv

- Der Speichern-Button spiegelt die tatsaechlich speicherbare Aenderung wider, nicht nur Angulars
  Dirty-Status.
- Metadaten, Quiz-Einstellungen und Fragen nutzen denselben oeffentlichen Speicherpfad.
- Neue Fragetypen und neue Settings haben einen klaren Integrationspunkt.
- Bedingte Controls, Selects, Toggle-Handler und Presets werden robuster gegen versehentlich
  vergessene Dirty-Markierungen.
- Tests koennen gezielt die zentrale Save-Logik pruefen, statt jede UI-Option als separaten
  Sonderpfad zu duplizieren.

### Negativ / Risiken

- Die Normalisierung muss mit dem Store-/Schema-Verhalten synchron bleiben. Wenn Defaults oder
  Persistenzregeln im Store geaendert werden, muss der Quiz-Editor-Vergleich mitgepflegt werden.
- Die zentrale Vergleichslogik kann bei sehr grossen Quiz-Objekten teurer werden. Der aktuelle
  Scope vergleicht nur Metadaten und Settings direkt; Fragen bleiben ueber bestehende Draft- und
  Comparable-Question-Logik begrenzt.
- Entwickler muessen bei neuen Optionen bewusst entscheiden, ob eine Aktion global gespeichert oder
  sofort persistiert wird.

## Alternativen (geprueft)

- **Jeden Handler manuell `markAsDirty()` setzen lassen:** Verworfen, weil neue Selects, Presets
  und bedingte Felder diesen Schritt leicht vergessen koennen.
- **Alle Controls ausschliesslich ueber `formControlName` anbinden:** Verworfen, weil manche
  UI-Elemente fachliche Inversion oder Folgewerte brauchen, z. B. Pseudonym-Modus,
  Timer-Umschalter oder Presets.
- **Separate Save-Buttons pro Bereich beibehalten:** Verworfen, weil dadurch mehrere
  Speicherpfade mit leicht unterschiedlichem Verhalten entstehen.
- **Jede einzelne Dropdown-Option als eigenen Test absichern:** Verworfen als primaere Strategie,
  weil sie viel Duplikation erzeugt. Stattdessen wird die zentrale Erkennung getestet; besonders
  riskante Felder erhalten fokussierte Regressionstests.

## Implementierungsstand

Umgesetzt im Repo:

- `QuizEditComponent.hasPendingChanges()` nutzt zentrale Vergleichslogik fuer Metadaten,
  Einstellungen und Fragen.
- Metadaten werden vor Vergleich und Speichern normalisiert: getrimmter Titel, leere Beschreibung
  und leeres Motivbild als `null`.
- Quiz-Einstellungen werden vor dem Vergleich in eine kanonische Form gebracht, u. a. Timer,
  Team-Namen, Bonus-Codes, Pseudonym-/Anonym-Modus und Defaults.
- `saveAll()` ist der einzige oeffentliche Speicherpfad fuer den Quiz-Editor.
- Redundante Einzelmethoden fuer Metadaten und Settings wurden entfernt.
- Editor-Preview-Aktionen laufen ueber `QuizEditComponent.openPreview()`. Diese Methode ruft
  `saveAll()` auf und navigiert nur bei erfolgreicher Persistenz in die Preview.
- Erfolgreiche zentrale Speicherungen zeigen eine Snackbar: "Gespeichert. Deine Aenderungen sind
  jetzt in der Vorschau und im Live-Quiz uebernommen."
- Erfolgreiche Preview-Inline-Edits zeigen dieselbe inhaltliche Snackbar-Bestaetigung, nachdem die
  Aenderung im Store gelandet ist.
- Lokale Nutzeränderungen am Demoquiz markieren den Demo-Datensatz als veraendert. `ensureDemoQuiz()`
  darf einen so markierten Demo-Datensatz nicht durch den Seed ersetzen; sonst koennen gespeicherte
  Editor-Aenderungen beim Preview-Wechsel, Live-Start oder Rueckkehr in die Sammlung verschwinden.
- Regressionstests decken Aenderungen ohne Angular-Dirty-Status ab, u. a. Pseudonym-/Anonym-Modus,
  Timer-Handler, Metadaten, die Speicherbestaetigung, den Preview-Wechsel nach aktivem Typwechsel
  Preview-Inline-Speicherbestaetigung und Demoquiz-Reseed-Schutz.
