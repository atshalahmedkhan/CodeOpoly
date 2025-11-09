import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerPiece from './PlayerPiece';

interface Property {
  id: string;
  name: string;
  position: number;
  price: number;
  color: string;
  ownerId?: string;
  houses: number;
  isSpecial?: boolean;
  specialType?: 'go' | 'jail' | 'free-parking' | 'go-to-jail' | 'chance' | 'community-chest';
  isRailroad?: boolean;
  isUtility?: boolean;
  category: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  position: number;
  money: number;
  color: string;
}

interface TraditionalMonopolyBoardProps {
  boardState: Property[];
  players: Player[];
  currentPlayer: Player | null;
  onTileClick: (property: Property) => void;
  landedPosition?: number;
}

// Color mapping for property groups
const PROPERTY_COLORS: Record<string, string> = {
  '#8B4513': '#8B4513', // Brown
  '#87CEEB': '#87CEEB', // Light Blue
  '#FF69B4': '#FF69B4', // Pink
  '#FF8C00': '#FF8C00', // Orange
  '#DC143C': '#DC143C', // Red
  '#FFD700': '#FFD700', // Yellow
  '#228B22': '#228B22', // Green
  '#00008B': '#00008B', // Dark Blue
  '#000000': '#000000', // Railroads
  '#FFFFFF': '#FFFFFF', // Utilities
};

