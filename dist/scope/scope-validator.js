import { ScanConfigSchema } from './scan-config.schema.js';
export function validateScanScope(input) {
    const parsed = ScanConfigSchema.safeParse(input);
    if (!parsed.success) {
        return {
            valid: false,
            errors: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
        };
    }
    const config = parsed.data;
    const errors = [];
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
export function isUrlInScope(url, config) {
    const parsedUrl = new URL(url);
    const host = normalizeDomain(parsedUrl.hostname);
    const allowedDomains = config.allowedDomains.map(normalizeDomain);
    if (!allowedDomains.includes(host)) {
        return false;
    }
    return !config.excludedPaths.some((excludedPath) => parsedUrl.pathname.startsWith(excludedPath));
}
function normalizeDomain(domain) {
    return domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}
