import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameEvent {
  id: string;
  type: 'info' | 'dice' | 'purchase' | 'rent' | 'duel' | 'special' | 'upgrade' | 'bankrupt';
  message: string;
  timestamp: number;
  player?: string;
}

interface GameEventLogProps {
  events: GameEvent[];
  maxEvents?: number;
}

export default function GameEventLog({ events, maxEvents = 10 }: GameEventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'dice': return '🎲';
      case 'purchase': return '🏠';
      case 'rent': return '💰';
      case 'duel': return '⚔️';
      case 'special': return '🎯';
      case 'upgrade': return '⬆️';
      case 'bankrupt': return '💸';
      case 'info': return '📝';
      default: return '📝';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'dice': return 'text-blue-400';
      case 'purchase': return 'text-green-400';
      case 'rent': return 'text-yellow-400';
      case 'duel': return 'text-red-400';
      case 'special': return 'text-purple-400';
      case 'upgrade': return 'text-cyan-400';
      case 'bankrupt': return 'text-red-500';
      case 'info': return 'text-slate-200';
      default: return 'text-white';
    }
  };

  const displayEvents = events.slice(-maxEvents);

  return (
    <div className="bg-slate-900/80 backdrop-blur-lg rounded-lg border-2 border-slate-700 p-4 h-64 flex flex-col">
      <h3 className="text-white font-bold mb-3 font-mono text-sm flex items-center gap-2">
        📜 Game Events
      </h3>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1e293b',
        }}
      >
        <AnimatePresence>
          {displayEvents.length === 0 ? (
            <div className="text-white/40 text-sm font-mono text-center py-8">
              No events yet...
            </div>
          ) : (
            displayEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`text-sm font-mono ${getEventColor(event.type)} bg-slate-800/50 rounded-lg p-2 border border-slate-700`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                  <div className="flex-1">
                    <div className="text-white/90">{event.message}</div>
                    <div className="text-white/40 text-xs mt-1">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

