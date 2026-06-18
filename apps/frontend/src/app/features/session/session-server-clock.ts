/**
 * Schätzt die Serverzeit aus ISO-Stempeln in API-Antworten (getInfo, Join, Status-Subscription),
 * um Geräte-Uhrenfehler beim Countdown auszugleichen.
 * Request/Response-Samples nutzen den lokalen Mittelpunkt zwischen Absenden und Empfang, damit
 * Netzwerklaufzeit die Countdown-Anzeige nicht systematisch zu spät macht.
 */
const SMOOTH_PREVIOUS = 0.75;
const ONE_WAY_BACKWARD_DRIFT_LIMIT_MS = 500;

let offsetMs = 0;
let hasSample = false;

function applyServerOffsetSample(sampleOffset: number): void {
  if (!hasSample) {
    offsetMs = sampleOffset;
    hasSample = true;
    return;
  }
  offsetMs = SMOOTH_PREVIOUS * offsetMs + (1 - SMOOTH_PREVIOUS) * sampleOffset;
}

export function recordServerTimeIso(iso: string, localReceiveMs = Date.now()): void {
  const serverMs = Date.parse(iso);
  if (Number.isNaN(serverMs)) return;
  const sampleOffset = serverMs - localReceiveMs;

  if (hasSample && sampleOffset < offsetMs - ONE_WAY_BACKWARD_DRIFT_LIMIT_MS) {
    return;
  }
  applyServerOffsetSample(sampleOffset);
}

export function recordServerTimeSample(
  iso: string,
  localSendMs: number,
  localReceiveMs = Date.now(),
): void {
  const serverMs = Date.parse(iso);
  if (Number.isNaN(serverMs)) return;
  if (!Number.isFinite(localSendMs) || !Number.isFinite(localReceiveMs)) return;

  const midpointMs = localSendMs + Math.max(0, localReceiveMs - localSendMs) / 2;
  applyServerOffsetSample(serverMs - midpointMs);
}

/** Für Tests oder Session-Wechsel (optional). */
export function resetServerClockSkew(): void {
  offsetMs = 0;
  hasSample = false;
}

export function getSkewAdjustedNow(): number {
  return Date.now() + (hasSample ? offsetMs : 0);
}
