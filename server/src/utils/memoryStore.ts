// Temporary in-memory store for games (no MongoDB required)
export interface GameData {
  _id: string;
  roomCode: string;
  status: string;
  players: any[];
  currentTurn: string;
  turnNumber: number;
  startTime: Date;
  boardState: any[];
  activeDuel?: any;
}

const games = new Map<string, GameData>();

export function saveGame(game: any): GameData {
  const gameData: GameData = {
    _id: game._id || `game-${Date.now()}`,
    roomCode: game.roomCode,
    status: game.status,
    players: game.players,
    currentTurn: game.currentTurn,
    turnNumber: game.turnNumber,
    startTime: game.startTime,
    boardState: game.boardState,
    activeDuel: game.activeDuel,
  };
  games.set(gameData._id, gameData);
  return gameData;
}

export function findGameById(id: string): GameData | null {
  return games.get(id) || null;
}

export function findGameByRoomCode(roomCode: string): GameData | null {
  const upperCode = roomCode.toUpperCase().trim();
  for (const game of games.values()) {
    if (game.roomCode && game.roomCode.toUpperCase() === upperCode) {
      return game;
    }
  }
  return null;
}

export function updateGame(id: string, updates: Partial<GameData>): GameData | null {
  const game = games.get(id);
  if (!game) return null;
  
  const updated = { ...game, ...updates };
  games.set(id, updated);
  return updated;
}

export function getAllGames(): GameData[] {
  return Array.from(games.values());
}

