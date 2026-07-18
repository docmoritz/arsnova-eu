import { PDFDict, PDFDocument, PDFName, StandardFonts } from 'pdf-lib';
import { chromium } from 'playwright';
import { describe, expect, it } from 'vitest';
import {
  encodeXmpUtf8,
  enhanceSessionResultsPdfUa,
  neutralizePdfUaInlineMarkup,
  sanitizeXmlText,
} from './session-results-report-pdf-ua.util';

describe('session-results-report-pdf-ua', () => {
  it('neutralisiert strong/em zu report-Klassen', () => {
    expect(neutralizePdfUaInlineMarkup('<p><strong class="x">A</strong> <em>B</em></p>')).toBe(
      '<p><span class="report-strong x">A</span> <span class="report-em">B</span></p>',
    );
  });

  it('encodiert XMP als gültiges UTF-8 inkl. BOM und Gedankenstrich', async () => {
    expect(sanitizeXmlText('A\u0014B')).toBe('AB');
    const bom = encodeXmpUtf8('<?xpacket begin="\uFEFF"?>');
    expect([...bom.slice(bom.indexOf(0x22) + 1, bom.indexOf(0x22) + 4)]).toEqual([
      0xef, 0xbb, 0xbf,
    ]);

    const doc = await PDFDocument.create();
    doc.addPage();
    const raw = await doc.save();
    const enhanced = await enhanceSessionResultsPdfUa(raw, {
      documentTitle: 'Didaktische Quiz-Auswertung — Praxis-Showcase: Team-Quiz',
      localeId: 'de',
      claimPdfUa: true,
    });
    const bytes = Buffer.from(enhanced);
    const begin = bytes.indexOf(Buffer.from('xpacket begin="'));
    expect(begin).toBeGreaterThanOrEqual(0);
    expect([...bytes.subarray(begin + 15, begin + 18)]).toEqual([0xef, 0xbb, 0xbf]);
    const titleIdx = bytes.indexOf(Buffer.from('Didaktische Quiz-Auswertung '));
    expect(titleIdx).toBeGreaterThanOrEqual(0);
    // UTF-8 Em-Dash U+2014 = E2 80 94, nicht Latin-1-Truncation 0x14
    expect([...bytes.subarray(titleIdx + 28, titleIdx + 31)]).toEqual([0xe2, 0x80, 0x94]);
    const xmpStart = bytes.indexOf(Buffer.from('<?xpacket begin'));
    const xmpEnd = bytes.indexOf(Buffer.from('<?xpacket end'), xmpStart);
    const xmp = bytes.subarray(xmpStart, xmpEnd + 20).toString('utf8');
    expect(xmp).toContain('pdfuaid:part');
    expect(xmp).toContain('—');
  });

  it('setzt Metadata, Lang, DisplayDocTitle und Link-Contents', async () => {
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.setContent(
        `<!doctype html><html lang="de"><head><title>T</title></head><body>
          <h1>Titel</h1>
          <p><a href="#ziel" title="Zum Ziel">Zum Ziel</a></p>
          <h2 id="ziel">Ziel</h2>
        </body></html>`,
        { waitUntil: 'load' },
      );
      const raw = await page.pdf({
        format: 'A4',
        tagged: true,
        outline: true,
        displayHeaderFooter: false,
        margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
      });
      const enhanced = await enhanceSessionResultsPdfUa(raw, {
        documentTitle: 'Didaktische Quiz-Auswertung',
        localeId: 'de',
        claimPdfUa: true,
      });
      const doc = await PDFDocument.load(enhanced);
      expect(doc.getTitle()).toBe('Didaktische Quiz-Auswertung');
      expect(doc.catalog.has(PDFName.of('Metadata'))).toBe(true);
      expect(doc.catalog.lookup(PDFName.of('Lang'))?.toString()).toContain('de');

      const viewerPrefs = doc.catalog.lookup(PDFName.of('ViewerPreferences'));
      expect(viewerPrefs).toBeInstanceOf(PDFDict);
      expect((viewerPrefs as PDFDict).lookup(PDFName.of('DisplayDocTitle'))?.toString()).toBe(
        'true',
      );

      const page0 = doc.getPage(0);
      const annots = page0.node.Annots();
      expect(annots).toBeTruthy();
      const link = annots!.lookup(0);
      expect(link).toBeInstanceOf(PDFDict);
      expect((link as PDFDict).has(PDFName.of('Contents'))).toBe(true);
    } finally {
      await browser.close();
    }
  }, 60_000);

  it('lässt ungültige PDFs unverändert', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText('x', { x: 10, y: 10, size: 12, font });
    // Minimales PDF ohne Tagging — enhance soll nicht werfen.
    const bytes = await doc.save();
    const out = await enhanceSessionResultsPdfUa(bytes, { documentTitle: 'X' });
    expect(out.byteLength).toBeGreaterThan(0);
  });
});
