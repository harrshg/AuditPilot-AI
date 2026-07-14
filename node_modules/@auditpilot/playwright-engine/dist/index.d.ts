import { ScanConfig } from '@auditpilot/shared';
export type PlaywrightEngineConfig = Pick<ScanConfig, 'websiteUrl' | 'allowedDomains' | 'excludedPaths' | 'safety'>;
export declare function createPlaywrightEngineConfig(config: PlaywrightEngineConfig): PlaywrightEngineConfig;
