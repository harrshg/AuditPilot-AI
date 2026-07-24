export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export type ScanSummary = {
  id: string;
  projectId: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  mode: string;
  targetUrl: string;
  overallHealthScore: number | null;
  securityScore: number | null;
  performanceScore: number | null;
  frontendQualityScore: number | null;
  backendApiScore: number | null;
  accessibilityScore: number | null;
  reliabilityScore: number | null;
  testCoverageScore: number | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  failureReason: string | null;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  affectedUrl: string | null;
  affectedEndpoint: string | null;
  evidence: Record<string, unknown> | null;
  recommendationText: string | null;
  recommendations?: Recommendation[];
  generatedTests?: GeneratedTest[];
};

export type Recommendation = {
  id: string;
  issueId: string | null;
  title: string;
  detail: string;
  priority: number;
  estimatedEffort: string | null;
};

export type GeneratedTest = {
  id: string;
  issueId: string | null;
  fileName: string;
  framework: string | null;
  content: string;
};

export type ScanEvent = {
  id: string;
  level: string;
  message: string;
  createdAt: string;
};

export type PageRecord = {
  id: string;
  url: string;
  title: string | null;
  statusCode: number | null;
  loadTimeMs: number | null;
};

export type ScanDetail = ScanSummary & {
  issues: Issue[];
  recommendations: Recommendation[];
  generatedTests: GeneratedTest[];
  pages: PageRecord[];
  events: ScanEvent[];
};

export type ScanComparison = {
  scanA: { id: string; scores: Record<string, number | undefined>; issueCount: number };
  scanB: { id: string; scores: Record<string, number | undefined>; issueCount: number };
  scoreDelta: Record<string, number | undefined>;
  issuesOnlyInA: string[];
  issuesOnlyInB: string[];
  commonIssues: string[];
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Request to ${path} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function listScans(): Promise<ScanSummary[]> {
  const data = await apiFetch<{ scans: ScanSummary[] }>('/v1/scans');
  return data.scans;
}

export async function getScan(id: string): Promise<ScanDetail> {
  const data = await apiFetch<{ scan: ScanDetail }>(`/v1/scans/${id}`);
  return data.scan;
}

export async function compareScans(idA: string, idB: string): Promise<ScanComparison> {
  const data = await apiFetch<{ comparison: ScanComparison }>(`/v1/scans/${idA}/compare/${idB}`);
  return data.comparison;
}

export type CreateScanInput = {
  websiteUrl: string;
  allowedDomains: string[];
  excludedPaths: string[];
  scanMode: string;
  maxCrawlDepth: number;
  maxPages: number;
  issueDescription?: string;
  safety: {
    safeMode: boolean;
    allowDestructiveActions: boolean;
    allowFormSubmission: boolean;
    allowFileUploadTesting: boolean;
    allowPaymentFlowTesting: boolean;
  };
  authorization: {
    isAuthorizedToTest: true;
    acceptedTermsAt: string;
    testerName: string;
    organizationName?: string;
    notes?: string;
  };
  credentials?: {
    username: string;
    password: string;
    loginUrl?: string;
    mfaRequired?: boolean;
  };
};

export async function createScan(input: CreateScanInput): Promise<{ scanId: string }> {
  return apiFetch<{ scanId: string }>('/v1/scans', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
