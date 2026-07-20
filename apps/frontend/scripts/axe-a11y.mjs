import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** WCAG 2.0/2.1/2.2 A + AA. Best-practice-only Regeln sind bewusst nicht enthalten. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Optional versionierte Allowlist. Jeder Eintrag braucht Regel-ID, Selektor,
 * Begründung, Verantwortliche:n und Ablaufdatum (ISO).
 * @typedef {{ id: string, selector?: string, reason: string, owner: string, expires: string }} AxeAllowlistEntry
 */
const ALLOWLIST = /** @type {AxeAllowlistEntry[]} */ ([]);

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

function isAllowlisted(violation) {
  const today = new Date().toISOString().slice(0, 10);
  return ALLOWLIST.some((entry) => {
    if (entry.id !== violation.id || entry.expires < today) return false;
    if (!entry.selector) return true;
    return violation.nodes.some((node) =>
      node.target.some((target) => String(target).includes(entry.selector)),
    );
  });
}

/**
 * Blockiert jeden WCAG-A/AA-Verstoß unabhängig vom axe-Impact.
 * Impact beschreibt Nutzerwirkung, nicht die Konformitätsstufe.
 */
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
  const blocking = results.violations.filter((violation) => !isAllowlisted(violation));
  const allowlisted = results.violations.filter((violation) => isAllowlisted(violation));

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
        allowlisted,
      },
      null,
      2,
    ),
  );

  if (results.incomplete.length > 0) {
    console.warn(
      `axe ${label}: ${results.incomplete.length} incomplete Regel(n) zur manuellen Prüfung: ${results.incomplete
        .map((item) => item.id)
        .join(', ')}`,
    );
  }

  if (blocking.length === 0) {
    console.log(
      `OK axe ${label} (${results.violations.length} WCAG-Verstoß/Verstöße, ${allowlisted.length} allowlisted)`,
    );
    return results;
  }

  throw new Error(
    `axe ${label}: ${blocking.length} WCAG-A/AA-Verstoß/Verstöße\n${blocking
      .map(formatViolation)
      .join('\n')}`,
  );
}
