import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { AccessibilitySignal } from '@auditpilot/analyzers';
import { canVisitUrl, ScanConfig } from '@auditpilot/shared';
import type { Page } from 'playwright';

import { captureScreenshot } from './capture.js';

export type CrawledPage = {
  url: string;
  title?: string;
  statusCode?: number;
  loadTimeMs?: number;
  screenshotPath?: string;
  discoveredFrom?: string;
};

export type CrawlResult = {
  pages: CrawledPage[];
  accessibilitySignals: AccessibilitySignal[];
};

export type CrawlOptions = {
  screenshotDir?: string;
};

type QueueEntry = {
  url: string;
  depth: number;
  discoveredFrom?: string;
};

export async function crawlSite(page: Page, scanConfig: ScanConfig, options: CrawlOptions = {}): Promise<CrawlResult> {
  const pages: CrawledPage[] = [];
  const accessibilitySignals: AccessibilitySignal[] = [];
  const visited = new Set<string>();
  const queue: QueueEntry[] = [{ url: scanConfig.websiteUrl, depth: 0 }];

  if (options.screenshotDir) {
    await mkdir(options.screenshotDir, { recursive: true });
  }

  while (queue.length > 0 && pages.length < scanConfig.maxPages) {
    const entry = queue.shift();
    if (!entry) {
      break;
    }

    const normalizedUrl = normalizeUrl(entry.url);
    if (visited.has(normalizedUrl)) {
      continue;
    }
    visited.add(normalizedUrl);

    const decision = canVisitUrl(normalizedUrl, scanConfig);
    if (!decision.allowed) {
      continue;
    }

    const startedAt = Date.now();
    const response = await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => null);
    const loadTimeMs = Date.now() - startedAt;

    const title = await page.title().catch(() => undefined);
    let screenshotPath: string | undefined;

    if (options.screenshotDir) {
      screenshotPath = join(options.screenshotDir, `${slugifyUrl(normalizedUrl)}.png`);
      await captureScreenshot(page, screenshotPath).catch(() => {
        screenshotPath = undefined;
      });
    }

    pages.push({
      url: normalizedUrl,
      title,
      statusCode: response?.status(),
      loadTimeMs,
      screenshotPath,
      discoveredFrom: entry.discoveredFrom,
    });

    accessibilitySignals.push(await extractAccessibilitySignal(page, normalizedUrl));

    if (entry.depth < scanConfig.maxCrawlDepth) {
      const links = await extractSameOriginLinks(page, normalizedUrl);
      for (const link of links) {
        if (!visited.has(normalizeUrl(link))) {
          queue.push({ url: link, depth: entry.depth + 1, discoveredFrom: normalizedUrl });
        }
      }
    }
  }

  return { pages, accessibilitySignals };
}

async function extractSameOriginLinks(page: Page, currentUrl: string): Promise<string[]> {
  const origin = new URL(currentUrl).origin;

  const hrefs: string[] = await page
    .$$eval('a[href]', (anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href))
    .catch(() => []);

  return hrefs.filter((href) => {
    try {
      return new URL(href).origin === origin;
    } catch {
      return false;
    }
  });
}

async function extractAccessibilitySignal(page: Page, url: string): Promise<AccessibilitySignal> {
  const signal = await page
    .evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const imagesWithoutAlt = images.filter((image) => !image.getAttribute('alt')).length;

      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      const inputsWithoutLabel = inputs.filter((input) => {
        const id = input.getAttribute('id');
        const hasLabelFor = id ? document.querySelector(`label[for="${id}"]`) !== null : false;
        const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
        const wrappedInLabel = input.closest('label') !== null;
        return !hasLabelFor && !hasAriaLabel && !wrappedInLabel;
      }).length;

      return {
        totalImages: images.length,
        imagesWithoutAlt,
        totalInputs: inputs.length,
        inputsWithoutLabel,
        missingLangAttribute: !document.documentElement.getAttribute('lang'),
        missingDocumentTitle: !document.title,
      };
    })
    .catch(() => ({
      totalImages: 0,
      imagesWithoutAlt: 0,
      totalInputs: 0,
      inputsWithoutLabel: 0,
      missingLangAttribute: false,
      missingDocumentTitle: false,
    }));

  return { url, ...signal };
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

function slugifyUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').slice(0, 100) || 'page';
}
