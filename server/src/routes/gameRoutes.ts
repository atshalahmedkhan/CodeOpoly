import express from 'express';
import { Game, IGame } from '../models/Game.js';
import { Problem } from '../models/Problem.js';
import { generateRoomCode } from '../utils/roomCode.js';
import { initializeBoard } from '../utils/boardInitializer.js';
import { saveGame, findGameById, findGameByRoomCode, updateGame, GameData } from '../utils/memoryStore.js';
import mongoose from 'mongoose';

const router = express.Router();

// Check if MongoDB is connected (function to check dynamically)
function useMongoDB() {
  return mongoose.connection.readyState === 1;
}

// Type guard to check if game is a Mongoose document
function isMongooseDocument(game: IGame | GameData | null): game is IGame {
  return game !== null && 'save' in game && typeof (game as any).save === 'function';
}

// Helper to get game ID
function getGameId(game: IGame | GameData): string {
  if (isMongooseDocument(game)) {
    return (game._id as any).toString();
  }
  return game._id;
}

// Create a new game room
router.post('/games/create', async (req, res) => {
  try {
    const { playerName, avatar } = req.body;
    
    if (!playerName) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    const roomCode = generateRoomCode();
    const boardState = initializeBoard();
    const playerId = `player-${Date.now()}`;

    const gameData = {
      roomCode,
      status: 'waiting',
      players: [{
        id: playerId,
        name: playerName,
        avatar: avatar || '💻',
        position: 0,
        money: 1500,
        properties: [],
        inJail: false,
        jailTurns: 0,
      }],
      currentTurn: playerId,
      turnNumber: 1,
      startTime: new Date(),
      boardState,
    };

    let game;
    if (useMongoDB()) {
      // Use MongoDB if connected
      game = new Game(gameData);
      await game.save();
      res.json({
        gameId: (game._id as any).toString(),
        roomCode: game.roomCode,
        playerId: game.players[0].id,
      });
    } else {
      // Use in-memory store
      console.log('⚠️  MongoDB not connected, using in-memory store');
      game = saveGame(gameData);
      res.json({
        gameId: game._id,
        roomCode: game.roomCode,
        playerId: game.players[0].id,
      });
    }
  } catch (error: any) {
    console.error('Error creating game:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Join an existing game
router.post('/games/join', async (req, res) => {
  try {
    const { roomCode, playerName, avatar } = req.body;

    if (!roomCode || !playerName) {
      return res.status(400).json({ error: 'Room code and player name are required' });
    }

    let game;
    const upperRoomCode = roomCode.toUpperCase().trim();
    if (useMongoDB()) {
      game = await Game.findOne({ roomCode: upperRoomCode });
    } else {
      game = findGameByRoomCode(upperRoomCode);
    }

    if (!game) {
      console.error('Game not found for room code:', upperRoomCode);
      return res.status(404).json({ error: 'Game not found. Make sure the room code is correct and the game was created.' });
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({ error: 'Game is already in progress' });
    }

    if (game.players.length >= 4) {
      return res.status(400).json({ error: 'Game is full' });
    }

    const newPlayer = {
      id: `player-${Date.now()}`,
      name: playerName,
      avatar: avatar || '💻',
      position: 0,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
    };

    game.players.push(newPlayer);
    
    if (isMongooseDocument(game)) {
      await game.save();
    } else {
      updateGame(game._id, game);
    }

    res.json({
      gameId: getGameId(game),
      roomCode: game.roomCode,
      playerId: newPlayer.id,
    });
  } catch (error: any) {
    console.error('Error joining game:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get game state
router.get('/games/:gameId', async (req, res) => {
  try {
    let game;
    if (useMongoDB()) {
      game = await Game.findById(req.params.gameId);
    } else {
      game = findGameById(req.params.gameId);
    }

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error: any) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get problems by category and difficulty
router.get('/problems', async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const problems = await Problem.find(query).limit(20);

    res.json(problems);
  } catch (error: any) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

