import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Pluggable secrets provider interface. The default implementation stores
 * secrets as local JSON files (gitignored) for development. In production,
 * swap this out for a real secrets manager (Vault, AWS Secrets Manager, etc.)
 * by implementing the same interface.
 */
export interface SecretsProvider {
  store(ref: string, value: unknown): Promise<void>;
  resolve<T>(ref: string): Promise<T | undefined>;
}

export class LocalFileSecretsProvider implements SecretsProvider {
  constructor(private readonly baseDir: string = join(process.cwd(), '.secrets')) {}

  async store(ref: string, value: unknown): Promise<void> {
    await mkdir(this.baseDir, { recursive: true });
    await writeFile(join(this.baseDir, `${ref}.json`), JSON.stringify(value), 'utf8');
  }

  async resolve<T>(ref: string): Promise<T | undefined> {
    try {
      const raw = await readFile(join(this.baseDir, `${ref}.json`), 'utf8');
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }
}

export const defaultSecretsProvider: SecretsProvider = new LocalFileSecretsProvider();
