import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPlayerToken from './AnimatedPlayerToken';
import { Trophy, TrendingUp, Home, DollarSign } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  color: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  position: number;
  properties: string[];
  inJail: boolean;
  jailTurns: number;
  color?: string;
}

interface GlassmorphicPlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  isYou: boolean;
  properties?: Property[];
  rank?: number;
  totalPlayers?: number;
}

export default function GlassmorphicPlayerCard({
  player,
  isCurrentTurn,
  isYou,
  properties = [],
  rank = 1,
  totalPlayers = 4,
}: GlassmorphicPlayerCardProps) {
  const [previousMoney, setPreviousMoney] = useState(player.money);
  const [moneyChange, setMoneyChange] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayMoney, setDisplayMoney] = useState(player.money);

  // Animate money changes
  useEffect(() => {
    const change = player.money - previousMoney;
    if (change !== 0) {
      setMoneyChange(change);
      setPreviousMoney(player.money);
      
      // Animate the number counting
      const duration = 1000;
      const steps = 30;
      const increment = change / steps;
      let current = previousMoney;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        current += increment;
        setDisplayMoney(Math.round(current));
        
        if (step >= steps) {
          clearInterval(timer);
          setDisplayMoney(player.money);
          setTimeout(() => setMoneyChange(0), 2000);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [player.money, previousMoney]);

  const ownedProperties = properties.filter(p => 
    player.properties.includes(p.id)
  );

  const netWorth = player.money + ownedProperties.length * 100; // Simplified

  return (
    <motion.div
      className="relative h-full"
      style={{ perspective: '1000px' }}
      animate={isCurrentTurn ? {
        scale: [1, 1.02, 1],
      } : {}}
      transition={{
        duration: 2,
        repeat: isCurrentTurn ? Infinity : 0,
      }}
    >
      {/* Active turn glow */}
      {isCurrentTurn && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, ${player.color || '#FFD700'}40, transparent)`,
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* Main card */}
      <motion.div
        className="relative h-full rounded-2xl overflow-hidden cursor-pointer"
        style={{
          background: 'rgba(15, 25, 45, 0.7)',
          backdropFilter: 'blur(10px) saturate(180%)',
          border: `2px solid ${isCurrentTurn ? player.color || '#FFD700' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isCurrentTurn
            ? `0 20px 40px ${player.color || '#FFD700'}30, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
            : '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsFlipped(!isFlipped)}
        transition={{ duration: 0.6 }}
      >
        {/* Front side */}
        <div 
          className="absolute inset-0 p-2 sm:p-3 md:p-4 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="scale-75 sm:scale-90 md:scale-100">
                <AnimatedPlayerToken
                  player={player}
                  isCurrentTurn={isCurrentTurn}
                />
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <h3 className="font-bold text-white font-mono text-sm sm:text-base md:text-lg">
                    {player.name}
                  </h3>
                  {isYou && (
                    <motion.span
                      className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500 rounded-full text-[10px] sm:text-xs text-emerald-400 font-bold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      YOU
                    </motion.span>
                  )}
                </div>
                {isCurrentTurn && (
                  <motion.div
                    className="text-[10px] sm:text-xs text-yellow-400 font-mono font-semibold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ▶ CURRENT TURN
                  </motion.div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-white/60">
                <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>#{rank}/{totalPlayers}</span>
              </div>
            </div>
          </div>

          {/* Money display with animation */}
          <div className="mb-2 sm:mb-3">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <DollarSign className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
              <motion.span 
                className="text-lg sm:text-xl md:text-2xl font-bold text-white font-mono"
                key={displayMoney}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                ${displayMoney.toLocaleString()}
              </motion.span>
              <AnimatePresence>
                {moneyChange !== 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-sm font-bold font-mono ${
                      moneyChange > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {moneyChange > 0 ? '+' : ''}{moneyChange}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            {/* Money bar */}
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((player.money / 2000) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Properties preview */}
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-white/60">
              <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Properties ({ownedProperties.length})</span>
            </div>
            <div className="flex flex-wrap gap-0.5 sm:gap-1">
              {ownedProperties.slice(0, 8).map((prop) => (
                <motion.div
                  key={prop.id}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold"
                  style={{
                    backgroundColor: `${prop.color}40`,
                    border: `1px solid ${prop.color}`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  title={prop.name}
                >
                  {prop.name[0]}
                </motion.div>
              ))}
              {ownedProperties.length > 8 && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded bg-white/10 flex items-center justify-center text-[10px] sm:text-xs text-white/60">
                  +{ownedProperties.length - 8}
                </div>
              )}
            </div>
          </div>

          {/* Status indicators */}
          {player.inJail && (
            <motion.div
              className="absolute bottom-2 right-2 px-3 py-1 bg-red-500/20 border border-red-500 rounded-full text-xs text-red-400 font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔒 JAILED ({player.jailTurns} turns)
            </motion.div>
          )}
        </div>

        {/* Back side - Stats */}
        <div 
          className="absolute inset-0 p-4 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h3 className="font-bold text-white font-mono text-lg mb-4">
            Player Stats
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Net Worth</span>
              <span className="text-emerald-400 font-bold font-mono">
                ${netWorth.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Properties</span>
              <span className="text-white font-mono">{ownedProperties.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Position</span>
              <span className="text-white font-mono">Space {player.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Monopolies</span>
              <span className="text-white font-mono">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Houses Built</span>
              <span className="text-white font-mono">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Rent Collected</span>
              <span className="text-white font-mono">$0</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <button className="text-xs text-white/40 hover:text-white/60">
              Click to flip back
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}





