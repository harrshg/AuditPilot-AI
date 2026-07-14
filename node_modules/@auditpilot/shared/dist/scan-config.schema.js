import { z } from 'zod';
export const ScanModeSchema = z.enum([
    'quick',
    'deep',
    'security-focused',
    'performance-focused',
    'full-qa',
]);
export const CredentialSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    loginUrl: z.string().url().optional(),
    mfaRequired: z.boolean().default(false),
});
export const ScanSafetySchema = z.object({
    safeMode: z.boolean().default(true),
    allowDestructiveActions: z.boolean().default(false),
    allowFormSubmission: z.boolean().default(false),
    allowFileUploadTesting: z.boolean().default(false),
    allowPaymentFlowTesting: z.boolean().default(false),
});
export const AuthorizationConsentSchema = z.object({
    isAuthorizedToTest: z.literal(true),
    acceptedTermsAt: z.string().datetime(),
    testerName: z.string().min(1),
    organizationName: z.string().min(1).optional(),
    notes: z.string().max(2000).optional(),
});
export const ScanConfigSchema = z.object({
    websiteUrl: z.string().url(),
    credentials: CredentialSchema.optional(),
    issueDescription: z.string().max(4000).optional(),
    scanMode: ScanModeSchema.default('quick'),
    maxCrawlDepth: z.number().int().min(0).max(10).default(2),
    maxPages: z.number().int().min(1).max(250).default(25),
    allowedDomains: z.array(z.string().min(1)).min(1),
    excludedPaths: z.array(z.string().startsWith('/')).default([]),
    safety: ScanSafetySchema.default({}),
    authorization: AuthorizationConsentSchema,
});
