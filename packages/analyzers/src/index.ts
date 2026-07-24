import { analyzeAccessibility } from './accessibility.js';
import { analyzeNetworkRequests } from './api-health.js';
import { analyzeCookies } from './cookies.js';
import { analyzeConsoleLogs } from './frontend-errors.js';
import { analyzePagePerformance } from './performance.js';
import { analyzeSecurityHeaders } from './security-headers.js';
import { AnalyzerIssue, AnalyzerScanData } from './types.js';

export * from './types.js';
export * from './security-headers.js';
export * from './cookies.js';
export * from './frontend-errors.js';
export * from './api-health.js';
export * from './performance.js';
export * from './accessibility.js';
export * from './scoring.js';

export type AnalyzerModule = {
  name: string;
  enabled: boolean;
};

export const analyzerModules: AnalyzerModule[] = [
  { name: 'security-headers', enabled: true },
  { name: 'cookies', enabled: true },
  { name: 'frontend-errors', enabled: true },
  { name: 'api-health', enabled: true },
  { name: 'performance', enabled: true },
  { name: 'accessibility', enabled: true },
];

export function runAnalyzers(data: AnalyzerScanData): AnalyzerIssue[] {
  return [
    ...analyzeSecurityHeaders(data.responseHeaders),
    ...analyzeCookies(data.cookies),
    ...analyzeConsoleLogs(data.consoleLogs),
    ...analyzeNetworkRequests(data.networkRequests),
    ...analyzePagePerformance(data.pages),
    ...analyzeAccessibility(data.accessibilitySignals),
  ];
}
