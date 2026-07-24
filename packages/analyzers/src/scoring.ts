import { AnalyzerIssue, IssueCategory, ScanScores } from './types.js';

const SEVERITY_PENALTY: Record<AnalyzerIssue['severity'], number> = {
  CRITICAL: 25,
  HIGH: 14,
  MEDIUM: 7,
  LOW: 3,
  INFO: 1,
};

const CATEGORY_SCORE_FIELD: Partial<Record<IssueCategory, keyof ScanScores>> = {
  SECURITY: 'securityScore',
  SERVER_CONFIG: 'securityScore',
  PERFORMANCE: 'performanceScore',
  FRONTEND: 'frontendQualityScore',
  BACKEND_API: 'backendApiScore',
  NETWORK: 'reliabilityScore',
  RELIABILITY: 'reliabilityScore',
  ACCESSIBILITY: 'accessibilityScore',
  TEST_COVERAGE: 'testCoverageScore',
};

export function computeScores(issues: AnalyzerIssue[]): ScanScores {
  const dimensionTotals = new Map<keyof ScanScores, number>();
  const dimensionsTouched = new Set<keyof ScanScores>();

  for (const issue of issues) {
    const field = CATEGORY_SCORE_FIELD[issue.category];
    if (!field) {
      continue;
    }

    dimensionsTouched.add(field);
    const current = dimensionTotals.get(field) ?? 100;
    dimensionTotals.set(field, Math.max(0, current - SEVERITY_PENALTY[issue.severity]));
  }

  const scores: ScanScores = {};

  for (const field of dimensionsTouched) {
    scores[field] = dimensionTotals.get(field) ?? 100;
  }

  const presentScores = Object.values(scores).filter((value): value is number => typeof value === 'number');
  if (presentScores.length > 0) {
    scores.overallHealthScore = Math.round(
      presentScores.reduce((sum, value) => sum + value, 0) / presentScores.length,
    );
  } else {
    scores.overallHealthScore = 100;
  }

  return scores;
}

export function computeTestCoverageScore(issueCount: number, generatedTestCount: number): number {
  if (issueCount === 0) {
    return 100;
  }

  return Math.round(Math.min(1, generatedTestCount / issueCount) * 100);
}
