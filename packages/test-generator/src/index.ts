export * from './types.js';
export * from './generator.js';

import { GeneratedTestFile } from './types.js';

export function createGeneratedTestFile(fileName: string, content: string): GeneratedTestFile {
  return { fileName, content };
}
