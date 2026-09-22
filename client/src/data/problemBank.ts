/** Public challenge metadata. Canonical tests and validators live only on the server. */
export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  functionName: string;
  functionSignatures: {
    python: string;
    javascript: string;
    cpp: string;
    java: string;
  };
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  constraints?: string;
  propertyTier?: string;
}
