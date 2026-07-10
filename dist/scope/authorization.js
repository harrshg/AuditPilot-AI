export function buildAuthorizationSummary(consent) {
    return {
        authorized: consent.isAuthorizedToTest === true,
        message: `Authorized defensive scan approved by ${consent.testerName}.`,
        acceptedTermsAt: consent.acceptedTermsAt,
    };
}
export function assertAuthorized(consent) {
    if (consent.isAuthorizedToTest !== true) {
        throw new Error('Scan cannot start without explicit authorization to test this website.');
    }
}
