import { useState } from 'react';

interface Property {
  id: string;
  name: string;
  price: number;
  color: string;
  position: number;
  ownerId?: string;
  houses: number;
  isSpecial?: boolean;
  specialType?: 'go' | 'jail' | 'free-parking' | 'go-to-jail' | 'chance' | 'community-chest';
}

interface GridBoardProps {
  boardState: Property[];
  players: any[];
  currentPlayer: any;
  onTileClick: (property: Property) => void;
}

export default function GridBoard({ boardState, players, currentPlayer, onTileClick }: GridBoardProps) {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);

  // Convert linear 40-space board to 10x10 grid
  // Layout: Start at top-left, go right, then down, then left, then up
  const gridSize = 10;
  const tiles: (Property | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

  // Map 40 positions to 10x10 grid (outer ring + inner spaces)
  boardState.forEach((property, index) => {
    const pos = property.position;
    let row = 0, col = 0;

    if (pos < 10) {
      // Top row (left to right)
      row = 0;
      col = pos;
    } else if (pos < 20) {
      // Right column (top to bottom)
      row = pos - 10;
      col = 9;
    } else if (pos < 30) {
      // Bottom row (right to left)
      row = 9;
      col = 29 - pos;
    } else {
      // Left column (bottom to top)
      row = 39 - pos;
      col = 0;
    }

    tiles[row][col] = property;
  });

  const getPlayersOnTile = (position: number) => {
    return players.filter(p => p.position === position);
  };

  const getTileStyle = (property: Property | null, row: number, col: number) => {
    if (!property) return {};
    
    const isCorner = (row === 0 && col === 0) || (row === 0 && col === 9) || 
                     (row === 9 && col === 0) || (row === 9 && col === 9);
    
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: property.ownerId 
        ? `3px solid ${property.color}` 
        : `2px solid ${property.color}40`,
      borderRadius: '8px',
      padding: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      background: property.isSpecial 
        ? `linear-gradient(135deg, ${property.color}20, ${property.color}40)`
        : property.ownerId
        ? `linear-gradient(135deg, ${property.color}30, ${property.color}50)`
        : `linear-gradient(135deg, ${property.color}10, ${property.color}20)`,
      boxShadow: hoveredTile === property.position
        ? `0 0 20px ${property.color}, 0 0 40px ${property.color}80`
        : property.ownerId
        ? `0 0 10px ${property.color}60`
        : 'none',
    };

    return baseStyle;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div 
        className="grid grid-cols-10 gap-1 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-lg p-2"
        style={{
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(147, 51, 234, 0.2)',
        }}
      >
        {tiles.map((row, rowIndex) =>
          row.map((property, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            
            if (!property) {
              return (
                <div
                  key={key}
                  className="aspect-square bg-gray-800/30 rounded border border-gray-700/50"
                />
              );
            }

            const playersHere = getPlayersOnTile(property.position);
            const isOwned = !!property.ownerId;
            const isCurrentPlayerTile = currentPlayer?.position === property.position;

            return (
              <div
                key={key}
                className="aspect-square relative group"
                onMouseEnter={() => setHoveredTile(property.position)}
                onMouseLeave={() => setHoveredTile(null)}
                onClick={() => onTileClick(property)}
              >
                <div style={getTileStyle(property, rowIndex, colIndex)}>
                  {/* Property Name */}
                  <div className="text-[8px] font-bold text-white truncate mb-0.5">
                    {property.name}
                  </div>
                  
                  {/* Price or Special Label */}
                  {property.isSpecial ? (
                    <div className="text-[7px] text-yellow-300 font-semibold">
                      {property.specialType?.toUpperCase().replace('-', ' ')}
                    </div>
                  ) : (
                    <div className="text-[7px] text-white/80">
                      ${property.price}
                    </div>
                  )}

                  {/* Owner Indicator */}
                  {isOwned && (
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-400 shadow-lg" />
                  )}

                  {/* Houses */}
                  {property.houses > 0 && (
                    <div className="absolute bottom-0 left-0 text-[10px]">
                      {'🏠'.repeat(Math.min(property.houses, 4))}
                    </div>
                  )}

                  {/* Players on this tile */}
                  {playersHere.length > 0 && (
                    <div className="absolute top-0 left-0 flex gap-0.5">
                      {playersHere.map((p, idx) => (
                        <span key={p.id} className="text-xs">
                          {p.avatar}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Current Player Highlight */}
                  {isCurrentPlayerTile && (
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded animate-pulse" />
                  )}
                </div>

                {/* Hover Tooltip */}
                {hoveredTile === property.position && (
                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl border border-blue-400 whitespace-nowrap">
                    <div className="font-bold">{property.name}</div>
                    {!property.isSpecial && (
                      <>
                        <div>Price: ${property.price}</div>
                        {isOwned && (
                          <div>Owned by: {players.find(p => p.id === property.ownerId)?.name}</div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

