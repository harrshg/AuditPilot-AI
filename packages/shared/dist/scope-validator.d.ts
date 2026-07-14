import { ScanConfig } from './scan-config.schema.js';
export type ScopeValidationResult = {
    valid: boolean;
    errors: string[];
    normalizedConfig?: ScanConfig;
};
export declare function validateScanScope(input: unknown): ScopeValidationResult;
export declare function isUrlInScope(url: string, config: Pick<ScanConfig, 'allowedDomains' | 'excludedPaths'>): boolean;
