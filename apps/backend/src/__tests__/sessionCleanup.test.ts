import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prismaMock, platformStatisticMocks, loggerMocks } = vi.hoisted(() => ({
  prismaMock: {
    session: {
      updateMany: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    quiz: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    bonusToken: {
      deleteMany: vi.fn(),
    },
    sessionFeedback: {
      deleteMany: vi.fn(),
    },
  },
  platformStatisticMocks: {
    incrementCompletedSessionsTotal: vi.fn(),
  },
  loggerMocks: {
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('../db', () => ({
  prisma: prismaMock,
}));

vi.mock('../lib/platformStatistic', () => ({
  incrementCompletedSessionsTotal: platformStatisticMocks.incrementCompletedSessionsTotal,
}));

vi.mock('../lib/logger', () => ({
  logger: loggerMocks,
}));

import {
  cleanupExpiredFinishedSessions,
  cleanupExpiredSessionFeedback,
  cleanupStaleSessions,
} from '../lib/sessionCleanup';

describe('sessionCleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inkrementiert den completedSessionsCounter fuer automatisch beendete verwaiste Sessions', async () => {
    prismaMock.session.updateMany.mockResolvedValue({ count: 3 });

    const result = await cleanupStaleSessions();

    expect(result).toBe(3);
    expect(platformStatisticMocks.incrementCompletedSessionsTotal).toHaveBeenCalledWith(3);
  });

  it('inkrementiert den completedSessionsCounter nicht, wenn keine Session beendet wurde', async () => {
    prismaMock.session.updateMany.mockResolvedValue({ count: 0 });

    const result = await cleanupStaleSessions();

    expect(result).toBe(0);
    expect(platformStatisticMocks.incrementCompletedSessionsTotal).not.toHaveBeenCalled();
  });

  it('loescht abgelaufenes Session-Feedback mit eigener Retention', async () => {
    prismaMock.sessionFeedback.deleteMany.mockResolvedValue({ count: 4 });

    const result = await cleanupExpiredSessionFeedback();

    expect(result).toBe(4);
    expect(prismaMock.sessionFeedback.deleteMany).toHaveBeenCalledWith({
      where: {
        createdAt: { lt: expect.any(Date) },
        session: { status: 'FINISHED' },
      },
    });
    expect(loggerMocks.info).toHaveBeenCalledWith(
      expect.stringContaining('SessionFeedback-Cleanup: 4 Bewertung(en)'),
    );
  });

  it('purged nur beendete Sessions ohne aktiven Bonus- oder Feedback-Verlauf', async () => {
    prismaMock.session.findMany.mockResolvedValue([
      { id: 'session-1', quizId: 'quiz-1' },
      { id: 'session-2', quizId: null },
    ]);
    prismaMock.session.deleteMany.mockResolvedValue({ count: 2 });
    prismaMock.quiz.findMany.mockResolvedValue([{ id: 'quiz-1' }]);
    prismaMock.quiz.deleteMany.mockResolvedValue({ count: 1 });

    const result = await cleanupExpiredFinishedSessions();

    expect(result).toBe(2);
    expect(prismaMock.session.findMany).toHaveBeenCalledWith({
      where: {
        status: 'FINISHED',
        endedAt: { not: null, lt: expect.any(Date) },
        OR: [{ legalHoldUntil: null }, { legalHoldUntil: { lte: expect.any(Date) } }],
        bonusTokens: {
          none: {
            generatedAt: { gte: expect.any(Date) },
          },
        },
        sessionFeedbacks: {
          none: {
            createdAt: { gte: expect.any(Date) },
          },
        },
      },
      select: {
        id: true,
        quizId: true,
      },
    });
    expect(prismaMock.session.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['session-1', 'session-2'] } },
    });
    expect(prismaMock.quiz.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: ['quiz-1'] },
        sessions: { none: {} },
      },
      select: { id: true },
    });
    expect(prismaMock.quiz.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['quiz-1'] } },
    });
    expect(loggerMocks.info).toHaveBeenCalledWith(
      expect.stringContaining('Session-Purge: 2 beendete Session(s)'),
    );
  });
});
