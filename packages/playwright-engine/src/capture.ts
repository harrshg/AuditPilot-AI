import type { CapturedConsoleLog, CapturedNetworkRequest, CapturedResponseHeaders } from '@auditpilot/analyzers';
import type { Page } from 'playwright';

export type CaptureHandles = {
  networkRequests: CapturedNetworkRequest[];
  responseHeaders: CapturedResponseHeaders[];
  consoleLogs: CapturedConsoleLog[];
  detach: () => void;
};

export function attachCapture(page: Page): CaptureHandles {
  const networkRequests: CapturedNetworkRequest[] = [];
  const responseHeaders: CapturedResponseHeaders[] = [];
  const consoleLogs: CapturedConsoleLog[] = [];
  const requestStartedAt = new Map<string, number>();

  const onRequest = (request: import('playwright').Request) => {
    requestStartedAt.set(request.url() + request.method(), Date.now());
  };

  const onResponse = async (response: import('playwright').Response) => {
    const request = response.request();
    const key = request.url() + request.method();
    const startedAt = requestStartedAt.get(key);
    const durationMs = startedAt ? Date.now() - startedAt : undefined;

    let headers: Record<string, string> = {};
    try {
      headers = await response.allHeaders();
    } catch {
      headers = {};
    }

    responseHeaders.push({ url: response.url(), headers });

    networkRequests.push({
      pageUrl: page.url(),
      requestUrl: response.url(),
      method: request.method(),
      statusCode: response.status(),
      durationMs,
      resourceType: request.resourceType(),
      failed: response.status() >= 400,
    });
  };

  const onRequestFailed = (request: import('playwright').Request) => {
    networkRequests.push({
      pageUrl: page.url(),
      requestUrl: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      failed: true,
      failureText: request.failure()?.errorText,
    });
  };

  const onConsole = (message: import('playwright').ConsoleMessage) => {
    consoleLogs.push({
      pageUrl: page.url(),
      type: message.type(),
      text: message.text(),
    });
  };

  const onPageError = (error: Error) => {
    consoleLogs.push({
      pageUrl: page.url(),
      type: 'pageerror',
      text: error.message,
    });
  };

  page.on('request', onRequest);
  page.on('response', onResponse);
  page.on('requestfailed', onRequestFailed);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  return {
    networkRequests,
    responseHeaders,
    consoleLogs,
    detach: () => {
      page.off('request', onRequest);
      page.off('response', onResponse);
      page.off('requestfailed', onRequestFailed);
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
    },
  };
}

export async function captureScreenshot(page: Page, filePath: string): Promise<void> {
  await page.screenshot({ path: filePath, fullPage: true });
}
