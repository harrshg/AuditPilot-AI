import { AnalyzerIssue } from '@auditpilot/analyzers';

import { RootCauseHypothesis } from './types.js';

const CATEGORY_HYPOTHESES: Record<string, string> = {
  SECURITY: 'Likely caused by missing or misconfigured server-side security headers/middleware.',
  SERVER_CONFIG: 'Likely caused by default or incomplete web server / reverse proxy configuration.',
  PERFORMANCE: 'Likely caused by unoptimized assets, missing caching, or an inefficient backend query.',
  FRONTEND: 'Likely caused by an unhandled exception or a missing null/undefined check in client-side code.',
  BACKEND_API: 'Likely caused by an unhandled server-side exception, a downstream dependency failure, or an invalid request contract.',
  NETWORK: 'Likely caused by an unstable upstream dependency, timeout, or intermittent connectivity issue.',
  ACCESSIBILITY: 'Likely caused by markup that omits semantic HTML or ARIA attributes.',
  RELIABILITY: 'Likely caused by an unhandled edge case or missing fallback/error page.',
  TEST_COVERAGE: 'Likely caused by this code path not having automated test coverage.',
};

export function hypothesizeRootCause(issue: AnalyzerIssue): RootCauseHypothesis {
  const baseHypothesis = CATEGORY_HYPOTHESES[issue.category]
    ?? 'Root cause requires manual investigation; no rule-based hypothesis is available for this category.';

  const confidence = issue.evidence && Object.keys(issue.evidence).length > 0 ? 'medium' : 'low';

  return {
    issueTitle: issue.title,
    hypothesis: baseHypothesis,
    confidence: issue.severity === 'CRITICAL' || issue.severity === 'HIGH' ? confidence : 'low',
  };
}

export function hypothesizeRootCauses(issues: AnalyzerIssue[]): RootCauseHypothesis[] {
  return issues.map(hypothesizeRootCause);
}
