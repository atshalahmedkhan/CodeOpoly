import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameEvent {
  id: string;
  type: 'dice' | 'purchase' | 'rent' | 'duel' | 'special' | 'upgrade' | 'bankrupt' | 'info';
  message: string;
  timestamp: number;
  player?: string;
}

interface LiveGameFeedProps {
  events: GameEvent[];
  onEmojiReaction?: (eventId: string, emoji: string) => void;
}

const EMOJI_REACTIONS = ['😂', '💸', '🥶', '🔥', '💯', '🎉'];

export default function LiveGameFeed({ events, onEmojiReaction }: LiveGameFeedProps) {
  const [reactedEvents, setReactedEvents] = useState<Set<string>>(new Set());
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const handleEmojiClick = (eventId: string, emoji: string) => {
    if (reactedEvents.has(eventId)) return;
    
    setReactedEvents(prev => new Set(prev).add(eventId));
    if (onEmojiReaction) {
      onEmojiReaction(eventId, emoji);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'dice': return '🎲';
      case 'purchase': return '💻';
      case 'rent': return '💰';
      case 'duel': return '⚔️';
      case 'special': return '🎯';
      case 'upgrade': return '⬆️';
      case 'bankrupt': return '💸';
      default: return '📢';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'dice': return 'border-blue-500 bg-blue-500/10';
      case 'purchase': return 'border-green-500 bg-green-500/10';
      case 'rent': return 'border-yellow-500 bg-yellow-500/10';
      case 'duel': return 'border-red-500 bg-red-500/10';
      case 'special': return 'border-purple-500 bg-purple-500/10';
      case 'upgrade': return 'border-cyan-500 bg-cyan-500/10';
      case 'bankrupt': return 'border-orange-500 bg-orange-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  // Limit to last 5 events to fit on screen
  const visibleEvents = events.slice().reverse().slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-xl p-3 border-2 border-emerald-500/30 h-full flex flex-col shadow-2xl"
      style={{
        boxShadow: '0 0 40px rgba(16, 185, 129, 0.2), inset 0 0 40px rgba(16, 185, 129, 0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-emerald-500/20">
        <motion.h3
          className="text-white font-bold text-sm font-mono flex items-center gap-1.5"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            className="text-lg"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            📡
          </motion.span>
          <span>Live Feed</span>
        </motion.h3>
        <motion.div
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {visibleEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`border-l-4 rounded-md p-2 ${getEventColor(event.type)}`}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <div className="flex items-start gap-1.5">
                <span className="text-base flex-shrink-0">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-mono leading-tight line-clamp-2">
                    {event.message}
                  </p>
                  <p className="text-white/30 text-[10px] font-mono mt-0.5">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Emoji Reactions - Compact */}
              <AnimatePresence>
                {hoveredEvent === event.id && !reactedEvents.has(event.id) && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex gap-1 mt-1.5 pt-1.5 border-t border-white/10"
                  >
                    {EMOJI_REACTIONS.slice(0, 3).map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEmojiClick(event.id, emoji)}
                        className="text-sm hover:scale-125 transition-transform cursor-pointer"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show reacted emoji */}
              {reactedEvents.has(event.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-1.5 pt-1.5 border-t border-white/10"
                >
                  <span className="text-sm">👍</span>
                  <span className="text-white/50 text-[10px] font-mono ml-1">Reacted</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="text-center text-white/40 text-xs font-mono py-4">
            No events yet
          </div>
        )}
      </div>
    </div>
  );
}

