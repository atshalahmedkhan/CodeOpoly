import { GameEvent, Problem } from '@/types/game';
import { getRandomProblem } from './problems';

export type EventType = 'code-sprint' | 'chaos-mode' | 'code-review' | 'stack-overflow-ban';

export interface EventCard {
  type: EventType;
  title: string;
  description: string;
  effect: string;
}

export const communityChestCards: EventCard[] = [
  {
    type: 'code-sprint',
    title: 'Code Sprint!',
    description: 'All players compete to solve the same problem. First to solve gets $500!',
    effect: 'All players get the same easy problem. First to solve earns $500.',
  },
  {
    type: 'code-sprint',
    title: 'Quick Challenge',
    description: 'Solve an easy problem in under 2 minutes to earn $300!',
    effect: 'Easy problem with 2-minute time limit. Success = $300.',
  },
  {
    type: 'code-sprint',
    title: 'Speed Bonus',
    description: 'Your next problem solved gives double money!',
    effect: 'Next property purchase or problem solved gives 2x money.',
  },
];

export const chanceCards: EventCard[] = [
  {
    type: 'chaos-mode',
    title: 'Chaos Mode: No Loops!',
    description: 'Your next problem must be solved without using any loops (for/while).',
    effect: 'Next problem cannot use loops. Must use recursion or array methods.',
  },
  {
    type: 'chaos-mode',
    title: 'Chaos Mode: One-Liner',
    description: 'Your next solution must be under 5 lines of code!',
    effect: 'Next problem solution must be 5 lines or less.',
  },
  {
    type: 'chaos-mode',
    title: 'Language Switch',
    description: 'You must solve the next problem using a different approach than usual.',
    effect: 'Next problem requires a different algorithmic approach.',
  },
  {
    type: 'stack-overflow-ban',
    title: 'Stack Overflow Ban',
    description: 'You cannot use any documentation or external help for your next problem!',
    effect: 'Next problem must be solved from memory only.',
  },
  {
    type: 'code-review',
    title: 'Code Review Challenge',
    description: 'Explain someone else\'s solution. If correct, earn $200!',
    effect: 'Review and explain a solution. Success = $200.',
  },
];

export function getRandomCommunityChestCard(): EventCard {
  return communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
}

export function getRandomChanceCard(): EventCard {
  return chanceCards[Math.floor(Math.random() * chanceCards.length)];
}

export function createGameEvent(card: EventCard, participants: string[]): GameEvent {
  const baseEvent: GameEvent = {
    type: card.type,
    description: card.description,
    participants,
    startTime: Date.now(),
    duration: card.type === 'code-sprint' ? 120 : 300, // 2-5 minutes
  };

  if (card.type === 'code-sprint') {
    return {
      ...baseEvent,
      problem: getRandomProblem('arrays', 'easy'),
    };
  }

  return baseEvent;
}

