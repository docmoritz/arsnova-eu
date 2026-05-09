ALTER TABLE "PlatformStatistic"
ADD COLUMN "usedSessionsTotal" INTEGER NOT NULL DEFAULT 0;

UPDATE "PlatformStatistic"
SET "usedSessionsTotal" = GREATEST(
  "usedSessionsTotal",
  "completedSessionsTotal",
  COALESCE(
    (
      SELECT COUNT(*)::int
      FROM "Session" s
      WHERE s."status" <> 'LOBBY'
         OR EXISTS (
           SELECT 1
           FROM "Participant" p
           WHERE p."sessionId" = s."id"
         )
    ),
    0
  )
);
