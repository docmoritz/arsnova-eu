import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import {
  getSkewAdjustedNow,
  recordServerTimeIso,
  recordServerTimeSample,
  resetServerClockSkew,
} from './session-server-clock';

describe('session-server-clock', () => {
  beforeEach(() => {
    resetServerClockSkew();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ohne Sample: getSkewAdjustedNow entspricht Date.now', () => {
    const spy = vi.spyOn(Date, 'now').mockReturnValue(42);
    expect(getSkewAdjustedNow()).toBe(42);
    spy.mockRestore();
  });

  it('setzt den Offset aus dem ersten Serverzeit-Sample', () => {
    recordServerTimeIso(new Date(7000).toISOString(), 2000);
    const spy = vi.spyOn(Date, 'now').mockReturnValue(3000);
    expect(getSkewAdjustedNow()).toBe(8000);
    spy.mockRestore();
  });

  it('nutzt bei Request/Response den lokalen Roundtrip-Mittelpunkt', () => {
    recordServerTimeSample(new Date(7000).toISOString(), 1000, 3000);
    const spy = vi.spyOn(Date, 'now').mockReturnValue(4000);
    expect(getSkewAdjustedNow()).toBe(9000);
    spy.mockRestore();
  });

  it('ignoriert stark verspätete einseitige Samples nach einer Kalibrierung', () => {
    recordServerTimeSample(new Date(2000).toISOString(), 1000, 3000);
    recordServerTimeIso(new Date(2500).toISOString(), 5000);
    const spy = vi.spyOn(Date, 'now').mockReturnValue(6000);
    expect(getSkewAdjustedNow()).toBe(6000);
    spy.mockRestore();
  });
});
