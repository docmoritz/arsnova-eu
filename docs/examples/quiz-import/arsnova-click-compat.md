# arsnova.click Import-Kompatibilitaet

Dieses Dokument haelt das aktuell ermittelte `arsnova.click`-Exportformat fest und beschreibt,
wie `arsnova.eu` es derzeit importiert.

## Referenzen

- Formales Snapshot-Schema: `docs/examples/quiz-import/arsnova-click-export.schema.json`
- Vollstaendiges Beispiel: `docs/examples/quiz-import/arsnova-click-maximal-export.json`
- Aktueller Normalizer: `apps/frontend/src/app/features/quiz/data/quiz-import-normalizer.ts`

## Wichtiger Kontext

- Das `arsnova.click`-Export-JSON ist als Archiv-/Import-Snapshot dokumentiert, nicht als minimales DTO.
- `TYPE` ist das massgebliche Feld fuer Fragetypen.
- Mehrere Felder im Snapshot sind fuer `arsnova.eu` derzeit ohne Laufzeitwirkung und werden nur dokumentiert.
- `arsnova.eu` wird `arsnova.click`-Tags nicht unterstuetzen oder fachlich auswerten. Tags und keywordartige Import-Metadaten duerfen beim Import nicht zu arsnova.eu-Bewertungslogik werden.

## Aktuelles Mapping nach arsnova.eu

| arsnova.click                   | arsnova.eu         | Status     | Bemerkung                                                                       |
| ------------------------------- | ------------------ | ---------- | ------------------------------------------------------------------------------- |
| `SingleChoiceQuestion`          | `SINGLE_CHOICE`    | importiert | direktes Mapping                                                                |
| `YesNoSingleChoiceQuestion`     | `SINGLE_CHOICE`    | importiert | Spezialisierung geht verloren                                                   |
| `TrueFalseSingleChoiceQuestion` | `SINGLE_CHOICE`    | importiert | Spezialisierung geht verloren                                                   |
| `MultipleChoiceQuestion`        | `MULTIPLE_CHOICE`  | importiert | direktes Mapping                                                                |
| `SurveyQuestion`                | `SURVEY`           | importiert | alle Antworten werden als nicht-korrekt normalisiert                            |
| `ABCDSurveyQuestion`            | `SURVEY`           | importiert | Spezialtyp geht verloren                                                        |
| `FreeTextQuestion`              | `SHORT_TEXT`       | importiert | Musterloesungen, Gross-/Kleinschreibung und Trim werden best effort uebernommen |
| `RangedQuestion`                | `NUMERIC_ESTIMATE` | importiert | `rangeMin/rangeMax` als absolutes Toleranzband, `correctValue` als Referenzwert |

## Sicherheitsgrad (Confidence Slider)

In `arsnova.click` ist der Sicherheitsgrad eine **Quiz-weite Session-Option** (`sessionConfig.confidenceSliderEnabled`), nicht ein Feld pro Frage.

Beim Import nach `arsnova.eu` gilt:

1. Ist `confidenceSliderEnabled: true`, wird `confidenceEnabled: true` für alle bewertbaren Fragen gesetzt (`SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `SHORT_TEXT`, `NUMERIC_ESTIMATE`).
2. Umfragen (`SURVEY`), offener Freitext (`FREETEXT`) und andere nicht bewertbare Typen bleiben ohne Sicherheitsgrad.
3. Optionale Labels aus `sessionConfig.confidenceLabelLow` / `confidenceLabelHigh` werden übernommen (Fallback-Feldnamen: `confidenceLowLabel`, `confidenceHighLabel`, `confidenceSliderLabelLow`, `confidenceSliderLabelHigh`).
4. Der Import meldet einen Hinweis: _Der Sicherheitsgrad wurde für bewertbare Fragen übernommen._

Tests: `apps/frontend/src/app/features/quiz/data/quiz-import-normalizer.spec.ts`

## Aktuell uebernommene Session-Felder

| Feld im click-Snapshot                     | Ziel in arsnova.eu     | Bemerkung                      |
| ------------------------------------------ | ---------------------- | ------------------------------ |
| `name`                                     | `quiz.name`            | direkt                         |
| `description`                              | `quiz.description`     | direkt                         |
| `sessionConfig.readingConfirmationEnabled` | `readingPhaseEnabled`  | direkt                         |
| `sessionConfig.confidenceSliderEnabled`    | `confidenceEnabled`    | nur für bewertbare Fragetypen  |
| `sessionConfig.confidenceLabelLow`         | `confidenceLabelLow`   | optional, max. 50 Zeichen      |
| `sessionConfig.confidenceLabelHigh`        | `confidenceLabelHigh`  | optional, max. 50 Zeichen      |
| `sessionConfig.nicks.blockIllegalNicks`    | `allowCustomNicknames` | invertiert                     |
| `sessionConfig.nicks.memberGroups`         | `teamNames`            | bis max. 8 Teams               |
| `sessionConfig.nicks.autoJoinToGroup`      | `teamAssignment`       | `true -> AUTO`, sonst `MANUAL` |

## Dokumentierte, aber aktuell nicht uebernommene Snapshot-Felder

- `origin`
- `state`
- `currentQuestionIndex`
- `currentStartTimestamp`
- `sentQuestionIndex`
- `readingConfirmationRequested`
- `questionCount`
- `sessionConfig.showResponseProgress`
- `sessionConfig.theme`
- `sessionConfig.leaderboardAlgorithm`
- `sessionConfig.music.*`
- `sessionConfig.nicks.maxMembersPerGroup`
- `sessionConfig.nicks.selectedNicks`
- `questionList[].displayAnswerText`
- `questionList[].showOneAnswerPerRow`
- `questionList[].multipleSelectionEnabled`
- `questionList[].tags` (bewusst nicht unterstuetzt, nicht ausgewertet)
- `questionList[].requiredForToken`
- `FreeTextAnswerOption.configUseKeywords` (bewusst nicht als arsnova.eu-Schluesselwortbewertung uebernommen)
- `FreeTextAnswerOption.configUsePunctuation`
- `RangedQuestion`-spezifische Plausibilitätsgrenzen, da `rangeMin/rangeMax` als Toleranzband importiert werden

## Offene Folgearbeiten fuer spaetere Angleichung

1. `FreeTextQuestion.configUseKeywords`, `questionList[].tags` und vergleichbare keywordartige click-Metadaten bleiben bewusst ohne arsnova.eu-Entsprechung; der Import darf sie nur ignorieren bzw. als Best-Effort-Abweichung melden.
2. Klaeren, ob `ABCDSurveyQuestion`, `YesNoSingleChoiceQuestion` und `TrueFalseSingleChoiceQuestion` als eigene UI-Varianten sichtbar bleiben sollen.
3. Festlegen, ob Musik-, Theme- und Nickname-Presets in `arsnova.eu` ueberhaupt eine fachliche Entsprechung bekommen sollen.
