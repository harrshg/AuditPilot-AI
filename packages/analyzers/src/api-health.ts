import { AnalyzerIssue, CapturedNetworkRequest } from './types.js';

const SLOW_REQUEST_THRESHOLD_MS = 2000;
const API_RESOURCE_TYPES = new Set(['xhr', 'fetch']);

export function analyzeNetworkRequests(requests: CapturedNetworkRequest[]): AnalyzerIssue[] {
  const issues: AnalyzerIssue[] = [];

  const failedRequests = requests.filter((request) => request.failed);
  if (failedRequests.length > 0) {
    issues.push({
      title: 'Network requests failed to complete',
      description: `${failedRequests.length} request(s) failed at the network level (connection reset, DNS failure, timeout, etc.).`,
      category: 'NETWORK',
      severity: failedRequests.length >= 5 ? 'HIGH' : 'MEDIUM',
      affectedUrl: failedRequests[0]?.requestUrl,
      evidence: {
        count: failedRequests.length,
        samples: failedRequests.slice(0, 5).map((request) => ({ url: request.requestUrl, reason: request.failureText })),
      },
      recommendationText: 'Investigate network failures and add retry/backoff handling on the client for transient failures.',
    });
  }

  const apiRequests = requests.filter((request) => isApiRequest(request));
  const serverErrors = apiRequests.filter((request) => (request.statusCode ?? 0) >= 500);
  if (serverErrors.length > 0) {
    issues.push({
      title: 'API endpoints returned server errors',
      description: `${serverErrors.length} API request(s) returned a 5xx status code.`,
      category: 'BACKEND_API',
      severity: 'HIGH',
      affectedEndpoint: serverErrors[0]?.requestUrl,
      evidence: {
        count: serverErrors.length,
        samples: serverErrors.slice(0, 5).map((request) => ({ url: request.requestUrl, status: request.statusCode })),
      },
      recommendationText: 'Add server-side error handling, structured logging, and monitoring for the affected endpoint(s).',
    });
  }

  const clientErrors = apiRequests.filter((request) => {
    const status = request.statusCode ?? 0;
    return status >= 400 && status < 500;
  });
  if (clientErrors.length > 0) {
    issues.push({
      title: 'API endpoints returned client errors',
      description: `${clientErrors.length} API request(s) returned a 4xx status code, which may indicate broken frontend/backend contracts.`,
      category: 'BACKEND_API',
      severity: 'MEDIUM',
      affectedEndpoint: clientErrors[0]?.requestUrl,
      evidence: {
        count: clientErrors.length,
        samples: clientErrors.slice(0, 5).map((request) => ({ url: request.requestUrl, status: request.statusCode })),
      },
      recommendationText: 'Verify request payloads, authentication, and routing between the frontend and the API.',
    });
  }

  const slowRequests = requests.filter((request) => (request.durationMs ?? 0) > SLOW_REQUEST_THRESHOLD_MS);
  if (slowRequests.length > 0) {
    issues.push({
      title: 'Slow network requests detected',
      description: `${slowRequests.length} request(s) took longer than ${SLOW_REQUEST_THRESHOLD_MS}ms to complete.`,
      category: 'PERFORMANCE',
      severity: slowRequests.length >= 5 ? 'HIGH' : 'MEDIUM',
      affectedUrl: slowRequests[0]?.requestUrl,
      evidence: {
        count: slowRequests.length,
        samples: slowRequests.slice(0, 5).map((request) => ({ url: request.requestUrl, durationMs: request.durationMs })),
      },
      recommendationText: 'Profile and optimize slow endpoints, or add caching/pagination where appropriate.',
    });
  }

  return issues;
}

function isApiRequest(request: CapturedNetworkRequest): boolean {
  if (request.resourceType && API_RESOURCE_TYPES.has(request.resourceType.toLowerCase())) {
    return true;
  }

  return request.requestUrl.includes('/api/');
}
