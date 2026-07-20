import { describe, expect, it } from 'vitest';
import {
  AnswerOptionRevealedDTOSchema,
  AnswerOptionStudentDTOSchema,
  JoinSessionInputSchema,
  previewMaxCorrectScoreAtElapsedSeconds,
  QuestionRevealedDTOSchema,
  QuestionStudentDTOSchema,
  resolvePersonalTimerSeconds,
  SetTimerAccommodationInputSchema,
  SubmitVoteInputSchema,
  TIMER_ACCOMMODATION_EXTENDED_FACTOR,
} from './schemas.js';

const sessionId = '10000000-0000-4000-8000-000000000001';
const participantId = '10000000-0000-4000-8000-000000000002';
const questionId = '10000000-0000-4000-8000-000000000003';
const answerId = '10000000-0000-4000-8000-000000000004';

describe('öffentliche Contract-Schemas', () => {
  it('weist Lösungsdaten in studentischen Antwortoptionen strikt zurück', () => {
    const result = AnswerOptionStudentDTOSchema.safeParse({
      id: answerId,
      text: 'Antwort',
      isCorrect: true,
    });

    expect(result.success).toBe(false);
  });

  it('erlaubt Lösungsdaten ausschließlich im aufgelösten Antwortvertrag', () => {
    const result = AnswerOptionRevealedDTOSchema.safeParse({
      id: answerId,
      text: 'Antwort',
      isCorrect: true,
      voteCount: 2,
      votePercentage: 100,
    });

    expect(result.success).toBe(true);
  });

  it('entfernt Lösungs- und Toleranzwerte aus der aktiven Teilnehmerfrage', () => {
    const parsed = QuestionStudentDTOSchema.parse({
      id: questionId,
      text: 'Schätzfrage',
      type: 'NUMERIC_ESTIMATE',
      timer: null,
      difficulty: 'MEDIUM',
      order: 0,
      answers: [],
      numericInputType: 'INTEGER',
      numericReferenceValue: 42,
      numericIntervalLeft: 40,
      numericIntervalRight: 44,
    });

    expect(parsed).not.toHaveProperty('numericReferenceValue');
    expect(parsed).not.toHaveProperty('numericIntervalLeft');
    expect(parsed).not.toHaveProperty('numericIntervalRight');
  });

  it('normalisiert die erste Vote-Runde und begrenzt Folgerunden', () => {
    const baseVote = {
      sessionId,
      participantId,
      questionId,
      answerIds: [answerId],
    };

    expect(SubmitVoteInputSchema.parse(baseVote).round).toBe(1);
    expect(SubmitVoteInputSchema.safeParse({ ...baseVote, round: 2 }).success).toBe(true);
    expect(SubmitVoteInputSchema.safeParse({ ...baseVote, round: 3 }).success).toBe(false);
  });

  it('transportiert die aktive Runde für numerische Zwei-Runden-Ergebnisse', () => {
    const parsed = QuestionRevealedDTOSchema.parse({
      id: questionId,
      text: 'Schätzfrage',
      type: 'NUMERIC_ESTIMATE',
      difficulty: 'MEDIUM',
      order: 0,
      answers: [],
      totalVotes: 20,
      numericTwoRounds: true,
      currentRound: 2,
    });

    expect(parsed.numericTwoRounds).toBe(true);
    expect(parsed.currentRound).toBe(2);
  });

  it('erzwingt Session-Code und begrenzte Anzeigenamen', () => {
    expect(JoinSessionInputSchema.safeParse({ code: 'ABC123', nickname: 'Ada' }).success).toBe(
      true,
    );
    expect(JoinSessionInputSchema.safeParse({ code: 'ABC12', nickname: 'Ada' }).success).toBe(
      false,
    );
    expect(
      JoinSessionInputSchema.safeParse({ code: 'ABC123', nickname: 'x'.repeat(31) }).success,
    ).toBe(false);
  });

  it('berechnet persönliche Timer-Anpassung ohne Lösungsdaten zu erfordern', () => {
    expect(resolvePersonalTimerSeconds(30, 'DEFAULT')).toBe(30);
    expect(resolvePersonalTimerSeconds(30, 'EXTENDED')).toBe(
      30 * TIMER_ACCOMMODATION_EXTENDED_FACTOR,
    );
    expect(resolvePersonalTimerSeconds(30, 'OFF')).toBeNull();
    expect(resolvePersonalTimerSeconds(null, 'EXTENDED')).toBeNull();

    const parsed = QuestionStudentDTOSchema.parse({
      id: questionId,
      text: 'Frage',
      type: 'SINGLE_CHOICE',
      timer: 300,
      sessionTimer: 30,
      timerAccommodation: 'EXTENDED',
      difficulty: 'MEDIUM',
      order: 0,
      answers: [{ id: answerId, text: 'A' }],
    });
    expect(parsed.timer).toBe(300);
    expect(parsed.sessionTimer).toBe(30);
    expect(parsed.timerAccommodation).toBe('EXTENDED');
    expect(parsed).not.toHaveProperty('isCorrect');

    expect(
      SetTimerAccommodationInputSchema.safeParse({
        code: 'ABC123',
        participantId,
        accommodation: 'OFF',
      }).success,
    ).toBe(true);
    expect(
      SetTimerAccommodationInputSchema.safeParse({
        code: 'ABC123',
        participantId,
        accommodation: 'DOUBLE',
      }).success,
    ).toBe(false);
  });

  it('punktet die Vorschau am Session-Timer und hält in der Nachlaufzeit das Minimum', () => {
    expect(
      previewMaxCorrectScoreAtElapsedSeconds({
        difficulty: 'MEDIUM',
        sessionTimerSeconds: 60,
        elapsedSeconds: 0,
      }),
    ).toBe(2000);
    expect(
      previewMaxCorrectScoreAtElapsedSeconds({
        difficulty: 'MEDIUM',
        sessionTimerSeconds: 60,
        elapsedSeconds: 30,
      }),
    ).toBe(1000);
    expect(
      previewMaxCorrectScoreAtElapsedSeconds({
        difficulty: 'MEDIUM',
        sessionTimerSeconds: 60,
        elapsedSeconds: 60,
      }),
    ).toBe(200);
    expect(
      previewMaxCorrectScoreAtElapsedSeconds({
        difficulty: 'MEDIUM',
        sessionTimerSeconds: 60,
        elapsedSeconds: 120,
      }),
    ).toBe(200);
  });
});
