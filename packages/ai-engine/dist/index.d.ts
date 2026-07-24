import { AnalyzerIssue } from '@auditpilot/analyzers';
import { SummaryProvider } from './types.js';
export * from './types.js';
export * from './summarizer.js';
export * from './root-cause.js';
export * from './recommendations.js';
export type AiEngineModule = {
    name: string;
    purpose: string;
};
export declare const aiEngineModule: AiEngineModule;
export declare function runAiEngine(issues: AnalyzerIssue[], summaryProvider?: SummaryProvider): Promise<{
    summary: import("./types.js").IssueSummary;
    rootCauses: import("./types.js").RootCauseHypothesis[];
    recommendations: import("./types.js").GeneratedRecommendation[];
}>;
