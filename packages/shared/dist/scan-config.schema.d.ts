import { z } from 'zod';
export declare const ScanModeSchema: z.ZodEnum<["quick", "deep", "security-focused", "performance-focused", "full-qa"]>;
export declare const CredentialSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    loginUrl: z.ZodOptional<z.ZodString>;
    mfaRequired: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    mfaRequired: boolean;
    loginUrl?: string | undefined;
}, {
    username: string;
    password: string;
    loginUrl?: string | undefined;
    mfaRequired?: boolean | undefined;
}>;
export declare const ScanSafetySchema: z.ZodObject<{
    safeMode: z.ZodDefault<z.ZodBoolean>;
    allowDestructiveActions: z.ZodDefault<z.ZodBoolean>;
    allowFormSubmission: z.ZodDefault<z.ZodBoolean>;
    allowFileUploadTesting: z.ZodDefault<z.ZodBoolean>;
    allowPaymentFlowTesting: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    safeMode: boolean;
    allowDestructiveActions: boolean;
    allowFormSubmission: boolean;
    allowFileUploadTesting: boolean;
    allowPaymentFlowTesting: boolean;
}, {
    safeMode?: boolean | undefined;
    allowDestructiveActions?: boolean | undefined;
    allowFormSubmission?: boolean | undefined;
    allowFileUploadTesting?: boolean | undefined;
    allowPaymentFlowTesting?: boolean | undefined;
}>;
export declare const AuthorizationConsentSchema: z.ZodObject<{
    isAuthorizedToTest: z.ZodLiteral<true>;
    acceptedTermsAt: z.ZodString;
    testerName: z.ZodString;
    organizationName: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    isAuthorizedToTest: true;
    acceptedTermsAt: string;
    testerName: string;
    organizationName?: string | undefined;
    notes?: string | undefined;
}, {
    isAuthorizedToTest: true;
    acceptedTermsAt: string;
    testerName: string;
    organizationName?: string | undefined;
    notes?: string | undefined;
}>;
export declare const ScanConfigSchema: z.ZodObject<{
    websiteUrl: z.ZodString;
    credentials: z.ZodOptional<z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
        loginUrl: z.ZodOptional<z.ZodString>;
        mfaRequired: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        password: string;
        mfaRequired: boolean;
        loginUrl?: string | undefined;
    }, {
        username: string;
        password: string;
        loginUrl?: string | undefined;
        mfaRequired?: boolean | undefined;
    }>>;
    issueDescription: z.ZodOptional<z.ZodString>;
    scanMode: z.ZodDefault<z.ZodEnum<["quick", "deep", "security-focused", "performance-focused", "full-qa"]>>;
    maxCrawlDepth: z.ZodDefault<z.ZodNumber>;
    maxPages: z.ZodDefault<z.ZodNumber>;
    allowedDomains: z.ZodArray<z.ZodString, "many">;
    excludedPaths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    safety: z.ZodDefault<z.ZodObject<{
        safeMode: z.ZodDefault<z.ZodBoolean>;
        allowDestructiveActions: z.ZodDefault<z.ZodBoolean>;
        allowFormSubmission: z.ZodDefault<z.ZodBoolean>;
        allowFileUploadTesting: z.ZodDefault<z.ZodBoolean>;
        allowPaymentFlowTesting: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        safeMode: boolean;
        allowDestructiveActions: boolean;
        allowFormSubmission: boolean;
        allowFileUploadTesting: boolean;
        allowPaymentFlowTesting: boolean;
    }, {
        safeMode?: boolean | undefined;
        allowDestructiveActions?: boolean | undefined;
        allowFormSubmission?: boolean | undefined;
        allowFileUploadTesting?: boolean | undefined;
        allowPaymentFlowTesting?: boolean | undefined;
    }>>;
    authorization: z.ZodObject<{
        isAuthorizedToTest: z.ZodLiteral<true>;
        acceptedTermsAt: z.ZodString;
        testerName: z.ZodString;
        organizationName: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isAuthorizedToTest: true;
        acceptedTermsAt: string;
        testerName: string;
        organizationName?: string | undefined;
        notes?: string | undefined;
    }, {
        isAuthorizedToTest: true;
        acceptedTermsAt: string;
        testerName: string;
        organizationName?: string | undefined;
        notes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    websiteUrl: string;
    scanMode: "quick" | "deep" | "security-focused" | "performance-focused" | "full-qa";
    maxCrawlDepth: number;
    maxPages: number;
    allowedDomains: string[];
    excludedPaths: string[];
    safety: {
        safeMode: boolean;
        allowDestructiveActions: boolean;
        allowFormSubmission: boolean;
        allowFileUploadTesting: boolean;
        allowPaymentFlowTesting: boolean;
    };
    authorization: {
        isAuthorizedToTest: true;
        acceptedTermsAt: string;
        testerName: string;
        organizationName?: string | undefined;
        notes?: string | undefined;
    };
    credentials?: {
        username: string;
        password: string;
        mfaRequired: boolean;
        loginUrl?: string | undefined;
    } | undefined;
    issueDescription?: string | undefined;
}, {
    websiteUrl: string;
    allowedDomains: string[];
    authorization: {
        isAuthorizedToTest: true;
        acceptedTermsAt: string;
        testerName: string;
        organizationName?: string | undefined;
        notes?: string | undefined;
    };
    credentials?: {
        username: string;
        password: string;
        loginUrl?: string | undefined;
        mfaRequired?: boolean | undefined;
    } | undefined;
    issueDescription?: string | undefined;
    scanMode?: "quick" | "deep" | "security-focused" | "performance-focused" | "full-qa" | undefined;
    maxCrawlDepth?: number | undefined;
    maxPages?: number | undefined;
    excludedPaths?: string[] | undefined;
    safety?: {
        safeMode?: boolean | undefined;
        allowDestructiveActions?: boolean | undefined;
        allowFormSubmission?: boolean | undefined;
        allowFileUploadTesting?: boolean | undefined;
        allowPaymentFlowTesting?: boolean | undefined;
    } | undefined;
}>;
export type ScanMode = z.infer<typeof ScanModeSchema>;
export type Credential = z.infer<typeof CredentialSchema>;
export type ScanSafety = z.infer<typeof ScanSafetySchema>;
export type AuthorizationConsent = z.infer<typeof AuthorizationConsentSchema>;
export type ScanConfig = z.infer<typeof ScanConfigSchema>;
