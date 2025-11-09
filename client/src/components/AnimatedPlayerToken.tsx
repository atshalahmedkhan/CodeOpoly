import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPlayerTokenProps {
  player: {
    id: string;
    name: string;
    avatar: string;
    position: number;
    color?: string;
  };
  isCurrentTurn: boolean;
  isMoving?: boolean;
  previousPosition?: number;
}

export default function AnimatedPlayerToken({
  player,
  isCurrentTurn,
  isMoving = false,
  previousPosition,
}: AnimatedPlayerTokenProps) {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const tokenRef = useRef<HTMLDivElement>(null);
  const trailIdRef = useRef(0);

  // Create glowing trail when moving
  useEffect(() => {
    if (isMoving && tokenRef.current) {
      const interval = setInterval(() => {
        const rect = tokenRef.current?.getBoundingClientRect();
        if (rect) {
          const newTrail = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            id: trailIdRef.current++,
          };
          setTrail(prev => [...prev, newTrail].slice(-10)); // Keep last 10 trail points
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isMoving]);

  // Clear trail after movement
  useEffect(() => {
    if (!isMoving) {
      const timeout = setTimeout(() => {
        setTrail([]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isMoving]);

  return (
    <>
      {/* Trail effect */}
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none"
            style={{
              left: point.x,
              top: point.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: `radial-gradient(circle, ${player.color || '#FFD700'}, transparent)`,
                boxShadow: `0 0 10px ${player.color || '#FFD700'}`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Player token */}
      <motion.div
        ref={tokenRef}
        className={`relative ${isCurrentTurn ? 'active' : ''}`}
        animate={{
          y: isCurrentTurn ? [0, -4, 0] : [0, -4, 0],
          scale: isCurrentTurn ? 1.1 : 1,
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          scale: {
            duration: 0.3,
          },
        }}
        whileHover={{ scale: 1.2 }}
      >
        {/* Pulsing ring for current player */}
        {isCurrentTurn && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px ${player.color || '#FFD700'}`,
              background: `radial-gradient(circle, transparent 30%, ${player.color || '#FFD700'}20)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Avatar container */}
        <motion.div
          className="relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg player-token"
          style={{
            background: `linear-gradient(135deg, ${player.color || '#FFD700'} 0%, ${player.color || '#FFD700'}CC 100%)`,
            border: `3px solid rgba(255, 255, 255, 0.3)`,
            boxShadow: isCurrentTurn
              ? `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 40px ${player.color || '#FFD700'}, 0 0 60px ${player.color || '#FFD700'}, inset 0 2px 4px rgba(255, 255, 255, 0.3)`
              : `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 30px ${player.color || '#FFD700'}, inset 0 2px 4px rgba(255, 255, 255, 0.3)`,
            cursor: 'pointer',
            '--player-color': player.color || '#FFD700',
            '--player-color-dark': player.color ? `${player.color}CC` : '#FFD700CC',
          } as React.CSSProperties}
          animate={isCurrentTurn ? {
            boxShadow: [
              `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 30px ${player.color || '#FFD700'}`,
              `0 6px 18px rgba(0, 0, 0, 0.6), 0 0 50px ${player.color || '#FFD700'}, 0 0 70px ${player.color || '#FFD700'}`,
              `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 30px ${player.color || '#FFD700'}`,
            ],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: isCurrentTurn ? Infinity : 0,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.2,
            y: -8,
            boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6), 0 0 50px ${player.color || '#FFD700'}`,
            zIndex: 100,
          }}
        >
          {/* Animated eyes for avatar */}
          <motion.div className="relative">
            <span className="text-2xl">{player.avatar}</span>
            {isCurrentTurn && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  times: [0, 0.1, 0.9, 1],
                }}
              >
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-black rounded-full" />
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Movement trail pulse effect */}
          <motion.div
            className="absolute inset-[-5px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${player.color || '#FFD700'} 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0.6, 0],
              scale: [1, 2],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </motion.div>

        {/* Player name label */}
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${player.color || '#FFD700'}20`,
              border: `1px solid ${player.color || '#FFD700'}60`,
              color: player.color || '#FFD700',
            }}
          >
            {player.name}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}




