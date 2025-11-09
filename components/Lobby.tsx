'use client';

import { useState } from 'react';
import { GameState, Player } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';
import { boardProperties } from '@/lib/board';

interface LobbyProps {
  onGameStart: (gameState: GameState) => void;
  onPlayerSet: (player: Player) => void;
}

export default function Lobby({ onGameStart, onPlayerSet }: LobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    const playerId = uuidv4();
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      avatar: '💻',
      position: 0,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
      isActive: true,
      sabotageCards: [],
    };

    const newGame: GameState = {
      id: uuidv4(),
      currentPlayerId: playerId,
      players: [newPlayer],
      properties: boardProperties,
      turnNumber: 1,
      gameStatus: 'waiting',
    };

    onPlayerSet(newPlayer);
    onGameStart(newGame);
  };

  const joinGame = () => {
    if (!playerName.trim() || !gameId.trim()) {
      alert('Please enter your name and game ID');
      return;
    }

    // For MVP, we'll create a local game
    // In production, this would connect to Firebase
    alert('Join game functionality will connect to Firebase. For now, create a new game.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🎮 CodeOpoly</h1>
          <p className="text-xl text-white/80">Competitive Coding Meets Monopoly</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white/90 mb-2 font-semibold">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyPress={(e) => e.key === 'Enter' && createGame()}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={createGame}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Create New Game
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">or</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter Game ID"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                onKeyPress={(e) => e.key === 'Enter' && joinGame()}
              />
              <button
                onClick={joinGame}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all border border-white/30"
              >
                Join Game
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-white/60 text-sm text-center">
            🎯 Solve LeetCode problems to buy properties<br />
            ⚔️ Challenge opponents to code duels<br />
            🏆 Win by having the most net worth
          </p>
        </div>
      </div>
    </div>
  );
}

