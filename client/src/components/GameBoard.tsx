import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPropertyCard from './AnimatedPropertyCard';
import AnimatedPlayerToken from './AnimatedPlayerToken';

interface Property {
  id: string;
  name: string;
  position: number;
  price: number;
  rent: number;
  rentWithHouse?: number[];
  color: string;
  ownerId?: string;
  houses: number;
  isSpecial?: boolean;
  specialType?: 'go' | 'jail' | 'free-parking' | 'go-to-jail' | 'chance' | 'community-chest' | 'tax';
  isRailroad?: boolean;
  isUtility?: boolean;
  category?: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  position: number;
  money: number;
  properties: string[];
  color?: string;
}

interface GameBoardProps {
  boardState: Property[];
  players: Player[];
  currentPlayer: Player | null;
  onTileClick: (property: Property) => void;
  landedPosition?: number;
}



// Memoized board component for performance
const GameBoard = memo(function GameBoard({
  boardState,
  players,
  currentPlayer,
  onTileClick,
  landedPosition,
}: GameBoardProps) {
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [glowingTile, setGlowingTile] = useState<number | null>(landedPosition || null);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (landedPosition !== undefined) {
      setGlowingTile(landedPosition);
      setTimeout(() => setGlowingTile(null), 3000);
    }
  }, [landedPosition]);

  // Memoize space lookups for performance
  const spaceMap = useMemo(() => {
    const map = new Map<number, Property>();
    boardState.forEach(p => map.set(p.position, p));
    return map;
  }, [boardState]);

  const getSpaceAtPosition = useCallback((pos: number) => {
    return spaceMap.get(pos);
  }, [spaceMap]);

  const getPlayersOnSpace = useCallback((pos: number) => {
    return players.filter(p => p.position === pos);
  }, [players]);

  const renderCornerSpace = (property: Property | undefined, className: string, icon: string) => {
    const playersHere = property ? getPlayersOnSpace(property.position) : [];
    const isGlowing = property && glowingTile === property.position;
    const isHovered = property && hoveredProperty === property.position;
    const isSelected = property && selectedProperty === property.position;
    const specialType = property?.specialType;
    
    return (
      <div 
        className={`relative ${className} overflow-hidden`}
        onMouseEnter={() => property && setHoveredProperty(property.position)}
        onMouseLeave={() => setHoveredProperty(null)}
        onClick={() => property && (setSelectedProperty(property.position), onTileClick(property))}
      >
        <motion.div
          animate={isGlowing ? { 
            scale: [1, 1.05, 1],
          } : isHovered ? {
            scale: 1.05,
          } : isSelected ? {
            scale: 1.02,
          } : {}}
          transition={{ duration: 0.3 }}
          className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black rounded-lg border-2 flex items-center justify-center relative group cursor-pointer"
          style={{
            borderColor: isSelected ? '#06B6D4' : isHovered ? '#8B5CF6' : '#334155',
            boxShadow: isSelected 
              ? '0 0 30px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.2)'
              : isHovered
              ? '0 0 20px rgba(139, 92, 246, 0.4)'
              : '0 4px 12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Neon glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="text-center z-10 relative">
            <motion.div
              className="text-5xl mb-2"
              animate={isGlowing ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {specialType === 'go' ? '🚀' : 
               specialType === 'jail' ? '🔒' : 
               specialType === 'free-parking' ? '🅿️' : 
               specialType === 'go-to-jail' ? '🚨' : icon}
            </motion.div>
            
            {property && (
              <>
                <div className="text-cyan-400 font-bold text-sm mb-1 px-2">
                  {property.name}
                </div>
                {property.name === 'GO' && (
                  <div className="text-green-400 text-xs font-mono">
                    +$200
                  </div>
                )}
                
                {playersHere.length > 0 && (
                  <div className="absolute bottom-1 right-1 flex gap-1 flex-wrap max-w-[80%]">
                    {playersHere.map(p => (
                      <AnimatedPlayerToken
                        key={p.id}
                        player={p}
                        isCurrentTurn={currentPlayer?.id === p.id}
                        isMoving={false}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderProperty = (property: Property, orientation: 'horizontal' | 'vertical', isTop: boolean = false) => {
    const playersHere = getPlayersOnSpace(property.position);
    const isOwned = !!property.ownerId;
    const owner = players.find(p => p.id === property.ownerId);
    const isHovered = hoveredProperty === property.position;
    const isSelected = selectedProperty === property.position;
    const isGlowing = glowingTile === property.position;
    const icon = property.specialType || '🏠';
    
    // Handle special spaces
    if (property.isSpecial && (property.specialType === 'chance' || property.specialType === 'community-chest')) {
      return (
        <motion.div
          key={property.id}
          className="w-full h-full bg-gradient-to-br from-black via-purple-900/30 to-black border-2 border-purple-500/50 rounded-lg flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
          onMouseEnter={() => setHoveredProperty(property.position)}
          onMouseLeave={() => setHoveredProperty(null)}
          onClick={() => {
            setSelectedProperty(property.position);
            onTileClick(property);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            borderColor: isSelected ? '#8B5CF6' : isHovered ? '#A78BFA' : '#7C3AED',
            boxShadow: isSelected 
              ? '0 0 25px rgba(139, 92, 246, 0.6)'
              : isHovered
              ? '0 0 15px rgba(139, 92, 246, 0.4)'
              : '0 2px 8px rgba(0, 0, 0, 0.5)',
          }}
        >
          <motion.span 
            className="text-3xl mb-1"
            animate={isHovered ? { rotate: [0, 180, 360] } : {}}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.span>
          <div className="text-cyan-300 text-xs font-semibold text-center px-1">{property.name}</div>
        </motion.div>
      );
    }
    
    return (
      <motion.div
        key={property.id}
        className="w-full h-full cursor-pointer relative overflow-hidden rounded-lg border-2"
        onMouseEnter={() => setHoveredProperty(property.position)}
        onMouseLeave={() => setHoveredProperty(null)}
        onClick={() => {
          setSelectedProperty(property.position);
          onTileClick(property);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: isOwned
            ? `linear-gradient(135deg, rgba(20, 30, 50, 0.8), rgba(20, 30, 50, 0.9))`
            : `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))`,
          borderColor: isSelected 
            ? '#06B6D4' 
            : isOwned && owner
            ? owner.color || '#10B981'
            : isHovered
            ? '#8B5CF6'
            : '#334155',
          borderWidth: isSelected ? '3px' : '2px',
          boxShadow: isGlowing
            ? `0 0 30px ${property.color}, 0 0 60px ${property.color}80, inset 0 0 20px ${property.color}40`
            : isSelected
            ? '0 0 25px rgba(6, 182, 212, 0.6), 0 4px 12px rgba(0, 0, 0, 0.5)'
            : isHovered
            ? '0 0 20px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.5)'
            : isOwned
            ? `0 0 10px ${property.color}30, 0 2px 8px rgba(0, 0, 0, 0.5)`
            : '0 2px 8px rgba(0, 0, 0, 0.5)',
          transform: orientation === 'vertical' ? 'rotate(90deg)' : (isTop ? 'rotate(180deg)' : 'rotate(0deg)'),
        }}
      >
        {/* Color stripe */}
        <div
          className="h-6 w-full absolute top-0 left-0 z-10"
          style={{
            backgroundColor: property.color,
            boxShadow: `0 0 10px ${property.color}80`,
          }}
        />
        
        {/* Property icon */}
        <div className="absolute top-1 right-1 z-20 text-lg">
          {icon}
        </div>
        
        <AnimatedPropertyCard
          property={property}
          owner={owner}
          isHovered={isHovered}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          className="w-full h-full"
          orientation={orientation}
        />
        
        {/* Ownership indicator */}
        {isOwned && owner && (
          <div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white z-30"
            style={{
              backgroundColor: owner.color || '#10B981',
              boxShadow: `0 0 10px ${owner.color || '#10B981'}`,
            }}
          >
            {owner.name[0].toUpperCase()}
          </div>
        )}
        
        {/* Houses indicator */}
        {property.houses > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5 z-20">
            {property.houses === 5 ? (
              <span className="text-xs">🏨</span>
            ) : (
              '🏠'.repeat(Math.min(property.houses, 4))
            )}
          </div>
        )}

        {/* Player Tokens */}
        {playersHere.length > 0 && (
          <div className="absolute bottom-1 right-1 flex gap-0.5 flex-wrap max-w-[60%] z-20">
            {playersHere.map((p) => (
              <AnimatedPlayerToken
                key={p.id}
                player={p}
                isCurrentTurn={currentPlayer?.id === p.id}
                isMoving={false}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // Memoize board layout for performance
  const boardLayout = useMemo(() => {
    const bottomSpaces = [9, 8, 7, 6, 5, 4, 3, 2, 1].map(pos => getSpaceAtPosition(pos));
    const rightSpaces = [11, 12, 13, 14, 15, 16, 17, 18, 19].map(pos => getSpaceAtPosition(pos));
    const topSpaces = [21, 22, 23, 24, 25, 26, 27, 28, 29].map(pos => getSpaceAtPosition(pos));
    const leftSpaces = [31, 32, 33, 34, 35, 36, 37, 38, 39].map(pos => getSpaceAtPosition(pos));
    return { bottomSpaces, rightSpaces, topSpaces, leftSpaces };
  }, [getSpaceAtPosition]);

  const { bottomSpaces, rightSpaces, topSpaces, leftSpaces } = boardLayout;

  return (
    <div 
      ref={boardRef}
      className="w-full mx-auto relative"
    >
      {/* Responsive Board Container - MAXIMUM POSSIBLE SIZE */}
      <div 
        className="relative bg-black rounded-3xl border-4 border-cyan-500/50 shadow-2xl"
        style={{
          width: 'min(calc(100vh - 0.25rem), calc(100vw - 9rem), 2000px)',
          height: 'min(calc(100vh - 0.25rem), calc(100vw - 9rem), 2000px)',
          aspectRatio: '1 / 1',
          margin: '0 auto',
          padding: '2vmin',
          boxShadow: '0 0 60px rgba(6, 182, 212, 0.4), inset 0 0 40px rgba(6, 182, 212, 0.1)',
        }}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, #06B6D4, #8B5CF6, #10B981, #06B6D4)',
            backgroundSize: '400% 400%',
            opacity: 0.2,
            filter: 'blur(20px)',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Grid Container - 11x11 */}
        <div 
          className="relative w-full h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(11, 1fr)',
            gridTemplateRows: 'repeat(11, 1fr)',
            gap: '3px',
          }}
        >
          {/* Top-Left Corner: Free Parking (20) */}
          <div style={{ gridArea: '1 / 1 / 2 / 2' }}>
            {renderCornerSpace(getSpaceAtPosition(20), 'h-full w-full', '🅿️')}
          </div>
          
          {/* Top Row: Properties (21-29) */}
          {topSpaces.map((prop, idx) => prop && (
            <div key={prop.id} style={{ gridArea: `1 / ${idx + 2} / 2 / ${idx + 3}` }}>
              {renderProperty(prop, 'horizontal', true)}
            </div>
          ))}
          
          {/* Top-Right Corner: Go to Jail (30) */}
          <div style={{ gridArea: '1 / 11 / 2 / 12' }}>
            {renderCornerSpace(getSpaceAtPosition(30), 'h-full w-full', '🚨')}
          </div>

          {/* Left Column: Properties (31-39) */}
          {leftSpaces.map((prop, idx) => prop && (
            <div key={prop.id} style={{ gridArea: `${idx + 2} / 1 / ${idx + 3} / 2` }}>
              {renderProperty(prop, 'vertical')}
            </div>
          ))}
          
          {/* Center Area - CODEOPOLY Logo */}
          <div 
            className="bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 rounded-xl border-2 border-cyan-500/30 flex items-center justify-center relative overflow-hidden"
            style={{
              gridArea: '2 / 2 / 11 / 11',
              boxShadow: '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 40px rgba(6, 182, 212, 0.1)',
            }}
          >
            <div className="text-center z-10 relative">
              <motion.h1
                className="font-black font-mono mb-2 relative"
                style={{
                  fontSize: 'clamp(2rem, 6vmin, 5rem)',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.6))',
                  letterSpacing: 'clamp(2px, 0.5vmin, 4px)',
                }}
                animate={{
                  filter: [
                    'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.6))',
                    'drop-shadow(0 4px 30px rgba(139, 92, 246, 0.8))',
                    'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.6))',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                CODEOPOLY
              </motion.h1>
              
              <motion.p
                className="text-cyan-400 font-mono relative"
                style={{
                  fontSize: 'clamp(0.75rem, 1.5vmin, 1rem)',
                  letterSpacing: 'clamp(1px, 0.3vmin, 2px)',
                  fontWeight: 300,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Where Code Meets Capitalism
              </motion.p>
            </div>
          </div>

          {/* Right Column: Properties (11-19) */}
          {rightSpaces.map((prop, idx) => prop && (
            <div key={prop.id} style={{ gridArea: `${idx + 2} / 11 / ${idx + 3} / 12` }}>
              {renderProperty(prop, 'vertical')}
            </div>
          ))}

          {/* Bottom-Left Corner: Jail (10) */}
          <div style={{ gridArea: '11 / 1 / 12 / 2' }}>
            {renderCornerSpace(getSpaceAtPosition(10), 'h-full w-full', '🔒')}
          </div>
          
          {/* Bottom Row: Properties (9 down to 1) */}
          {bottomSpaces.map((prop, idx) => prop && (
            <div key={prop.id} style={{ gridArea: `11 / ${idx + 2} / 12 / ${idx + 3}` }}>
              {renderProperty(prop, 'horizontal')}
            </div>
          ))}
          
          {/* Bottom-Right Corner: GO (0) */}
          <div style={{ gridArea: '11 / 11 / 12 / 12' }}>
            {renderCornerSpace(getSpaceAtPosition(0), 'h-full w-full', '🚀')}
          </div>
        </div>
      </div>
    </div>
  );
});

export default GameBoard;
