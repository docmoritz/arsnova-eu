import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BLOCKING_IMPACTS = new Set(['serious', 'critical']);
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

function artifactName(label) {
  return label
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatViolation(violation) {
  const targets = violation.nodes
    .flatMap((node) => node.target)
    .slice(0, 5)
    .join(', ');
  return `${violation.id} (${violation.impact ?? 'unknown'}): ${violation.help}${targets ? ` [${targets}]` : ''}`;
}

export async function assertNoBlockingA11y(page, label, options = {}) {
  const include = options.include ?? 'body';
  const readySelector = options.readySelector ?? 'main';
  const artifactDir =
    options.artifactDir ??
    process.env.A11Y_ARTIFACT_DIR ??
    process.env.SMOKE_ARTIFACT_DIR ??
    'tmp/a11y-reports';

  await page.locator(readySelector).first().waitFor({ state: 'visible', timeout: 15_000 });

  const results = await new AxeBuilder({ page }).include(include).withTags(WCAG_TAGS).analyze();
  const blocking = results.violations.filter((violation) => BLOCKING_IMPACTS.has(violation.impact));

  await mkdir(artifactDir, { recursive: true });
  await writeFile(
    join(artifactDir, `${artifactName(label)}.json`),
    JSON.stringify(
      {
        label,
        url: page.url(),
        scannedAt: new Date().toISOString(),
        violations: results.violations,
        incomplete: results.incomplete,
      },
      null,
      2,
    ),
  );

  if (blocking.length === 0) {
    console.log(`OK axe ${label} (${results.violations.length} nicht-blockierende Befunde)`);
    return results;
  }

  throw new Error(
    `axe ${label}: ${blocking.length} serious/critical Verstoß/Verstöße\n${blocking
      .map(formatViolation)
      .join('\n')}`,
  );
}
