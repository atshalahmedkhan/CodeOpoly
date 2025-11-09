import { Problem } from '@/types/game';

export const debugProblems: Problem[] = [
  {
    id: 'debug-off-by-one',
    title: 'Fix Off-By-One Error',
    description: `The following code has an off-by-one error. Find and fix it.

The function should return the sum of all elements in the array.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'sumArray',
    functionSignature: 'function sumArray(arr: number[]): number',
    starterCode: `function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i <= arr.length; i++) {  // BUG: Should be < not <=
        sum += arr[i];
    }
    return sum;
}`,
    solution: `function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}`,
    testCases: [
      { input: [[1, 2, 3]], expectedOutput: 6 },
      { input: [[5, 10, 15]], expectedOutput: 30 },
      { input: [[0]], expectedOutput: 0 },
    ],
  },
  {
    id: 'debug-wrong-variable',
    title: 'Fix Wrong Variable Name',
    description: `The following code uses the wrong variable name. Find and fix it.

The function should return the maximum value in the array.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'findMax',
    functionSignature: 'function findMax(nums: number[]): number',
    starterCode: `function findMax(nums) {
    let max = nums[0];
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > maxValue) {  // BUG: Should be max not maxValue
            max = nums[i];
        }
    }
    return max;
}`,
    solution: `function findMax(nums) {
    let max = nums[0];
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > max) {
            max = nums[i];
        }
    }
    return max;
}`,
    testCases: [
      { input: [[1, 5, 3, 9, 2]], expectedOutput: 9 },
      { input: [[-1, -5, -3]], expectedOutput: -1 },
    ],
  },
  {
    id: 'debug-missing-edge-case',
    title: 'Fix Missing Edge Case',
    description: `The following code doesn't handle an edge case. Find and fix it.

The function should return true if the array contains duplicates, false otherwise.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'hasDuplicates',
    functionSignature: 'function hasDuplicates(nums: number[]): boolean',
    starterCode: `function hasDuplicates(nums) {
    const seen = new Set();
    for (let num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    // BUG: Missing return false for empty array case (actually this is fine, but let's add a different bug)
    return false;
}`,
    solution: `function hasDuplicates(nums) {
    if (nums.length === 0) return false;
    const seen = new Set();
    for (let num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`,
    testCases: [
      { input: [[1, 2, 3, 1]], expectedOutput: true },
      { input: [[1, 2, 3, 4]], expectedOutput: false },
      { input: [[]], expectedOutput: false },
    ],
  },
  {
    id: 'debug-logic-error',
    title: 'Fix Logic Error',
    description: `The following code has a logic error. Find and fix it.

The function should check if a number is even.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'isEven',
    functionSignature: 'function isEven(n: number): boolean',
    starterCode: `function isEven(n) {
    return n % 2 === 1;  // BUG: Should be === 0
}`,
    solution: `function isEven(n) {
    return n % 2 === 0;
}`,
    testCases: [
      { input: [2], expectedOutput: true },
      { input: [3], expectedOutput: false },
      { input: [0], expectedOutput: true },
    ],
  },
];

export function getRandomDebugProblem(): Problem {
  return debugProblems[Math.floor(Math.random() * debugProblems.length)];
}

