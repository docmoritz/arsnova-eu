import { describe, expect, it } from 'vitest';
import {
  confidenceDefaultLabelHigh,
  confidenceDefaultLabelLow,
  resolveConfidenceLabelHigh,
  resolveConfidenceLabelLow,
} from './confidence-default-labels';

describe('confidence-default-labels', () => {
  it('liefert lokalisierte Standard-Ecklabels', () => {
    expect(confidenceDefaultLabelLow().length).toBeGreaterThan(0);
    expect(confidenceDefaultLabelHigh().length).toBeGreaterThan(0);
  });

  it('nutzt benutzerdefinierte Labels, wenn gesetzt', () => {
    expect(resolveConfidenceLabelLow('Geraten')).toBe('Geraten');
    expect(resolveConfidenceLabelHigh('Sicher')).toBe('Sicher');
  });

  it('faellt auf Standard-Labels zurück, wenn leer', () => {
    expect(resolveConfidenceLabelLow('')).toBe(confidenceDefaultLabelLow());
    expect(resolveConfidenceLabelHigh('   ')).toBe(confidenceDefaultLabelHigh());
    expect(resolveConfidenceLabelLow(null)).toBe(confidenceDefaultLabelLow());
  });
});
