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
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Turn Timer</span>
      </div>
      
      <div className="text-4xl font-bold text-cyan-400 mb-2 font-mono">{formatTime(timeRemaining)}</div>
      
      {/* Circular Progress */}
      <div className="relative w-24 h-24 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            initial={{ pathLength: 1 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.5, ease: 'linear' }}
            className="text-cyan-400"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-mono">{Math.round(progress)}%</div>
            <div className="text-xs text-gray-400">remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}


