import { z } from 'zod';
export declare const ScanJobStatusSchema: z.ZodEnum<["queued", "running", "completed", "failed", "cancelled"]>;
export declare const ScanJobPrioritySchema: z.ZodEnum<["low", "normal", "high", "urgent"]>;
export declare const ScanJobTriggerSchema: z.ZodEnum<["manual", "scheduled", "api", "retry"]>;
export declare const ScanJobTimestampsSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    queuedAt: z.ZodString;
    startedAt: z.ZodOptional<z.ZodString>;
    completedAt: z.ZodOptional<z.ZodString>;
    failedAt: z.ZodOptional<z.ZodString>;
    cancelledAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
    queuedAt: string;
    startedAt?: string | undefined;
    completedAt?: string | undefined;
    failedAt?: string | undefined;
    cancelledAt?: string | undefined;
}, {
    createdAt: string;
    updatedAt: string;
    queuedAt: string;
    startedAt?: string | undefined;
    completedAt?: string | undefined;
    failedAt?: string | undefined;
    cancelledAt?: string | undefined;
}>;
export declare const ScanJobProgressSchema: z.ZodObject<{
    currentStep: z.ZodOptional<z.ZodString>;
    pagesDiscovered: z.ZodDefault<z.ZodNumber>;
    pagesVisited: z.ZodDefault<z.ZodNumber>;
    networkRequestsCaptured: z.ZodDefault<z.ZodNumber>;
    consoleMessagesCaptured: z.ZodDefault<z.ZodNumber>;
    issuesFound: z.ZodDefault<z.ZodNumber>;
    percentComplete: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    pagesDiscovered: number;
    pagesVisited: number;
    networkRequestsCaptured: number;
    consoleMessagesCaptured: number;
    issuesFound: number;
    percentComplete: number;
    currentStep?: string | undefined;
}, {
    currentStep?: string | undefined;
    pagesDiscovered?: number | undefined;
    pagesVisited?: number | undefined;
    networkRequestsCaptured?: number | undefined;
    consoleMessagesCaptured?: number | undefined;
    issuesFound?: number | undefined;
    percentComplete?: number | undefined;
}>;
export declare const ScanJobErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    retryable: z.ZodDefault<z.ZodBoolean>;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    retryable: boolean;
    details?: Record<string, unknown> | undefined;
}, {
    code: string;
    message: string;
    retryable?: boolean | undefined;
    details?: Record<string, unknown> | undefined;
}>;
export declare const ScanJobPayloadSchema: z.ZodObject<{
    scanConfig: z.ZodObject<{
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
    requestedByUserId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    correlationId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    scanConfig: {
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
    };
    requestedByUserId?: string | undefined;
    projectId?: string | undefined;
    correlationId?: string | undefined;
}, {
    scanConfig: {
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
    };
    requestedByUserId?: string | undefined;
    projectId?: string | undefined;
    correlationId?: string | undefined;
}>;
export declare const ScanJobSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["queued", "running", "completed", "failed", "cancelled"]>>;
    priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high", "urgent"]>>;
    trigger: z.ZodDefault<z.ZodEnum<["manual", "scheduled", "api", "retry"]>>;
    payload: z.ZodObject<{
        scanConfig: z.ZodObject<{
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
        requestedByUserId: z.ZodOptional<z.ZodString>;
        projectId: z.ZodOptional<z.ZodString>;
        correlationId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    }, {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    }>;
    progress: z.ZodDefault<z.ZodObject<{
        currentStep: z.ZodOptional<z.ZodString>;
        pagesDiscovered: z.ZodDefault<z.ZodNumber>;
        pagesVisited: z.ZodDefault<z.ZodNumber>;
        networkRequestsCaptured: z.ZodDefault<z.ZodNumber>;
        consoleMessagesCaptured: z.ZodDefault<z.ZodNumber>;
        issuesFound: z.ZodDefault<z.ZodNumber>;
        percentComplete: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        pagesDiscovered: number;
        pagesVisited: number;
        networkRequestsCaptured: number;
        consoleMessagesCaptured: number;
        issuesFound: number;
        percentComplete: number;
        currentStep?: string | undefined;
    }, {
        currentStep?: string | undefined;
        pagesDiscovered?: number | undefined;
        pagesVisited?: number | undefined;
        networkRequestsCaptured?: number | undefined;
        consoleMessagesCaptured?: number | undefined;
        issuesFound?: number | undefined;
        percentComplete?: number | undefined;
    }>>;
    attempts: z.ZodDefault<z.ZodNumber>;
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    lockOwnerId: z.ZodOptional<z.ZodString>;
    lockedUntil: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        retryable: z.ZodDefault<z.ZodBoolean>;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        retryable: boolean;
        details?: Record<string, unknown> | undefined;
    }, {
        code: string;
        message: string;
        retryable?: boolean | undefined;
        details?: Record<string, unknown> | undefined;
    }>>;
    timestamps: z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        queuedAt: z.ZodString;
        startedAt: z.ZodOptional<z.ZodString>;
        completedAt: z.ZodOptional<z.ZodString>;
        failedAt: z.ZodOptional<z.ZodString>;
        cancelledAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        createdAt: string;
        updatedAt: string;
        queuedAt: string;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        failedAt?: string | undefined;
        cancelledAt?: string | undefined;
    }, {
        createdAt: string;
        updatedAt: string;
        queuedAt: string;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        failedAt?: string | undefined;
        cancelledAt?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    status: "queued" | "running" | "completed" | "failed" | "cancelled";
    id: string;
    priority: "low" | "normal" | "high" | "urgent";
    trigger: "manual" | "scheduled" | "api" | "retry";
    payload: {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    };
    progress: {
        pagesDiscovered: number;
        pagesVisited: number;
        networkRequestsCaptured: number;
        consoleMessagesCaptured: number;
        issuesFound: number;
        percentComplete: number;
        currentStep?: string | undefined;
    };
    attempts: number;
    maxAttempts: number;
    timestamps: {
        createdAt: string;
        updatedAt: string;
        queuedAt: string;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        failedAt?: string | undefined;
        cancelledAt?: string | undefined;
    };
    lockOwnerId?: string | undefined;
    lockedUntil?: string | undefined;
    error?: {
        code: string;
        message: string;
        retryable: boolean;
        details?: Record<string, unknown> | undefined;
    } | undefined;
}, {
    id: string;
    payload: {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    };
    timestamps: {
        createdAt: string;
        updatedAt: string;
        queuedAt: string;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        failedAt?: string | undefined;
        cancelledAt?: string | undefined;
    };
    status?: "queued" | "running" | "completed" | "failed" | "cancelled" | undefined;
    priority?: "low" | "normal" | "high" | "urgent" | undefined;
    trigger?: "manual" | "scheduled" | "api" | "retry" | undefined;
    progress?: {
        currentStep?: string | undefined;
        pagesDiscovered?: number | undefined;
        pagesVisited?: number | undefined;
        networkRequestsCaptured?: number | undefined;
        consoleMessagesCaptured?: number | undefined;
        issuesFound?: number | undefined;
        percentComplete?: number | undefined;
    } | undefined;
    attempts?: number | undefined;
    maxAttempts?: number | undefined;
    lockOwnerId?: string | undefined;
    lockedUntil?: string | undefined;
    error?: {
        code: string;
        message: string;
        retryable?: boolean | undefined;
        details?: Record<string, unknown> | undefined;
    } | undefined;
}>;
export declare const CreateScanJobInputSchema: z.ZodObject<{
    id: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high", "urgent"]>>;
    trigger: z.ZodDefault<z.ZodEnum<["manual", "scheduled", "api", "retry"]>>;
    payload: z.ZodObject<{
        scanConfig: z.ZodObject<{
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
        requestedByUserId: z.ZodOptional<z.ZodString>;
        projectId: z.ZodOptional<z.ZodString>;
        correlationId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    }, {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    }>;
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    now: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    priority: "low" | "normal" | "high" | "urgent";
    trigger: "manual" | "scheduled" | "api" | "retry";
    payload: {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    };
    maxAttempts: number;
    now?: string | undefined;
}, {
    id: string;
    payload: {
        scanConfig: {
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
        };
        requestedByUserId?: string | undefined;
        projectId?: string | undefined;
        correlationId?: string | undefined;
    };
    priority?: "low" | "normal" | "high" | "urgent" | undefined;
    trigger?: "manual" | "scheduled" | "api" | "retry" | undefined;
    maxAttempts?: number | undefined;
    now?: string | undefined;
}>;
export declare const ScanJobStateTransitionSchema: z.ZodObject<{
    from: z.ZodEnum<["queued", "running", "completed", "failed", "cancelled"]>;
    to: z.ZodEnum<["queued", "running", "completed", "failed", "cancelled"]>;
}, "strip", z.ZodTypeAny, {
    from: "queued" | "running" | "completed" | "failed" | "cancelled";
    to: "queued" | "running" | "completed" | "failed" | "cancelled";
}, {
    from: "queued" | "running" | "completed" | "failed" | "cancelled";
    to: "queued" | "running" | "completed" | "failed" | "cancelled";
}>;
export type ScanJobStatus = z.infer<typeof ScanJobStatusSchema>;
export type ScanJobPriority = z.infer<typeof ScanJobPrioritySchema>;
export type ScanJobTrigger = z.infer<typeof ScanJobTriggerSchema>;
export type ScanJobTimestamps = z.infer<typeof ScanJobTimestampsSchema>;
export type ScanJobProgress = z.infer<typeof ScanJobProgressSchema>;
export type ScanJobError = z.infer<typeof ScanJobErrorSchema>;
export type ScanJobPayload = z.infer<typeof ScanJobPayloadSchema>;
export type ScanJob = z.infer<typeof ScanJobSchema>;
export type CreateScanJobInput = z.infer<typeof CreateScanJobInputSchema>;
export type ScanJobStateTransition = z.infer<typeof ScanJobStateTransitionSchema>;
export declare function createScanJob(input: CreateScanJobInput): ScanJob;
export declare function canTransitionScanJob(from: ScanJobStatus, to: ScanJobStatus): boolean;
export declare function transitionScanJobStatus(job: ScanJob, to: ScanJobStatus, now?: string): ScanJob;
export declare function updateScanJobProgress(job: ScanJob, progress: Partial<ScanJobProgress>, now?: string): ScanJob;
