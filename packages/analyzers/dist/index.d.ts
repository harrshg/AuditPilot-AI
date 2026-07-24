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
export declare const analyzerModules: AnalyzerModule[];
export declare function runAnalyzers(data: AnalyzerScanData): AnalyzerIssue[];
