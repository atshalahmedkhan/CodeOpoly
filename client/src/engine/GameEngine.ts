import { Property, getPropertyByPosition } from '../data/properties';
import { Challenge } from '../data/challenges';
import { CHANCE_CARDS, COMMUNITY_CHEST_CARDS, Card, drawChanceCard, drawCommunityChestCard } from '../data/cards';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  position: number;
  money: number;
  properties: string[]; // Property IDs
  inJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
  bankrupt: boolean;
  doublesCount: number; // Track consecutive doubles
}

export interface GameState {
  id: string;
  roomCode: string;
  status: 'waiting' | 'active' | 'finished';
  players: Player[];
  currentTurn: string; // Player ID
  turnNumber: number;
  boardState: Property[];
  activeDuel?: {
    challengerId: string;
    defenderId: string;
    propertyId: string;
    status: 'active' | 'challenger-won' | 'defender-won';
    challengerTime?: number;
    defenderTime?: number;
  };
  chanceDeck: Card[];
  communityChestDeck: Card[];
  startTime: Date;
  winner?: string;
}

export class GameEngine {
  private gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = { ...gameState };
    // Initialize shuffled decks
    this.gameState.chanceDeck = [...CHANCE_CARDS].sort(() => Math.random() - 0.5);
    this.gameState.communityChestDeck = [...COMMUNITY_CHEST_CARDS].sort(() => Math.random() - 0.5);
  }

  // Roll dice and return result
  rollDice(): { dice1: number; dice2: number; total: number; isDouble: boolean } {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    return {
      dice1,
      dice2,
      total: dice1 + dice2,
      isDouble: dice1 === dice2,
    };
  }

  // Move player
  movePlayer(playerId: string, spaces: number): { newPosition: number; passedGo: boolean } {
    const player = this.getPlayer(playerId);
    if (!player) throw new Error('Player not found');

    const oldPosition = player.position;
    let newPosition = (oldPosition + spaces) % 40;
    const passedGo = oldPosition + spaces >= 40;

    if (passedGo && newPosition !== 0) {
      // Passed GO, collect $200
      player.money += 200;
    }

    player.position = newPosition;
    return { newPosition, passedGo };
  }

  // Handle landing on a space
  handleLand(playerId: string, position: number): {
    property: Property | null;
    canBuy: boolean;
    mustPayRent: boolean;
    rentAmount?: number;
    isSpecial: boolean;
    specialAction?: string;
  } {
    const property = getPropertyByPosition(position);
    const player = this.getPlayer(playerId);
    if (!player || !property) {
      return { property: null, canBuy: false, mustPayRent: false, isSpecial: false };
    }

    // Handle special spaces
    if (property.isSpecial) {
      return this.handleSpecialSpace(player, property);
    }

    // Regular property
    const isOwned = !!property.ownerId;
    const isOwnedByPlayer = property.ownerId === playerId;

    if (!isOwned) {
      return {
        property,
        canBuy: true,
        mustPayRent: false,
        isSpecial: false,
      };
    }

    if (isOwnedByPlayer) {
      return {
        property,
        canBuy: false,
        mustPayRent: false,
        isSpecial: false,
      };
    }

    // Owned by another player - calculate rent
    const rentAmount = this.calculateRent(property);
    return {
      property,
      canBuy: false,
      mustPayRent: true,
      rentAmount,
      isSpecial: false,
    };
  }

  // Handle special spaces
  private handleSpecialSpace(player: Player, property: Property): {
    property: Property | null;
    canBuy: boolean;
    mustPayRent: boolean;
    isSpecial: boolean;
    specialAction: string;
  } {
    switch (property.specialType) {
      case 'go':
        player.money += 200;
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'collect-salary',
        };
      
      case 'jail':
        // Just visiting
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'visiting',
        };
      
      case 'go-to-jail':
        this.enterJail(player.id);
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'go-to-jail',
        };
      
      case 'free-parking':
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'free-parking',
        };
      
      case 'chance':
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'draw-chance',
        };
      
      case 'community-chest':
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'draw-community-chest',
        };
      
      case 'tax':
        const taxAmount = property.position === 4 ? 200 : 100;
        player.money = Math.max(0, player.money - taxAmount);
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'pay-tax',
        };
      
      default:
        return {
          property,
          canBuy: false,
          mustPayRent: false,
          isSpecial: true,
          specialAction: 'none',
        };
    }
  }

  // Buy property
  buyProperty(playerId: string, propertyId: string): boolean {
    const player = this.getPlayer(playerId);
    const property = this.gameState.boardState.find(p => p.id === propertyId);
    
    if (!player || !property || property.ownerId) {
      return false;
    }

    if (player.money < property.cost) {
      return false;
    }

    player.money -= property.cost;
    property.ownerId = playerId;
    player.properties.push(propertyId);
    
    return true;
  }

  // Pay rent
  payRent(playerId: string, propertyId: string): boolean {
    const player = this.getPlayer(playerId);
    const property = this.gameState.boardState.find(p => p.id === propertyId);
    
    if (!player || !property || !property.ownerId || property.ownerId === playerId) {
      return false;
    }

    const rentAmount = this.calculateRent(property);
    if (player.money < rentAmount) {
      // Player can't afford rent - bankrupt
      this.handleBankruptcy(playerId, property.ownerId);
      return false;
    }

    const owner = this.getPlayer(property.ownerId);
    if (!owner) return false;

    player.money -= rentAmount;
    owner.money += rentAmount;
    
    return true;
  }

  // Calculate rent based on houses/hotels
  calculateRent(property: Property): number {
    if (!property.ownerId) return 0;
    
    const houses = property.houses || 0;
    if (houses === 0) {
      return property.baseRent;
    }
    
    // Use rent array: [base, 1 house, 2 houses, 3 houses, 4 houses, hotel]
    const rentIndex = Math.min(houses, property.rent.length - 1);
    return property.rent[rentIndex] || property.baseRent;
  }

  // Start code duel
  startDuel(challengerId: string, defenderId: string, propertyId: string, _challenge: Challenge): void {
    this.gameState.activeDuel = {
      challengerId,
      defenderId,
      propertyId,
      status: 'active',
    };
  }

  // Submit duel code
  submitDuelCode(playerId: string, _code: string, timeTaken: number, passed: boolean): void {
    if (!this.gameState.activeDuel) return;
    
    const isChallenger = this.gameState.activeDuel.challengerId === playerId;
    
    if (isChallenger) {
      this.gameState.activeDuel.challengerTime = timeTaken;
    } else {
      this.gameState.activeDuel.defenderTime = timeTaken;
    }

    // Determine winner
    if (passed) {
      if (isChallenger) {
        this.gameState.activeDuel.status = 'challenger-won';
      } else {
        this.gameState.activeDuel.status = 'defender-won';
      }
    }
  }

  // Enter jail (Debug Hell)
  enterJail(playerId: string): void {
    const player = this.getPlayer(playerId);
    if (!player) return;
    
    player.inJail = true;
    player.jailTurns = 0;
    player.position = 10; // Jail position
  }

  // Escape jail - 3 stage bug fix
  escapeJail(playerId: string, stage: 1 | 2 | 3, solved: boolean): boolean {
    const player = this.getPlayer(playerId);
    if (!player || !player.inJail) return false;

    if (solved) {
      if (stage === 3) {
        // All stages complete - escape jail
        player.inJail = false;
        player.jailTurns = 0;
        return true;
      }
      // Continue to next stage
      return false;
    }

    // Failed - stay in jail
    player.jailTurns += 1;
    if (player.jailTurns >= 3) {
      // Must pay to get out after 3 turns
      if (player.money >= 50) {
        player.money -= 50;
        player.inJail = false;
        player.jailTurns = 0;
        return true;
      }
    }
    
    return false;
  }

  // Draw card
  drawCard(type: 'chance' | 'community-chest'): Card {
    if (type === 'chance') {
      return drawChanceCard();
    } else {
      return drawCommunityChestCard();
    }
  }

  // Execute card action
  executeCardAction(playerId: string, card: Card): void {
    const player = this.getPlayer(playerId);
    if (!player) return;

    switch (card.action) {
      case 'addMoney':
        if (card.value) player.money += card.value;
        break;
      
      case 'subtractMoney':
        if (card.value) player.money = Math.max(0, player.money - card.value);
        break;
      
      case 'move':
        if (card.targetPosition !== undefined) {
          player.position = card.targetPosition;
        }
        break;
      
      case 'jail':
        if (card.targetPosition !== undefined) {
          this.enterJail(playerId);
        }
        break;
      
      case 'getOutOfJail':
        player.getOutOfJailCards += 1;
        break;
      
      case 'advanceToGo':
        player.position = 0;
        player.money += 200;
        break;
      
      case 'goBack':
        if (card.value) {
          player.position = Math.max(0, player.position - card.value);
        }
        break;
      
      case 'repairs':
        // Pay for repairs based on houses
        const totalCost = this.calculateRepairsCost(playerId, card.value || 0);
        player.money = Math.max(0, player.money - totalCost);
        break;
    }
  }

  // Calculate repairs cost
  private calculateRepairsCost(playerId: string, perHouse: number): number {
    const playerProperties = this.gameState.boardState.filter(p => p.ownerId === playerId);
    let totalHouses = 0;
    let totalHotels = 0;

    playerProperties.forEach(prop => {
      const houses = prop.houses || 0;
      if (houses === 5) {
        totalHotels += 1;
      } else {
        totalHouses += houses;
      }
    });

    return totalHouses * perHouse + totalHotels * (perHouse * 2.875); // Hotel cost multiplier
  }

  // Upgrade property (add house/hotel)
  upgradeProperty(playerId: string, propertyId: string): boolean {
    const player = this.getPlayer(playerId);
    const property = this.gameState.boardState.find(p => p.id === propertyId);
    
    if (!player || !property || property.ownerId !== playerId) {
      return false;
    }

    const currentHouses = property.houses || 0;
    if (currentHouses >= 5) {
      return false; // Already has hotel
    }

    const houseCost = property.houseCost || 50;
    if (player.money < houseCost) {
      return false;
    }

    // Check if player owns all properties in group
    const groupProperties = this.gameState.boardState.filter(
      p => p.group === property.group && !p.isSpecial
    );
    const ownedInGroup = groupProperties.filter(p => p.ownerId === playerId);
    
    if (ownedInGroup.length !== groupProperties.length && currentHouses === 0) {
      return false; // Must own all in group to build
    }

    // Check building restrictions (even building)
    if (currentHouses > 0) {
      const minHouses = Math.min(...groupProperties.map(p => p.houses || 0));
      if (currentHouses > minHouses) {
        return false; // Must build evenly
      }
    }

    player.money -= houseCost;
    property.houses = (property.houses || 0) + 1;
    
    return true;
  }

  // Handle bankruptcy
  handleBankruptcy(playerId: string, creditorId?: string): void {
    const player = this.getPlayer(playerId);
    if (!player) return;

    player.bankrupt = true;
    
    // Transfer all properties to creditor or bank
    this.gameState.boardState.forEach(property => {
      if (property.ownerId === playerId) {
        if (creditorId) {
          property.ownerId = creditorId;
          const creditor = this.getPlayer(creditorId);
          if (creditor) {
            creditor.properties.push(property.id);
          }
        } else {
          property.ownerId = undefined;
          property.houses = 0;
        }
      }
    });

    // Remove player from turn order if bankrupt
    if (this.gameState.currentTurn === playerId) {
      this.nextTurn();
    }
  }

  // Next turn
  nextTurn(): void {
    const currentIndex = this.gameState.players.findIndex(
      p => p.id === this.gameState.currentTurn && !p.bankrupt
    );
    const nextIndex = (currentIndex + 1) % this.gameState.players.filter(p => !p.bankrupt).length;
    const nextPlayer = this.gameState.players.filter(p => !p.bankrupt)[nextIndex];
    
    if (nextPlayer) {
      this.gameState.currentTurn = nextPlayer.id;
      this.gameState.turnNumber += 1;
      // Reset doubles count for new turn
      nextPlayer.doublesCount = 0;
    }
  }

  // Check win conditions
  checkWinConditions(): { gameOver: boolean; winner?: string } {
    const activePlayers = this.gameState.players.filter(p => !p.bankrupt);
    
    if (activePlayers.length === 1) {
      return { gameOver: true, winner: activePlayers[0].id };
    }

    // Check time limit (60 minutes)
    const gameDuration = Date.now() - this.gameState.startTime.getTime();
    if (gameDuration >= 60 * 60 * 1000) {
      // Game over - highest net worth wins
      const playersWithNetWorth = activePlayers.map(p => ({
        id: p.id,
        netWorth: this.calculateNetWorth(p.id),
      }));
      playersWithNetWorth.sort((a, b) => b.netWorth - a.netWorth);
      return { gameOver: true, winner: playersWithNetWorth[0].id };
    }

    return { gameOver: false };
  }

  // Calculate net worth
  calculateNetWorth(playerId: string): number {
    const player = this.getPlayer(playerId);
    if (!player) return 0;

    let netWorth = player.money;
    
    // Add property values
    const playerProperties = this.gameState.boardState.filter(p => p.ownerId === playerId);
    playerProperties.forEach(property => {
      netWorth += property.cost;
      // Add house/hotel value
      const houses = property.houses || 0;
      const houseCost = property.houseCost || 50;
      netWorth += houses * houseCost;
    });

    return netWorth;
  }

  // Helper methods
  getPlayer(playerId: string): Player | undefined {
    return this.gameState.players.find(p => p.id === playerId);
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  updateGameState(updates: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...updates };
  }
}

