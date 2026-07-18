#!/usr/bin/env node
/**
 * Erzeugt einen PDF-Ergebnisbericht aus dem Demo-Quiz-Unterrichtsszenario (30 TN).
 *
 * Run (Backend muss laufen):
 *   npm run generate:session-pdf-demo -w @arsnova/frontend
 *
 * Optional:
 *   SESSION_CODE=ABC123 TRPC_URL=http://127.0.0.1:3000/trpc \
 *   OUTPUT=output/pdf/demo-session-results-30.pdf \
 *   PDF_PROFILE=visual|pdfUa|both \
 *   npm run generate:session-pdf-demo -w @arsnova/frontend
 *
 * Standard (PDF_PROFILE=both): schreibt beide Profile nach
 *   apps/frontend/src/assets/demo/demo-session-results-30.pdf
 *   apps/frontend/src/assets/demo/demo-session-results-30-pdfua.pdf
 *
 * Standardmäßig wird das PDF lokal per Playwright aus dem frisch gerenderten HTML
 * erzeugt (aktueller Workspace-Stand). USE_BACKEND_PDF=1 testet zusätzlich die Backend-Route.
 *
 * Ohne SESSION_CODE wird zuerst scripts/load/demo-quiz-classroom-30.mjs ausgeführt.
 */
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { createTRPCProxyClient, httpLink } from '@trpc/client';
import { chromium } from 'playwright';
import {
  buildSessionResultsReportHtml,
  getDefaultSessionResultsReportLabelsDe,
} from '../src/app/core/session-results-report.util';
import {
  inlineExportImagesInHtml,
  buildSessionResultsPlaywrightPdfOptions,
  buildQuestionContinuationStamps,
  stampQuestionContinuationsOnPdf,
} from '@arsnova/session-export-report';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');
const FRONTEND_ASSET_ROOT = join(REPO_ROOT, 'apps/frontend/src/assets');

async function readDemoLocalAsset(relativePath: string): Promise<Uint8Array | null> {
  try {
    const data = await readFile(join(FRONTEND_ASSET_ROOT, relativePath));
    return new Uint8Array(data);
  } catch {
    return null;
  }
}
const TRPC_URL = String(process.env.TRPC_URL || 'http://127.0.0.1:3000/trpc').trim();
const ASSET_BASE_URL = String(
  process.env.SESSION_EXPORT_ASSET_BASE_URL ||
    process.env.PUBLIC_FRONTEND_URL ||
    'http://127.0.0.1:4200',
).replace(/\/$/, '');
const SESSION_CODE = String(process.env.SESSION_CODE || '')
  .trim()
  .toUpperCase();
const PARTICIPANTS = Math.max(1, Number(process.env.PARTICIPANTS || 30));
const QUIZ_CONTENT_LOCALE = String(process.env.QUIZ_CONTENT_LOCALE || 'de')
  .trim()
  .slice(0, 2)
  .toLowerCase();
const DEMO_ASSETS_DIR = join(FRONTEND_ASSET_ROOT, 'demo');
const DEFAULT_VISUAL_OUTPUT = join(DEMO_ASSETS_DIR, 'demo-session-results-30.pdf');
const DEFAULT_PDFUA_OUTPUT = join(DEMO_ASSETS_DIR, 'demo-session-results-30-pdfua.pdf');
const OUTPUT_ENV = process.env.OUTPUT ? resolve(process.env.OUTPUT) : '';
const PDF_PROFILE_RAW = String(process.env.PDF_PROFILE || 'both')
  .trim()
  .toLowerCase();
type DemoPdfProfile = 'visual' | 'pdfUa';
const PDF_PROFILES: DemoPdfProfile[] =
  PDF_PROFILE_RAW === 'visual'
    ? ['visual']
    : PDF_PROFILE_RAW === 'pdfua'
      ? ['pdfUa']
      : ['visual', 'pdfUa'];

function createTrpcClient(hostToken?: string) {
  return createTRPCProxyClient({
    links: [
      httpLink({
        url: TRPC_URL,
        headers: hostToken ? () => ({ 'x-host-token': hostToken }) : undefined,
      }),
    ],
  });
}

async function mintHostToken(sessionCode: string): Promise<string> {
  const hostTokenEnv = String(process.env.HOST_TOKEN || '').trim();
  if (hostTokenEnv) {
    return hostTokenEnv;
  }

  const backendDir = join(REPO_ROOT, 'apps/backend');
  const script = `
    import { createHostSessionToken } from './src/lib/hostAuth.ts';
    createHostSessionToken(${JSON.stringify(sessionCode)})
      .then((token) => {
        console.log(token);
        process.exit(0);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  `;
  const { stdout } = await execFileAsync('npx', ['tsx', '-e', script], {
    cwd: backendDir,
    encoding: 'utf8',
  });
  const token = stdout.trim();
  if (!token) {
    throw new Error(`Host-Token für Session ${sessionCode} konnte nicht erzeugt werden.`);
  }
  return token;
}

async function waitForTrpc(client: ReturnType<typeof createTrpcClient>, attempts = 40) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      await client.health.check.query();
      return;
    } catch {
      await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    }
  }
  throw new Error(`tRPC ist nicht erreichbar: ${TRPC_URL}`);
}

