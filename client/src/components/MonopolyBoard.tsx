import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
}

interface MonopolyBoardProps {
  boardState: Property[];
  players: any[];
  currentPlayer: any;
  onTileClick: (property: Property) => void;
  landedPosition?: number;
}

export default function MonopolyBoard({ 
  boardState, 
  players, 
  currentPlayer, 
  onTileClick,
  landedPosition 
}: MonopolyBoardProps) {
  const [glowingTile, setGlowingTile] = useState<number | null>(landedPosition || null);

  useEffect(() => {
    if (landedPosition !== undefined) {
      setGlowingTile(landedPosition);
      setTimeout(() => setGlowingTile(null), 3000);
    }
  }, [landedPosition]);

  // Classic Monopoly board layout: square with 40 spaces
  // Positions: 0=GO (bottom-right), 1-9=bottom, 10=Jail (top-right), 11-19=right, 
  // 20=Free Parking (top-left), 21-29=top, 30=Go to Jail (bottom-left), 31-39=left

  const getSpaceAtPosition = (pos: number) => {
    return boardState.find(p => p.position === pos);
  };

  const getPlayersOnSpace = (pos: number) => {
    return players.filter(p => p.position === pos);
  };

  const getSpaceStyle = (property: Property | undefined, pos: number) => {
    if (!property) return {};
    
    const isGlowing = glowingTile === pos;
    const isLanded = currentPlayer?.position === pos;
    const isOwned = !!property.ownerId;
    
    return {
      background: property.isSpecial 
        ? `linear-gradient(135deg, ${property.color}40, ${property.color}60)`
        : `linear-gradient(135deg, ${property.color}80, ${property.color})`,
      border: isOwned 
        ? `3px solid ${property.color}` 
        : `2px solid ${property.color}60`,
      boxShadow: isGlowing
        ? `0 0 30px ${property.color}, 0 0 60px ${property.color}80, 0 0 90px ${property.color}60`
        : isLanded
        ? `0 0 20px ${property.color}60, inset 0 0 20px ${property.color}40`
        : isOwned
        ? `0 0 15px ${property.color}40`
        : 'none',
      transform: isGlowing ? 'scale(1.1) translateZ(10px)' : 'scale(1)',
      zIndex: isGlowing ? 10 : isLanded ? 5 : 1,
    };
  };

  // Render corner space
  const renderCorner = (property: Property | undefined, className: string, label: string) => {
    const playersHere = property ? getPlayersOnSpace(property.position) : [];
    const isGlowing = property && glowingTile === property.position;
    
    return (
      <div className={className} style={{ perspective: '1000px' }}>
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
          className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 border-slate-600 p-2 flex flex-col items-center justify-center text-white font-bold shadow-lg"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-5deg) rotateX(5deg)',
          }}
        >
          <div className="text-xs font-mono mb-1">{label}</div>
          {property && (
            <>
              <div className="text-[10px] text-yellow-400 font-semibold">
                {property.specialType?.toUpperCase().replace('-', ' ') || property.name}
              </div>
              {playersHere.length > 0 && (
                <div className="flex gap-1 mt-1">
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

  // Render property space
  const renderProperty = (property: Property, orientation: 'horizontal' | 'vertical', isTop: boolean = false) => {
    const playersHere = getPlayersOnSpace(property.position);
    const isGlowing = glowingTile === property.position;
    const isOwned = !!property.ownerId;
    const isLanded = currentPlayer?.position === property.position;
    
    return (
      <motion.div
        key={property.id}
        animate={isGlowing ? { 
          scale: [1, 1.15, 1],
          rotateY: [0, 5, 0],
        } : isLanded ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 0.6, repeat: (isGlowing || isLanded) ? Infinity : 0 }}
        onClick={() => onTileClick(property)}
        className={`cursor-pointer transition-all duration-300 relative ${
          orientation === 'horizontal' ? 'h-20' : 'w-20 h-full'
        }`}
        style={{
          ...getSpaceStyle(property, property.position),
          transformStyle: 'preserve-3d',
          transform: orientation === 'horizontal' 
            ? 'rotateY(-2deg) translateZ(5px)' 
            : 'rotateX(2deg) translateZ(5px)',
        }}
        onMouseEnter={() => setGlowingTile(property.position)}
        onMouseLeave={() => !isLanded && setGlowingTile(null)}
      >
        <div className={`h-full flex flex-col items-center justify-center p-1 rounded ${
          orientation === 'horizontal' ? 'text-center' : 'text-center'
        }`}>
          {orientation === 'horizontal' ? (
            <>
              <div className="text-[9px] font-bold text-white truncate w-full px-1 leading-tight">
                {property.name}
              </div>
              {!property.isSpecial && (
                <div className="text-[8px] text-yellow-300 font-mono font-semibold mt-0.5">
                  ${property.price}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-[8px] font-bold text-white writing-vertical-rl transform rotate-180">
                {property.name}
              </div>
              {!property.isSpecial && (
                <div className="text-[7px] text-yellow-300 font-mono font-semibold mt-1">
                  ${property.price}
                </div>
              )}
            </>
          )}
          {isOwned && (
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-lg border border-yellow-600" />
          )}
          {property.houses > 0 && (
            <div className="absolute bottom-1 left-1 text-[10px]">
              {'🏠'.repeat(Math.min(property.houses, 4))}
            </div>
          )}
          {playersHere.length > 0 && (
            <div className="absolute top-1 left-1 flex gap-0.5 flex-wrap max-w-[60%]">
              {playersHere.map(p => (
                <span key={p.id} className="text-sm">{p.avatar}</span>
              ))}
            </div>
          )}
          {isLanded && (
            <div className="absolute inset-0 border-2 border-yellow-400 rounded animate-pulse" />
          )}
        </div>
      </motion.div>
    );
  };

  // Get spaces for each side
  const bottomSpaces = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(pos => getSpaceAtPosition(pos));
  const rightSpaces = [11, 12, 13, 14, 15, 16, 17, 18, 19].map(pos => getSpaceAtPosition(pos));
  const topSpaces = [21, 22, 23, 24, 25, 26, 27, 28, 29].map(pos => getSpaceAtPosition(pos));
  const leftSpaces = [31, 32, 33, 34, 35, 36, 37, 38, 39].map(pos => getSpaceAtPosition(pos));

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div 
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl"
        style={{
          boxShadow: '0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 60px rgba(147, 51, 234, 0.3)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        }}
      >
        {/* Classic Monopoly Square Layout - 11x11 grid */}
        <div className="grid grid-cols-11 gap-0" style={{ aspectRatio: '1', minHeight: '600px' }}>
          {/* Top Row: Free Parking (20) -> Top Properties (21-29) -> Jail (10) */}
          <div className="col-span-1">
            {renderCorner(getSpaceAtPosition(20), 'h-full', 'FREE PARKING')}
          </div>
          <div className="col-span-9 grid grid-cols-9 gap-0">
            {topSpaces.map((prop) => prop && (
              <div key={prop.id} className="transform rotate-180">
                {renderProperty(prop, 'horizontal', true)}
              </div>
            ))}
          </div>
          <div className="col-span-1">
            {renderCorner(getSpaceAtPosition(10), 'h-full', 'JAIL')}
          </div>

          {/* Middle Rows: Left Properties (31-39) -> Center -> Right Properties (11-19) */}
          <div className="col-span-1">
            <div className="h-full grid grid-rows-9 gap-0">
              {leftSpaces.map((prop) => prop && (
                <div key={prop.id} className="transform rotate-90">
                  {renderProperty(prop, 'vertical')}
                </div>
              ))}
            </div>
          </div>
          
          {/* Center Area - CODEOPOLY Logo */}
          <div className="col-span-9 bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border-4 border-slate-600 flex items-center justify-center relative overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 40px rgba(16, 185, 129, 0.2), 0 0 40px rgba(16, 185, 129, 0.1)',
            }}
          >
            <div className="text-center z-10">
              <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent font-mono">
                CODEOPOLY
              </div>
              <div className="text-sm text-emerald-400 font-mono space-y-1">
                <div>💻 Solve Problems</div>
                <div>🏠 Buy Properties</div>
                <div>🏆 Win the Game</div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-6xl">🎲</div>
              <div className="absolute bottom-4 right-4 text-6xl">💻</div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="h-full grid grid-rows-9 gap-0">
              {rightSpaces.map((prop) => prop && (
                <div key={prop.id} className="transform -rotate-90">
                  {renderProperty(prop, 'vertical')}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row: Go to Jail (30) -> Bottom Properties (1-9) -> GO (0) */}
          <div className="col-span-1">
            {renderCorner(getSpaceAtPosition(30), 'h-full', 'GO TO JAIL')}
          </div>
          <div className="col-span-9 grid grid-cols-9 gap-0">
            {bottomSpaces.map((prop) => prop && renderProperty(prop, 'horizontal'))}
          </div>
          <div className="col-span-1">
            {renderCorner(getSpaceAtPosition(0), 'h-full', 'GO')}
          </div>
        </div>
      </div>
    </div>
  );
}

