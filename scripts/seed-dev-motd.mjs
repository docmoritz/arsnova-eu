#!/usr/bin/env node
/**
 * Legt die dauerhafte Willkommens-MOTD an (feste ID, lang gültig bis Ende 2099).
 * Idempotent: DELETE + INSERT ersetzt Inhalt und Locales bei wiederholtem Aufruf.
 *
 * Priorität -100 (unter Admin-Standard 0), damit echte / Feature-MOTDs mit getCurrent zuerst kommen.
 *
 * Text-Updates für bestehende DBs: prisma/migrations/20260524123000_motd_welcome_copy_v6/migration.sql
 * Making-of-MOTD (6 Monate, nach Willkommen): 20260329140000_motd_making_of_ai (id …bbbbbbbb…).
 *
 * Nutzung: DATABASE_URL gesetzt oder Default localhost (wie ensure-schema.js).
 *   node scripts/seed-dev-motd.mjs
 */
import { randomUUID } from 'node:crypto';
import pg from 'pg';

const DEFAULT_DATABASE_URL =
  'postgresql://arsnova_user:secretpassword@localhost:5432/arsnova_v3_dev?schema=public';

const DEV_MOTD_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

/** Start sichtbar ab Go-Live-Datum; endsAt mittags UTC, damit MEZ nicht 01.01.2100 anzeigt */
const STARTS = new Date('2026-03-24T00:00:00.000Z');
const ENDS = new Date('2099-12-31T12:00:00.000Z');
const CONTENT_VERSION = 6;

const markdownDe = `# Mit einem Klick live.

Starte sofort ein Blitzlicht – oder leg mit Quiz, Abstimmung, Q&A, Peer Instruction, Team-Modus und Bonus-Code nach. Wie Mentimeter – aber Open Source, kostenlos und ohne Tracking. Wie Kahoot – aber für Lernen, Training und Workshops gemacht. Wie Slido – aber nicht nur Q&A, sondern komplette Live-Interaktion ohne Account.

**Jetzt ausprobieren**`;

const markdownEn = `# Go live in one click.

Start an instant pulse with one click — or go further with quizzes, polls, Q&A, Peer Instruction, team mode, and bonus codes. Like Mentimeter — but open source, free to use, and no tracking. Like Kahoot — but built for learning, training, and workshops. Like Slido — but not just Q&A: full live interaction, no account required.

**Try it now**`;

const markdownFr = `# En direct en un clic.

Lance un feedback instantané en un clic — ou va plus loin avec quiz, votes, Q&R, Peer Instruction, mode équipes et codes bonus. Comme Mentimeter — mais open source, gratuit et sans pistage. Comme Kahoot — mais pensé pour apprendre, former et animer des ateliers. Comme Slido — mais pas seulement pour les Q&R : une vraie interaction live, sans compte.

**Essaie maintenant**`;

const markdownEs = `# En vivo con un clic.

Lanza feedback instantáneo con un clic — o ve más allá con quizzes, votaciones, preguntas y respuestas, Peer Instruction, modo equipos y códigos bonus. Como Mentimeter — pero open source, gratis y sin rastreo. Como Kahoot — pero pensado para aprender, formar y dinamizar talleres. Como Slido — pero no solo para preguntas y respuestas: interacción en vivo completa, sin cuenta.

**Pruébalo ahora**`;

const markdownIt = `# Vai live con un clic.

Avvia un feedback istantaneo con un clic — oppure vai oltre con quiz, sondaggi, Q&A, Peer Instruction, modalità team e codici bonus. Come Mentimeter — ma open source, gratuito e senza tracking. Come Kahoot — ma pensato per apprendimento, formazione e workshop. Come Slido — ma non solo Q&A: interazione live completa, senza account.

**Provalo ora**`;

async function main() {
  const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    await client.query('DELETE FROM "Motd" WHERE id = $1', [DEV_MOTD_ID]);

    const now = new Date();

    await client.query(
      `INSERT INTO "Motd" (
        "id", "status", "priority", "startsAt", "endsAt",
        "visibleInArchive", "contentVersion", "templateId",
        "createdAt", "updatedAt"
      ) VALUES ($1, 'PUBLISHED', -100, $2, $3, true, $4, NULL, $5, $5)`,
      [DEV_MOTD_ID, STARTS, ENDS, CONTENT_VERSION, now],
    );

    const locales = [
      ['de', markdownDe],
      ['en', markdownEn],
      ['fr', markdownFr],
      ['es', markdownEs],
      ['it', markdownIt],
    ];

    for (const [locale, md] of locales) {
      await client.query(
        `INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown") VALUES ($1, $2, $3, $4)`,
        [randomUUID(), DEV_MOTD_ID, locale, md],
      );
    }

    console.log(
      `Willkommens-MOTD angelegt (id=${DEV_MOTD_ID}), gültig ${STARTS.toISOString()} … ${ENDS.toISOString()} UTC (contentVersion=${CONTENT_VERSION}).`,
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