async function runDemoClassroomScenario(): Promise<string> {
  const scriptPath = join(REPO_ROOT, 'scripts/load/demo-quiz-classroom-30.mjs');
  const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      PARTICIPANTS: String(PARTICIPANTS),
      TRPC_URL,
      // PDF-Demo: lokale Runner-Last darf das p95-Smoke-Gate nicht blockieren
      VOTE_P95_LIMIT_MS: String(process.env.VOTE_P95_LIMIT_MS || 3_000),
    },
    maxBuffer: 10 * 1024 * 1024,
  });
  const jsonMatch = stdout.match(/\{[\s\S]*"code"\s*:\s*"[A-Z0-9]{6}"[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Demo-Szenario lieferte keinen Session-Code in der Ausgabe.');
  }
  const summary = JSON.parse(jsonMatch[0]) as { code?: string };
  if (!summary.code) {
    throw new Error('Demo-Szenario-Summary ohne code-Feld.');
  }
  return summary.code.toUpperCase();
}

async function renderLocalPlaywrightPdf(
  html: string,
  labels: ReturnType<typeof getDefaultSessionResultsReportLabelsDe>,
  exportData: {
    quizName: string;
    sessionCode: string;
    questions: { questionOrder: number; questionTextShort: string }[];
  },
  profile: DemoPdfProfile,
): Promise<Buffer> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const raw = await page.pdf(
      buildSessionResultsPlaywrightPdfOptions(
        labels,
        {
          quizName: exportData.quizName,
          sessionCode: exportData.sessionCode,
        },
        profile,
      ),
    );
    const documentTitle = `${labels.documentTitle} — ${exportData.quizName}`;
    const stamped = await stampQuestionContinuationsOnPdf(
      new Uint8Array(raw),
      buildQuestionContinuationStamps(exportData, labels),
      { documentTitle, localeId: 'de', claimPdfUa: profile === 'pdfUa' },
    );
    return Buffer.from(stamped);
  } finally {
    await browser.close();
  }
}

function resolveProfileOutput(profile: DemoPdfProfile): string {
  if (OUTPUT_ENV) {
    if (PDF_PROFILES.length === 1) {
      return OUTPUT_ENV.endsWith('.pdf')
        ? OUTPUT_ENV
        : join(OUTPUT_ENV, `demo-session-results-30${profile === 'pdfUa' ? '-pdfua' : ''}.pdf`);
    }
    const base = OUTPUT_ENV.endsWith('.pdf') ? OUTPUT_ENV.replace(/\.pdf$/i, '') : OUTPUT_ENV;
    return `${base}${profile === 'pdfUa' ? '-pdfua' : ''}.pdf`;
  }
  return profile === 'pdfUa' ? DEFAULT_PDFUA_OUTPUT : DEFAULT_VISUAL_OUTPUT;
}

async function run() {
  const bootstrapClient = createTrpcClient();
  await waitForTrpc(bootstrapClient);

  const code = SESSION_CODE || (await runDemoClassroomScenario());
  const hostToken = await mintHostToken(code);
  const client = createTrpcClient(hostToken);

  const exportData = await client.session.getExportData.query({ code });
  const labels = getDefaultSessionResultsReportLabelsDe();
  const useBackendPdf = String(process.env.USE_BACKEND_PDF || '').trim() === '1';
  const outputs: { profile: DemoPdfProfile; pdfPath: string; htmlPath: string }[] = [];

  for (const profile of PDF_PROFILES) {
    let html = buildSessionResultsReportHtml(exportData, labels, {
      localeId: 'de',
      generatedAt: new Date().toISOString(),
      assetBaseUrl: ASSET_BASE_URL,
      pageNumbersViaCss: false,
      pdfUaSafeVisuals: profile === 'pdfUa',
      quizContentLocale: QUIZ_CONTENT_LOCALE,
      includeTeachingNotes: true,
    });

    html = await inlineExportImagesInHtml(html, {
      readLocalAsset: readDemoLocalAsset,
      fetchExternal: true,
    });

    const pdfPath = resolveProfileOutput(profile);
    // HTML-Debugausgaben nicht unter src/assets ablegen (nur PDFs gehören dorthin).
    const htmlPath =
      pdfPath.includes('/assets/demo/') || pdfPath.includes('\\assets\\demo\\')
        ? join(
            REPO_ROOT,
            'output/pdf',
            profile === 'pdfUa'
              ? 'demo-session-results-30-pdfua.html'
              : 'demo-session-results-30.html',
          )
        : pdfPath.replace(/\.pdf$/i, '.html');

    await mkdir(dirname(pdfPath), { recursive: true });
    await mkdir(dirname(htmlPath), { recursive: true });
    await writeFile(htmlPath, html, 'utf8');

    let pdfBuffer: Buffer;
    if (useBackendPdf) {
      try {
        const serverPdf = await client.session.getSessionExportPdf.query({
          code,
          localeId: 'de',
          profile,
        });
        pdfBuffer = Buffer.from(serverPdf.contentBase64, 'base64');
      } catch (error) {
        console.warn('Backend-PDF fehlgeschlagen, fallback auf lokales Playwright:', error);
        pdfBuffer = await renderLocalPlaywrightPdf(html, labels, exportData, profile);
      }
    } else {
      pdfBuffer = await renderLocalPlaywrightPdf(html, labels, exportData, profile);
    }
    await writeFile(pdfPath, pdfBuffer);
    outputs.push({ profile, pdfPath, htmlPath });
  }

  console.log(
    JSON.stringify(
      {
        sessionCode: code,
        participantCount: exportData.participantCount,
        questionCount: exportData.questions.length,
        hasConfidenceSummary: Boolean(exportData.confidenceSummary),
        profiles: outputs,
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
