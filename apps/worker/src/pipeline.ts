import { join } from 'node:path';

import { computeScores, computeTestCoverageScore, runAnalyzers } from '@auditpilot/analyzers';
import type { AnalyzerScanData } from '@auditpilot/analyzers';
import { runAiEngine } from '@auditpilot/ai-engine';
import {
  addConsoleLogs,
  addGeneratedTests,
  addIssues,
  addNetworkRequests,
  addPages,
  addRecommendations,
  addScanEvent,
  defaultSecretsProvider,
  getScanConfigById,
  markScanCompleted,
  markScanFailed,
  markScanRunning,
} from '@auditpilot/db';
import type { Prisma as PrismaNamespace } from '@auditpilot/db';
import { runPlaywrightEngine } from '@auditpilot/playwright-engine';
import type { Credential } from '@auditpilot/shared';
import { generateTestForIssue } from '@auditpilot/test-generator';

import { buildScanConfigFromRow } from './scan-config-mapper.js';

const STORAGE_ROOT = join(process.cwd(), 'storage');

export async function processScan(scanId: string, scanConfigId: string | null): Promise<void> {
  if (!scanConfigId) {
    await markScanFailed(scanId, 'Scan has no associated ScanConfig; cannot run the crawl pipeline.');
    return;
  }

  await markScanRunning(scanId);
  await addScanEvent(scanId, 'INFO', 'Scan started.');

  try {
    const scanConfigRow = await getScanConfigById(scanConfigId);
    if (!scanConfigRow) {
      throw new Error(`ScanConfig '${scanConfigId}' was not found.`);
    }

    const credential = scanConfigRow.credentialsSecretRef
      ? await defaultSecretsProvider.resolve<Credential>(scanConfigRow.credentialsSecretRef)
      : undefined;

    const scanConfig = buildScanConfigFromRow(scanConfigRow, credential);

    await addScanEvent(scanId, 'INFO', `Crawling ${scanConfig.websiteUrl} (mode: ${scanConfig.scanMode}).`);

    const engineResult = await runPlaywrightEngine(scanConfig, {
      screenshotDir: join(STORAGE_ROOT, 'screenshots', scanId),
      storageStatePath: join(STORAGE_ROOT, 'sessions', `${scanConfigId}.json`),
    });

    if (engineResult.loginMessage) {
      await addScanEvent(scanId, 'INFO', `Login: ${engineResult.loginMessage}`);
    }

    await addScanEvent(scanId, 'INFO', `Crawl complete: ${engineResult.pages.length} page(s) visited.`);

    const analyzerData: AnalyzerScanData = {
      responseHeaders: engineResult.responseHeaders,
      cookies: engineResult.cookies.map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expires: cookie.expires,
      })),
      consoleLogs: engineResult.consoleLogs,
      networkRequests: engineResult.networkRequests,
      pages: engineResult.pages,
      accessibilitySignals: engineResult.accessibilitySignals,
    };

    const issues = runAnalyzers(analyzerData);
    const scores = computeScores(issues);

    await addScanEvent(scanId, 'INFO', `Analysis complete: ${issues.length} issue(s) found.`);

    const aiResult = await runAiEngine(issues);

    await addPages(scanId, engineResult.pages);
    await addNetworkRequests(scanId, engineResult.networkRequests);
    await addConsoleLogs(scanId, engineResult.consoleLogs);

    const createdIssues = await addIssues(
      scanId,
      issues.map((issue, index) => ({
        title: issue.title,
        description: issue.description,
        category: issue.category,
        severity: issue.severity,
        affectedUrl: issue.affectedUrl,
        affectedEndpoint: issue.affectedEndpoint,
        evidence: {
          ...(issue.evidence ?? {}),
          rootCause: aiResult.rootCauses[index],
        } as PrismaNamespace.InputJsonValue,
        recommendationText: issue.recommendationText,
      })),
    );

    await addRecommendations(
      scanId,
      aiResult.recommendations.map((recommendation, index) => ({
        issueId: createdIssues[index]?.id,
        title: recommendation.title,
        detail: recommendation.detail,
        priority: recommendation.priority,
        estimatedEffort: recommendation.estimatedEffort,
      })),
    );

    const generatedTests = issues.map((issue, index) => {
      const test = generateTestForIssue(issue);
      return {
        issueId: createdIssues[index]?.id,
        fileName: test.fileName,
        framework: 'playwright',
        content: test.content,
      };
    });

    await addGeneratedTests(scanId, generatedTests);

    const testCoverageScore = computeTestCoverageScore(issues.length, generatedTests.length);

    await markScanCompleted(scanId, { ...scores, testCoverageScore });
    await addScanEvent(scanId, 'INFO', `Scan completed. Overall health score: ${scores.overallHealthScore ?? 'n/a'}.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while processing scan.';
    await addScanEvent(scanId, 'ERROR', message);
    await markScanFailed(scanId, message);
  }
}
