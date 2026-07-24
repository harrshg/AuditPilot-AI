import { listQueuedScans } from '@auditpilot/db';
import { canVisitUrl, validateScanScope } from '@auditpilot/shared';

import { processScan } from './pipeline.js';
import { runDueSchedules } from './scheduler.js';

export * from './pipeline.js';
export * from './scan-config-mapper.js';
export * from './scheduler.js';

export const workerService = {
  name: '@auditpilot/worker',
  validateScanScope,
  canVisitUrl,
};

const POLL_INTERVAL_MS = Number(process.env.WORKER_POLL_INTERVAL_MS ?? 5000);
let isPolling = false;

export async function pollOnce(): Promise<void> {
  if (isPolling) {
    return;
  }

  isPolling = true;
  try {
    await runDueSchedules();

    const queuedScans = await listQueuedScans(5);
    for (const scan of queuedScans) {
      await processScan(scan.id, scan.scanConfigId);
    }
  } finally {
    isPolling = false;
  }
}

export function startWorker(): NodeJS.Timeout {
  process.stdout.write('AuditPilot worker started. Polling for queued scans...\n');
  return setInterval(() => {
    pollOnce().catch((error) => {
      process.stderr.write(`Worker poll failed: ${error instanceof Error ? error.message : String(error)}\n`);
    });
  }, POLL_INTERVAL_MS);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  startWorker();
}
