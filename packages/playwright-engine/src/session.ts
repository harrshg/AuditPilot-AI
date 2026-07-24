import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { BrowserContext } from 'playwright';

export async function saveStorageState(context: BrowserContext, filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await context.storageState({ path: filePath });
}

export function storageStateExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function resolveStorageStatePath(filePath: string): string | undefined {
  return storageStateExists(filePath) ? filePath : undefined;
}
