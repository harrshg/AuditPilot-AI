import { ScanConfig } from './scan-config.schema.js';
export type ActionDecision = {
    allowed: boolean;
    reason: string;
};
export declare function canVisitUrl(url: string, config: ScanConfig): ActionDecision;
export declare function canInteractWithElement(label: string, config: ScanConfig): ActionDecision;
export declare function canSubmitForm(config: ScanConfig): ActionDecision;
