import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPropertyCard from './AnimatedPropertyCard';
import AnimatedPlayerToken from './AnimatedPlayerToken';
import { soundManager } from '../lib/soundEffects';

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
  specialType?: 'go' | 'jail' | 'free-parking' | 'go-to-jail' | 'chance' | 'community-chest';
  isRailroad?: boolean;
  isUtility?: boolean;
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

interface EnhancedMonopolyBoardProps {
  boardState: Property[];
  players: Player[];
  currentPlayer: Player | null;
  onTileClick: (property: Property) => void;
  landedPosition?: number;
}

export default function EnhancedMonopolyBoard({
  boardState,
  players,
  currentPlayer,
  onTileClick,
  landedPosition,
}: EnhancedMonopolyBoardProps) {
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [glowingTile, setGlowingTile] = useState<number | null>(landedPosition || null);
  const boardRef = useRef<HTMLDivElement>(null);

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

  const getPropertyStyle = (property: Property | undefined, pos: number) => {
    if (!property) return {};
    
    const isHovered = hoveredProperty === pos;
    const isGlowing = glowingTile === pos;
    const isOwned = !!property.ownerId;
    const owner = players.find(p => p.id === property.ownerId);
    
    // Extract RGB from hex color for CSS variable
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '79, 209, 197';
    };
    const propertyColorRgb = hexToRgb(property.color);
    
    return {
      background: property.isSpecial 
        ? `linear-gradient(135deg, ${property.color}40, ${property.color}60)`
        : isOwned
        ? `linear-gradient(135deg, rgba(20, 30, 50, 0.9), rgba(20, 30, 50, 0.95))`
        : `linear-gradient(135deg, rgba(20, 30, 50, 0.9), rgba(20, 30, 50, 0.95))`,
      border: isOwned && owner
        ? `3px solid ${owner.color || '#FFD700'}`
        : `2px solid rgba(255, 255, 255, 0.1)`,
      boxShadow: isGlowing
        ? `0 0 30px ${property.color}, 0 0 60px ${property.color}80, 0 0 90px ${property.color}60, inset 0 0 30px ${property.color}40, 0 12px 32px rgba(0,0,0,0.7), 0 0 40px rgba(${propertyColorRgb}, 0.8)`
        : isHovered
        ? `0 12px 32px rgba(0,0,0,0.7), 0 0 40px rgba(${propertyColorRgb}, 0.8), inset 0 1px 2px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5)`
        : isOwned
        ? `0 4px 12px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1), 0 0 20px rgba(${propertyColorRgb}, 0.3), 0 0 15px ${property.color}40`
        : `0 4px 12px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1), 0 0 20px rgba(${propertyColorRgb}, 0.3)`,
      transform: isHovered 
        ? 'perspective(1000px) rotateX(0deg) translateY(-12px) scale(1.08)' 
        : 'perspective(1000px) rotateX(2deg)',
      zIndex: isHovered ? 100 : isGlowing ? 10 : 1,
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      '--property-color': property.color,
    } as React.CSSProperties;
  };

  const renderCornerSpace = (property: Property | undefined, className: string, icon: string) => {
    const playersHere = property ? getPlayersOnSpace(property.position) : [];
    const isGlowing = property && glowingTile === property.position;
    const isHovered = property && hoveredProperty === property.position;
    const specialType = property?.specialType;
    
    // Get corner-specific styling
    const getCornerStyle = () => {
      switch (specialType) {
        case 'go':
          return {
            background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
            className: 'go-corner',
          };
        case 'free-parking':
          return {
            background: 'linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)',
            className: 'free-parking',
          };
        case 'go-to-jail':
          return {
            background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
            className: 'go-to-jail',
          };
        case 'jail':
          return {
            background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
            className: 'jail-corner',
          };
        default:
          return {
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            className: '',
          };
      }
    };
    
    const cornerStyle = getCornerStyle();
    
    return (
      <div 
        className={`${className} relative ${cornerStyle.className}`} 
        style={{ perspective: '1000px' }}
        onMouseEnter={() => property && setHoveredProperty(property.position)}
        onMouseLeave={() => property && setHoveredProperty(null)}
      >
        <motion.div
          animate={isGlowing ? { 
            scale: [1, 1.1, 1],
            rotateY: [0, 5, -5, 0],
          } : isHovered ? {
            scale: 1.05,
            translateZ: 20,
          } : {}}
          transition={{ duration: 0.5, repeat: isGlowing ? Infinity : 0 }}
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
            background: cornerStyle.background,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl border-2 border-slate-600 p-4 flex flex-col items-center justify-center overflow-hidden">
            {/* Special effects for each corner */}
            {specialType === 'free-parking' && (
              <motion.div
                className="parking-icon text-6xl mb-2"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(66, 153, 225, 0.6))',
                }}
              >
                🅿️
              </motion.div>
            )}
            
            {specialType === 'go-to-jail' && (
              <>
                <motion.div
                  className="police-light absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full"
                  animate={{
                    background: [
                      'radial-gradient(circle, #E53E3E 0%, transparent 70%)',
                      'radial-gradient(circle, #3182CE 0%, transparent 70%)',
                      'radial-gradient(circle, #E53E3E 0%, transparent 70%)',
                    ],
                    boxShadow: [
                      '0 0 20px #E53E3E',
                      '0 0 20px #3182CE',
                      '0 0 20px #E53E3E',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="jail-arrow absolute bottom-4 text-2xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ⬇️
                </motion.div>
              </>
            )}
            
            {specialType === 'jail' && (
              <>
                <div className="jail-bars absolute inset-0 pointer-events-none" style={{
                  background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 15px, rgba(255, 255, 255, 0.1) 15px, rgba(255, 255, 255, 0.1) 18px)',
                }} />
                <motion.div
                  className="jail-lock text-6xl mb-2"
                  animate={{
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.02, 0.04, 0.1] }}
                  style={{
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8))',
                  }}
                >
                  🔒
                </motion.div>
              </>
            )}
            
            {specialType === 'go' && (
              <>
                <motion.div
                  className="go-arrow text-5xl mb-2"
                  animate={{ x: [-4, 4, -4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ➡️
                </motion.div>
                <motion.div
                  className="go-amount text-2xl font-black text-yellow-300"
                  animate={{
                    textShadow: [
                      '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 211, 141, 0.8)',
                      '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 30px rgba(251, 211, 141, 1)',
                      '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 211, 141, 0.8)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  $200
                </motion.div>
              </>
            )}
            
            {/* Default icon if no special type */}
            {!specialType && (
              <motion.div
                className="text-5xl mb-2"
                animate={isGlowing ? { 
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                } : {}}
                transition={{ duration: 2, repeat: isGlowing ? Infinity : 0 }}
              >
                {icon}
              </motion.div>
            )}
            
            {property && (
              <>
                <div className="text-xs font-mono text-emerald-400 font-bold tracking-wider mt-2">
                  {property.name.toUpperCase()}
                </div>
                
                {/* Players */}
                {playersHere.length > 0 && (
                  <div className="absolute bottom-2 right-2 flex gap-1 flex-wrap">
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
    
    return (
      <motion.div
        key={property.id}
        className={`cursor-pointer relative ${
          orientation === 'horizontal' ? 'h-20' : 'w-32 h-full'
        }`}
        style={getPropertyStyle(property, property.position)}
        onMouseEnter={() => {
          setHoveredProperty(property.position);
          soundManager.playPropertyLanding();
        }}
        onMouseLeave={() => setHoveredProperty(null)}
        onClick={() => onTileClick(property)}
        whileHover={{ scale: 1.03, translateY: -6 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated border glow on hover */}
        {hoveredProperty === property.position && (
          <motion.div
            className="absolute inset-[-2px] rounded pointer-events-none"
            style={{
              background: `linear-gradient(45deg, ${property.color}, transparent, ${property.color})`,
              backgroundSize: '200% 200%',
              opacity: 0,
              zIndex: -1,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backgroundPosition: ['0% 50%', '200% 50%', '0% 50%'],
            }}
            transition={{
              opacity: { duration: 0.3 },
              backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
            }}
          />
        )}
        
        {/* Enhanced Color Bar */}
        <motion.div
          className={orientation === 'horizontal' ? 'h-3 w-full' : 'w-3 h-full absolute left-0 top-0'}
          style={{
            background: `linear-gradient(135deg, ${property.color} 0%, ${property.color}CC 100%)`,
            boxShadow: `0 2px 8px ${property.color}`,
          }}
          animate={hoveredProperty === property.position ? {
            ...(orientation === 'horizontal' ? { height: 16 } : { width: 16 }),
          } : {}}
          transition={{ duration: 0.3 }}
        >
          {/* Shimmer effect on color bar */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: orientation === 'horizontal' 
                ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
                : 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
            }}
            animate={{
              ...(orientation === 'horizontal' 
                ? { x: ['-100%', '100%'] }
                : { y: ['-100%', '100%'] }
              ),
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
        
        <AnimatedPropertyCard
          property={property}
          owner={owner}
          isHovered={hoveredProperty === property.position}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          className="w-full h-full"
        />
        
        {/* Enhanced Ownership indicator */}
        {isOwned && owner && (
          <motion.div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${owner.color || '#FFD700'}, ${owner.color || '#FFD700'}CC)`,
              boxShadow: `0 0 15px ${owner.color || '#FFD700'}, 0 2px 8px rgba(0,0,0,0.4)`,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {owner.name[0]}
          </motion.div>
        )}
        
        {/* Enhanced Houses/Hotels */}
        {property.houses > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {[...Array(Math.min(property.houses, 4))].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-sm relative"
                style={{
                  background: 'linear-gradient(135deg, #68D391 0%, #48BB78 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                  transform: 'perspective(100px) rotateX(-20deg)',
                }}
                initial={{ scale: 0, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 500 }}
              >
                {/* House roof */}
                <div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '3px solid transparent',
                    borderRight: '3px solid transparent',
                    borderBottom: '3px solid #68D391',
                  }}
                />
              </motion.div>
            ))}
            {property.houses === 5 && (
              <motion.div
                className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #FC8181 0%, #F56565 100%)',
                  boxShadow: '0 2px 8px rgba(252, 129, 129, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
                  transform: 'perspective(100px) rotateX(-20deg)',
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                H
              </motion.div>
            )}
          </div>
        )}

        {/* Player Tokens */}
        {playersHere.length > 0 && (
          <div className="absolute bottom-1 right-1 flex gap-1 flex-wrap max-w-[60%]">
            {playersHere.map((p, idx) => (
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

  const bottomSpaces = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(pos => getSpaceAtPosition(pos));
  const rightSpaces = [11, 12, 13, 14, 15, 16, 17, 18, 19].map(pos => getSpaceAtPosition(pos));
  const topSpaces = [21, 22, 23, 24, 25, 26, 27, 28, 29].map(pos => getSpaceAtPosition(pos));
  const leftSpaces = [31, 32, 33, 34, 35, 36, 37, 38, 39].map(pos => getSpaceAtPosition(pos));

  return (
    <motion.div 
      ref={boardRef}
      className="w-full max-w-5xl mx-auto p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
          backgroundSize: '400% 400%',
          opacity: 0.3,
          filter: 'blur(40px)',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      
      <div 
        className="relative rounded-2xl overflow-hidden game-board board-border"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(79, 209, 197, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(104, 211, 145, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, #0F1419 0%, #1a1f2e 100%)
          `,
          border: '4px solid transparent',
          borderImage: 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 25%, #68D391 50%, #4FD1C5 75%, #38B2AC 100%) 1',
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.8),
            0 0 40px rgba(79, 209, 197, 0.3),
            inset 0 0 40px rgba(79, 209, 197, 0.1)
          `,
          position: 'relative',
        }}
      >
        {/* Animated gradient orbs in background */}
        <motion.div
          className="absolute bg-orb orb-1"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #4FD1C5 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.3,
            top: '-200px',
            left: '-200px',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bg-orb orb-2"
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #68D391 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.3,
            bottom: '-250px',
            right: '-250px',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bg-orb orb-3"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #B794F4 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.3,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 10,
          }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 board-grid pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(79, 209, 197, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 209, 197, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.3,
          }}
        />
        
        {/* Vignette effect */}
        <div 
          className="absolute inset-0 board-vignette pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
          }}
        />
        
        {/* Noise texture for depth */}
        <div 
          className="absolute inset-0 board-noise pointer-events-none opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '4px solid transparent',
            borderImage: 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 25%, #68D391 50%, #4FD1C5 75%, #38B2AC 100%) 1',
          }}
          animate={{
            boxShadow: [
              '0 0 40px rgba(79, 209, 197, 0.3), inset 0 0 40px rgba(79, 209, 197, 0.1)',
              '0 0 60px rgba(79, 209, 197, 0.5), inset 0 0 60px rgba(79, 209, 197, 0.2)',
              '0 0 40px rgba(79, 209, 197, 0.3), inset 0 0 40px rgba(79, 209, 197, 0.1)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Board grid */}
        <div className="grid gap-0 p-6" style={{ 
          aspectRatio: '1', 
          minHeight: '600px',
          gridTemplateColumns: 'repeat(13, minmax(0, 1fr))'
        }}>
          {/* Top Row */}
          <div className="col-span-2">
            {renderCornerSpace(getSpaceAtPosition(20), 'h-full', '🅿️')}
          </div>
          <div className="col-span-9 grid grid-cols-9 gap-0">
            {topSpaces.map((prop) => prop && (
              <div key={prop.id} className="transform rotate-180">
                {renderProperty(prop, 'horizontal', true)}
              </div>
            ))}
          </div>
          <div className="col-span-2">
            {renderCornerSpace(getSpaceAtPosition(30), 'h-full', '🚨')}
          </div>

          {/* Middle Rows */}
          <div className="col-span-2">
            <div className="h-full grid grid-rows-9 gap-0">
              {leftSpaces.map((prop) => prop && (
                <div key={prop.id}>
                  {renderProperty(prop, 'vertical')}
                </div>
              ))}
            </div>
          </div>
          
          {/* Center Area */}
          <div className="col-span-9 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-xl backdrop-blur-sm border-2 border-slate-600/50 flex items-center justify-center relative overflow-hidden codeopoly-logo">
            {/* Animated particles background */}
            <div className="absolute inset-0 logo-particles">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute code-symbol font-mono"
                  style={{
                    left: `${10 + (i % 4) * 20}%`,
                    top: `${20 + Math.floor(i / 4) * 25}%`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                    color: 'rgba(79, 209, 197, 0.3)',
                  }}
                  animate={{
                    x: [0, Math.random() * 60 - 30, 0],
                    y: [0, Math.random() * -60, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 0.6, 0.8, 0.6, 0],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: 'easeInOut',
                  }}
                >
                  {['</>', '{}', 'fn', '()', '[]', '=>', 'const', 'let', 'var', 'class'][i % 10]}
                </motion.div>
              ))}
            </div>
            
            <div className="text-center z-10 relative">
              {/* Enhanced logo text with animated gradient */}
              <motion.h1
                className="logo-text text-6xl md:text-7xl lg:text-8xl font-black font-mono mb-2 relative"
                style={{
                  background: 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 20%, #68D391 40%, #4FD1C5 60%, #38B2AC 80%, #68D391 100%)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 20px rgba(79, 209, 197, 0.6))',
                  letterSpacing: '6px',
                  position: 'relative',
                  zIndex: 1,
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  backgroundPosition: { duration: 5, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                CODEOPOLY
              </motion.h1>
              
              {/* Tagline with animated underline */}
              <motion.p
                className="tagline text-lg md:text-xl text-emerald-400 font-mono relative"
                style={{
                  letterSpacing: '3px',
                  fontWeight: 300,
                  marginTop: '12px',
                  marginBottom: '40px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Where Code Meets Capitalism
                <motion.div
                  className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                  animate={{
                    width: ['0%', '80%', '0%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.p>
              
              <div className="mt-6 space-y-2">
                <motion.div
                  className="flex items-center justify-center gap-2 text-white/60 text-xs font-mono"
                  whileHover={{ scale: 1.05, color: '#10b981' }}
                >
                  <span>💻</span>
                  <span>Solve Problems</span>
                </motion.div>
                <motion.div
                  className="flex items-center justify-center gap-2 text-white/60 text-xs font-mono"
                  whileHover={{ scale: 1.05, color: '#f59e0b' }}
                >
                  <span>🏠</span>
                  <span>Buy Properties</span>
                </motion.div>
                <motion.div
                  className="flex items-center justify-center gap-2 text-white/60 text-xs font-mono"
                  whileHover={{ scale: 1.05, color: '#8b5cf6' }}
                >
                  <span>🏆</span>
                  <span>Win the Game</span>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-full grid grid-rows-9 gap-0">
              {rightSpaces.map((prop) => prop && (
                <div key={prop.id}>
                  {renderProperty(prop, 'vertical')}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="col-span-2">
            {renderCornerSpace(getSpaceAtPosition(10), 'h-full', '🔒')}
          </div>
          <div className="col-span-9 grid grid-cols-9 gap-0">
            {bottomSpaces.map((prop) => prop && renderProperty(prop, 'horizontal'))}
          </div>
          <div className="col-span-2">
            {renderCornerSpace(getSpaceAtPosition(0), 'h-full', '➡️')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
