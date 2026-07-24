import { createScan, listDueScheduledConfigs, recordScheduledRun } from '@auditpilot/db';

import { processScan } from './pipeline.js';

export async function runDueSchedules(): Promise<void> {
  const dueConfigs = await listDueScheduledConfigs();

  for (const config of dueConfigs) {
    const scan = await createScan({
      projectId: config.projectId,
      scanConfigId: config.id,
      mode: config.scanMode,
      targetUrl: config.websiteUrl,
    });

    await recordScheduledRun(config.id);
    await processScan(scan.id, config.id);
  }
}
