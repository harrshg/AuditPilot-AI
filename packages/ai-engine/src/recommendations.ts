import { AnalyzerIssue, IssueSeverity } from '@auditpilot/analyzers';

import { GeneratedRecommendation } from './types.js';

const SEVERITY_PRIORITY: Record<IssueSeverity, number> = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  INFO: 5,
};

const CATEGORY_EFFORT: Record<string, string> = {
  SECURITY: 'small',
  SERVER_CONFIG: 'small',
  PERFORMANCE: 'medium',
  FRONTEND: 'medium',
  BACKEND_API: 'medium',
  NETWORK: 'medium',
  ACCESSIBILITY: 'small',
  RELIABILITY: 'medium',
  TEST_COVERAGE: 'small',
};

export function generateRecommendations(issues: AnalyzerIssue[]): GeneratedRecommendation[] {
  return issues.map((issue) => ({
    issueTitle: issue.title,
    title: `Fix: ${issue.title}`,
    detail: issue.recommendationText ?? `Investigate and resolve: ${issue.description}`,
    priority: SEVERITY_PRIORITY[issue.severity],
    estimatedEffort: CATEGORY_EFFORT[issue.category] ?? 'medium',
  }));
}
