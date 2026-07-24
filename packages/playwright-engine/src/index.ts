import type { CapturedConsoleLog, CapturedNetworkRequest, CapturedResponseHeaders } from '@auditpilot/analyzers';
import { ScanConfig } from '@auditpilot/shared';
import { chromium } from 'playwright';

import { attachCapture } from './capture.js';
import { CrawlOptions, crawlSite } from './crawler.js';
import { performLogin } from './login.js';
import { resolveStorageStatePath, saveStorageState } from './session.js';

export * from './session.js';
export * from './login.js';
export * from './capture.js';
export * from './crawler.js';

export type PlaywrightEngineConfig = Pick<ScanConfig, 'websiteUrl' | 'allowedDomains' | 'excludedPaths' | 'safety'>;

export function createPlaywrightEngineConfig(config: PlaywrightEngineConfig): PlaywrightEngineConfig {
  return config;
}

export type RunEngineOptions = CrawlOptions & {
  storageStatePath?: string;
};

export type EngineResult = {
  pages: Awaited<ReturnType<typeof crawlSite>>['pages'];
  accessibilitySignals: Awaited<ReturnType<typeof crawlSite>>['accessibilitySignals'];
  networkRequests: CapturedNetworkRequest[];
  responseHeaders: CapturedResponseHeaders[];
  consoleLogs: CapturedConsoleLog[];
  cookies: Awaited<ReturnType<import('playwright').BrowserContext['cookies']>>;
  loginMessage?: string;
};

export async function runPlaywrightEngine(scanConfig: ScanConfig, options: RunEngineOptions = {}): Promise<EngineResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    const storageState = options.storageStatePath ? resolveStorageStatePath(options.storageStatePath) : undefined;
    const context = await browser.newContext(storageState ? { storageState } : {});
    const page = await context.newPage();

    let loginMessage: string | undefined;
    if (scanConfig.credentials) {
      const loginResult = await performLogin(page, scanConfig.credentials);
      loginMessage = loginResult.message;

      if (loginResult.success && options.storageStatePath) {
        await saveStorageState(context, options.storageStatePath);
      }
    }

    const capture = attachCapture(page);
    const { pages, accessibilitySignals } = await crawlSite(page, scanConfig, options);
    capture.detach();

    const cookies = await context.cookies();

    await context.close();

    return {
      pages,
      accessibilitySignals,
      networkRequests: capture.networkRequests,
      responseHeaders: capture.responseHeaders,
      consoleLogs: capture.consoleLogs,
      cookies,
      loginMessage,
    };
  } finally {
    await browser.close();
  }
}
