import { ScanConfigSchema } from '@auditpilot/shared';
export const apiService = {
    name: '@auditpilot/api',
    validateScanConfig: ScanConfigSchema.safeParse,
};
