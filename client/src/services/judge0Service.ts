import axios from 'axios';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_JUDGE0_API_KEY || '';

interface TestResult {
  passed: boolean;
  input: any[];
  expected: any;
  actual?: any;
  error?: string;
  executionTime?: number;
}

const LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
};

export async function executeCode(
  code: string,
  language: string,
  testCases: Array<{ input: any[]; expectedOutput: any }>
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  if (!RAPIDAPI_KEY) {
    // Fallback to client-side execution for development
    return executeCodeClientSide(code, language, testCases);
  }

  const languageId = LANGUAGE_IDS[language.toLowerCase()];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // Execute each test case
  for (const testCase of testCases) {
    try {
      // Submit code
      const submitResponse = await axios.post(
        `${JUDGE0_API_URL}/submissions`,
        {
          source_code: code,
          language_id: languageId,
          stdin: JSON.stringify(testCase.input),
          wait: true,
        },
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );

      const submissionId = submitResponse.data.token;

      // Poll for result
      let result;
      let attempts = 0;
      while (attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const resultResponse = await axios.get(
          `${JUDGE0_API_URL}/submissions/${submissionId}`,
          {
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        result = resultResponse.data;
        
        if (result.status.id > 2) { // Finished
          break;
        }
        
        attempts++;
      }

      if (result.status.id === 3) { // Accepted
        const output = result.stdout?.trim() || '';
        const expected = JSON.stringify(testCase.expectedOutput);
        const actual = output;
        
        // Try to parse output as JSON, otherwise compare as string
        let parsedOutput;
        try {
          parsedOutput = JSON.parse(output);
        } catch {
          parsedOutput = output;
        }

        const passed = deepEqual(parsedOutput, testCase.expectedOutput);
        
        results.push({
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: parsedOutput,
          executionTime: result.time,
        });
      } else {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          error: result.stderr || result.compile_output || result.message || 'Execution failed',
        });
      }
    } catch (error: any) {
      results.push({
        passed: false,
        input: testCase.input,
        expected: testCase.expectedOutput,
        error: error.message || 'Network error',
      });
    }
  }

  return results;
}

function executeCodeClientSide(
  code: string,
  language: string,
  testCases: Array<{ input: any[]; expectedOutput: any }>
): TestResult[] {
  const results: TestResult[] = [];

  try {
    // Simple client-side execution (for development)
    const func = new Function('return ' + code)();
    
    if (typeof func !== 'function') {
      return testCases.map(tc => ({
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput,
        error: 'Code must define a function',
      }));
    }

    for (const testCase of testCases) {
      try {
        const clonedInputs = testCase.input.map((inp: any) => 
          typeof inp === 'object' && inp !== null ? JSON.parse(JSON.stringify(inp)) : inp
        );
        
        const result = func(...clonedInputs);
        const passed = deepEqual(result, testCase.expectedOutput);
        
        results.push({
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result,
        });
      } catch (e: any) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          error: `Runtime error: ${e.message}`,
        });
      }
    }
  } catch (e: any) {
    return testCases.map(tc => ({
      passed: false,
      input: tc.input,
      expected: tc.expectedOutput,
      error: `Compilation error: ${e.message}`,
    }));
  }

  return results;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

