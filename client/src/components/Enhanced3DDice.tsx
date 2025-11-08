import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiceParticles from './particles/DiceParticles';
import { soundManager } from '../lib/soundEffects';

interface Enhanced3DDiceProps {
  onRoll: (dice1: number, dice2: number) => void;
  disabled?: boolean;
}

export default function Enhanced3DDice({ onRoll, disabled }: Enhanced3DDiceProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const rollDice = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    setShowResult(false);
    setShowParticles(false);
    soundManager.playDiceRoll();

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
      setShowParticles(true);
      soundManager.playDiceExplosion();
      onRoll(finalDice1, finalDice2);

      setTimeout(() => {
        setShowResult(false);
        setShowParticles(false);
      }, 3000);
    }, 1500);
  };

  const DiceFace = ({ value, isRolling }: { value: number; isRolling: boolean }) => {
    const dots: { [key: number]: { x: number; y: number }[] } = {
      1: [{ x: 50, y: 50 }],
      2: [{ x: 25, y: 25 }, { x: 75, y: 75 }],
      3: [{ x: 25, y: 25 }, { x: 50, y: 50 }, { x: 75, y: 75 }],
      4: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
      5: [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 50, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 75 }],
      6: [{ x: 25, y: 25 }, { x: 25, y: 50 }, { x: 25, y: 75 }, { x: 75, y: 25 }, { x: 75, y: 50 }, { x: 75, y: 75 }],
    };

    return (
      <div className="relative w-20 h-20 preserve-3d">
        {/* Dice cube with enhanced 3D effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            boxShadow: isRolling
              ? '0 15px 35px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.5), 0 0 20px rgba(79, 209, 197, 0.6)'
              : '0 4px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.5)',
            transform: 'perspective(500px) rotateX(-10deg) rotateY(10deg)',
            transformStyle: 'preserve-3d',
          }}
          animate={isRolling ? {
            rotateX: [0, 720],
            rotateY: [0, 720],
            rotateZ: [0, 360],
            scale: [1, 1.1, 1],
          } : {}}
          whileHover={!isRolling ? {
            rotateX: -15,
            rotateY: 15,
            scale: 1.05,
          } : {}}
          transition={{
            duration: isRolling ? 0.1 : 0.3,
            repeat: isRolling ? Infinity : 0,
            ease: isRolling ? 'linear' : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Dice faces - front */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white"
            style={{
              transform: 'translateZ(40px)',
              backfaceVisibility: 'hidden',
            }}
          >
            {dots[value]?.map((dot, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-full"
                style={{
                  width: '12px',
                  height: '12px',
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, #000 30%, #333 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                }}
                animate={showResult && !isRolling ? {
                  scale: [0, 1.2, 1],
                  opacity: [0, 1],
                } : isRolling ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                } : {
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  delay: idx * 0.1,
                  duration: isRolling ? 0.5 : 0.3,
                  repeat: isRolling ? Infinity : 0,
                  type: 'spring',
                  stiffness: 500,
                }}
              />
            ))}
          </div>

          {/* Side faces for 3D effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"
            style={{
              transform: 'rotateY(90deg) translateZ(40px)',
              backfaceVisibility: 'hidden',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-gray-300 rounded-lg"
            style={{
              transform: 'rotateX(90deg) translateZ(40px)',
              backfaceVisibility: 'hidden',
            }}
          />
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <DiceParticles trigger={showParticles} position={{ x: window.innerWidth / 2, y: 300 }} />
      
      <div 
        className="flex flex-col items-center gap-6 p-8 rounded-2xl relative"
        style={{
          background: 'rgba(15, 25, 45, 0.7)',
          backdropFilter: 'blur(10px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.2), transparent 70%)',
          }}
          animate={{
            opacity: isRolling ? [0.2, 0.5, 0.2] : 0.2,
          }}
          transition={{
            duration: 1,
            repeat: isRolling ? Infinity : 0,
          }}
        />

        <motion.button
          onClick={rollDice}
          disabled={disabled || isRolling}
          whileHover={!disabled && !isRolling ? { scale: 1.02, y: -3 } : {}}
          whileTap={!disabled && !isRolling ? { scale: 0.98, y: -1 } : {}}
          className="relative z-10 mb-4 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 disabled:from-slate-600 disabled:via-slate-700 disabled:to-slate-600 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-2xl font-mono text-xl overflow-hidden group disabled:cursor-not-allowed"
          style={{
            background: disabled || isRolling
              ? 'linear-gradient(135deg, #475569 0%, #334155 100%)'
              : 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: disabled || isRolling
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(79, 209, 197, 0.4), inset 0 1px 2px rgba(255,255,255,0.3), 0 0 30px rgba(79, 209, 197, 0.4)',
          }}
        >
          {/* Enhanced shimmer effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
            }}
            animate={!disabled && !isRolling ? {
              x: ['-100%', '100%'],
              y: ['-100%', '100%'],
              rotate: 45,
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
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
                <motion.span 
                  className="text-2xl"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                >
                  🎲
                </motion.span>
                <span>ROLL DICE</span>
              </>
            )}
          </span>
        </motion.button>

        <div className="flex gap-6 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isRolling ? 'rolling-1' : dice1}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <DiceFace value={dice1} isRolling={isRolling} />
            </motion.div>
          </AnimatePresence>

          <motion.span 
            className="text-white text-4xl font-bold font-mono"
            animate={{ opacity: showResult ? 1 : 0.5 }}
          >
            +
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.div
              key={isRolling ? 'rolling-2' : dice2}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <DiceFace value={dice2} isRolling={isRolling} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Result display */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
            >
              <div 
                className="text-center px-6 py-3 rounded-full font-mono"
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid rgba(16, 185, 129, 0.8)',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                }}
              >
                <motion.div 
                  className="text-3xl font-bold text-emerald-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {dice1 + dice2}
                </motion.div>
                <div className="text-xs text-emerald-300">TOTAL</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}


