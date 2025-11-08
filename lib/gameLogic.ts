import { GameState, Player, Property, CodeDuel, Problem } from '@/types/game';
import { getRandomProblem } from './problems';

export function rollDice(): [number, number] {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
}

export function movePlayer(player: Player, diceRoll: [number, number], boardSize: number = 40): Player {
  const totalMove = diceRoll[0] + diceRoll[1];
  let newPosition = (player.position + totalMove) % boardSize;
  
  // Handle passing Go
  if (player.position + totalMove >= boardSize) {
    return {
      ...player,
      position: newPosition,
      money: player.money + 200, // Pass Go, collect $200
    };
  }
  
  return {
    ...player,
    position: newPosition,
  };
}

export function calculateRent(property: Property): number {
  if (property.houses === 0) {
    return property.rent;
  } else if (property.houses === 4) {
    return property.rentWithHotel;
  } else {
    // Linear interpolation for houses 1-3
    const houseRent = property.rentWithHouse;
    const baseRent = property.rent;
    return baseRent + (houseRent - baseRent) * (property.houses / 4);
  }
}

export function canBuyProperty(player: Player, property: Property): boolean {
  return player.money >= property.price && !property.ownerId;
}

export function buyProperty(player: Player, property: Property): { player: Player; property: Property } {
  return {
    player: {
      ...player,
      money: player.money - property.price,
      properties: [...player.properties, property.id],
    },
    property: {
      ...property,
      ownerId: player.id,
    },
  };
}

export function payRent(player: Player, property: Property, owner: Player): Player {
  const rent = calculateRent(property);
  return {
    ...player,
    money: player.money - rent,
  };
}

export function receiveRent(owner: Player, rent: number): Player {
  return {
    ...owner,
    money: owner.money + rent,
  };
}

export function createCodeDuel(
  challengerId: string,
  defenderId: string,
  property: Property,
  problem: Problem
): CodeDuel {
  return {
    id: `duel-${Date.now()}`,
    challengerId,
    defenderId,
    propertyId: property.id,
    problem,
    challengerCode: problem.starterCode,
    defenderCode: problem.starterCode,
    challengerSolved: false,
    defenderSolved: false,
    startTime: Date.now(),
    timeLimit: 300, // 5 minutes
    status: 'active',
  };
}

export function checkDuelWinner(duel: CodeDuel): CodeDuel {
  const now = Date.now();
  const elapsed = (now - duel.startTime) / 1000;
  
  // Check for timeout
  if (elapsed >= duel.timeLimit) {
    if (duel.challengerSolved && !duel.defenderSolved) {
      return { ...duel, status: 'challenger-won' };
    } else if (duel.defenderSolved && !duel.challengerSolved) {
      return { ...duel, status: 'defender-won' };
    } else {
      // Both solved or neither solved - defender wins by default
      return { ...duel, status: 'defender-won' };
    }
  }
  
  // Check if someone solved first
  if (duel.challengerSolved && !duel.defenderSolved) {
    return { ...duel, status: 'challenger-won', challengerTime: elapsed };
  } else if (duel.defenderSolved && !duel.challengerSolved) {
    return { ...duel, status: 'defender-won', defenderTime: elapsed };
  } else if (duel.challengerSolved && duel.defenderSolved) {
    // Both solved - faster one wins
    if (duel.challengerTime! < duel.defenderTime!) {
      return { ...duel, status: 'challenger-won' };
    } else {
      return { ...duel, status: 'defender-won' };
    }
  }
  
  return duel;
}

export function getNextPlayer(currentPlayerId: string, players: Player[]): string {
  const currentIndex = players.findIndex(p => p.id === currentPlayerId);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
}

export function checkGameOver(gameState: GameState): { isOver: boolean; winnerId?: string } {
  const activePlayers = gameState.players.filter(p => p.isActive && p.money > 0);
  
  if (activePlayers.length === 1) {
    return { isOver: true, winnerId: activePlayers[0].id };
  }
  
  if (activePlayers.length === 0) {
    // Find player with most net worth
    const playersWithNetWorth = gameState.players.map(player => ({
      player,
      netWorth: calculateNetWorth(player, gameState.properties),
    }));
    playersWithNetWorth.sort((a, b) => b.netWorth - a.netWorth);
    return { isOver: true, winnerId: playersWithNetWorth[0].player.id };
  }
  
  return { isOver: false };
}

export function calculateNetWorth(player: Player, properties: Property[]): number {
  const ownedProperties = properties.filter(p => p.ownerId === player.id);
  const propertyValue = ownedProperties.reduce((sum, prop) => {
    return sum + prop.price + (prop.houses * prop.houseCost);
  }, 0);
  return player.money + propertyValue;
}

export function canUpgradeProperty(player: Player, property: Property): boolean {
  if (property.ownerId !== player.id) return false;
  if (property.houses >= 4) return false; // Already has hotel
  if (player.money < property.houseCost) return false;
  return true;
}

export function upgradeProperty(player: Player, property: Property): { player: Player; property: Property } {
  return {
    player: {
      ...player,
      money: player.money - property.houseCost,
    },
    property: {
      ...property,
      houses: property.houses + 1,
    },
  };
}

