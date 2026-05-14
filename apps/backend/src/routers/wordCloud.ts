import {
  type AnalyzeWordCloudInput,
  AnalyzeWordCloudInputSchema,
  AnalyzeWordCloudOutputSchema,
  type AnalyzeWordCloudOutput,
} from '@arsnova/shared-types';
import {
  buildLexicalWordCloudEntries,
  buildThemeWordCloudAnalysis,
} from '../lib/wordCloudAnalysis';
import { hostProcedure, router } from '../trpc';

function buildFallbackAnalysisResult(input: AnalyzeWordCloudInput): AnalyzeWordCloudOutput {
  const entries = buildLexicalWordCloudEntries(input.items, input.maxEntries);

  return AnalyzeWordCloudOutputSchema.parse({
    mode: input.mode,
    locale: input.locale,
    metric: input.metric,
    generatedAt: new Date().toISOString(),
    fallbackUsed: input.mode === 'THEME',
    entries,
  });
}

function buildThemeAnalysisResult(input: AnalyzeWordCloudInput): AnalyzeWordCloudOutput {
  const analysis = buildThemeWordCloudAnalysis(input);
  if (!analysis.usedThemeAnchors || analysis.entries.length === 0) {
    return buildFallbackAnalysisResult(input);
  }

  return AnalyzeWordCloudOutputSchema.parse({
    mode: input.mode,
    locale: input.locale,
    metric: input.metric,
    generatedAt: new Date().toISOString(),
    fallbackUsed: false,
    entries: analysis.entries,
  });
}

/**
 * Word-Cloud-Analysepfad für 3.0.
 * Themenmodus nutzt einen deterministischen, erklärbaren Backend-Analyzer.
 */
export const wordCloudRouter = router({
  analyze: hostProcedure
    .input(AnalyzeWordCloudInputSchema)
    .output(AnalyzeWordCloudOutputSchema)
    .mutation(({ input }) =>
      input.mode === 'THEME' ? buildThemeAnalysisResult(input) : buildFallbackAnalysisResult(input),
    ),
});
