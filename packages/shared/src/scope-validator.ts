import { ScanConfig, ScanConfigSchema } from './scan-config.schema.js';

export type ScopeValidationResult = {
  valid: boolean;
  errors: string[];
  normalizedConfig?: ScanConfig;
};

export function validateScanScope(input: unknown): ScopeValidationResult {
  const parsed = ScanConfigSchema.safeParse(input);

  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    };
  }

  const config = parsed.data;
  const errors: string[] = [];
  const websiteHost = new URL(config.websiteUrl).hostname;
  const normalizedAllowedDomains = config.allowedDomains.map(normalizeDomain);

  if (!normalizedAllowedDomains.includes(websiteHost)) {
    errors.push(`websiteUrl host '${websiteHost}' must be included in allowedDomains.`);
  }

  for (const domain of normalizedAllowedDomains) {
    if (domain === '*' || domain.startsWith('*.')) {
      errors.push(`Wildcard domain '${domain}' is not allowed for initial safe scanning.`);
    }
  }

  for (const path of config.excludedPaths) {
    if (!path.startsWith('/')) {
      errors.push(`Excluded path '${path}' must start with '/'.`);
    }
  }

  if (config.safety.safeMode && config.safety.allowDestructiveActions) {
    errors.push('safeMode cannot be enabled while allowDestructiveActions is true.');
  }

  return {
    valid: errors.length === 0,
    errors,
    normalizedConfig: {
      ...config,
      allowedDomains: normalizedAllowedDomains,
    },
  };
}

export function isUrlInScope(url: string, config: Pick<ScanConfig, 'allowedDomains' | 'excludedPaths'>): boolean {
  const parsedUrl = new URL(url);
  const host = normalizeDomain(parsedUrl.hostname);
  const allowedDomains = config.allowedDomains.map(normalizeDomain);

  if (!allowedDomains.includes(host)) {
    return false;
  }

  return !config.excludedPaths.some((excludedPath) => parsedUrl.pathname.startsWith(excludedPath));
}

function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}
