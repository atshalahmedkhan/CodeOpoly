import mongoose, { Schema, Document } from 'mongoose';

export interface ITestCase {
  input: any[];
  expectedOutput: any;
  description?: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'arrays' | 'strings' | 'dp' | 'graphs' | 'trees' | 'sql' | 'system-design';
  functionName: string;
  functionSignatures: {
    python: string;
    javascript: string;
    cpp: string;
    java: string;
  };
  testCases: ITestCase[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  timeLimit: number; // seconds
}

const TestCaseSchema = new Schema<ITestCase>({
  input: [Schema.Types.Mixed],
  expectedOutput: Schema.Types.Mixed,
  description: String,
});

const ProblemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  category: { type: String, enum: ['arrays', 'strings', 'dp', 'graphs', 'trees', 'sql', 'system-design'], required: true },
  functionName: { type: String, required: true },
  functionSignatures: {
    python: String,
    javascript: String,
    cpp: String,
    java: String,
  },
  testCases: [TestCaseSchema],
  examples: [{
    input: String,
    output: String,
    explanation: String,
  }],
  timeLimit: { type: Number, default: 300 }, // 5 minutes default
});

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);

