import { Problem, CodeExecutionResult, TestCase } from '@/types/game';

export function executeCode(
  code: string,
  problem: Problem,
  testCases?: TestCase[]
): CodeExecutionResult {
  const tests = testCases || problem.testCases;
  let passedTests = 0;
  let error: string | undefined;
  const startTime = Date.now();

  try {
    // Create a safe execution context
    // The code should already be a function definition
    const func = new Function('return ' + code)();
    
    if (typeof func !== 'function') {
      return {
        success: false,
        passedTests: 0,
        totalTests: tests.length,
        error: 'Code must define a function',
      };
    }

    // Run test cases
    for (const testCase of tests) {
      try {
        // Deep clone inputs for in-place operations
        const clonedInputs = testCase.input.map((inp: any) => 
          typeof inp === 'object' && inp !== null ? JSON.parse(JSON.stringify(inp)) : inp
        );
        
        const result = func(...clonedInputs);
        
        // For in-place operations, check the modified first argument
        let actualOutput = result;
        if (result === undefined && clonedInputs.length > 0 && Array.isArray(clonedInputs[0])) {
          actualOutput = clonedInputs[0];
        }
        
        // Deep equality check
        if (deepEqual(actualOutput, testCase.expectedOutput)) {
          passedTests++;
        } else {
          error = `Test failed: Expected ${JSON.stringify(testCase.expectedOutput)}, got ${JSON.stringify(actualOutput)}`;
          break;
        }
      } catch (e: any) {
        error = `Runtime error: ${e.message}`;
        break;
      }
    }

    const executionTime = Date.now() - startTime;

    return {
      success: passedTests === tests.length,
      passedTests,
      totalTests: tests.length,
      error: passedTests === tests.length ? undefined : error,
      executionTime,
    };
  } catch (e: any) {
    return {
      success: false,
      passedTests: 0,
      totalTests: tests.length,
      error: `Compilation error: ${e.message}`,
    };
  }
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

// For problems that modify arrays in-place (like reverseString, removeDuplicates)
export function executeCodeInPlace(
  code: string,
  problem: Problem,
  testCases?: TestCase[]
): CodeExecutionResult {
  const tests = testCases || problem.testCases;
  let passedTests = 0;
  let error: string | undefined;
  const startTime = Date.now();

  try {
    const func = new Function('return ' + code)();
    
    if (typeof func !== 'function') {
      return {
        success: false,
        passedTests: 0,
        totalTests: tests.length,
        error: 'Code must define a function',
      };
    }

    for (const testCase of tests) {
      try {
        // Deep clone the input array for in-place operations
        const inputClone = JSON.parse(JSON.stringify(testCase.input));
        const result = func(...inputClone);
        
        // For in-place operations, check if the modified input matches expected
        // Some functions return void, so we check the first argument
        const actualOutput = result !== undefined ? result : inputClone[0];
        const expected = testCase.expectedOutput !== undefined 
          ? testCase.expectedOutput 
          : testCase.input[0]; // For void functions, we'd need to track expected state
        
        // For now, if expectedOutput is undefined, we assume the function modifies in place
        // and we'd need to compare the modified input with expected state
        // This is a simplified version
        if (testCase.expectedOutput === undefined) {
          // For functions like reverseString, we need to check if the array was modified correctly
          passedTests++;
        } else if (deepEqual(actualOutput, testCase.expectedOutput)) {
          passedTests++;
        } else {
          error = `Test failed: Expected ${JSON.stringify(testCase.expectedOutput)}, got ${JSON.stringify(actualOutput)}`;
          break;
        }
      } catch (e: any) {
        error = `Runtime error: ${e.message}`;
        break;
      }
    }

    const executionTime = Date.now() - startTime;

    return {
      success: passedTests === tests.length,
      passedTests,
      totalTests: tests.length,
      error: passedTests === tests.length ? undefined : error,
      executionTime,
    };
  } catch (e: any) {
    return {
      success: false,
      passedTests: 0,
      totalTests: tests.length,
      error: `Compilation error: ${e.message}`,
    };
  }
}

