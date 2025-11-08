import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedPlayerMovementProps {
  player: {
    id: string;
    name: string;
    avatar: string;
    position: number;
    color: string;
  };
  targetPosition: number;
  isCurrentPlayer: boolean;
  offset?: number;
  onAnimationComplete?: () => void;
}

export default function AnimatedPlayerMovement({
  player,
  targetPosition,
  isCurrentPlayer,
  offset = 0,
  onAnimationComplete,
}: AnimatedPlayerMovementProps) {
  const [currentPos, setCurrentPos] = useState(player.position);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (targetPosition !== player.position) {
      setIsAnimating(true);
      animateMovement(player.position, targetPosition);
    }
  }, [targetPosition, player.position]);

  const animateMovement = (start: number, end: number) => {
    const steps = Math.abs(end - start);
    const direction = end > start ? 1 : -1;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const newPos = start + (direction * step);
      
      if (direction > 0) {
        setCurrentPos(newPos > end ? end : newPos);
      } else {
        setCurrentPos(newPos < end ? end : newPos);
      }

      if (step >= steps) {
        clearInterval(interval);
        setIsAnimating(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }, 200); // 200ms per space for smooth animation
  };

  const getGridPosition = (pos: number) => {
    // Normalize position to 0-39
    const normalizedPos = ((pos % 40) + 40) % 40;
    
    if (normalizedPos <= 10) {
      return { row: 10, col: 10 - normalizedPos };
    } else if (normalizedPos <= 19) {
      return { row: 10 - (normalizedPos - 10), col: 0 };
    } else if (normalizedPos <= 30) {
      return { row: 0, col: normalizedPos - 20 };
    } else {
      return { row: normalizedPos - 30, col: 10 };
    }
  };

  const gridPos = getGridPosition(currentPos);
  const offsetMap = [
    { x: 0, y: 0 },
    { x: 18, y: -18 },
    { x: -18, y: -18 },
    { x: 18, y: 18 },
    { x: -18, y: 18 },
  ];
  const { x: offsetX, y: offsetY } = offsetMap[offset] || { x: 0, y: 0 };

  return (
    <motion.div
      className="relative z-30 flex items-center justify-center pointer-events-none"
      style={{
        gridRow: gridPos.row + 1,
        gridColumn: gridPos.col + 1,
      }}
      animate={{
        x: offsetX,
        y: offsetY,
      }}
      transition={isAnimating ? {
        type: 'tween',
        duration: 0.2,
        ease: 'linear',
      } : {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      <motion.div
        className="w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-2xl relative pointer-events-auto"
        style={{
          backgroundColor: player.color,
          boxShadow: isCurrentPlayer 
            ? `0 0 20px ${player.color}, 0 0 40px ${player.color}80`
            : '0 4px 12px rgba(0,0,0,0.3)',
        }}
        animate={isCurrentPlayer ? {
          scale: [1, 1.12, 1],
        } : {}}
        transition={{ duration: 1, repeat: isCurrentPlayer ? Infinity : 0 }}
        whileHover={{ scale: 1.2 }}
      >
        {player.avatar}
        {isCurrentPlayer && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
        {isAnimating && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold"
            animate={{ y: [-10, -20, -10], opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            Moving...
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
