ALTER TABLE "QaQuestion"
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "QaQuestion_sessionId_updatedAt_idx"
ON "QaQuestion"("sessionId", "updatedAt");

CREATE INDEX IF NOT EXISTS "QaUpvote_qaQuestionId_direction_idx"
ON "QaUpvote"("qaQuestionId", "direction");
