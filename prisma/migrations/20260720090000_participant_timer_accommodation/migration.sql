-- Persönliche Timer-Anpassung für Teilnehmende (WCAG 2.2.1 Timing Adjustable).
ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "timerAccommodation" TEXT NOT NULL DEFAULT 'DEFAULT';
