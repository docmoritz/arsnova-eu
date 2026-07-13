/**
 * Aktiviert Sicherheitsgrad an ausgewählten Showcase-Fragen und ergänzt die Quiz-Beschreibung.
 * Aufruf: node scripts/patch-demo-quiz-confidence.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoDir = path.join(__dirname, '../src/assets/demo');

const EXPORT_VERSION = 27;
const EXPORTED_AT = '2026-07-13T13:00:00.000Z';

const CONFIDENCE_ORDERS = new Set([1, 3, 4, 6, 7]);

const DESCRIPTION_PATCH = {
  de: {
    anchor: '- Multiple-Choice- und Rating-Fragen sinnvoll einsetzt\n',
    insert:
      '- nach bewertbaren Antworten den **Sicherheitsgrad** (1–5) abfragen und **selbstsicher falsche** Antworten in der Host-Auswertung erkennen\n',
  },
  en: {
    anchor: '- use multiple-choice and quick rating prompts well\n',
    insert:
      '- ask for **confidence** (1–5) after gradable answers and spot **high-confidence wrong** answers in the host view\n',
  },
  fr: {
    anchor: '- utiliser à bon escient les choix multiples et les échelles d’évaluation\n',
    insert:
      '- demander le **niveau de confiance** (1–5) après les réponses notées et repérer les réponses **fausses mais très sûres** dans la vue hôte\n',
  },
  es: {
    anchor: '- usar bien preguntas de respuesta múltiple y escalas de valoración\n',
    insert:
      '- preguntar el **grado de confianza** (1–5) tras respuestas evaluables y detectar respuestas **incorrectas con mucha seguridad** en la vista del anfitrión\n',
  },
  it: {
    anchor: '- usare bene domande a scelta multipla e scale di valutazione rapide\n',
    insert:
      '- chiedere il **grado di sicurezza** (1–5) dopo risposte valutabili e individuare risposte **sbagliate ma molto sicure** nella vista host\n',
  },
};

const LABELS = {
  de: { low: 'Geraten', high: 'Sehr sicher' },
  en: { low: 'Guessing', high: 'Very confident' },
  fr: { low: 'Au hasard', high: 'Très sûr' },
  es: { low: 'A ojo', high: 'Muy seguro' },
  it: { low: 'A caso', high: 'Molto sicuro' },
};

for (const locale of Object.keys(DESCRIPTION_PATCH)) {
  const file = path.join(demoDir, `quiz-demo-showcase.${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const patch = DESCRIPTION_PATCH[locale];
  const labels = LABELS[locale];

  if (!data.quiz?.description?.includes(patch.insert.trim())) {
    if (!data.quiz.description.includes(patch.anchor)) {
      throw new Error(`Anchor not found in ${locale}: ${patch.anchor}`);
    }
    data.quiz.description = data.quiz.description.replace(patch.anchor, patch.anchor + patch.insert);
  }

  data.exportVersion = EXPORT_VERSION;
  data.exportedAt = EXPORTED_AT;

  for (const question of data.quiz.questions ?? []) {
    if (CONFIDENCE_ORDERS.has(question.order)) {
      question.confidenceEnabled = true;
      question.confidenceLabelLow = labels.low;
      question.confidenceLabelHigh = labels.high;
    } else {
      delete question.confidenceEnabled;
      delete question.confidenceLabelLow;
      delete question.confidenceLabelHigh;
    }
  }

  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`patched ${locale}`);
}
