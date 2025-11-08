export interface Problem {
  id: string;
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
  testCases: Array<{
    input: any[];
    expectedOutput: any;
    description?: string;
  }>;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string;
  propertyTier: 'brown' | 'lightblue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'darkblue';
}

export const problemBank: Problem[] = [
  // EASY PROBLEMS (Brown/Light Blue)
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'twoSum',
    functionSignatures: {
      python: 'def twoSum(nums: List[int], target: int) -> List[int]:',
      javascript: 'function twoSum(nums, target) {',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {',
      java: 'public int[] twoSum(int[] nums, int target) {',
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2] },
      { input: [[3, 3], 6], expectedOutput: [0, 1] },
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
    ],
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    propertyTier: 'brown',
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: 'easy',
    category: 'strings',
    functionName: 'reverseString',
    functionSignatures: {
      python: 'def reverseString(s: List[str]) -> None:',
      javascript: 'function reverseString(s) {',
      cpp: 'void reverseString(vector<char>& s) {',
      java: 'public void reverseString(char[] s) {',
    },
    testCases: [
      { input: [['h', 'e', 'l', 'l', 'o']], expectedOutput: undefined },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], expectedOutput: undefined },
    ],
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: 'The string is reversed in-place.' },
    ],
    constraints: '1 <= s.length <= 10^5\ns[i] is a printable ascii character.',
    propertyTier: 'lightblue',
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    difficulty: 'easy',
    category: 'strings',
    functionName: 'isPalindrome',
    functionSignatures: {
      python: 'def isPalindrome(s: str) -> bool:',
      javascript: 'function isPalindrome(s) {',
      cpp: 'bool isPalindrome(string s) {',
      java: 'public boolean isPalindrome(String s) {',
    },
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expectedOutput: true },
      { input: ['race a car'], expectedOutput: false },
      { input: [' '], expectedOutput: true },
    ],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
    ],
    propertyTier: 'lightblue',
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    difficulty: 'easy',
    category: 'arrays',
    functionName: 'containsDuplicate',
    functionSignatures: {
      python: 'def containsDuplicate(nums: List[int]) -> bool:',
      javascript: 'function containsDuplicate(nums) {',
      cpp: 'bool containsDuplicate(vector<int>& nums) {',
      java: 'public boolean containsDuplicate(int[] nums) {',
    },
    testCases: [
      { input: [[1, 2, 3, 1]], expectedOutput: true },
      { input: [[1, 2, 3, 4]], expectedOutput: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expectedOutput: true },
    ],
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: '1 appears twice.' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'All elements are distinct.' },
    ],
    propertyTier: 'brown',
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
    functionSignatures: {
      python: 'def maxProfit(prices: List[int]) -> int:',
      javascript: 'function maxProfit(prices) {',
      cpp: 'int maxProfit(vector<int>& prices) {',
      java: 'public int maxProfit(int[] prices) {',
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expectedOutput: 5 },
      { input: [[7, 6, 4, 3, 1]], expectedOutput: 0 },
    ],
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' },
    ],
    propertyTier: 'lightblue',
  },

  // MEDIUM PROBLEMS (Pink/Orange/Red)
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    difficulty: 'medium',
    category: 'strings',
    functionName: 'lengthOfLongestSubstring',
    functionSignatures: {
      python: 'def lengthOfLongestSubstring(s: str) -> int:',
      javascript: 'function lengthOfLongestSubstring(s) {',
      cpp: 'int lengthOfLongestSubstring(string s) {',
      java: 'public int lengthOfLongestSubstring(String s) {',
    },
    testCases: [
      { input: ['abcabcbb'], expectedOutput: 3 },
      { input: ['bbbbb'], expectedOutput: 1 },
      { input: ['pwwkew'], expectedOutput: 3 },
    ],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
    ],
    propertyTier: 'pink',
  },
  {
    id: 'three-sum',
    title: '3Sum',
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    difficulty: 'medium',
    category: 'arrays',
    functionName: 'threeSum',
    functionSignatures: {
      python: 'def threeSum(nums: List[int]) -> List[List[int]]:',
      javascript: 'function threeSum(nums) {',
      cpp: 'vector<vector<int>> threeSum(vector<int>& nums) {',
      java: 'public List<List<Integer>> threeSum(int[] nums) {',
    },
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expectedOutput: [[-1, -1, 2], [-1, 0, 1]] },
      { input: [[0, 1, 1]], expectedOutput: [] },
      { input: [[0, 0, 0]], expectedOutput: [[0, 0, 0]] },
    ],
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'The distinct triplets are [-1,0,1] and [-1,-1,2].' },
    ],
    propertyTier: 'orange',
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    difficulty: 'medium',
    category: 'arrays',
    functionName: 'maxArea',
    functionSignatures: {
      python: 'def maxArea(height: List[int]) -> int:',
      javascript: 'function maxArea(height) {',
      cpp: 'int maxArea(vector<int>& height) {',
      java: 'public int maxArea(int[] height) {',
    },
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expectedOutput: 49 },
      { input: [[1, 1]], expectedOutput: 1 },
    ],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The above vertical lines form a container with area = 49.' },
    ],
    propertyTier: 'red',
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    difficulty: 'medium',
    category: 'strings',
    functionName: 'groupAnagrams',
    functionSignatures: {
      python: 'def groupAnagrams(strs: List[str]) -> List[List[str]]:',
      javascript: 'function groupAnagrams(strs) {',
      cpp: 'vector<vector<string>> groupAnagrams(vector<string>& strs) {',
      java: 'public List<List<String>> groupAnagrams(String[] strs) {',
    },
    testCases: [
      { input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expectedOutput: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
      { input: [['']], expectedOutput: [['']] },
      { input: [['a']], expectedOutput: [['a']] },
    ],
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Anagrams are grouped together.' },
    ],
    propertyTier: 'pink',
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    difficulty: 'medium',
    category: 'dp',
    functionName: 'coinChange',
    functionSignatures: {
      python: 'def coinChange(coins: List[int], amount: int) -> int:',
      javascript: 'function coinChange(coins, amount) {',
      cpp: 'int coinChange(vector<int>& coins, int amount) {',
      java: 'public int coinChange(int[] coins, int amount) {',
    },
    testCases: [
      { input: [[1, 2, 5], 11], expectedOutput: 3 },
      { input: [[2], 3], expectedOutput: -1 },
      { input: [[1], 0], expectedOutput: 0 },
    ],
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make amount with given coins.' },
    ],
    propertyTier: 'orange',
  },

  // HARD PROBLEMS (Yellow/Green/Dark Blue)
  {
    id: 'median-arrays',
    title: 'Median of Two Sorted Arrays',
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    difficulty: 'hard',
    category: 'arrays',
    functionName: 'findMedianSortedArrays',
    functionSignatures: {
      python: 'def findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:',
      javascript: 'function findMedianSortedArrays(nums1, nums2) {',
      cpp: 'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {',
      java: 'public double findMedianSortedArrays(int[] nums1, int[] nums2) {',
    },
    testCases: [
      { input: [[1, 3], [2]], expectedOutput: 2.0 },
      { input: [[1, 2], [3, 4]], expectedOutput: 2.5 },
    ],
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'Merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' },
    ],
    propertyTier: 'yellow',
  },
  {
    id: 'trapping-rain',
    title: 'Trapping Rain Water',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    difficulty: 'hard',
    category: 'arrays',
    functionName: 'trap',
    functionSignatures: {
      python: 'def trap(height: List[int]) -> int:',
      javascript: 'function trap(height) {',
      cpp: 'int trap(vector<int>& height) {',
      java: 'public int trap(int[] height) {',
    },
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expectedOutput: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expectedOutput: 9 },
    ],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.' },
    ],
    propertyTier: 'green',
  },
  {
    id: 'longest-valid-parentheses',
    title: 'Longest Valid Parentheses',
    description: `Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.`,
    difficulty: 'hard',
    category: 'strings',
    functionName: 'longestValidParentheses',
    functionSignatures: {
      python: 'def longestValidParentheses(s: str) -> int:',
      javascript: 'function longestValidParentheses(s) {',
      cpp: 'int longestValidParentheses(string s) {',
      java: 'public int longestValidParentheses(String s) {',
    },
    testCases: [
      { input: ['(()'], expectedOutput: 2 },
      { input: [')()())'], expectedOutput: 4 },
      { input: [''], expectedOutput: 0 },
    ],
    examples: [
      { input: 's = "(()"', output: '2', explanation: 'The longest valid parentheses substring is "()".' },
      { input: 's = ")()())"', output: '4', explanation: 'The longest valid parentheses substring is "()()".' },
    ],
    propertyTier: 'darkblue',
  },
];

