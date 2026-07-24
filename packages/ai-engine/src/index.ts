import { AnalyzerIssue } from '@auditpilot/analyzers';

import { generateRecommendations } from './recommendations.js';
import { hypothesizeRootCauses } from './root-cause.js';
import { summarizeIssuesWithProvider } from './summarizer.js';
import { SummaryProvider } from './types.js';

export * from './types.js';
export * from './summarizer.js';
export * from './root-cause.js';
export * from './recommendations.js';

export type AiEngineModule = {
  name: string;
  purpose: string;
};

export const aiEngineModule: AiEngineModule = {
  name: '@auditpilot/ai-engine',
  purpose: 'Summarize scan evidence, prioritize issues, and generate recommendations.',
};

export async function runAiEngine(issues: AnalyzerIssue[], summaryProvider?: SummaryProvider) {
  const [summary, rootCauses, recommendations] = await Promise.all([
    summarizeIssuesWithProvider(issues, summaryProvider),
    Promise.resolve(hypothesizeRootCauses(issues)),
    Promise.resolve(generateRecommendations(issues)),
  ]);

  return { summary, rootCauses, recommendations };
}
