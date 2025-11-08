export type ProblemDifficulty = 'easy' | 'medium' | 'hard';
export type ProblemCategory = 'arrays' | 'strings' | 'dp' | 'graphs' | 'trees' | 'sql' | 'system-design';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  category: ProblemCategory;
  functionName: string;
  functionSignature: string;
  testCases: TestCase[];
  starterCode: string;
  solution: string;
}

export interface TestCase {
  input: any[];
  expectedOutput: any;
  description?: string;
}

export interface Property {
  id: string;
  name: string;
  position: number;
  price: number;
  rent: number;
  rentWithHouse: number;
  rentWithHotel: number;
  houseCost: number;
  hotelCost: number;
  category: ProblemCategory;
  color: string;
  ownerId?: string;
  houses: number; // 0-4 (4 houses = hotel)
  isRailroad?: boolean;
  isUtility?: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  position: number;
  money: number;
  properties: string[]; // Property IDs
  inJail: boolean;
  jailTurns: number;
  isActive: boolean;
  sabotageCards: SabotageCard[];
}

export interface SabotageCard {
  id: string;
  name: string;
  description: string;
  effect: string;
}

export interface GameState {
  id: string;
  currentPlayerId: string;
  players: Player[];
  properties: Property[];
  turnNumber: number;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winnerId?: string;
  activeDuel?: CodeDuel;
  activeEvent?: GameEvent;
  diceRoll?: number[];
}

export interface CodeDuel {
  id: string;
  challengerId: string;
  defenderId: string;
  propertyId: string;
  problem: Problem;
  challengerCode: string;
  defenderCode: string;
  challengerSolved: boolean;
  defenderSolved: boolean;
  challengerTime?: number;
  defenderTime?: number;
  startTime: number;
  timeLimit: number; // seconds
  status: 'active' | 'challenger-won' | 'defender-won' | 'timeout';
}

export interface GameEvent {
  type: 'code-sprint' | 'chaos-mode' | 'code-review' | 'stack-overflow-ban';
  description: string;
  participants: string[];
  problem?: Problem;
  startTime: number;
  duration: number;
}

export interface CodeExecutionResult {
  success: boolean;
  passedTests: number;
  totalTests: number;
  error?: string;
  executionTime?: number;
}

