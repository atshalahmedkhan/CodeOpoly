import axios from 'axios';
import { getApiUrl } from '../lib/session';

export type CodeLanguage = 'javascript' | 'python' | 'cpp' | 'java';
export interface CodeTestResult { index: number; passed: boolean; input: string; expected: string; actual?: string; }
export interface CodeResult { status: 'ok'|'wrong_answer'|'compile_error'|'runtime_error'|'timeout'|'service_unavailable'; allPassed: boolean; tests: CodeTestResult[]; message?: string; }
interface CodeRequest { gameId: string; playerId: string; challengeId: string; language: CodeLanguage; sourceCode: string; }

async function request(path: 'run'|'submit', body: CodeRequest): Promise<CodeResult> {
  try {
    const { data } = await axios.post(`${getApiUrl()}/code/${path}`, body, { timeout: 30000 });
    return data;
  } catch (error: any) {
    const message = error.response?.data?.error || error.response?.data?.message || 'Code execution service is unavailable.';
    throw new Error(message);
  }
}
export const runCode = (body: CodeRequest) => request('run', body);
export const submitCode = (body: CodeRequest) => request('submit', body);
