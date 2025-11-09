'use client';

import { useState } from 'react';
import { CodeDuel, GameState, Player } from '@/types/game';
import CodeEditor from './CodeEditor';

interface CodeDuelComponentProps {
  duel: CodeDuel;
  currentPlayer: Player;
  gameState: GameState;
  onDuelEnd: (result: 'challenger-won' | 'defender-won') => void;
}

export default function CodeDuelComponent({ duel, currentPlayer, gameState, onDuelEnd }: CodeDuelComponentProps) {
  const isChallenger = duel.challengerId === currentPlayer.id;
  const isDefender = duel.defenderId === currentPlayer.id;
  const challenger = gameState.players.find(p => p.id === duel.challengerId);
  const defender = gameState.players.find(p => p.id === duel.defenderId);

  if (!isChallenger && !isDefender) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 max-w-2xl">
          <h2 className="text-white text-2xl font-bold mb-4">⚔️ Code Duel in Progress</h2>
          <p className="text-white/80">
            {challenger?.name} is challenging {defender?.name} to a code duel!
          </p>
          <p className="text-white/60 text-sm mt-2">
            Problem: {duel.problem.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <CodeEditor
      problem={duel.problem}
      onSubmit={(code) => {
        // Handle duel submission
        // In a real implementation, this would update the duel state
        // and check if both players have solved it
        onDuelEnd('challenger-won');
      }}
      onClose={() => {}}
      timeLimit={duel.timeLimit}
    />
  );
}