export function getProblemByTier(tier: string): Problem | undefined {
  return problemBank.find(p => p.propertyTier === tier);
}

export function getProblemByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Problem[] {
  return problemBank.filter(p => p.difficulty === difficulty);
}

export function getRandomProblem(tier?: string, difficulty?: 'easy' | 'medium' | 'hard'): Problem {
  let filtered = problemBank;
  if (tier) {
    filtered = filtered.filter(p => p.propertyTier === tier);
  }
  if (difficulty) {
    filtered = filtered.filter(p => p.difficulty === difficulty);
  }
  if (filtered.length === 0) {
    return problemBank[0]; // Fallback
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomProblemByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Problem {
  return getRandomProblem(undefined, difficulty);
}

const COLOR_TO_TIER: Record<string, Problem['propertyTier']> = {
  '#8B4513': 'brown',
  '#87CEEB': 'lightblue',
  '#FF69B4': 'pink',
  '#FF8C00': 'orange',
  '#DC143C': 'red',
  '#FFD700': 'yellow',
  '#228B22': 'green',
  '#00008B': 'darkblue',
};

const TIER_TO_DIFFICULTY: Record<Problem['propertyTier'], 'easy' | 'medium' | 'hard'> = {
  brown: 'easy',
  lightblue: 'easy',
  pink: 'medium',
  orange: 'medium',
  red: 'medium',
  yellow: 'hard',
  green: 'hard',
  darkblue: 'hard',
};

interface PropertyLike {
  color?: string;
  propertyTier?: Problem['propertyTier'];
}

export function getProblemForProperty(property: PropertyLike | null | undefined): Problem | null {
  if (!property) {
    return null;
  }

  const tier = property.propertyTier
    || (property.color ? COLOR_TO_TIER[property.color] : undefined);

  if (!tier) {
    return null;
  }

  const difficulty = TIER_TO_DIFFICULTY[tier];
  const problems = problemBank.filter(p => p.propertyTier === tier && p.difficulty === difficulty);

  if (problems.length === 0) {
    return getRandomProblemByDifficulty(difficulty);
  }

  return problems[Math.floor(Math.random() * problems.length)];
}

