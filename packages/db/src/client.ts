import { PrismaClient } from '@prisma/client';

type GlobalWithPrisma = typeof globalThis & {
  __auditpilotPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

export const prisma = globalForPrisma.__auditpilotPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__auditpilotPrisma = prisma;
}
