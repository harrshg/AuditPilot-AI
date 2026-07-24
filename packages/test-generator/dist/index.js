export * from './types.js';
export * from './generator.js';
export function createGeneratedTestFile(fileName, content) {
    return { fileName, content };
}
