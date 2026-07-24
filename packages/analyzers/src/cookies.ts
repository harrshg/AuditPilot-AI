import { AnalyzerIssue, CapturedCookie } from './types.js';

const SENSITIVE_NAME_PATTERN = /(session|auth|token|jwt|login|remember)/i;

export function analyzeCookies(cookies: CapturedCookie[]): AnalyzerIssue[] {
  const issues: AnalyzerIssue[] = [];

  const insecureCookies = cookies.filter((cookie) => !cookie.secure);
  if (insecureCookies.length > 0) {
    issues.push({
      title: 'Cookies missing the Secure flag',
      description: 'One or more cookies are set without the Secure flag, allowing them to be transmitted over unencrypted HTTP.',
      category: 'SECURITY',
      severity: 'MEDIUM',
      evidence: { cookieNames: insecureCookies.map((cookie) => cookie.name) },
      recommendationText: 'Set the Secure attribute on all cookies, especially session and authentication cookies.',
    });
  }

  const sensitiveWithoutHttpOnly = cookies.filter(
    (cookie) => SENSITIVE_NAME_PATTERN.test(cookie.name) && !cookie.httpOnly,
  );
  if (sensitiveWithoutHttpOnly.length > 0) {
    issues.push({
      title: 'Sensitive cookies missing the HttpOnly flag',
      description: 'Cookies that appear to hold session or authentication data are accessible to client-side JavaScript, increasing XSS impact.',
      category: 'SECURITY',
      severity: 'HIGH',
      evidence: { cookieNames: sensitiveWithoutHttpOnly.map((cookie) => cookie.name) },
      recommendationText: 'Set the HttpOnly attribute on session and authentication cookies.',
    });
  }

  const missingSameSite = cookies.filter((cookie) => !cookie.sameSite || cookie.sameSite.toLowerCase() === 'none');
  if (missingSameSite.length > 0) {
    issues.push({
      title: 'Cookies missing a strict SameSite policy',
      description: 'Cookies without SameSite=Lax or SameSite=Strict are more exposed to cross-site request forgery.',
      category: 'SECURITY',
      severity: 'LOW',
      evidence: { cookieNames: missingSameSite.map((cookie) => cookie.name) },
      recommendationText: 'Set SameSite=Lax or SameSite=Strict on cookies unless cross-site delivery is explicitly required.',
    });
  }

  return issues;
}
