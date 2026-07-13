export type GeneratedTestFile = {
  fileName: string;
  content: string;
};

export function createGeneratedTestFile(fileName: string, content: string): GeneratedTestFile {
  return { fileName, content };
}
