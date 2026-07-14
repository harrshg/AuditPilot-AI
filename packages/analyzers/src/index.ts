export type AnalyzerModule = {
  name: string;
  enabled: boolean;
};

export const analyzerModules: AnalyzerModule[] = [
  { name: 'security-headers', enabled: true },
  { name: 'network-health', enabled: true },
  { name: 'frontend-errors', enabled: true },
];