export default function TraditionalMonopolyBoard({
  boardState,
  players,
  currentPlayer,
  onTileClick,
  landedPosition,
}: TraditionalMonopolyBoardProps) {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [glowingTile, setGlowingTile] = useState<number | null>(landedPosition || null);

  useEffect(() => {
    if (landedPosition !== undefined) {
      setGlowingTile(landedPosition);
      setTimeout(() => setGlowingTile(null), 3000);
    }
  }, [landedPosition]);

  const getSpaceAtPosition = (pos: number) => {
    return boardState.find(p => p.position === pos);
  };

  const getPlayersOnSpace = (pos: number) => {
    return players.filter(p => p.position === pos);
  };

  // Convert position (0-39) to board coordinates
  const getPositionCoords = (pos: number) => {
    // Traditional Monopoly layout:
    // 0-10: Bottom row (right to left)
    // 11-19: Left column (bottom to top)
    // 20-30: Top row (left to right)
    // 31-39: Right column (top to bottom)
    
    if (pos <= 10) {
      // Bottom row: right to left
      return { row: 10, col: 10 - pos, side: 'bottom' };
    } else if (pos <= 19) {
      // Left column: bottom to top
      return { row: 10 - (pos - 10), col: 0, side: 'left' };
    } else if (pos <= 30) {
      // Top row: left to right
      return { row: 0, col: pos - 20, side: 'top' };
    } else {
      // Right column: top to bottom
      return { row: pos - 30, col: 10, side: 'right' };
    }
  };

  // Render corner space (120x120px)
  const renderCorner = (property: Property | undefined, label: string, cornerClass: string) => {
    const playersHere = property ? getPlayersOnSpace(property.position) : [];
    const isGlowing = property && glowingTile === property.position;
    
    return (
      <div className={`${cornerClass} relative`} style={{ width: '120px', height: '120px' }}>
        <motion.div
          animate={isGlowing ? {
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(255,255,255,0.5)',
              '0 0 40px rgba(255,255,255,0.8)',
              '0 0 20px rgba(255,255,255,0.5)'
            ]
          } : {}}
          transition={{ duration: 0.5, repeat: isGlowing ? Infinity : 0 }}
          className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 border-slate-600 p-2 flex flex-col items-center justify-center text-white font-bold shadow-lg cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-5deg) rotateX(5deg)',
          }}
          onClick={() => property && onTileClick(property)}
        >
          <div className="text-xs font-mono mb-1">{label}</div>
          {property && (
            <>
              <div className="text-[10px] text-yellow-400 font-semibold text-center">
                {property.specialType?.toUpperCase().replace('-', ' ') || property.name}
              </div>
              {playersHere.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap justify-center">
                  {playersHere.map(p => (
                    <span key={p.id} className="text-lg">{p.avatar}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    );
  };

  // Render property space (80x100px)
  const renderProperty = (property: Property, orientation: 'horizontal' | 'vertical') => {
    const playersHere = getPlayersOnSpace(property.position);
    const isGlowing = glowingTile === property.position;
    const isOwned = !!property.ownerId;
    const isLanded = currentPlayer?.position === property.position;
    const owner = isOwned ? players.find(p => p.id === property.ownerId) : null;
    
    const propertyStyle: React.CSSProperties = {
      width: orientation === 'horizontal' ? '80px' : '100px',
      height: orientation === 'horizontal' ? '100px' : '80px',
      background: isOwned
        ? `linear-gradient(135deg, ${property.color} 0%, ${property.color}cc 50%, ${owner?.color || property.color}dd 100%)`
        : `linear-gradient(180deg, ${property.color} 0%, ${property.color}dd 100%)`,
      border: isOwned 
        ? `3px solid ${owner?.color || property.color}` 
        : `2px solid ${property.color}80`,
      boxShadow: isGlowing
        ? `0 0 40px ${property.color}, 0 0 80px ${property.color}80, inset 0 0 30px rgba(255,255,255,0.2)`
        : isLanded
        ? `0 0 30px ${property.color}80, 0 0 60px ${property.color}40, inset 0 0 25px ${property.color}60`
        : isOwned
        ? `0 0 20px ${owner?.color || property.color}60, 0 0 40px ${owner?.color || property.color}30, inset 0 0 15px rgba(255,255,255,0.1)`
        : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)',
    };

    return (
      <motion.div
        key={property.id}
        animate={isGlowing ? { 
          scale: [1, 1.15, 1],
        } : isLanded ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 0.6, repeat: (isGlowing || isLanded) ? Infinity : 0 }}
        onClick={() => onTileClick(property)}
        className="cursor-pointer transition-all duration-300 relative group"
        style={propertyStyle}
        onMouseEnter={() => setHoveredTile(property.position)}
        onMouseLeave={() => !isLanded && setHoveredTile(null)}
        whileHover={{ 
          scale: 1.08,
          zIndex: 20,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Colored bar at top */}
        <div 
          className="h-3 w-full"
          style={{ backgroundColor: property.color }}
        />
        
        {/* Property content */}
        <div className="h-full flex flex-col items-center justify-center p-1 text-center overflow-hidden">
          {orientation === 'horizontal' ? (
            <>
              <div className="text-[11px] font-bold text-white leading-tight mb-0.5 px-0.5 line-clamp-2 max-h-[28px] overflow-hidden">
                {property.name.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </div>
              {!property.isSpecial && (
                <div className="text-[10px] text-yellow-300 font-mono font-semibold">
                  ${property.price}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-[10px] font-bold text-white leading-tight line-clamp-3 max-h-[60px] overflow-hidden px-0.5">
                {property.name.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </div>
              {!property.isSpecial && (
                <div className="text-[9px] text-yellow-300 font-mono font-semibold mt-0.5">
                  ${property.price}
                </div>
              )}
            </>
          )}
          
          {/* Enhanced Owner indicator */}
          {isOwned && owner && (
            <>
              <motion.div
                className="absolute top-1 right-1 w-4 h-4 rounded-full shadow-xl border-2 border-white"
                style={{
                  background: `linear-gradient(135deg, ${owner.color} 0%, ${owner.color}dd 100%)`,
                  boxShadow: `0 0 10px ${owner.color}, inset 0 0 5px rgba(255,255,255,0.3)`,
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-5 right-1 text-sm drop-shadow-lg"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {owner.avatar}
              </motion.div>
              {/* Ownership glow */}
              <div 
                className="absolute inset-0 rounded opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${owner.color}80, transparent 70%)`,
                }}
              />
            </>
          )}
          
          {/* Enhanced Houses/Solutions indicator */}
          {property.houses > 0 && (
            <motion.div
              className="absolute bottom-1 left-1 flex gap-0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {Array.from({ length: Math.min(property.houses, 5) }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-[14px] drop-shadow-lg"
                  animate={{ 
                    y: [0, -3, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                >
                  🏠
                </motion.span>
              ))}
              {property.houses > 5 && (
                <span className="text-[10px] text-yellow-300 font-bold">+{property.houses - 5}</span>
              )}
            </motion.div>
          )}
          
          {/* Players on this space */}
          {playersHere.length > 0 && (
            <div className="absolute top-4 left-1 flex gap-0.5 flex-wrap max-w-[60%]">
              {playersHere.map(p => (
                <span key={p.id} className="text-sm">{p.avatar}</span>
              ))}
            </div>
          )}
          
          {/* Landed indicator */}
          {isLanded && (
            <div className="absolute inset-0 border-2 border-yellow-400 rounded animate-pulse" />
          )}
        </div>

        {/* Enhanced Hover tooltip */}
        {hoveredTile === property.position && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-sm rounded-xl p-4 shadow-2xl border-2 border-emerald-400 min-w-[200px]"
              style={{
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.1)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: property.color }}
                />
                <div className="font-bold text-base">{property.name}</div>
              </div>
              {!property.isSpecial && (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">💰</span>
                    <span>Price: <span className="font-bold text-yellow-300">${property.price}</span></span>
                  </div>
                  {isOwned && owner && (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">👤</span>
                      <span>Owned by: <span className="font-bold">{owner.name}</span></span>
                    </div>
                  )}
                  {property.houses > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">🏠</span>
                      <span>Solutions: <span className="font-bold">{property.houses}</span></span>
                    </div>
                  )}
                  {!isOwned && (
                    <div className="text-emerald-400 text-[10px] mt-2 pt-2 border-t border-slate-700">
                      💡 Click to view details
                    </div>
                  )}
                </div>
              )}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Get spaces for each side - ensure we have all positions
  const bottomSpaces = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(pos => getSpaceAtPosition(pos));
  const leftSpaces = [11, 12, 13, 14, 15, 16, 17, 18, 19].map(pos => getSpaceAtPosition(pos));
  const topSpaces = [21, 22, 23, 24, 25, 26, 27, 28, 29].map(pos => getSpaceAtPosition(pos));
  const rightSpaces = [31, 32, 33, 34, 35, 36, 37, 38, 39].map(pos => getSpaceAtPosition(pos));

  // Render empty space placeholder
  const renderEmptySpace = (orientation: 'horizontal' | 'vertical') => (
    <div
      className="bg-slate-800/50 border border-slate-700/50 rounded"
      style={{
        width: orientation === 'horizontal' ? '80px' : '100px',
        height: orientation === 'horizontal' ? '100px' : '80px',
      }}
    />
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div 
        className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 shadow-2xl"
        style={{
          boxShadow: '0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 60px rgba(147, 51, 234, 0.3)',
        }}
      >
        {/* Traditional Monopoly Square Layout - 11x11 grid */}
        <div className="grid grid-cols-11 gap-0" style={{ minHeight: '800px' }}>
          {/* Top Row: Free Parking (20) -> Top Properties (21-29) -> Jail (10) */}
          <div className="col-span-1 flex items-start justify-center">
            {renderCorner(getSpaceAtPosition(20), 'FREE PARKING', '')}
          </div>
          <div className="col-span-9 flex gap-0">
            {topSpaces.map((prop, idx) => prop ? (
              <div key={prop.id} className="transform rotate-180">
                {renderProperty(prop, 'horizontal')}
              </div>
            ) : (
              <div key={`empty-top-${idx}`} className="transform rotate-180">
                {renderEmptySpace('horizontal')}
              </div>
            ))}
          </div>
          <div className="col-span-1 flex items-start justify-center">
            {renderCorner(getSpaceAtPosition(10), 'JAIL', '')}
          </div>

          {/* Middle Rows: Left Properties (11-19) -> Center -> Right Properties (31-39) */}
          <div className="col-span-1 flex flex-col gap-0">
            {leftSpaces.map((prop, idx) => prop ? (
              <div key={prop.id} className="transform rotate-90">
                {renderProperty(prop, 'vertical')}
              </div>
            ) : (
              <div key={`empty-left-${idx}`} className="transform rotate-90">
                {renderEmptySpace('vertical')}
              </div>
            ))}
          </div>
          
          {/* Center Area - Will be used for Current Action Display */}
          <motion.div
            className="col-span-9 bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 rounded-xl border-4 border-emerald-500/50 flex items-center justify-center relative overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 60px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.2), inset 0 0 100px rgba(147, 51, 234, 0.1)',
              minHeight: '600px',
            }}
            id="board-center"
            animate={{
              borderColor: ['rgba(16, 185, 129, 0.5)', 'rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.5)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Center content will be injected by CurrentActionDisplay component */}
            <motion.div
              className="text-center text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent font-mono"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  backgroundSize: '200%',
                }}
              >
                CODEOPOLY
              </motion.div>
              <div className="text-sm text-emerald-400/70 font-mono space-y-2">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  💻 Solve Problems
                </motion.div>
                <motion.div
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                >
                  🏠 Buy Properties
                </motion.div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  🏆 Win the Game
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Player Pieces Overlay - grid based for accurate alignment */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-11 grid-rows-11">
            {players.map((player) => {
              const playersOnSpace = players.filter(p => p.position === player.position);
              const offsetIndex = playersOnSpace.findIndex(p => p.id === player.id);
              return (
                <PlayerPiece
                  key={player.id}
                  player={player}
                  isCurrentPlayer={currentPlayer?.id === player.id}
                  offset={offsetIndex}
                />
              );
            })}
          </div>

          <div className="col-span-1 flex flex-col gap-0">
            {rightSpaces.map((prop, idx) => prop ? (
              <div key={prop.id} className="transform -rotate-90">
                {renderProperty(prop, 'vertical')}
              </div>
            ) : (
              <div key={`empty-right-${idx}`} className="transform -rotate-90">
                {renderEmptySpace('vertical')}
              </div>
            ))}
          </div>

          {/* Bottom Row: Go to Jail (30) -> Bottom Properties (1-9) -> GO (0) */}
          <div className="col-span-1 flex items-end justify-center">
            {renderCorner(getSpaceAtPosition(30), 'GO TO JAIL', '')}
          </div>
          <div className="col-span-9 flex gap-0">
            {bottomSpaces.map((prop, idx) => prop ? (
              renderProperty(prop, 'horizontal')
            ) : (
              <div key={`empty-bottom-${idx}`}>
                {renderEmptySpace('horizontal')}
              </div>
            ))}
          </div>
          <div className="col-span-1 flex items-end justify-center">
            {renderCorner(getSpaceAtPosition(0), 'GO', '')}
          </div>
        </div>
      </div>
    </div>
  );
}

