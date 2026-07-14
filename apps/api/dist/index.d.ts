export declare const apiService: {
    name: string;
    validateScanConfig: (data: unknown, params?: import("zod").util.InexactPartial<import("zod").ParseParams>) => import("zod").SafeParseReturnType<{
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
    }, {
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
    }>;
};
