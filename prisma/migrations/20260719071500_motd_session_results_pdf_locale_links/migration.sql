-- Demo-Nachbesprechungsplan: MOTD-Links auf locale-spezifische PDFs
-- (demo-session-results-30.{locale}.pdf). Idempotent: ersetzt nur, wenn alter Link noch gesetzt ist.

UPDATE "Motd"
SET "contentMd" = REPLACE(
  "contentMd",
  '](/assets/demo/demo-session-results-30.pdf)',
  '](/assets/demo/demo-session-results-30.de.pdf)'
)
WHERE "locale" = 'de'
  AND "contentMd" LIKE '%](/assets/demo/demo-session-results-30.pdf)%';

UPDATE "Motd"
SET "contentMd" = REPLACE(
  "contentMd",
  '](/assets/demo/demo-session-results-30.pdf)',
  '](/assets/demo/demo-session-results-30.en.pdf)'
)
WHERE "locale" = 'en'
  AND "contentMd" LIKE '%](/assets/demo/demo-session-results-30.pdf)%';

UPDATE "Motd"
SET "contentMd" = REPLACE(
  "contentMd",
  '](/assets/demo/demo-session-results-30.pdf)',
  '](/assets/demo/demo-session-results-30.fr.pdf)'
)
WHERE "locale" = 'fr'
  AND "contentMd" LIKE '%](/assets/demo/demo-session-results-30.pdf)%';

UPDATE "Motd"
SET "contentMd" = REPLACE(
  "contentMd",
  '](/assets/demo/demo-session-results-30.pdf)',
  '](/assets/demo/demo-session-results-30.it.pdf)'
)
WHERE "locale" = 'it'
  AND "contentMd" LIKE '%](/assets/demo/demo-session-results-30.pdf)%';

UPDATE "Motd"
SET "contentMd" = REPLACE(
  "contentMd",
  '](/assets/demo/demo-session-results-30.pdf)',
  '](/assets/demo/demo-session-results-30.es.pdf)'
)
WHERE "locale" = 'es'
  AND "contentMd" LIKE '%](/assets/demo/demo-session-results-30.pdf)%';
