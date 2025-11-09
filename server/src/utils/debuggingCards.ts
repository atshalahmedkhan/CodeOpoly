// Debugging Card System (Chance/Community Chest)

export interface DebuggingCard {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
  effect: {
    money?: number; // Positive = gain, Negative = lose
    move?: number; // Move spaces (positive = forward, negative = backward)
    property?: string; // Property-related effect
  };
}

export const CHANCE_CARDS: DebuggingCard[] = [
  {
    id: 'chance-1',
    type: 'positive',
    title: 'Pass All Test Cases!',
    message: 'Your code passed all test cases! Collect 100 Algo-Coins.',
    effect: { money: 100 },
  },
  {
    id: 'chance-2',
    type: 'positive',
    title: 'Code Review Bonus',
    message: 'Your code review was excellent! Collect 150 Algo-Coins.',
    effect: { money: 150 },
  },
  {
    id: 'chance-3',
    type: 'positive',
    title: 'Performance Optimization',
    message: 'You optimized your algorithm! Move forward 3 spaces.',
    effect: { move: 3 },
  },
  {
    id: 'chance-4',
    type: 'negative',
    title: 'Security Vulnerability Found',
    message: 'A security vulnerability was found in your code. Pay 50 Algo-Coins.',
    effect: { money: -50 },
  },
  {
    id: 'chance-5',
    type: 'negative',
    title: 'Time Limit Exceeded',
    message: 'Your solution exceeded the time limit. Pay 75 Algo-Coins.',
    effect: { money: -75 },
  },
  {
    id: 'chance-6',
    type: 'neutral',
    title: 'Code Refactoring',
    message: 'Time to refactor! No effect this turn.',
    effect: {},
  },
];

export const COMMUNITY_CHEST_CARDS: DebuggingCard[] = [
  {
    id: 'chest-1',
    type: 'positive',
    title: 'Bug Bounty Reward',
    message: 'You found a critical bug! Collect 200 Algo-Coins.',
    effect: { money: 200 },
  },
  {
    id: 'chest-2',
    type: 'positive',
    title: 'Open Source Contribution',
    message: 'Your open source contribution was merged! Collect 100 Algo-Coins.',
    effect: { money: 100 },
  },
  {
    id: 'chest-3',
    type: 'positive',
    title: 'Algorithm Improvement',
    message: 'You improved your algorithm complexity! Move forward 2 spaces.',
    effect: { move: 2 },
  },
  {
    id: 'chest-4',
    type: 'negative',
    title: 'Memory Leak Detected',
    message: 'A memory leak was detected in your code. Pay 60 Algo-Coins.',
    effect: { money: -60 },
  },
  {
    id: 'chest-5',
    type: 'negative',
    title: 'Code Smell Found',
    message: 'Code smells detected. Pay 40 Algo-Coins for refactoring.',
    effect: { money: -40 },
  },
  {
    id: 'chest-6',
    type: 'neutral',
    title: 'Code Review',
    message: 'Your code is under review. No effect this turn.',
    effect: {},
  },
];

export function getRandomChanceCard(): DebuggingCard {
  return CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
}

export function getRandomCommunityChestCard(): DebuggingCard {
  return COMMUNITY_CHEST_CARDS[Math.floor(Math.random() * COMMUNITY_CHEST_CARDS.length)];
}










