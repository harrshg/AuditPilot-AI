import { canVisitUrl, validateScanScope } from '@auditpilot/shared';

export const workerService = {
  name: '@auditpilot/worker',
  validateScanScope,
  canVisitUrl,
};
