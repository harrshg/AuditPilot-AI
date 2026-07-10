import { isPotentiallyDestructiveAction } from './destructive-actions.js';
import { isUrlInScope } from './scope-validator.js';
export function canVisitUrl(url, config) {
    if (!isUrlInScope(url, config)) {
        return {
            allowed: false,
            reason: 'URL is outside allowed domains or matches an excluded path.',
        };
    }
    return {
        allowed: true,
        reason: 'URL is inside the approved scan scope.',
    };
}
export function canInteractWithElement(label, config) {
    if (isPotentiallyDestructiveAction(label) && !config.safety.allowDestructiveActions) {
        return {
            allowed: false,
            reason: 'Element appears destructive and destructive actions are disabled.',
        };
    }
    return {
        allowed: true,
        reason: 'Element interaction is allowed by the current scan policy.',
    };
}
export function canSubmitForm(config) {
    if (!config.safety.allowFormSubmission) {
        return {
            allowed: false,
            reason: 'Form submission is disabled for this scan.',
        };
    }
    return {
        allowed: true,
        reason: 'Form submission is enabled for this scan.',
    };
}
