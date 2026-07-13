-- Aktuelle Feature-MOTD: Sicherheitsgrad (Confidence Slider, Story 1.2i).
-- Feste ID; idempotent fuer lokale Seeds und produktive Migrationen.

INSERT INTO "Motd" (
  "id",
  "status",
  "priority",
  "startsAt",
  "endsAt",
  "visibleInArchive",
  "contentVersion",
  "templateId",
  "createdAt",
  "updatedAt"
) VALUES (
  'c0111111-c111-4c11-8c11-c01111111111',
  'PUBLISHED',
  50,
  '2026-07-13 00:00:00'::timestamp(3),
  '2027-03-31 23:59:59.999'::timestamp(3),
  true,
  2,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO UPDATE SET
  "status" = EXCLUDED."status",
  "priority" = EXCLUDED."priority",
  "startsAt" = EXCLUDED."startsAt",
  "endsAt" = EXCLUDED."endsAt",
  "visibleInArchive" = EXCLUDED."visibleInArchive",
  "contentVersion" = EXCLUDED."contentVersion",
  "templateId" = EXCLUDED."templateId",
  "updatedAt" = NOW();

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'c0111111-c111-4c11-8c11-c01111111111',
  'de',
  $mdde$# Richtig — oder nur gut geraten?

# ✅ → 🤔 → 🎯

**Sicherheitsgrad: sieh, wo die Gruppe wirklich steht**

Eine falsche Antwort allein verrät wenig. Viele **selbstsichere** falsche Antworten sind ein anderer Fall: Dahinter steckt oft ein festes Fehlkonzept — und du erkennst es **noch in der Veranstaltung**, nicht erst in der Klausur.

Aktiviere beim Bearbeiten einer Frage **„Sicherheitsgrad abfragen“**. Nach der Antwort wählen Lernende auf einer Skala von 1 bis 5, wie fest sie stehen.

**In der Host-Auswertung** zeigt dir die Heatmap **anonym aggregiert**, wie viele Teilnehmende richtig oder falsch geantwortet haben — und mit welcher Sicherheit. Besonders auffällig: die **Anzahl selbstsicher falscher** Antworten. Die Punktevergabe bleibt unberührt.

**Jetzt im Quiz-Editor ausprobieren.**$mdde$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'c0111111-c111-4c11-8c11-c01111111111',
  'en',
  $mden$# Right — or just a lucky guess?

# ✅ → 🤔 → 🎯

**Confidence rating: see where the group really stands**

A wrong answer alone tells you little. Many **confident** wrong answers are different — they often signal a misconception you can address **in class**, not after the exam.

When editing a question, turn on **“Ask for confidence level”**. After answering, learners rate how sure they are on a scale of 1 to 5.

**In the host results view**, the heatmap shows **anonymised aggregate counts**: how many participants answered correctly or incorrectly — and with what confidence. Especially telling: the **number of confidently incorrect** responses. Scoring stays unchanged.

**Try it in the quiz editor.**$mden$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'c0111111-c111-4c11-8c11-c01111111111',
  'fr',
  $mdfr$# Juste — ou simple coup de chance ?

# ✅ → 🤔 → 🎯

**Niveau de confiance : vois où en est vraiment le groupe**

Une mauvaise réponse, seule, n’en dit pas long. Beaucoup de mauvaises réponses **assurées**, c’est autre chose : derrière, il y a souvent une idée fausse bien ancrée — et tu la vois **pendant le cours**, pas seulement à l’examen.

Lors de l’édition d’une question, active **« Demander le niveau de confiance »**. Après la réponse, les apprenants indiquent sur une échelle de 1 à 5 à quel point ils sont sûrs.

**Dans la vue hôte**, la heatmap affiche **des effectifs agrégés et anonymes** : combien de participant·es ont répondu juste ou faux — et avec quelle assurance. Signal fort : le **nombre de réponses fausses mais assurées**. Le barème de points ne change pas.

**À essayer dans l’éditeur de quiz.**$mdfr$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'c0111111-c111-4c11-8c11-c01111111111',
  'es',
  $mdes$# ¿Correcto — o solo un buen intento?

# ✅ → 🤔 → 🎯

**Grado de seguridad: mira dónde está realmente el grupo**

Una respuesta incorrecta, por sí sola, dice poco. Muchas incorrectas **con mucha seguridad** son otra historia: detrás suele haber una idea equivocada arraigada — y la detectas **en clase**, no solo en el examen.

Al editar una pregunta, activa **«Preguntar grado de seguridad»**. Tras responder, el alumnado indica en una escala del 1 al 5 cuán seguro está.

**En la vista de anfitrión**, el mapa de calor muestra **recuentos agregados y anónimos**: cuántas personas respondieron bien o mal — y con qué seguridad. Especialmente revelador: el **número de respuestas incorrectas pero seguras**. La puntuación no cambia.

**Pruébalo en el editor de quiz.**$mdes$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'c0111111-c111-4c11-8c11-c01111111111',
  'it',
  $mdit$# Giusto — o solo un colpo di fortuna?

# ✅ → 🤔 → 🎯

**Livello di sicurezza: capisci dove sta davvero il gruppo**

Una risposta sbagliata, da sola, non basta. Molte sbagliate **con sicurezza** sono un’altra storia: spesso c’è un’idea errata ben radicata — e la vedi **in aula**, non solo all’esame.

Modificando una domanda, attiva **«Chiedi il livello di sicurezza»**. Dopo la risposta, gli studenti indicano su una scala da 1 a 5 quanto sono convinti.

**Nella vista host**, la heatmap mostra **conteggi aggregati e anonimi**: quante persone hanno risposto correttamente o meno — e con quale sicurezza. Segnale forte: il **numero di risposte sbagliate ma sicure**. Il punteggio resta invariato.

**Provalo nell’editor quiz.**$mdit$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";
