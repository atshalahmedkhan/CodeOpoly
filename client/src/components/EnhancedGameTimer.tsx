import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import { soundManager } from '../lib/soundEffects';

interface EnhancedGameTimerProps {
  duration: number; // seconds
  onTimeUp?: () => void;
  isPaused?: boolean;
}

export default function EnhancedGameTimer({
  duration,
  onTimeUp,
  isPaused = false,
}: EnhancedGameTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [hasAlerted10s, setHasAlerted10s] = useState(false);
  const [hasAlerted5s, setHasAlerted5s] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Sound alerts
        if (newTime === 10 && !hasAlerted10s) {
          setHasAlerted10s(true);
          soundManager.playPropertyLanding();
        }
        if (newTime === 5 && !hasAlerted5s) {
          setHasAlerted5s(true);
          soundManager.playPropertyLanding();
        }
        if (newTime === 0) {
          soundManager.playCodeFailure();
          onTimeUp?.();
        }

        return newTime >= 0 ? newTime : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, hasAlerted10s, hasAlerted5s, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = () => {
    if (timeRemaining > 60) return '#4FD1C5'; // Cyan (> 60s)
    if (timeRemaining > 30) return '#F6E05E'; // Yellow (30-60s)
    if (timeRemaining > 10) return '#FC8181'; // Red (10-30s)
    return '#E53E3E'; // Dark Red (< 10s)
  };

  const getGradient = () => {
    if (timeRemaining > 60) return 'from-cyan-400 to-emerald-500';
    if (timeRemaining > 30) return 'from-yellow-400 to-amber-500';
    if (timeRemaining > 10) return 'from-red-400 to-rose-500';
    return 'from-red-600 to-red-800';
  };

  const isUrgent = timeRemaining <= 10;
  const isWarning = timeRemaining <= 30 && timeRemaining > 10;
  const isCritical = timeRemaining <= 5;
  const progress = (timeRemaining / duration) * 100;

  return (
    <motion.div
      className="relative"
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={isUrgent ? { duration: 0.5, repeat: Infinity } : {}}
    >
      {/* Glassmorphic container */}
      <div
        className="relative px-8 py-6 rounded-2xl"
        style={{
          background: 'rgba(15, 25, 45, 0.7)',
          backdropFilter: 'blur(10px) saturate(180%)',
          border: `2px solid ${getColor()}40`,
          boxShadow: `0 0 30px ${getColor()}30, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        }}
      >
        {/* Urgent warning pulse */}
        {isUrgent && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${getColor()}40, transparent)`,
              filter: 'blur(20px)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={isUrgent ? {
              rotate: [0, -10, 10, 0],
            } : {}}
            transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
          >
            {isUrgent ? (
              <AlertCircle className="text-red-400" size={24} />
            ) : (
              <Clock className="text-white/60" size={24} />
            )}
          </motion.div>
          <span className="text-white/60 font-mono text-sm uppercase tracking-wider">
            {isUrgent ? 'Time Running Out!' : 'Turn Timer'}
          </span>
        </div>

        {/* Time display */}
        <motion.div
          className="text-center mb-4"
          animate={isUrgent ? {
            x: [-2, 2, -2],
          } : {}}
          transition={{ duration: 0.1, repeat: isUrgent ? Infinity : 0 }}
        >
          <motion.div
            className={`text-5xl font-bold font-mono bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}
            style={{
              filter: isCritical ? `drop-shadow(0 4px 16px ${getColor()}80)` : `drop-shadow(0 2px 8px ${getColor()}50)`,
            }}
            animate={isCritical ? {
              scale: [1, 1.1, 1],
            } : timeRemaining === duration ? {
              scale: [0.8, 1],
            } : {}}
            transition={{
              duration: isCritical ? 0.5 : 0.3,
              repeat: isCritical ? Infinity : 0,
            }}
          >
            {formatTime(timeRemaining)}
          </motion.div>
          {isWarning && (
            <motion.div
              className="text-xs text-yellow-400 mt-1"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Warning
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Circular progress ring */}
        <div className="relative w-40 h-40 mx-auto">
          {/* Glass-morphism background glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${getColor()}20 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
            animate={{
              opacity: isUrgent ? [0.3, 0.6, 0.3] : 0.2,
            }}
            transition={{
              duration: 0.5,
              repeat: isUrgent ? Infinity : 0,
            }}
          />
          
          <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 72}`}
              initial={{ pathLength: 1 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: 'linear' }}
              style={{
                filter: `drop-shadow(0 0 10px ${getColor()})`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className={`text-2xl font-bold font-mono ${isUrgent ? 'text-red-400' : 'text-white'}`}
                animate={isCritical ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isCritical ? Infinity : 0,
                }}
              >
                {Math.round(progress)}%
              </motion.div>
              <div className={`text-xs mt-1 ${isUrgent ? 'text-red-300' : 'text-white/60'}`}>
                remaining
              </div>
            </div>
          </div>
        </div>

        {/* Warning messages */}
        <AnimatePresence>
          {isUrgent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-center"
            >
              <motion.div
                className="text-red-400 font-bold font-mono text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⚠️ HURRY UP! ⚠️
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


