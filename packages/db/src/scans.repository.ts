import type { IssueCategory, IssueSeverity, Prisma, ScanEventLevel, ScanMode, ScanStatus } from '@prisma/client';

import { prisma } from './client.js';

export type CreateScanInput = {
  projectId: string;
  scanConfigId?: string;
  requestedByUserId?: string;
  mode: ScanMode;
  targetUrl: string;
};

export async function createScan(input: CreateScanInput) {
  return prisma.scan.create({
    data: {
      projectId: input.projectId,
      scanConfigId: input.scanConfigId,
      requestedByUserId: input.requestedByUserId,
      mode: input.mode,
      targetUrl: input.targetUrl,
      status: 'QUEUED',
    },
  });
}

export async function listQueuedScans(limit = 5) {
  return prisma.scan.findMany({
    where: { status: 'QUEUED' },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}

export async function markScanStatus(scanId: string, status: ScanStatus, extra: Prisma.ScanUpdateInput = {}) {
  return prisma.scan.update({
    where: { id: scanId },
    data: {
      status,
      ...extra,
    },
  });
}

export async function markScanRunning(scanId: string) {
  return markScanStatus(scanId, 'RUNNING', { startedAt: new Date() });
}

export type ScanScores = {
  overallHealthScore?: number;
  securityScore?: number;
  performanceScore?: number;
  frontendQualityScore?: number;
  backendApiScore?: number;
  accessibilityScore?: number;
  reliabilityScore?: number;
  testCoverageScore?: number;
};

export async function markScanCompleted(scanId: string, scores: ScanScores) {
  return markScanStatus(scanId, 'COMPLETED', {
    completedAt: new Date(),
    ...scores,
  });
}

export async function markScanFailed(scanId: string, failureReason: string) {
  return markScanStatus(scanId, 'FAILED', {
    completedAt: new Date(),
    failureReason,
  });
}

export async function addScanEvent(scanId: string, level: ScanEventLevel, message: string, metadata?: Prisma.InputJsonValue) {
  return prisma.scanEvent.create({
    data: { scanId, level, message, metadata },
  });
}

export type PageInput = {
  url: string;
  title?: string;
  statusCode?: number;
  loadTimeMs?: number;
  screenshotPath?: string;
  discoveredFrom?: string;
};

export async function addPages(scanId: string, pages: PageInput[]) {
  if (pages.length === 0) return [];
  await prisma.page.createMany({ data: pages.map((page) => ({ scanId, ...page })) });
  return prisma.page.findMany({ where: { scanId } });
}

export type NetworkRequestInput = {
  pageUrl?: string;
  requestUrl: string;
  method: string;
  statusCode?: number;
  resourceType?: string;
  durationMs?: number;
  requestBytes?: number;
  responseBytes?: number;
  failed?: boolean;
  failureText?: string;
};

export async function addNetworkRequests(scanId: string, requests: NetworkRequestInput[]) {
  if (requests.length === 0) return;
  await prisma.networkRequest.createMany({ data: requests.map((request) => ({ scanId, ...request })) });
}

export type ConsoleLogInput = {
  pageUrl?: string;
  type: string;
  text: string;
};

export async function addConsoleLogs(scanId: string, logs: ConsoleLogInput[]) {
  if (logs.length === 0) return;
  await prisma.consoleLog.createMany({ data: logs.map((log) => ({ scanId, ...log })) });
}

export type IssueInput = {
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  affectedUrl?: string;
  affectedEndpoint?: string;
  evidence?: Prisma.InputJsonValue;
  recommendationText?: string;
};

export async function addIssues(scanId: string, issues: IssueInput[]) {
  const created = [];
  for (const issue of issues) {
    created.push(await prisma.issue.create({ data: { scanId, ...issue } }));
  }
  return created;
}

export type RecommendationInput = {
  issueId?: string;
  title: string;
  detail: string;
  priority: number;
  estimatedEffort?: string;
};

export async function addRecommendations(scanId: string, recommendations: RecommendationInput[]) {
  if (recommendations.length === 0) return;
  await prisma.recommendation.createMany({ data: recommendations.map((recommendation) => ({ scanId, ...recommendation })) });
}

export type GeneratedTestInput = {
  issueId?: string;
  fileName: string;
  framework?: string;
  content: string;
  metadata?: Prisma.InputJsonValue;
};

export async function addGeneratedTests(scanId: string, tests: GeneratedTestInput[]) {
  if (tests.length === 0) return;
  await prisma.generatedTest.createMany({ data: tests.map((test) => ({ scanId, ...test })) });
}

export async function getScanById(scanId: string) {
  return prisma.scan.findUnique({
    where: { id: scanId },
    include: {
      issues: { include: { recommendations: true, generatedTests: true } },
      pages: true,
      networkRequests: true,
      consoleLogs: true,
      recommendations: true,
      generatedTests: true,
      artifacts: true,
      events: { orderBy: { createdAt: 'asc' } },
    },
  });
}

export async function listScans(projectId?: string) {
  return prisma.scan.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export type ScanComparison = {
  scanA: { id: string; scores: ScanScores; issueCount: number };
  scanB: { id: string; scores: ScanScores; issueCount: number };
  scoreDelta: Partial<Record<keyof ScanScores, number>>;
  issuesOnlyInA: string[];
  issuesOnlyInB: string[];
  commonIssues: string[];
};

export async function compareScans(scanIdA: string, scanIdB: string): Promise<ScanComparison> {
  const [scanA, scanB] = await Promise.all([getScanById(scanIdA), getScanById(scanIdB)]);

  if (!scanA || !scanB) {
    throw new Error('Both scans must exist to run a comparison.');
  }

  const signature = (issue: { title: string; category: IssueCategory }) => `${issue.category}::${issue.title}`;
  const issuesA = new Set(scanA.issues.map(signature));
  const issuesB = new Set(scanB.issues.map(signature));

  const scoreKeys: (keyof ScanScores)[] = [
    'overallHealthScore',
    'securityScore',
    'performanceScore',
    'frontendQualityScore',
    'backendApiScore',
    'accessibilityScore',
    'reliabilityScore',
    'testCoverageScore',
  ];

  const scoreDelta: Partial<Record<keyof ScanScores, number>> = {};
  for (const key of scoreKeys) {
    const valueA = scanA[key] ?? undefined;
    const valueB = scanB[key] ?? undefined;
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      scoreDelta[key] = valueB - valueA;
    }
  }

  return {
    scanA: { id: scanA.id, scores: extractScores(scanA), issueCount: scanA.issues.length },
    scanB: { id: scanB.id, scores: extractScores(scanB), issueCount: scanB.issues.length },
    scoreDelta,
    issuesOnlyInA: [...issuesA].filter((signatureValue) => !issuesB.has(signatureValue)),
    issuesOnlyInB: [...issuesB].filter((signatureValue) => !issuesA.has(signatureValue)),
    commonIssues: [...issuesA].filter((signatureValue) => issuesB.has(signatureValue)),
  };
}

function extractScores(scan: {
  overallHealthScore: number | null;
  securityScore: number | null;
  performanceScore: number | null;
  frontendQualityScore: number | null;
  backendApiScore: number | null;
  accessibilityScore: number | null;
  reliabilityScore: number | null;
  testCoverageScore: number | null;
}): ScanScores {
  return {
    overallHealthScore: scan.overallHealthScore ?? undefined,
    securityScore: scan.securityScore ?? undefined,
    performanceScore: scan.performanceScore ?? undefined,
    frontendQualityScore: scan.frontendQualityScore ?? undefined,
    backendApiScore: scan.backendApiScore ?? undefined,
    accessibilityScore: scan.accessibilityScore ?? undefined,
    reliabilityScore: scan.reliabilityScore ?? undefined,
    testCoverageScore: scan.testCoverageScore ?? undefined,
  };
}
