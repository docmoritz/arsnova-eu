#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const inputPaths = process.argv.slice(2);
if (inputPaths.length === 0) {
  inputPaths.push('lighthouse-a11y-report.json');
}

async function collectJsonFiles(path) {
  const absolutePath = resolve(path);
  const fileStat = await stat(absolutePath);
  if (fileStat.isFile()) {
    return absolutePath.endsWith('.json') ? [absolutePath] : [];
  }

  const entries = await readdir(absolutePath, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => collectJsonFiles(resolve(absolutePath, entry.name))),
  );
  return nested.flat();
}

function failedAccessibilityAudits(report) {
  const refs = report.categories?.accessibility?.auditRefs ?? [];
  return refs.filter((ref) => {
    const audit = report.audits?.[ref.id];
    return (ref.weight ?? 0) > 0 && (audit?.score === 0 || audit?.score === false);
  });
}

let checked = 0;
let failures = 0;

for (const inputPath of inputPaths) {
  const files = await collectJsonFiles(inputPath);
  for (const file of files) {
    const report = JSON.parse(await readFile(file, 'utf8'));
    if (!report.categories?.accessibility || !report.audits) {
      continue;
    }

    checked += 1;
    const score = report.categories.accessibility.score;
    const failed = failedAccessibilityAudits(report);
    const url = report.finalDisplayedUrl ?? report.finalUrl ?? file;

    if (score == null || score < 0.9 || failed.length > 0) {
      failures += 1;
      console.error(
        `FEHLER Lighthouse A11y ${url}: Score=${score ?? 'n/a'}, Audits=${
          failed.map((ref) => ref.id).join(', ') || 'keine'
        }`,
      );
    } else {
      console.log(`OK Lighthouse A11y ${url}: Score=${Math.round(score * 100)}, alle Audits grün`);
    }
  }
}

if (checked === 0) {
  console.error('Keine Lighthouse-Berichte mit Accessibility-Kategorie gefunden.');
  process.exit(1);
}
if (failures > 0) {
  process.exit(1);
}

console.log(`Lighthouse-A11y-Gate bestanden (${checked} Bericht/Berichte).`);
