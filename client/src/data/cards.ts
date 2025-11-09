export interface Card {
  id: string;
  text: string;
  action: 'addMoney' | 'subtractMoney' | 'move' | 'jail' | 'getOutOfJail' | 'repairs' | 'advanceToGo' | 'goBack';
  value?: number;
  targetPosition?: number;
  type: 'chance' | 'community-chest';
}

export const CHANCE_CARDS: Card[] = [
  {
    id: 'chance-1',
    text: 'PR Merged! Collect $200',
    action: 'addMoney',
    value: 200,
    type: 'chance',
  },
  {
    id: 'chance-2',
    text: 'Null Pointer Exception! Pay $100',
    action: 'subtractMoney',
    value: 100,
    type: 'chance',
  },
  {
    id: 'chance-3',
    text: 'Bug Fix Bonus! Collect $50',
    action: 'addMoney',
    value: 50,
    type: 'chance',
  },
  {
    id: 'chance-4',
    text: 'Code Review Passed! Collect $150',
    action: 'addMoney',
    value: 150,
    type: 'chance',
  },
  {
    id: 'chance-5',
    text: 'Memory Leak Detected! Pay $150',
    action: 'subtractMoney',
    value: 150,
    type: 'chance',
  },
  {
    id: 'chance-6',
    text: 'Advance to GO. Collect $200',
    action: 'advanceToGo',
    targetPosition: 0,
    type: 'chance',
  },
  {
    id: 'chance-7',
    text: 'Go to Debug Hell. Do not pass GO, do not collect $200',
    action: 'jail',
    targetPosition: 10,
    type: 'chance',
  },
  {
    id: 'chance-8',
    text: 'Deployment Failed! Pay $50',
    action: 'subtractMoney',
    value: 50,
    type: 'chance',
  },
  {
    id: 'chance-9',
    text: 'Performance Optimization! Collect $100',
    action: 'addMoney',
    value: 100,
    type: 'chance',
  },
  {
    id: 'chance-10',
    text: 'Security Vulnerability! Pay $200',
    action: 'subtractMoney',
    value: 200,
    type: 'chance',
  },
  {
    id: 'chance-11',
    text: 'Open Source Contribution! Collect $25',
    action: 'addMoney',
    value: 25,
    type: 'chance',
  },
  {
    id: 'chance-12',
    text: 'API Rate Limit Exceeded! Pay $75',
    action: 'subtractMoney',
    value: 75,
    type: 'chance',
  },
  {
    id: 'chance-13',
    text: 'Go back 3 spaces',
    action: 'goBack',
    value: 3,
    type: 'chance',
  },
  {
    id: 'chance-14',
    text: 'Database Migration Success! Collect $125',
    action: 'addMoney',
    value: 125,
    type: 'chance',
  },
  {
    id: 'chance-15',
    text: 'Server Crash! Pay $100',
    action: 'subtractMoney',
    value: 100,
    type: 'chance',
  },
  {
    id: 'chance-16',
    text: 'Advance to AWS Street',
    action: 'move',
    targetPosition: 8,
    type: 'chance',
  },
];

export const COMMUNITY_CHEST_CARDS: Card[] = [
  {
    id: 'cc-1',
    text: 'PR Approved! Collect $200',
    action: 'addMoney',
    value: 200,
    type: 'community-chest',
  },
  {
    id: 'cc-2',
    text: 'Bank Error in Your Favor! Collect $200',
    action: 'addMoney',
    value: 200,
    type: 'community-chest',
  },
  {
    id: 'cc-3',
    text: 'Doctor Fee. Pay $50',
    action: 'subtractMoney',
    value: 50,
    type: 'community-chest',
  },
  {
    id: 'cc-4',
    text: 'Get Out of Debug Hell Free',
    action: 'getOutOfJail',
    type: 'community-chest',
  },
  {
    id: 'cc-5',
    text: 'Go to Debug Hell',
    action: 'jail',
    targetPosition: 10,
    type: 'community-chest',
  },
  {
    id: 'cc-6',
    text: 'Holiday Fund Matures! Collect $100',
    action: 'addMoney',
    value: 100,
    type: 'community-chest',
  },
  {
    id: 'cc-7',
    text: 'Income Tax Refund! Collect $20',
    action: 'addMoney',
    value: 20,
    type: 'community-chest',
  },
  {
    id: 'cc-8',
    text: 'Life Insurance Matures! Collect $100',
    action: 'addMoney',
    value: 100,
    type: 'community-chest',
  },
  {
    id: 'cc-9',
    text: 'Pay Hospital Fees of $100',
    action: 'subtractMoney',
    value: 100,
    type: 'community-chest',
  },
  {
    id: 'cc-10',
    text: 'Pay School Fees of $150',
    action: 'subtractMoney',
    value: 150,
    type: 'community-chest',
  },
  {
    id: 'cc-11',
    text: 'Receive $25 Consultancy Fee',
    action: 'addMoney',
    value: 25,
    type: 'community-chest',
  },
  {
    id: 'cc-12',
    text: 'You are Assessed for Street Repairs: $40 per house, $115 per hotel',
    action: 'repairs',
    value: 40,
    type: 'community-chest',
  },
  {
    id: 'cc-13',
    text: 'You have won Second Prize in a Beauty Contest! Collect $10',
    action: 'addMoney',
    value: 10,
    type: 'community-chest',
  },
  {
    id: 'cc-14',
    text: 'You inherit $100',
    action: 'addMoney',
    value: 100,
    type: 'community-chest',
  },
  {
    id: 'cc-15',
    text: 'From Sale of Stock, You Get $50',
    action: 'addMoney',
    value: 50,
    type: 'community-chest',
  },
  {
    id: 'cc-16',
    text: 'Advance to GO',
    action: 'advanceToGo',
    targetPosition: 0,
    type: 'community-chest',
  },
];

// Helper to get random card
export const drawChanceCard = (): Card => {
  return CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
};

export const drawCommunityChestCard = (): Card => {
  return COMMUNITY_CHEST_CARDS[Math.floor(Math.random() * COMMUNITY_CHEST_CARDS.length)];
};

