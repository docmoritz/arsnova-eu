import { describe, expect, it } from 'vitest';
import {
  answerOptionColor,
  answerOptionShape,
  answerOptionShapeKind,
  showQuestionTypeIndicator,
} from './answer-option-badge.util';

describe('answer-option-badge.util', () => {
  it('verwendet stabile Badge-Farben', () => {
    expect(answerOptionColor(0)).toBe('#1565c0');
    expect(answerOptionColor(8)).toBe('#1565c0');
  });

  it('macht Single-Choice mit Kreisen und Multiple-Choice mit Quadraten erkennbar', () => {
    expect(answerOptionShape(0, 'SINGLE_CHOICE', true)).toBe('○');
    expect(answerOptionShape(3, 'SINGLE_CHOICE', true)).toBe('○');
    expect(answerOptionShape(0, 'MULTIPLE_CHOICE', true)).toBe('□');
    expect(answerOptionShape(3, 'MULTIPLE_CHOICE', true)).toBe('□');
    expect(answerOptionShapeKind(0, 'SINGLE_CHOICE', true)).toBe('circle');
    expect(answerOptionShapeKind(0, 'MULTIPLE_CHOICE', true)).toBe('square');
  });

  it('laesst Umfragen und deaktivierte Indikatoren bei gemischten Formen', () => {
    expect(answerOptionShape(0, 'SURVEY', true)).toBe('△');
    expect(answerOptionShape(1, 'SURVEY', true)).toBe('○');
    expect(answerOptionShape(0, 'SINGLE_CHOICE', false)).toBe('△');
    expect(answerOptionShape(1, 'MULTIPLE_CHOICE', false)).toBe('○');
  });

  it('wertet nur explizit false als ausgeblendet', () => {
    expect(showQuestionTypeIndicator(undefined)).toBe(true);
    expect(showQuestionTypeIndicator(true)).toBe(true);
    expect(showQuestionTypeIndicator(false)).toBe(false);
  });
});
