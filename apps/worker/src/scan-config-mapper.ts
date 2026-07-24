import { getScanConfigById, mapScanModeFromPrisma } from '@auditpilot/db';
import { Credential, ScanConfig } from '@auditpilot/shared';

type ScanConfigRow = NonNullable<Awaited<ReturnType<typeof getScanConfigById>>>;

export function buildScanConfigFromRow(row: ScanConfigRow, credential?: Credential): ScanConfig {
  return {
    websiteUrl: row.websiteUrl,
    credentials: credential,
    issueDescription: row.issueDescription ?? undefined,
    scanMode: mapScanModeFromPrisma(row.scanMode) as ScanConfig['scanMode'],
    maxCrawlDepth: row.maxCrawlDepth,
    maxPages: row.maxPages,
    allowedDomains: row.allowedDomains as string[],
    excludedPaths: row.excludedPaths as string[],
    safety: {
      safeMode: row.safeMode,
      allowDestructiveActions: row.allowDestructiveActions,
      allowFormSubmission: row.allowFormSubmission,
      allowFileUploadTesting: row.allowFileUploadTesting,
      allowPaymentFlowTesting: row.allowPaymentFlowTesting,
    },
    authorization: {
      isAuthorizedToTest: true,
      acceptedTermsAt: row.authorizationAcceptedAt.toISOString(),
      testerName: row.authorizationTesterName,
      organizationName: row.authorizationOrgName ?? undefined,
      notes: row.authorizationNotes ?? undefined,
    },
  };
}
