'use client';

import { GameState, Player } from '@/types/game';
import { boardProperties } from '@/lib/board';

interface BoardVisualizationProps {
  gameState: GameState;
  currentPlayer: Player;
}

export default function BoardVisualization({ gameState, currentPlayer }: BoardVisualizationProps) {
  const getPlayerAtPosition = (position: number): Player[] => {
    return gameState.players.filter(p => p.position === position);
  };

  const getPropertyColor = (color: string) => {
    const colorMap: Record<string, string> = {
      '#8B4513': 'bg-amber-900',
      '#87CEEB': 'bg-sky-300',
      '#FF69B4': 'bg-pink-400',
      '#FF8C00': 'bg-orange-500',
      '#DC143C': 'bg-red-600',
      '#FFD700': 'bg-yellow-400',
      '#228B22': 'bg-green-600',
      '#00008B': 'bg-blue-800',
      '#000000': 'bg-gray-800',
      '#FFFFFF': 'bg-white',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  // Simplified board view - showing key properties in a grid
  const keyProperties = boardProperties.filter(p => p.price > 0).slice(0, 12);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
      <h2 className="text-white font-bold text-xl mb-4">Game Board</h2>
      
      {/* Simplified Board Grid */}
      <div className="grid grid-cols-4 gap-2">
        {keyProperties.map((property) => {
          const playersHere = getPlayerAtPosition(property.position);
          const owner = gameState.players.find(p => p.id === property.ownerId);
          
          return (
            <div
              key={property.id}
              className={`p-3 rounded-lg border-2 ${
                property.ownerId === currentPlayer.id
                  ? 'border-green-400 bg-green-500/20'
                  : property.ownerId
                  ? 'border-red-400 bg-red-500/20'
                  : 'border-white/20 bg-white/5'
              } ${getPropertyColor(property.color)}`}
            >
              <div className="text-white text-xs font-semibold mb-1 truncate">
                {property.name}
              </div>
              <div className="text-white/80 text-xs">
                ${property.price}
              </div>
              {owner && (
                <div className="text-white/60 text-xs mt-1">
                  {owner.avatar} {owner.name}
                </div>
              )}
              {property.houses > 0 && (
                <div className="text-yellow-400 text-xs mt-1">
                  {'🏠'.repeat(Math.min(property.houses, 4))}
                </div>
              )}
              {playersHere.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {playersHere.map(p => (
                    <span key={p.id} className="text-lg">{p.avatar}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Player Positions */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <h3 className="text-white font-semibold mb-2">Player Positions</h3>
        <div className="space-y-1">
          {gameState.players.map((player) => (
            <div key={player.id} className="flex items-center justify-between text-sm">
              <span className="text-white">
                {player.avatar} {player.name}
              </span>
              <span className="text-white/60">
                Position: {player.position}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

