import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    session: {
      findUnique: vi.fn(),
    },
    vote: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../db', () => ({
  prisma: prismaMock,
}));

import { sessionRouter } from '../routers/session';

const caller = sessionRouter.createCaller({ req: undefined });

describe('session.getPersonalScorecard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('wertet positive SHORT_TEXT-Punkte in der persoenlichen Scorecard als korrekt', async () => {
    const participantId = '11111111-1111-4111-8111-111111111111';
    const otherParticipantId = '22222222-2222-4222-8222-222222222222';
    const questionId = '33333333-3333-4333-8333-333333333333';

    prismaMock.session.findUnique.mockResolvedValue({
      id: 'sess-1',
      status: 'RESULTS',
      quiz: {
        questions: [
          {
            id: questionId,
            type: 'SHORT_TEXT',
            answers: [{ id: '44444444-4444-4444-8444-444444444444', isCorrect: true }],
          },
        ],
      },
      participants: [{ id: participantId }, { id: otherParticipantId }],
    });
    prismaMock.vote.findUnique.mockResolvedValue({
      score: 215,
      streakCount: 2,
      streakBonus: 1.1,
      selectedAnswers: [],
    });
    prismaMock.vote.findMany.mockResolvedValue([
      { participantId, score: 215, responseTimeMs: 1200 },
      { participantId: otherParticipantId, score: 180, responseTimeMs: 1400 },
    ]);

    const result = await caller.getPersonalScorecard({
      code: 'ABC123',
      participantId,
      questionIndex: 0,
      round: 1,
    });

    expect(result).toEqual(
      expect.objectContaining({
        wasCorrect: true,
        questionScore: 215,
      }),
    );
  });
});
