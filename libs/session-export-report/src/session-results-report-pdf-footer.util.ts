import type { SessionResultsReportLabels } from './labels-de';

export type SessionResultsPdfProfile = 'visual' | 'pdfUa';

const PDF_PAGE_MARGINS_VISUAL = {
  /** Platz für Header-Template; Content-Abstand steuert vor allem CSS `@page`. */
  top: '18mm',
  right: '14mm',
  bottom: '20mm',
  left: '14mm',
} as const;

const PDF_PAGE_MARGINS_PDF_UA = {
  /** Gleichmäßige Ränder ohne Playwright-Header/Footer (PDF/UA). */
  top: '14mm',
  right: '14mm',
  bottom: '14mm',
  left: '14mm',
} as const;

export interface SessionResultsPdfHeaderContext {
  quizName: string;
  sessionCode: string;
}

function escapeCssString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Entfernt Demo-Timestamps und kürzt für die laufende Kopfzeile. */
export function displayQuizNameForPdfHeader(quizName: string, maxLength = 64): string {
  let cleaned = quizName.trimEnd();
  const demoMarker = ' · Didaktik-Demo ';
  const demoIdx = cleaned.lastIndexOf(demoMarker);
  if (demoIdx >= 0) {
    const suffix = cleaned.slice(demoIdx + demoMarker.length).trim();
    if (/^\d{10,}$/u.test(suffix)) {
      cleaned = cleaned.slice(0, demoIdx).trimEnd();
    }
  }
  const trailingDigits = cleaned.match(/ \d{13,}$/u);
  if (trailingDigits) {
    cleaned = cleaned.slice(0, cleaned.length - trailingDigits[0].length).trimEnd();
  }
  cleaned = cleaned.trim();
  return (cleaned || quizName).slice(0, maxLength);
}

/** Playwright/Chromium `headerTemplate` für laufenden Seitenkopf. */
export function buildSessionResultsPdfHeaderTemplate(
  header: SessionResultsPdfHeaderContext,
): string {
  const title = escapeHtml(displayQuizNameForPdfHeader(header.quizName));
  const code = escapeHtml(header.sessionCode);
  return `<div style="width:100%;font-size:8px;color:#5c6570;font-family:Segoe UI,system-ui,sans-serif;padding:3mm 14mm 3mm;border-bottom:1px solid #d8dee6;display:flex;justify-content:space-between;box-sizing:border-box;">
    <span>${title}</span>
    <span>${code}</span>
  </div>`;
}

/** Playwright/Chromium `footerTemplate` für `page.pdf({ displayHeaderFooter: true })`. */
export function buildSessionResultsPdfFooterTemplate(labels: SessionResultsReportLabels): string {
  const text = labels.pageNumberFooter
    .replace('{0}', '<span class="pageNumber"></span>')
    .replace('{1}', '<span class="totalPages"></span>');
  return `<div style="width:100%;font-size:9px;color:#5c6570;font-family:Segoe UI,system-ui,sans-serif;text-align:center;padding:0 14mm;">${text}</div>`;
}

/** Zusätzliches `@page`-CSS für Browser-Druck mit lokalisiertem Seitenfuß. */
export function buildSessionResultsPrintPageFooterCss(labels: SessionResultsReportLabels): string {
  const segments = labels.pageNumberFooter.split(/\{0\}|\{1\}/);
  const before = segments[0] ?? '';
  const between = segments[1] ?? ' / ';
  const after = segments[2] ?? '';
  const content = [
    before ? `"${escapeCssString(before)}"` : null,
    'counter(page)',
    `"${escapeCssString(between)}"`,
    'counter(pages)',
    after ? `"${escapeCssString(after)}"` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return `@page { margin-bottom: ${PDF_PAGE_MARGINS_VISUAL.bottom}; @bottom-center { content: ${content}; font: 9pt/1.2 "Segoe UI", system-ui, sans-serif; color: #5c6570; } }`;
}

export function buildSessionResultsPlaywrightPdfOptions(
  labels: SessionResultsReportLabels,
  header: SessionResultsPdfHeaderContext,
  profile: SessionResultsPdfProfile = 'visual',
) {
  if (profile === 'pdfUa') {
    // Header/Footer-Templates erzeugen untagged Content (veraPDF 7.1/3).
    return {
      format: 'A4' as const,
      printBackground: true,
      displayHeaderFooter: false,
      margin: { ...PDF_PAGE_MARGINS_PDF_UA },
      tagged: true,
      outline: true,
    };
  }

  return {
    format: 'A4' as const,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: buildSessionResultsPdfHeaderTemplate(header),
    footerTemplate: buildSessionResultsPdfFooterTemplate(labels),
    margin: { ...PDF_PAGE_MARGINS_VISUAL },
    /** Chromium-getaggtes PDF (Strukturbaum); kein vollständiges PDF/UA. */
    tagged: true,
    outline: true,
  };
}
