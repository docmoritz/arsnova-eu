import { PDFDict, PDFDocument, PDFName, PDFString } from 'pdf-lib';

export interface EnhanceSessionResultsPdfUaOptions {
  /** Dokumenttitel für Info-Dict + XMP (dc:title). */
  documentTitle?: string;
  /** BCP-47 / ISO-Sprache für Catalog Lang + XMP (z. B. de, en). */
  localeId?: string;
  /**
   * `pdfuaid:part=1` nur setzen, wenn das Dokument tatsächlich PDF/UA-sicher gerendert wurde.
   * Standard: false (kein falscher UA-Claim für visuelle Exporte).
   */
  claimPdfUa?: boolean;
}

/** Entfernt in XML 1.0 unzulässige Steuerzeichen (behält Tab/LF/CR). */
export function sanitizeXmlText(value: string): string {
  let out = '';
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 && code !== 0x9 && code !== 0xa && code !== 0xd) {
      continue;
    }
    out += ch;
  }
  return out;
}

function escapeXml(value: string): string {
  return sanitizeXmlText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** XMP als UTF-8-Bytes — pdf-lib encodiert Strings sonst Latin-1 (BOM→0xFF, —→0x14). */
export function encodeXmpUtf8(xmp: string): Uint8Array {
  return new TextEncoder().encode(xmp);
}

function pdfStringish(value: unknown): string {
  if (!value) return '';
  const raw = String(value);
  // pdf-lib toString für PDFString ist oft `(text)` bzw. `/Name`.
  return raw.replace(/^\(|\)$/g, '').replace(/^\//, '');
}

function linkContentsFromAnnot(annot: PDFDict): string {
  const action = annot.lookup(PDFName.of('A'));
  if (action instanceof PDFDict) {
    const uri = action.lookup(PDFName.of('URI'));
    if (uri) {
      const target = pdfStringish(uri);
      return target.startsWith('#') ? `Link ${target.slice(1)}` : `Link ${target}`;
    }
    const d = action.lookup(PDFName.of('D'));
    if (d) {
      return `Link ${pdfStringish(d)}`;
    }
  }
  const dest = annot.lookup(PDFName.of('Dest'));
  if (dest) {
    return `Link ${pdfStringish(dest)}`;
  }
  return 'Link';
}

/**
 * PDF/UA-Nachbearbeitung für Chromium-getaggte Session-PDFs:
 * XMP-Metadata, Lang, DisplayDocTitle, RoleMap (Strong/Em), Link-Contents.
 *
 * Voraussetzung: semantisches HTML + kein untagged Header/Footer-Template.
 */
export async function enhanceSessionResultsPdfUa(
  pdfBytes: Uint8Array,
  options: EnhanceSessionResultsPdfUaOptions = {},
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes.slice());
    const title = options.documentTitle?.trim() || pdfDoc.getTitle()?.trim() || 'arsnova.eu';
    const lang = (options.localeId ?? 'de').trim().slice(0, 2).toLowerCase() || 'de';
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

    pdfDoc.setTitle(title);
    pdfDoc.setLanguage(lang);
    pdfDoc.setProducer('arsnova.eu');
    pdfDoc.setCreator('arsnova.eu');

    let viewerPrefs = pdfDoc.catalog.lookup(PDFName.of('ViewerPreferences'));
    if (!(viewerPrefs instanceof PDFDict)) {
      viewerPrefs = pdfDoc.context.obj({}) as PDFDict;
      pdfDoc.catalog.set(PDFName.of('ViewerPreferences'), viewerPrefs);
    }
    (viewerPrefs as PDFDict).set(PDFName.of('DisplayDocTitle'), pdfDoc.context.obj(true));

    const structTreeRoot = pdfDoc.catalog.lookup(PDFName.of('StructTreeRoot'));
    if (structTreeRoot instanceof PDFDict) {
      let roleMap = structTreeRoot.lookup(PDFName.of('RoleMap'));
      if (!(roleMap instanceof PDFDict)) {
        roleMap = pdfDoc.context.obj({}) as PDFDict;
        structTreeRoot.set(PDFName.of('RoleMap'), roleMap);
      }
      (roleMap as PDFDict).set(PDFName.of('Strong'), PDFName.of('Span'));
      (roleMap as PDFDict).set(PDFName.of('Em'), PDFName.of('Span'));
    }

    for (const page of pdfDoc.getPages()) {
      const annots = page.node.Annots();
      if (!annots) continue;
      for (let i = 0; i < annots.size(); i++) {
        const annot = annots.lookup(i);
        if (!(annot instanceof PDFDict)) continue;
        if (annot.lookup(PDFName.of('Subtype'))?.toString() !== '/Link') continue;
        if (annot.has(PDFName.of('Contents'))) continue;
        annot.set(PDFName.of('Contents'), PDFString.of(linkContentsFromAnnot(annot)));
      }
    }

    const claimPdfUa = options.claimPdfUa === true;
    const pdfUaNs = claimPdfUa
      ? `
      xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/"`
      : '';
    const pdfUaPart = claimPdfUa ? '\n      <pdfuaid:part>1</pdfuaid:part>' : '';
    const safeTitle = escapeXml(title);
    const xmp = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      xmlns:pdf="http://ns.adobe.com/pdf/1.3/"${pdfUaNs}>
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${safeTitle}</rdf:li></rdf:Alt></dc:title>
      <dc:language><rdf:Bag><rdf:li>${escapeXml(lang)}</rdf:li></rdf:Bag></dc:language>
      <xmp:CreatorTool>arsnova.eu</xmp:CreatorTool>
      <xmp:CreateDate>${now}</xmp:CreateDate>
      <xmp:ModifyDate>${now}</xmp:ModifyDate>
      <pdf:Producer>arsnova.eu</pdf:Producer>${pdfUaPart}
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

    const metadataStream = pdfDoc.context.stream(encodeXmpUtf8(xmp), {
      Type: 'Metadata',
      Subtype: 'XML',
    });
    pdfDoc.catalog.set(PDFName.of('Metadata'), pdfDoc.context.register(metadataStream));

    return pdfDoc.save({ useObjectStreams: false });
  } catch {
    return pdfBytes;
  }
}

function replaceInlineTagWithClass(tag: 'strong' | 'em', className: string, html: string): string {
  const open = new RegExp(`<${tag}\\b([^>]*)>`, 'gi');
  return html
    .replace(open, (_match, attrs: string) => {
      if (/\bclass\s*=/.test(attrs)) {
        return `<span${attrs.replace(/\bclass\s*=\s*(["'])/i, `class=$1${className} `)}>`;
      }
      return `<span class="${className}"${attrs}>`;
    })
    .replace(new RegExp(`</${tag}>`, 'gi'), '</span>');
}

/**
 * Ersetzt Chromium-nicht-standard `<strong>`/`<em>` durch Span-Klassen,
 * damit der PDF-Strukturbaum ohne RoleMap-Lücken auskommt.
 */
export function neutralizePdfUaInlineMarkup(html: string): string {
  return replaceInlineTagWithClass(
    'em',
    'report-em',
    replaceInlineTagWithClass('strong', 'report-strong', html),
  );
}
