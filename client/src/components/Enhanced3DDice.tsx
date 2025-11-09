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
      
      <motion.button
        onClick={rollDice}
        disabled={disabled || isRolling}
        whileHover={!disabled && !isRolling ? { scale: 1.08, boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)" } : {}}
        whileTap={!disabled && !isRolling ? { scale: 0.92 } : {}}
        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white py-5 rounded-2xl font-black text-xl transition-all transform shadow-2xl mb-6 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
        style={{
          boxShadow: "0 10px 40px rgba(6, 182, 212, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)"
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <span className="text-3xl">{isRolling ? '🎲' : '🎲'}</span>
        <span className="relative z-10">{isRolling ? 'ROLLING...' : 'ROLL DICE'}</span>
      </motion.button>

      <div className="flex gap-4 justify-center">
        <motion.div 
          className={`w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden border-4 border-cyan-400/50`}
          animate={isRolling ? { 
            rotate: [0, 360, 720, 1080],
            scale: [1, 1.1, 0.9, 1],
            y: [0, -20, 0, -10, 0]
          } : {}}
          transition={{ duration: 0.6, repeat: isRolling ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(6, 182, 212, 0.4)"
          }}
        >
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-600 to-blue-600">{dice1}</div>
          {!isRolling && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
        <motion.div 
          className={`w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden border-4 border-purple-400/50`}
          animate={isRolling ? { 
            rotate: [0, -360, -720, -1080],
            scale: [1, 0.9, 1.1, 1],
            y: [0, -15, 0, -20, 0]
          } : {}}
          transition={{ duration: 0.6, repeat: isRolling ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(168, 85, 247, 0.4)"
          }}
        >
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600">{dice2}</div>
          {!isRolling && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          )}
        </motion.div>
      </div>
      
      {!isRolling && dice1 + dice2 > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Total: {dice1 + dice2}
          </div>
          {dice1 === dice2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-yellow-400 font-bold text-lg mt-2"
            >
              🎉 DOUBLES! 🎉
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}


