'use client';

import { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import Lobby from '@/components/Lobby';
import { GameState, Player } from '@/types/game';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  if (!gameState || !currentPlayer) {
    return <Lobby onGameStart={setGameState} onPlayerSet={setCurrentPlayer} />;
  }

  return (
    <GameBoard 
      gameState={gameState} 
      currentPlayer={currentPlayer}
      onGameStateChange={setGameState}
    />
  );
}

