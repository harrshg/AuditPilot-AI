import { AuthorizationConsent } from './scan-config.schema.js';
export type AuthorizationSummary = {
    authorized: boolean;
    message: string;
    acceptedTermsAt?: string;
};
export declare function buildAuthorizationSummary(consent: AuthorizationConsent): AuthorizationSummary;
export declare function assertAuthorized(consent: AuthorizationConsent): void;
