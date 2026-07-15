# QA-Bericht zum aktuellen Projektstand

**Stand:** 2026-07-13  
**Branch:** `feat/story-1-2i-confidence`  
**Kontext:** Aktive PR „feat(quiz): Story 1.2i Sicherheitsgrad mit Host-Auswertung"  
**Ziel:** Qualitätsbewertung des aktuellen Umsetzungsstands mit Fokus auf Laufzeit-, Last- und Integrationsnachweise.

## 1. Management Summary

- **Gesamtbewertung:** 🟡 **Bedingt freigabefähig**.
- **Fachliche Story-Reife:** Story **1.2i (Sicherheitsgrad/Confidence)** ist gemäß Backlog auf **✅ Fertig** gesetzt.
- **Aktuelle Laufzeitnachweise (lokal, 2026-07-13):** 14 Szenario-Reports vorhanden, davon 13 direkt grün und 1 initial rot mit anschließendem grünem Retry.
- **Hauptbeobachtung:** Das harte Fairness-p95-Gate (600 Teilnehmende) war im ersten Lauf knapp verletzt, im unmittelbaren Retry jedoch klar innerhalb des Grenzwerts.
- **Performance/Web-Qualität:** Lighthouse-Rerun erfolgreich; Scores auf `/de/` und `/en/` im Bereich ~0.79–0.81 (Accessibility jeweils 1.00).

## 2. Scope und Änderungsfläche

Basis: Diff `main...HEAD` (aktueller Branchstand).

- **Geänderte Dateien gesamt:** 64
- **Davon nach Bereich:**
  - Backend: 8
  - Frontend: 29
  - Shared Types: 5
  - Prisma: 3
  - Docs: 8
  - Landing: 6
  - Scripts: 2
  - Sonstige: 3

Interpretation: Die Story berührt **Contract-, Persistenz-, Backend- und Frontend-Ebene** gleichzeitig. QA muss daher End-to-End-Konsistenz (Schema → API → UI → Export) priorisieren.

## 3. Evidenzbasis

Dieser Bericht basiert auf:

- Laufartefakten unter `artifacts/local-runtime-20260713/`
- CI-E2E-Logartefakten unter `artifacts/ci-e2e-29145359840/`
- Vorläuferberichten:
  - `docs/implementation/LOCAL-TESTRUN-2026-07-10.md`
  - `docs/implementation/LOCAL-QA-RECHECK-2026-07-11.md`
  - `docs/implementation/LOCAL-BASELINE-FREIGABE-2026-07-12.md`
- Produkt-/Backlog-Status aus `Backlog.md`

## 4. Ergebnisübersicht der Laufartefakte (2026-07-13)

| Report                                | Ergebnis                 |
| ------------------------------------- | ------------------------ |
| `qa-classroom-30.json`                | ✅ Pass                  |
| `demo-classroom-30.json`              | ✅ Pass                  |
| `blitzlicht-classroom-30.json`        | ✅ Pass                  |
| `channel-ws-fanout-classroom-30.json` | ✅ Pass                  |
| `ws-vote-progress-classroom-30.json`  | ✅ Pass                  |
| `ws-reconnect-wave-classroom-30.json` | ✅ Pass                  |
| `host-vote-progress-200.json`         | ✅ Pass                  |
| `freetext-wordcloud.json`             | ✅ Pass                  |
| `artillery-500.json`                  | ✅ Pass                  |
| `artillery-reconnect-500.json`        | ✅ Pass                  |
| `yjs-sync.json`                       | ✅ Pass                  |
| `soak-live-session.json`              | ✅ Pass                  |
| `vote-timer-fairness-600.json`        | ❌ Fail (initial)        |
| `vote-timer-fairness-600-retry.json`  | ✅ Pass (direkter Retry) |

JUnit-Summe aus `artifacts/local-runtime-20260713/*.junit.xml`:

- **tests:** 24
- **errors:** 0
- **failures:** 2

Die 2 Failures stammen vollständig aus dem initialen Fairness-Lauf (`vote-timer-fairness-600.json`).

## 5. KPI-Auszug (repräsentative Szenarien)

### 5.1 Q&A Classroom (30 Teilnehmende)

Quelle: `qa-classroom-30.json`

- Erwartete Fragen: 90, eingereicht: 90
- Submit-Phase: p95 **111 ms**
- Vote-Phase: 180 akzeptiert, 0 abgewiesen
- Host-Moderation: 15/15 Aktionen akzeptiert (Pin/Archive/Delete)

### 5.2 Artillery Live Session (500)

Quelle: `artillery-500.json`

- HTTP: 500 Joins, 500 Votes, 0 Join-/Vote-Fehler
- WebSocket: 500 Verbindungen, 0 Fehler
- Host-Sicht: `hostProgressMaxVotes=500`, Status endet auf `RESULTS`

### 5.3 Artillery Reconnect-Welle (500)

Quelle: `artillery-reconnect-500.json`

- 500/500 Reconnects erfolgreich
- `reconnectResultsSeen=500`, `reconnectResultsMissing=0`
- Reconnect-Latenz: max **12 ms**, avg **3 ms**

### 5.4 Yjs Sync/Reconnect

Quelle: `yjs-sync.json`

- Initial: connect p95 **112 ms**, sync p95 **113 ms**
- Reconnect (6 Clients): connect p95 **277 ms**, sync p95 **278 ms**
- Re-Konvergenz: **5 ms**, `errorCount=0`

### 5.5 5-Minuten Soak

Quelle: `soak-live-session.json`

