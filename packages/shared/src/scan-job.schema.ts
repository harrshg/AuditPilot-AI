import { z } from 'zod';

import { ScanConfigSchema } from './scan-config.schema.js';

export const ScanJobStatusSchema = z.enum([
  'queued',
  'running',
  'completed',
  'failed',
  'cancelled',
]);

export const ScanJobPrioritySchema = z.enum([
  'low',
  'normal',
  'high',
  'urgent',
]);

export const ScanJobTriggerSchema = z.enum([
  'manual',
  'scheduled',
  'api',
  'retry',
]);

export const ScanJobTimestampsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  queuedAt: z.string().datetime(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  failedAt: z.string().datetime().optional(),
  cancelledAt: z.string().datetime().optional(),
});

export const ScanJobProgressSchema = z.object({
  currentStep: z.string().min(1).optional(),
  pagesDiscovered: z.number().int().min(0).default(0),
  pagesVisited: z.number().int().min(0).default(0),
  networkRequestsCaptured: z.number().int().min(0).default(0),
  consoleMessagesCaptured: z.number().int().min(0).default(0),
  issuesFound: z.number().int().min(0).default(0),
  percentComplete: z.number().min(0).max(100).default(0),
});

export const ScanJobErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  retryable: z.boolean().default(false),
  details: z.record(z.unknown()).optional(),
});

export const ScanJobPayloadSchema = z.object({
  scanConfig: ScanConfigSchema,
  requestedByUserId: z.string().min(1).optional(),
  projectId: z.string().min(1).optional(),
  correlationId: z.string().min(1).optional(),
});

export const ScanJobSchema = z.object({
  id: z.string().min(1),
  status: ScanJobStatusSchema.default('queued'),
  priority: ScanJobPrioritySchema.default('normal'),
  trigger: ScanJobTriggerSchema.default('manual'),
  payload: ScanJobPayloadSchema,
  progress: ScanJobProgressSchema.default({}),
  attempts: z.number().int().min(0).default(0),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  lockOwnerId: z.string().min(1).optional(),
  lockedUntil: z.string().datetime().optional(),
  error: ScanJobErrorSchema.optional(),
  timestamps: ScanJobTimestampsSchema,
});

export const CreateScanJobInputSchema = z.object({
  id: z.string().min(1),
  priority: ScanJobPrioritySchema.default('normal'),
  trigger: ScanJobTriggerSchema.default('manual'),
  payload: ScanJobPayloadSchema,
  maxAttempts: z.number().int().min(1).max(10).default(3),
  now: z.string().datetime().optional(),
});

export const ScanJobStateTransitionSchema = z.object({
  from: ScanJobStatusSchema,
  to: ScanJobStatusSchema,
});

export type ScanJobStatus = z.infer<typeof ScanJobStatusSchema>;
export type ScanJobPriority = z.infer<typeof ScanJobPrioritySchema>;
export type ScanJobTrigger = z.infer<typeof ScanJobTriggerSchema>;
export type ScanJobTimestamps = z.infer<typeof ScanJobTimestampsSchema>;
export type ScanJobProgress = z.infer<typeof ScanJobProgressSchema>;
export type ScanJobError = z.infer<typeof ScanJobErrorSchema>;
export type ScanJobPayload = z.infer<typeof ScanJobPayloadSchema>;
export type ScanJob = z.infer<typeof ScanJobSchema>;
export type CreateScanJobInput = z.infer<typeof CreateScanJobInputSchema>;
export type ScanJobStateTransition = z.infer<typeof ScanJobStateTransitionSchema>;

export function createScanJob(input: CreateScanJobInput): ScanJob {
  const parsedInput = CreateScanJobInputSchema.parse(input);
  const now = parsedInput.now ?? new Date().toISOString();

  return ScanJobSchema.parse({
    id: parsedInput.id,
    status: 'queued',
    priority: parsedInput.priority,
    trigger: parsedInput.trigger,
    payload: parsedInput.payload,
    maxAttempts: parsedInput.maxAttempts,
    timestamps: {
      createdAt: now,
      updatedAt: now,
      queuedAt: now,
    },
  });
}

export function canTransitionScanJob(from: ScanJobStatus, to: ScanJobStatus): boolean {
  const allowedTransitions: Record<ScanJobStatus, ScanJobStatus[]> = {
    queued: ['running', 'cancelled'],
    running: ['completed', 'failed', 'cancelled'],
    completed: [],
    failed: ['queued'],
    cancelled: [],
  };

  return allowedTransitions[from].includes(to);
}

export function transitionScanJobStatus(job: ScanJob, to: ScanJobStatus, now = new Date().toISOString()): ScanJob {
  const parsedJob = ScanJobSchema.parse(job);

  if (!canTransitionScanJob(parsedJob.status, to)) {
    throw new Error(`Invalid scan job transition from ${parsedJob.status} to ${to}`);
  }

  const timestamps: ScanJobTimestamps = {
    ...parsedJob.timestamps,
    updatedAt: now,
  };

  if (to === 'running') {
    timestamps.startedAt = now;
  }

  if (to === 'completed') {
    timestamps.completedAt = now;
  }

  if (to === 'failed') {
    timestamps.failedAt = now;
  }

  if (to === 'cancelled') {
    timestamps.cancelledAt = now;
  }

  return ScanJobSchema.parse({
    ...parsedJob,
    status: to,
    timestamps,
  });
}

export function updateScanJobProgress(job: ScanJob, progress: Partial<ScanJobProgress>, now = new Date().toISOString()): ScanJob {
  const parsedJob = ScanJobSchema.parse(job);

  return ScanJobSchema.parse({
    ...parsedJob,
    progress: {
      ...parsedJob.progress,
      ...progress,
    },
    timestamps: {
      ...parsedJob.timestamps,
      updatedAt: now,
    },
  });
}
