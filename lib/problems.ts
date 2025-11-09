import { Problem, TestCase, ProblemCategory, ProblemDifficulty } from '@/types/game';

export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'twoSum',
    functionSignature: 'function twoSum(nums: number[], target: number): number[]',
    starterCode: `function twoSum(nums, target) {
    // Your code here
}`,
    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2] },
      { input: [[3, 3], 6], expectedOutput: [0, 1] },
    ],
  },
  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates from Sorted Array',
    description: `Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.

Return k after placing the final result in the first k slots of nums.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'removeDuplicates',
    functionSignature: 'function removeDuplicates(nums: number[]): number',
    starterCode: `function removeDuplicates(nums) {
    // Your code here
}`,
    solution: `function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    let k = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[i - 1]) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`,
    testCases: [
      { input: [[1, 1, 2]], expectedOutput: 2 },
      { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expectedOutput: 5 },
    ],
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: 'easy',
    category: 'strings',
    functionName: 'reverseString',
    functionSignature: 'function reverseString(s: string[]): void',
    starterCode: `function reverseString(s) {
    // Your code here
}`,
    solution: `function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}`,
    testCases: [
      { input: [['h', 'e', 'l', 'l', 'o']], expectedOutput: undefined },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], expectedOutput: undefined },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'easy',
    category: 'strings',
    functionName: 'isValid',
    functionSignature: 'function isValid(s: string): boolean',
    starterCode: `function isValid(s) {
    // Your code here
}`,
    solution: `function isValid(s) {
    const stack = [];
    const map = { '(': ')', '{': '}', '[': ']' };
    for (let char of s) {
        if (char in map) {
            stack.push(char);
        } else {
            if (stack.length === 0) return false;
            const top = stack.pop();
            if (map[top] !== char) return false;
        }
    }
    return stack.length === 0;
}`,
    testCases: [
      { input: ['()'], expectedOutput: true },
      { input: ['()[]{}'], expectedOutput: true },
      { input: ['(]'], expectedOutput: false },
      { input: ['([)]'], expectedOutput: false },
    ],
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.`,
    difficulty: 'medium',
    category: 'dp',
    functionName: 'maxSubArray',
    functionSignature: 'function maxSubArray(nums: number[]): number',
    starterCode: `function maxSubArray(nums) {
    // Your code here
}`,
    solution: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expectedOutput: 6 },
      { input: [[1]], expectedOutput: 1 },
      { input: [[5, 4, -1, 7, 8]], expectedOutput: 23 },
    ],
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    difficulty: 'easy',
    category: 'dp',
    functionName: 'climbStairs',
    functionSignature: 'function climbStairs(n: number): number',
    starterCode: `function climbStairs(n) {
    // Your code here
}`,
    solution: `function climbStairs(n) {
    if (n <= 2) return n;
    let first = 1;
    let second = 2;
    for (let i = 3; i <= n; i++) {
        const third = first + second;
        first = second;
        second = third;
    }
    return second;
}`,
    testCases: [
      { input: [2], expectedOutput: 2 },
      { input: [3], expectedOutput: 3 },
      { input: [5], expectedOutput: 8 },
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'search',
    functionSignature: 'function search(nums: number[], target: number): number',
    starterCode: `function search(nums, target) {
    // Your code here
}`,
    solution: `function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expectedOutput: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expectedOutput: -1 },
    ],
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'containsDuplicate',
    functionSignature: 'function containsDuplicate(nums: number[]): boolean',
    starterCode: `function containsDuplicate(nums) {
    // Your code here
}`,
    solution: `function containsDuplicate(nums) {
    const seen = new Set();
    for (let num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}`,
    testCases: [
      { input: [[1, 2, 3, 1]], expectedOutput: true },
      { input: [[1, 2, 3, 4]], expectedOutput: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expectedOutput: true },
    ],
  },
  {
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'maxProfit',
    functionSignature: 'function maxProfit(prices: number[]): number',
    starterCode: `function maxProfit(prices) {
    // Your code here
}`,
    solution: `function maxProfit(prices) {
    let minPrice = prices[0];
    let maxProfit = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else {
            maxProfit = Math.max(maxProfit, prices[i] - minPrice);
        }
    }
    return maxProfit;
}`,
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expectedOutput: 5 },
      { input: [[7, 6, 4, 3, 1]], expectedOutput: 0 },
    ],
  },
  {
    id: 'palindrome',
    title: 'Valid Palindrome',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    difficulty: 'easy',
    category: 'strings',
    functionName: 'isPalindrome',
    functionSignature: 'function isPalindrome(s: string): boolean',
    starterCode: `function isPalindrome(s) {
    // Your code here
}`,
    solution: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0;
    let right = cleaned.length - 1;
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expectedOutput: true },
      { input: ['race a car'], expectedOutput: false },
      { input: [' '], expectedOutput: true },
    ],
  },
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find(p => p.id === id);
}

export function getProblemsByCategory(category: ProblemCategory): Problem[] {
  return problems.filter(p => p.category === category);
}

export function getProblemsByDifficulty(difficulty: ProblemDifficulty): Problem[] {
  return problems.filter(p => p.difficulty === difficulty);
}

export function getRandomProblem(category?: ProblemCategory, difficulty?: ProblemDifficulty): Problem {
  let filtered = problems;
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (difficulty) {
    filtered = filtered.filter(p => p.difficulty === difficulty);
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
}

