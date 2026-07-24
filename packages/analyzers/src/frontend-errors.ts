import { AnalyzerIssue, CapturedConsoleLog } from './types.js';

const ERROR_TYPES = new Set(['error', 'pageerror']);

export function analyzeConsoleLogs(logs: CapturedConsoleLog[]): AnalyzerIssue[] {
  const errorLogs = logs.filter((log) => ERROR_TYPES.has(log.type.toLowerCase()));

  if (errorLogs.length === 0) {
    return [];
  }

  const groups = new Map<string, { count: number; urls: Set<string> }>();

  for (const log of errorLogs) {
    const signature = normalizeMessage(log.text);
    const group = groups.get(signature) ?? { count: 0, urls: new Set<string>() };
    group.count += 1;
    if (log.pageUrl) {
      group.urls.add(log.pageUrl);
    }
    groups.set(signature, group);
  }

  const issues: AnalyzerIssue[] = [];

  for (const [signature, group] of groups) {
    issues.push({
      title: `Frontend console error: ${truncate(signature, 80)}`,
      description: `A JavaScript error was observed in the browser console across ${group.urls.size || 1} page(s), occurring ${group.count} time(s).`,
      category: 'FRONTEND',
      severity: group.count >= 5 ? 'HIGH' : group.count >= 2 ? 'MEDIUM' : 'LOW',
      affectedUrl: [...group.urls][0],
      evidence: {
        occurrences: group.count,
        affectedUrls: [...group.urls].slice(0, 5),
        sampleMessage: signature,
      },
      recommendationText: 'Investigate the browser console error and add proper error handling or fix the underlying script issue.',
    });
  }

  return issues;
}

function normalizeMessage(text: string): string {
  return text.replace(/\d+/g, '#').trim();
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}
