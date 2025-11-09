import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedDiceRollerProps {
  onRoll: (dice1: number, dice2: number) => void;
  disabled?: boolean;
}

export default function EnhancedDiceRoller({ onRoll, disabled }: EnhancedDiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [rollHistory, setRollHistory] = useState<number[]>([]);

  const rollDice = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    setShowResult(false);

    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 80);

    // Stop rolling after 1.5 seconds
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDice1 = Math.floor(Math.random() * 6) + 1;
      const finalDice2 = Math.floor(Math.random() * 6) + 1;
      setDice1(finalDice1);
      setDice2(finalDice2);
      setIsRolling(false);
      setShowResult(true);
      const total = finalDice1 + finalDice2;
      setRollHistory(prev => [total, ...prev].slice(0, 5));
      onRoll(finalDice1, finalDice2);

      setTimeout(() => setShowResult(false), 3000);
    }, 1500);
  };

  const DiceFace = ({ value, isRolling }: { value: number; isRolling: boolean }) => {
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
      <div 
        className="w-20 h-20 bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-2xl p-3 grid grid-cols-3 gap-1 border-2 border-gray-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: isRolling ? 'rotateX(360deg) rotateY(360deg)' : 'rotateX(0deg) rotateY(0deg)',
          transition: isRolling ? 'transform 0.1s linear' : 'transform 0.3s ease',
        }}
      >
        {positions[value].map(([row, col], idx) => (
          <div
            key={idx}
            className="w-4 h-4 bg-gray-800 rounded-full"
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
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg rounded-2xl p-6 border-2 border-emerald-400 shadow-2xl"
        style={{
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.5), inset 0 0 40px rgba(16, 185, 129, 0.2)',
        }}
      >
        <motion.button
          onClick={rollDice}
          disabled={disabled || isRolling}
          whileHover={!disabled && !isRolling ? { scale: 1.05, y: -2 } : {}}
          whileTap={!disabled && !isRolling ? { scale: 0.95 } : {}}
          className={`
            w-full mb-4 px-8 py-5 rounded-xl font-bold text-xl font-mono
            transition-all relative overflow-hidden
            ${disabled || isRolling
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white'
            }
          `}
          style={{
            boxShadow: disabled || isRolling 
              ? 'none' 
              : '0 0 40px rgba(16, 185, 129, 0.7), 0 0 80px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(255,255,255,0.2)',
          }}
        >
          {/* Animated shine effect */}
          {!disabled && !isRolling && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isRolling ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                  className="text-2xl"
                >
                  🎲
                </motion.span>
                <span>ROLLING...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🎲</span>
                <span>ROLL DICE</span>
              </>
            )}
          </span>
        </motion.button>

        <div className="flex gap-4 items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={isRolling ? 'rolling-1' : dice1}
              initial={{ rotateX: 0, rotateY: 0 }}
              animate={{ 
                rotateX: isRolling ? 720 : 0,
                rotateY: isRolling ? 720 : 0,
              }}
              transition={{ 
                duration: isRolling ? 0.1 : 0.5,
                repeat: isRolling ? Infinity : 0,
              }}
            >
              <DiceFace value={dice1} isRolling={isRolling} />
            </motion.div>
          </AnimatePresence>

          <span className="text-white text-3xl font-bold font-mono">+</span>

          <AnimatePresence mode="wait">
            <motion.div
              key={isRolling ? 'rolling-2' : dice2}
              initial={{ rotateX: 0, rotateY: 0 }}
              animate={{ 
                rotateX: isRolling ? -720 : 0,
                rotateY: isRolling ? -720 : 0,
              }}
              transition={{ 
                duration: isRolling ? 0.1 : 0.5,
                repeat: isRolling ? Infinity : 0,
              }}
            >
              <DiceFace value={dice2} isRolling={isRolling} />
            </motion.div>
          </AnimatePresence>
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <div className="text-white text-2xl font-bold font-mono bg-emerald-500/20 px-4 py-2 rounded-lg border border-emerald-400">
              TOTAL: {dice1 + dice2}
            </div>
          </motion.div>
        )}

        {rollHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-white/60 text-xs font-mono mb-2">Recent Rolls:</div>
            <div className="flex gap-2">
              {rollHistory.map((total, idx) => (
                <div key={idx} className="bg-slate-700 px-2 py-1 rounded text-white text-xs font-mono">
                  {total}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

