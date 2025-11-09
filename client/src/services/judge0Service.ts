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

  // Validate code is not empty
  if (!code || code.trim().length === 0) {
    return testCases.map(tc => ({
      passed: false,
      input: tc.input,
      expected: tc.expectedOutput,
      error: 'Code is empty. Please write a solution.',
    }));
  }

  try {
    // For JavaScript, wrap code in a function if it's not already
    let wrappedCode = code.trim();
    
    // Check if code is just whitespace or comments
    const codeWithoutComments = wrappedCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').trim();
    if (codeWithoutComments.length === 0) {
      return testCases.map(tc => ({
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput,
        error: 'Code contains only comments. Please write an implementation.',
      }));
    }

    // Try to execute the code
    let func;
    try {
      // For JavaScript, try to evaluate as a function
      if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
        // Check if it's already a function expression
        if (wrappedCode.startsWith('function') || wrappedCode.startsWith('(') || wrappedCode.startsWith('const') || wrappedCode.startsWith('let') || wrappedCode.startsWith('var')) {
          func = new Function('return ' + wrappedCode)();
        } else {
          // Try to wrap it
          func = new Function('return ' + wrappedCode)();
        }
      } else {
        func = new Function('return ' + wrappedCode)();
      }
    } catch (parseError: any) {
      return testCases.map(tc => ({
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput,
        error: `Syntax error: ${parseError.message}`,
      }));
    }
    
    if (typeof func !== 'function') {
      return testCases.map(tc => ({
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput,
        error: 'Code must define a function. Please implement a function that solves the problem.',
      }));
    }

    // Run all test cases
    for (const testCase of testCases) {
      try {
        const clonedInputs = testCase.input.map((inp: any) => 
          typeof inp === 'object' && inp !== null ? JSON.parse(JSON.stringify(inp)) : inp
        );
        
        const result = func(...clonedInputs);
        
        // Check for undefined/null results (likely incomplete implementation)
        if (result === undefined && testCase.expectedOutput !== undefined) {
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: undefined,
            error: 'Function returned undefined. Please implement the function logic.',
          });
          continue;
        }
        
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

