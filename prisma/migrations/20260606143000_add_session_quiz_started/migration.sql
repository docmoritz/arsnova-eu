ALTER TABLE "Session" ADD COLUMN "quizStarted" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Session"
SET "quizStarted" = true
WHERE "currentQuestion" IS NOT NULL
   OR EXISTS (
     SELECT 1
     FROM "Vote"
     WHERE "Vote"."sessionId" = "Session"."id"
   );
