import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GameTimerProps {
  startTime: number | string | null | undefined;
  duration: number; // in seconds (e.g., 3600 for 60 minutes)
  onTimeUp: () => void;
}

export default function GameTimer({ startTime, duration, onTimeUp }: GameTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);

  const resolveStartTime = () => {
    if (!startTime) {
      return Date.now();
    }
    if (typeof startTime === 'number') {
      return startTime;
    }
    const parsed = new Date(startTime).getTime();
    return Number.isNaN(parsed) ? Date.now() : parsed;
  };

  useEffect(() => {
    const baseStart = resolveStartTime();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - baseStart) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeRemaining / duration) * 100;
  const isCritical = timeRemaining <= 300; // Less than 5 minutes
  const isWarning = timeRemaining <= 600 && timeRemaining > 300; // Less than 10 minutes

  const containerClasses = isCritical
    ? 'bg-red-900/40 border-red-500 text-red-300'
    : isWarning
    ? 'bg-amber-900/30 border-amber-500 text-amber-300'
    : 'bg-slate-800/50 border-emerald-500 text-emerald-400';

  return (
    <motion.div
      className={`px-4 py-2 rounded-lg border-2 font-mono ${containerClasses}`}
      animate={isCritical ? { scale: [1, 1.07, 1] } : isWarning ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 1, repeat: isCritical || isWarning ? Infinity : 0 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">⏱️</span>
        <div className="flex-1">
          <div className="text-xl font-bold">{formatTime(timeRemaining)}</div>
          <div className="text-xs opacity-80">Time Remaining</div>
        </div>
        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

