import { AnalyzerIssue, IssueCategory, IssueSeverity } from '@auditpilot/analyzers';

export type { AnalyzerIssue, IssueCategory, IssueSeverity };

export type IssueSummary = {
  totalIssues: number;
  bySeverity: Record<IssueSeverity, number>;
  byCategory: Partial<Record<IssueCategory, number>>;
  summaryText: string;
};

export type RootCauseHypothesis = {
  issueTitle: string;
  hypothesis: string;
  confidence: 'low' | 'medium' | 'high';
};

export type GeneratedRecommendation = {
  issueTitle?: string;
  title: string;
  detail: string;
  priority: number;
  estimatedEffort: string;
};

export type SummaryProvider = (issues: AnalyzerIssue[]) => Promise<string>;
