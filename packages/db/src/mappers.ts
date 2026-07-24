import type { ScanMode as PrismaScanMode } from '@prisma/client';

const SCAN_MODE_MAP: Record<string, PrismaScanMode> = {
  quick: 'QUICK',
  deep: 'DEEP',
  'security-focused': 'SECURITY_FOCUSED',
  'performance-focused': 'PERFORMANCE_FOCUSED',
  'full-qa': 'FULL_QA',
};

export function mapScanModeToPrisma(mode: string): PrismaScanMode {
  const mapped = SCAN_MODE_MAP[mode];
  if (!mapped) {
    throw new Error(`Unknown scan mode '${mode}'`);
  }
  return mapped;
}

const REVERSE_SCAN_MODE_MAP: Record<PrismaScanMode, string> = {
  QUICK: 'quick',
  DEEP: 'deep',
  SECURITY_FOCUSED: 'security-focused',
  PERFORMANCE_FOCUSED: 'performance-focused',
  FULL_QA: 'full-qa',
};

export function mapScanModeFromPrisma(mode: PrismaScanMode): string {
  return REVERSE_SCAN_MODE_MAP[mode];
}
