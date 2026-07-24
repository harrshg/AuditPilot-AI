import type { ScanMode as PrismaScanMode } from '@prisma/client';

import { prisma } from './client.js';

export type CreateScanConfigInput = {
  projectId: string;
  name: string;
  websiteUrl: string;
  loginUrl?: string;
  issueDescription?: string;
  scanMode: PrismaScanMode;
  maxCrawlDepth: number;
  maxPages: number;
  allowedDomains: string[];
  excludedPaths: string[];
  safeMode: boolean;
  allowDestructiveActions: boolean;
  allowFormSubmission: boolean;
  allowFileUploadTesting: boolean;
  allowPaymentFlowTesting: boolean;
  authorizationTesterName: string;
  authorizationOrgName?: string;
  authorizationAcceptedAt: Date;
  authorizationNotes?: string;
  credentialsSecretRef?: string;
};

export async function createScanConfig(input: CreateScanConfigInput) {
  return prisma.scanConfig.create({
    data: {
      ...input,
      allowedDomains: input.allowedDomains,
      excludedPaths: input.excludedPaths,
    },
  });
}

export async function getScanConfigById(id: string) {
  return prisma.scanConfig.findUnique({ where: { id } });
}
