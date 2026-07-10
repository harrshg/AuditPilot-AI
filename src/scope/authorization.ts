import { AuthorizationConsent } from './scan-config.schema.js';

export type AuthorizationSummary = {
  authorized: boolean;
  message: string;
  acceptedTermsAt?: string;
};

export function buildAuthorizationSummary(consent: AuthorizationConsent): AuthorizationSummary {
  return {
    authorized: consent.isAuthorizedToTest === true,
    message: `Authorized defensive scan approved by ${consent.testerName}.`,
    acceptedTermsAt: consent.acceptedTermsAt,
  };
}

export function assertAuthorized(consent: AuthorizationConsent): void {
  if (consent.isAuthorizedToTest !== true) {
    throw new Error('Scan cannot start without explicit authorization to test this website.');
  }
}