- Dauer: **300028 ms** (~5 min), Zyklen: 147
- Funktionale Fehler: 0
- HTTP p95: **12.72 ms** (Limit 2000 ms)
- Event-Loop p99 (Load-Generator): **22.05 ms** (Limit 200 ms)
- Backend RSS-Wachstum: **0.39 MB** (Limit 256 MB)
- Redis p95: **5.13 ms**, PostgreSQL `SELECT 1` p95: **4.93 ms**

## 6. Vertiefung: Vote-Timer-Fairness (600)

### 6.1 Initialer Lauf (Fail)

Quelle: `vote-timer-fairness-600.json`

- `ACTIVE vor Timerende`: p95 **1207 ms** (Limit 1000 ms) → **Fail**
- `RESULTS innerhalb Backend-Karenz`: p95 **1168 ms** (Limit 1000 ms) → **Fail**
- Fachlogik korrekt:
  - innerhalb Fenster/Karenz: 600 akzeptiert
  - außerhalb Karenz: 600 abgewiesen (erwartet)

### 6.2 Direkter Retry (Pass)

Quelle: `vote-timer-fairness-600-retry.json`

- `ACTIVE vor Timerende`: p95 **757 ms**
- `RESULTS innerhalb Backend-Karenz`: p95 **816 ms**
- Assertions: **Pass**

Bewertung: **kein funktionaler Defekt erkennbar**, aber **Latenz-Volatilität** um das harte 1000-ms-Gate vorhanden. Für stabile Freigaben sollte die p95-Sicherheitsmarge unter Last weiter vergrößert werden.

## 7. Lighthouse und Frontend-Qualität

### 7.1 Beobachtung

- In `artifacts/local-runtime-20260713/lighthouse.log` trat ein Lauf mit `CHROME_INTERSTITIAL_ERROR` auf (Seitenschutz/Interstitial verhindert reguläres Auditing).
- Der anschließende Rerun (`lighthouse-rerun.log`) lief erfolgreich mit 6/6 Runs durch.

### 7.2 Letzte Messwerte (2026-07-13)

Aus `.lighthouseci/*2026_07_13*.report.json`:

- `/de/`: Performance **0.79**, **0.80**, **0.99**; Accessibility jeweils **1.00**; LCP typ. ~3.7–3.8 s
- `/en/`: Performance **0.81**, **0.80**, **0.80**; Accessibility jeweils **1.00**; LCP typ. ~3.75–3.83 s

Bewertung: Gate-relevante Werte sind im Vergleich zur historischen roten Messung (2026-07-10) deutlich verbessert. Der 0.99-Ausreißer spricht für Warm-Cache-/Messumgebungseffekte und sollte nicht als alleinige Baseline genutzt werden.

## 8. CI-E2E-Artefakt-Sichtung

Quellen:

- `artifacts/ci-e2e-29145359840/frontend.log`
- `artifacts/ci-e2e-29145359840/backend.log`

Ergebnis:

- Frontend-Serve/Proxy-Setup startet erwartungsgemäß (`serve:localize:api`, Proxy auf `/trpc`, `/trpc-ws`, `/yjs-ws`).
- Keine offensichtlichen Fehler-Signaturen (`ERROR|FAIL|Unhandled|Exception`) per Log-Suche gefunden.
- Backend-Log ist sehr umfangreich (Prisma Query-Trace-lastig), ohne direktes Fehlersignal in der Stichprobe.

## 9. Risikobewertung

### 9.1 Aktuelle Risiken

1. **Performance-Stabilitätsrisiko (mittel):** Vote-Fairness-Lauf war initial rot, dann grün. Risiko betrifft harte p95-Grenze bei 600 parallelen Abstimmungen.
2. **Messstabilitätsrisiko Lighthouse (niedrig bis mittel):** sporadischer Interstitial-Lauf; danach stabil grün.
3. **Integrationsbreite (mittel):** 64 geänderte Dateien über mehrere Schichten erhöhen Regressionseintrittswahrscheinlichkeit trotz grüner Einzelläufe.

### 9.2 Nicht vollständig durch diesen Snapshot abgedeckt

- Kein vollständig neu ausgeführter Root-Gesamtlauf (`npm run build`, `npm run lint`, `npm test`) im Rahmen **dieser** Berichtserstellung; es wurde auf vorhandene frische Laufartefakte zurückgegriffen.

## 10. QA-Entscheidung und Empfehlung

### 10.1 Entscheidungsstatus

- **QA-Status aktuell:** 🟡 **Bedingt freigabefähig**

### 10.2 Empfehlung vor Merge/Freigabe

1. Vote-Timer-Fairness 600 mindestens 3x nacheinander ausführen und p95-Streuung dokumentieren.
2. Lighthouse 6er-Run unter identischer Umgebung erneut ausführen und Interstitial-Freiheit verifizieren.
3. PR-Checks abwarten bzw. erneut bestätigen (insb. Build, Test, Lighthouse, Classroom-Smokes, Trivy).

Bei stabil grünen Wiederholungen ist aus QA-Sicht ein Wechsel auf **🟢 Freigabefähig** plausibel.

## 11. Referenzen

- `docs/TESTING.md`
- `docs/PERFORMANCE-TESTING.md`
- `docs/features/confidence-slider.md`
- `docs/implementation/LOCAL-TESTRUN-2026-07-10.md`
- `docs/implementation/LOCAL-QA-RECHECK-2026-07-11.md`
- `docs/implementation/LOCAL-BASELINE-FREIGABE-2026-07-12.md`
- `Backlog.md`
