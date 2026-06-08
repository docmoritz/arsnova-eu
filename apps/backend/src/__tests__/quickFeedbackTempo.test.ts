import { describe, expect, it } from 'vitest';
import { calculateTempoTrend } from '../lib/quickFeedbackTempo';

describe('calculateTempoTrend', () => {
  it('gibt NEUTRAL zurück wenn tempoVotes unterhalb der Mindestanzahl', () => {
    const result = calculateTempoTrend({
      distribution: { LOST: 0, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 0 },
      totalVotes: 0,
      activeParticipants: 5,
      snapshots: [],
    });
    expect(result.status).toBe('NEUTRAL');
    expect(result.active).toBe(false);
  });

  it('erkannte LOST-Signal mit einem Bucket bleibt stabil', () => {
    // Ein einzelner Bucket mit 40 % LOST (> 18 % Klarmarge) → LOST.
    const result = calculateTempoTrend({
      distribution: { LOST: 8, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 12 },
      totalVotes: 20,
      activeParticipants: 20,
      snapshots: [
        {
          bucketMs: 0,
          distribution: { LOST: 8, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 12 },
          totalVotes: 20,
        },
      ],
    });
    expect(result.status).toBe('LOST');
    expect(result.active).toBe(true);
  });

  it('jüngere Buckets werden stärker gewichtet – LOST-Signal wird bei Erholung schneller aufgehoben', () => {
    // Älterer Bucket (Gewicht 1): 8 von 20 abgehängt → klares LOST-Signal (40 % > 18 % Marge).
    // Neuerer Bucket (Gewicht 2): vollständige Erholung, niemand mehr abgehängt.
    //
    // Gleichgewichtung: avg LOST = (8 + 0) / 2 = 4 → 20 % ≥ 18 % Klarmarge → LOST.
    // Lineare Zeitgewichtung: avg LOST = (8×1 + 0×2) / 3 ≈ 2.67 → 13.3 % < 18 % Klarmarge
    //   → deriveTempoStatus liefert noch LOST (>12 %), aber hasClearTempoMargin schlägt fehl
    //   → Status fällt auf HETEROGENEOUS, nicht mehr LOST.
    //
    // stableBucketStatus: Snapshot 0 → LOST, Snapshot 1 → FOLLOWING → kein Konsens → null.
    const result = calculateTempoTrend({
      distribution: { LOST: 0, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 20 },
      totalVotes: 20,
      activeParticipants: 20,
      snapshots: [
        {
          bucketMs: 0,
          distribution: { LOST: 8, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 12 },
          totalVotes: 20,
        },
        {
          bucketMs: 15_000,
          distribution: { LOST: 0, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 20 },
          totalVotes: 20,
        },
      ],
    });
    expect(result.active).toBe(true);
    expect(result.status).toBe('HETEROGENEOUS');
    expect(result.marginMet).toBe(false);
  });

  it('setzt marginMet=true bei echtem FOLLOWING-Signal mit klarer Marge', () => {
    // 80 % FOLLOWING (≥ 65 % Marge) und problems 0 % (< 10 %) → FOLLOWING mit marginMet=true.
    const result = calculateTempoTrend({
      distribution: { LOST: 0, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 16 },
      totalVotes: 20,
      activeParticipants: 20,
      snapshots: [],
    });
    expect(result.status).toBe('FOLLOWING');
    expect(result.marginMet).toBe(true);
  });

  it('setzt marginMet=true bei stabilem FOLLOWING über zwei Buckets (stableBucketStatus)', () => {
    // Beide Buckets knapp über der Primärschwelle (50 %), aber unter der Klarmarge (65 %).
    // stableBucketStatus liefert FOLLOWING → marginMet=true trotz fehlender Klarmarge.
    const snapshot = {
      distribution: { LOST: 0, SLOW_DOWN: 0, SPEED_UP: 0, FOLLOWING: 11 },
      totalVotes: 20,
    };
    const result = calculateTempoTrend({
      distribution: snapshot.distribution,
      totalVotes: 20,
      activeParticipants: 20,
      snapshots: [
        { bucketMs: 0, ...snapshot },
        { bucketMs: 15_000, ...snapshot },
      ],
    });
    expect(result.status).toBe('FOLLOWING');
    expect(result.marginMet).toBe(true);
  });
});
