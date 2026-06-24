-- Aktuelle Feature-MOTD: KI-Quizgenerierung.
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
  'f0f0f0f0-f0f0-4f0f-8f0f-f0f0f0f0f0f0',
  'PUBLISHED',
  40,
  '2026-06-24 00:00:00'::timestamp(3),
  '2027-03-31 23:59:59.999'::timestamp(3),
  true,
  1,
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
  'f0f0f0f0-f0f0-4f0f-8f0f-f0f0f0f0f0f0',
  'de',
  $mdde$# Aus Unterrichtsmaterial wird ein Quiz.

# 📚 → 🤖 → 🎯

**KI-Quizgenerierung für deine Unterrichtsvorbereitung**

Folien, Skripte oder Lernziele reichen als Startpunkt: Öffne **„Quiz mit KI erstellen“**, kopiere die **Startvorlage** in deinen KI-Chat und füge dein Material ein.

Anschließend schickst du die **Prüfvorlage** in denselben Chat. Sie gleicht Antwortoptionen an, schärft Distraktoren und prüft den JSON-Code vor dem Import.

**Ergebnis:** In wenigen Minuten hast du einen importierbaren Quizentwurf, den du in arsnova.eu fachlich prüfst, anpasst und direkt in deiner Veranstaltung einsetzen kannst.

**Zu finden in deiner Quiz-Sammlung.**$mdde$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'f0f0f0f0-f0f0-4f0f-8f0f-f0f0f0f0f0f0',
  'en',
  $mden$# Turn course material into a quiz.

# 📚 → 🤖 → 🎯

**AI-powered quiz generation for lesson prep**

Slides, notes, or learning objectives are enough to get started. In your quiz collection, open **“Create a quiz with AI”**, copy the **generation template** into your AI chat, and paste in your material.

Then send the **review template** in the same chat. It balances answer options, strengthens distractors, and checks the JSON before import.

**Result:** In minutes, you have an importable quiz draft to review in arsnova.eu, fine-tune, and use in class.

**Find it in your quiz collection.**$mden$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'f0f0f0f0-f0f0-4f0f-8f0f-f0f0f0f0f0f0',
  'fr',
  $mdfr$# Transformez vos supports en quiz.

# 📚 → 🤖 → 🎯

**Génération de quiz avec l’IA pour préparer vos cours**

Des diapositives, des notes de cours ou des objectifs d’apprentissage suffisent. Dans votre bibliothèque de quiz, ouvrez « Créer un quiz avec l’IA », copiez le **modèle de génération** dans votre chat avec l’IA et ajoutez vos supports.

Envoyez ensuite le **modèle de vérification** dans le même chat. Il harmonise les options de réponse, améliore les distracteurs et vérifie le JSON avant l’import.

**Résultat :** en quelques minutes, vous obtenez un brouillon de quiz importable, à vérifier dans arsnova.eu, à ajuster et à utiliser en cours.

**À retrouver dans votre bibliothèque de quiz.**$mdfr$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'f0f0f0f0-f0f0-4f0f-8f0f-f0f0f0f0f0f0',
  'es',
  $mdes$# Convierte tu material en un quiz.

# 📚 → 🤖 → 🎯

**Generación de quizzes con IA para preparar tus clases**

Con diapositivas, apuntes u objetivos de aprendizaje basta para empezar. En tu colección de quizzes, abre «Crear un quiz con IA», copia la **plantilla de generación** en tu chat de IA y pega tu material.

Después envía la **plantilla de revisión** en el mismo chat. Equilibra las opciones de respuesta, mejora los distractores y comprueba el JSON antes de importarlo.

**Resultado:** en pocos minutos tienes un borrador de quiz importable para revisarlo en arsnova.eu, ajustarlo y usarlo en clase.

**Lo encuentras en tu colección de quizzes.**$mdes$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";

INSERT INTO "MotdLocale" ("id", "motdId", "locale", "markdown")
VALUES (
  gen_random_uuid()::text,
  'f0f0f0f0-f0f0-4f0f-8f0f-f0f0f0f0f0f0',
  'it',
  $mdit$# Trasforma il materiale in un quiz.

# 📚 → 🤖 → 🎯

**Generazione di quiz con l’IA per preparare le lezioni**

Ti bastano slide, appunti o obiettivi di apprendimento. Nella tua raccolta quiz apri «Crea un quiz con l’IA», copia il **modello di generazione** nella tua chat con l’IA e incolla il materiale.

Poi invia il **modello di verifica** nella stessa chat. Armonizza le opzioni di risposta, migliora i distrattori e controlla il JSON prima dell’importazione.

**Risultato:** in pochi minuti ottieni una bozza di quiz importabile, da controllare in arsnova.eu, adattare e usare a lezione.

**La trovi nella tua raccolta quiz.**$mdit$
)
ON CONFLICT ("motdId", "locale") DO UPDATE SET "markdown" = EXCLUDED."markdown";
