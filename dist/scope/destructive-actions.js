export const DESTRUCTIVE_ACTION_PATTERNS = [
    /delete/i,
    /remove/i,
    /destroy/i,
    /drop/i,
    /truncate/i,
    /cancel\s+(subscription|plan|account|order)/i,
    /refund/i,
    /charge/i,
    /pay\s+now/i,
    /transfer/i,
    /withdraw/i,
    /publish/i,
    /send\s+(email|sms|notification)/i,
    /invite\s+users?/i,
    /disable\s+(user|account|project)/i,
    /archive/i,
];
export function isPotentiallyDestructiveAction(label) {
    return DESTRUCTIVE_ACTION_PATTERNS.some((pattern) => pattern.test(label));
}
