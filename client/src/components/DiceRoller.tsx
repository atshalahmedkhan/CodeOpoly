import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceRollerProps {
  onRoll: (dice1: number, dice2: number) => void;
  disabled?: boolean;
}

export default function DiceRoller({ onRoll, disabled }: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const rollDice = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    setShowResult(false);

    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDice1 = Math.floor(Math.random() * 6) + 1;
      const finalDice2 = Math.floor(Math.random() * 6) + 1;
      setDice1(finalDice1);
      setDice2(finalDice2);
      setIsRolling(false);
      setShowResult(true);
      onRoll(finalDice1, finalDice2);

      // Hide result after 2 seconds
      setTimeout(() => setShowResult(false), 2000);
    }, 1000);
  };

  const DiceFace = ({ value }: { value: number }) => {
    const dots = [];
    const positions: Record<number, number[][]> = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
    };

    return (
      <div className="w-16 h-16 bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 gap-1">
        {positions[value].map(([row, col], idx) => (
          <div
            key={idx}
            className="w-3 h-3 bg-gray-800 rounded-full"
            style={{
              gridRow: row + 1,
              gridColumn: col + 1,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={rollDice}
        disabled={disabled || isRolling}
        className={`
          px-8 py-4 rounded-lg font-bold text-lg
          transition-all transform hover:scale-105
          shadow-lg
          ${disabled || isRolling
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white'
          }
        `}
        style={{
          boxShadow: disabled || isRolling 
            ? 'none' 
            : '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)',
        }}
      >
        {isRolling ? 'Rolling...' : '🎲 Roll Dice'}
      </button>

      <div className="flex gap-4 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isRolling ? 'rolling' : dice1}
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ 
              rotate: isRolling ? 360 : 0,
              scale: 1,
            }}
            transition={{ 
              duration: isRolling ? 0.1 : 0.3,
              repeat: isRolling ? Infinity : 0,
            }}
          >
            <DiceFace value={dice1} />
          </motion.div>
        </AnimatePresence>

        <span className="text-white text-2xl font-bold">+</span>

        <AnimatePresence mode="wait">
          <motion.div
            key={isRolling ? 'rolling' : dice2}
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ 
              rotate: isRolling ? -360 : 0,
              scale: 1,
            }}
            transition={{ 
              duration: isRolling ? 0.1 : 0.3,
              repeat: isRolling ? Infinity : 0,
            }}
          >
            <DiceFace value={dice2} />
          </motion.div>
        </AnimatePresence>
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-white text-xl font-bold bg-green-500/20 px-4 py-2 rounded-lg"
        >
          Total: {dice1 + dice2}
        </motion.div>
      )}
    </div>
  );
}

