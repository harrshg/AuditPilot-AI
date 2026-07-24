export type IssueCategory =
  | 'SECURITY'
  | 'PERFORMANCE'
  | 'FRONTEND'
  | 'BACKEND_API'
  | 'NETWORK'
  | 'ACCESSIBILITY'
  | 'SERVER_CONFIG'
  | 'RELIABILITY'
  | 'TEST_COVERAGE';

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AnalyzerIssue = {
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  affectedUrl?: string;
  affectedEndpoint?: string;
  evidence?: Record<string, unknown>;
  recommendationText?: string;
};

export type CapturedResponseHeaders = {
  url: string;
  headers: Record<string, string>;
};

export type CapturedCookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite?: string;
  expires?: number;
};

export type CapturedConsoleLog = {
  pageUrl?: string;
  type: string;
  text: string;
};

export type CapturedNetworkRequest = {
  pageUrl?: string;
  requestUrl: string;
  method: string;
  statusCode?: number;
  durationMs?: number;
  failed?: boolean;
  failureText?: string;
  resourceType?: string;
};

export type CapturedPage = {
  url: string;
  title?: string;
  statusCode?: number;
  loadTimeMs?: number;
};

export type AccessibilitySignal = {
  url: string;
  imagesWithoutAlt: number;
  totalImages: number;
  inputsWithoutLabel: number;
  totalInputs: number;
  lowContrastElements?: number;
  missingLangAttribute?: boolean;
  missingDocumentTitle?: boolean;
};

export type AnalyzerScanData = {
  responseHeaders: CapturedResponseHeaders[];
  cookies: CapturedCookie[];
  consoleLogs: CapturedConsoleLog[];
  networkRequests: CapturedNetworkRequest[];
  pages: CapturedPage[];
  accessibilitySignals: AccessibilitySignal[];
};

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
