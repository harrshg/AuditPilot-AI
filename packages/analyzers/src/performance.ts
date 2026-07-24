import { AnalyzerIssue, CapturedPage } from './types.js';

const MEDIUM_LOAD_TIME_MS = 3000;
const HIGH_LOAD_TIME_MS = 6000;

export function analyzePagePerformance(pages: CapturedPage[]): AnalyzerIssue[] {
  const issues: AnalyzerIssue[] = [];

  const slowPages = pages.filter((page) => (page.loadTimeMs ?? 0) > MEDIUM_LOAD_TIME_MS);

  for (const page of slowPages) {
    const loadTimeMs = page.loadTimeMs ?? 0;
    issues.push({
      title: 'Slow page load time',
      description: `Page took ${loadTimeMs}ms to load, exceeding the ${MEDIUM_LOAD_TIME_MS}ms performance budget.`,
      category: 'PERFORMANCE',
      severity: loadTimeMs > HIGH_LOAD_TIME_MS ? 'HIGH' : 'MEDIUM',
      affectedUrl: page.url,
      evidence: { loadTimeMs },
      recommendationText: 'Reduce render-blocking resources, optimize assets, and consider server-side caching for this page.',
    });
  }

  const errorPages = pages.filter((page) => (page.statusCode ?? 200) >= 400);
  for (const page of errorPages) {
    issues.push({
      title: 'Page returned an error status code',
      description: `Page responded with HTTP status ${page.statusCode}.`,
      category: 'RELIABILITY',
      severity: (page.statusCode ?? 0) >= 500 ? 'HIGH' : 'MEDIUM',
      affectedUrl: page.url,
      evidence: { statusCode: page.statusCode },
      recommendationText: 'Investigate why this page returns an error status and fix routing or server-side issues.',
    });
  }

  return issues;
}
