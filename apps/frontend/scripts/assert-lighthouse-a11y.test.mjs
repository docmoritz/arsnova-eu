import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { failedAccessibilityAudits } from './assert-lighthouse-a11y.mjs';

describe('failedAccessibilityAudits', () => {
  it('blockiert fehlgeschlagene Audits auch bei weight 0', () => {
    const failed = failedAccessibilityAudits({
      categories: {
        accessibility: {
          auditRefs: [
            { id: 'label-content-name-mismatch', weight: 0 },
            { id: 'color-contrast', weight: 7 },
          ],
        },
      },
      audits: {
        'label-content-name-mismatch': {
          score: 0,
          scoreDisplayMode: 'binary',
        },
        'color-contrast': {
          score: 1,
          scoreDisplayMode: 'binary',
        },
      },
    });

    assert.deepEqual(
      failed.map((ref) => ref.id),
      ['label-content-name-mismatch'],
    );
  });

  it('ignoriert manuelle und nicht anwendbare Audits', () => {
    const failed = failedAccessibilityAudits({
      categories: {
        accessibility: {
          auditRefs: [
            { id: 'logical-tab-order', weight: 0 },
            { id: 'td-has-header', weight: 0 },
          ],
        },
      },
      audits: {
        'logical-tab-order': {
          score: null,
          scoreDisplayMode: 'manual',
        },
        'td-has-header': {
          score: null,
          scoreDisplayMode: 'notApplicable',
        },
      },
    });

    assert.equal(failed.length, 0);
  });
});
