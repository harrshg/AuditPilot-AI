import parser from 'cron-parser';

import { prisma } from './client.js';

export async function listDueScheduledConfigs(now: Date = new Date()) {
  return prisma.scanConfig.findMany({
    where: {
      scheduleEnabled: true,
      nextRunAt: { lte: now },
    },
  });
}

export function computeNextRunAt(cronExpression: string, from: Date = new Date()): Date {
  const interval = parser.parseExpression(cronExpression, { currentDate: from });
  return interval.next().toDate();
}

export async function scheduleScanConfig(scanConfigId: string, cronExpression: string) {
  const nextRunAt = computeNextRunAt(cronExpression);

  return prisma.scanConfig.update({
    where: { id: scanConfigId },
    data: {
      scheduleCron: cronExpression,
      scheduleEnabled: true,
      nextRunAt,
    },
  });
}

export async function disableScanConfigSchedule(scanConfigId: string) {
  return prisma.scanConfig.update({
    where: { id: scanConfigId },
    data: {
      scheduleEnabled: false,
      nextRunAt: null,
    },
  });
}

export async function recordScheduledRun(scanConfigId: string) {
  const scanConfig = await prisma.scanConfig.findUniqueOrThrow({ where: { id: scanConfigId } });

  if (!scanConfig.scheduleCron) {
    throw new Error(`ScanConfig '${scanConfigId}' does not have a schedule configured.`);
  }

  const now = new Date();
  const nextRunAt = computeNextRunAt(scanConfig.scheduleCron, now);

  return prisma.scanConfig.update({
    where: { id: scanConfigId },
    data: {
      lastScheduledRunAt: now,
      nextRunAt,
    },
  });
}
