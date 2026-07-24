import { AnalyzerIssue, IssueSeverity } from '@auditpilot/analyzers';

import { IssueSummary, SummaryProvider } from './types.js';

const SEVERITY_ORDER: IssueSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

export function summarizeIssues(issues: AnalyzerIssue[]): IssueSummary {
  const bySeverity = SEVERITY_ORDER.reduce((acc, severity) => {
    acc[severity] = 0;
    return acc;
  }, {} as Record<IssueSeverity, number>);

  const byCategory: IssueSummary['byCategory'] = {};

  for (const issue of issues) {
    bySeverity[issue.severity] += 1;
    byCategory[issue.category] = (byCategory[issue.category] ?? 0) + 1;
  }

  return {
    totalIssues: issues.length,
    bySeverity,
    byCategory,
    summaryText: buildSummaryText(issues, bySeverity),
  };
}

function buildSummaryText(issues: AnalyzerIssue[], bySeverity: Record<IssueSeverity, number>): string {
  if (issues.length === 0) {
    return 'No issues were detected during this scan.';
  }

  const criticalAndHigh = bySeverity.CRITICAL + bySeverity.HIGH;
  const topCategories = [...new Set(issues.map((issue) => issue.category))].slice(0, 3).join(', ');

  return `Found ${issues.length} issue(s) across categories including ${topCategories}. ` +
    `${criticalAndHigh} of these are critical or high severity and should be prioritized first.`;
}

/**
 * Summarize issues using a pluggable async provider (e.g. an LLM call), falling back
 * to the deterministic rule-based summary if no provider is configured or the
 * provider call fails. This keeps the engine functional without requiring an
 * external API key while allowing real LLM integration to be wired in later.
 */
export async function summarizeIssuesWithProvider(
  issues: AnalyzerIssue[],
  provider?: SummaryProvider,
): Promise<IssueSummary> {
  const deterministicSummary = summarizeIssues(issues);

  if (!provider) {
    return deterministicSummary;
  }

  try {
    const summaryText = await provider(issues);
    return { ...deterministicSummary, summaryText };
  } catch {
    return deterministicSummary;
  }
}
