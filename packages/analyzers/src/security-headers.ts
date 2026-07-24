import { AnalyzerIssue, CapturedResponseHeaders } from './types.js';

type RequiredHeaderRule = {
  header: string;
  title: string;
  description: string;
  severity: AnalyzerIssue['severity'];
};

const REQUIRED_HEADERS: RequiredHeaderRule[] = [
  {
    header: 'strict-transport-security',
    title: 'Missing Strict-Transport-Security header',
    description: 'The site does not send an HSTS header, allowing browsers to fall back to insecure HTTP connections.',
    severity: 'HIGH',
  },
  {
    header: 'content-security-policy',
    title: 'Missing Content-Security-Policy header',
    description: 'No CSP header was found, increasing the risk of cross-site scripting and data injection attacks.',
    severity: 'HIGH',
  },
  {
    header: 'x-content-type-options',
    title: 'Missing X-Content-Type-Options header',
    description: 'The site does not send X-Content-Type-Options: nosniff, allowing MIME type sniffing attacks.',
    severity: 'MEDIUM',
  },
  {
    header: 'x-frame-options',
    title: 'Missing X-Frame-Options header',
    description: 'Without X-Frame-Options (or an equivalent CSP frame-ancestors directive), the site may be vulnerable to clickjacking.',
    severity: 'MEDIUM',
  },
  {
    header: 'referrer-policy',
    title: 'Missing Referrer-Policy header',
    description: 'No Referrer-Policy header was found, which may leak full URLs to third parties via the Referer header.',
    severity: 'LOW',
  },
  {
    header: 'permissions-policy',
    title: 'Missing Permissions-Policy header',
    description: 'No Permissions-Policy header was found to restrict access to sensitive browser features.',
    severity: 'LOW',
  },
];

export function analyzeSecurityHeaders(responses: CapturedResponseHeaders[]): AnalyzerIssue[] {
  if (responses.length === 0) {
    return [];
  }

  const issues: AnalyzerIssue[] = [];

  for (const rule of REQUIRED_HEADERS) {
    const missingOn = responses.filter((response) => !hasHeader(response.headers, rule.header));

    if (missingOn.length === 0) {
      continue;
    }

    issues.push({
      title: rule.title,
      description: rule.description,
      category: 'SECURITY',
      severity: rule.severity,
      affectedUrl: missingOn[0]?.url,
      evidence: {
        header: rule.header,
        missingOnUrlCount: missingOn.length,
        sampleUrls: missingOn.slice(0, 5).map((response) => response.url),
      },
      recommendationText: `Add the ${rule.header} response header on all pages and API responses.`,
    });
  }

  return issues;
}

function hasHeader(headers: Record<string, string>, headerName: string): boolean {
  return Object.keys(headers).some((key) => key.toLowerCase() === headerName);
}
