import { prisma } from './client.js';

const DEFAULT_OWNER_EMAIL = 'system@auditpilot.local';
const DEFAULT_PROJECT_NAME = 'Default Project';

export async function getOrCreateDefaultProject(): Promise<{ userId: string; projectId: string }> {
  const owner = await prisma.user.upsert({
    where: { email: DEFAULT_OWNER_EMAIL },
    update: {},
    create: {
      email: DEFAULT_OWNER_EMAIL,
      name: 'AuditPilot System',
      role: 'OWNER',
    },
  });

  const existingProject = await prisma.project.findFirst({
    where: { ownerId: owner.id, name: DEFAULT_PROJECT_NAME },
  });

  const project = existingProject
    ? existingProject
    : await prisma.project.create({
        data: {
          ownerId: owner.id,
          name: DEFAULT_PROJECT_NAME,
          description: 'Automatically created project for scans submitted without an explicit project.',
          baseUrl: 'https://default.local',
        },
      });

  return { userId: owner.id, projectId: project.id };
}
