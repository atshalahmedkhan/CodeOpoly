import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FeedEvent {
  id: string;
  type: 'dice' | 'purchase' | 'rent' | 'land' | 'special' | 'duel' | 'upgrade' | 'bankrupt';
  message: string;
  timestamp: number;
  player?: string;
  playerAvatar?: string;
  amount?: number;
  property?: string;
}

interface EnhancedLiveFeedProps {
  events: FeedEvent[];
  maxEvents?: number;
  currentPlayerId?: string;
}

const EVENT_ICONS = {
  dice: '🎲',
  purchase: '💰',
  rent: '💸',
  land: '🏠',
  special: '⭐',
  duel: '⚔️',
  upgrade: '⬆️',
  bankrupt: '💀',
};

const EVENT_COLORS = {
  dice: 'from-code-blue to-code-purple',
  purchase: 'from-code-green to-code-blue',
  rent: 'from-code-red to-code-orange',
  land: 'from-code-purple to-code-blue',
  special: 'from-code-orange to-code-red',
  duel: 'from-code-red to-code-purple',
  upgrade: 'from-code-green to-code-blue',
  bankrupt: 'from-gray-600 to-gray-800',
};

type FilterType = 'all' | 'my-turn' | 'transactions';

export default function EnhancedLiveFeed({ events, maxEvents = 20, currentPlayerId }: EnhancedLiveFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Auto-scroll to latest event
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'my-turn') return event.player === currentPlayerId;
    if (filter === 'transactions') return ['purchase', 'rent', 'upgrade'].includes(event.type);
    return true;
  });

  const recentEvents = filteredEvents.slice(-maxEvents);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-cyan-500/30 overflow-hidden shadow-xl" style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)' }}>
      {/* Header with Filter */}
      <div className="p-4 border-b-2 border-cyan-500/30 flex items-center justify-between bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-400 rounded-full" />
          <span className="text-white font-black text-base tracking-wider">LIVE FEED</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'my-turn', 'transactions'] as FilterType[]).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              {f === 'all' ? '📋 All' : f === 'my-turn' ? '👤 Me' : '💰 Money'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar"
        ref={feedRef}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#06B6D4 #1F2937',
        }}
      >
        {recentEvents.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: idx * 0.03, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`bg-gradient-to-r ${EVENT_COLORS[event.type]} rounded-xl p-3 border-2 border-white/20 hover:border-cyan-400/50 transition-all cursor-pointer shadow-lg`}
            style={{
              background: `linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))`,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-lg backdrop-blur-sm">
                {EVENT_ICONS[event.type] || '⭐'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">{formatTimestamp(event.timestamp)}</span>
                  {event.amount && (
                    <span className={`text-xs font-bold ${
                      event.amount > 0 ? 'text-code-green' : 'text-code-red'
                    }`}>
                      {event.amount > 0 ? '+' : ''}${Math.abs(event.amount)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-text-primary break-words font-medium">{event.message}</div>
                {event.player && (
                  <div className="text-xs text-text-muted mt-1 flex items-center gap-1">
                    <span>{event.playerAvatar}</span>
                    <span>{event.player}</span>
                  </div>
                )}
                {event.property && (
                  <div className="text-xs text-code-blue mt-1">📍 {event.property}</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {recentEvents.length === 0 && (
          <div className="text-center text-text-muted text-sm py-8">
            No events yet...
          </div>
        )}
      </div>
    </div>
  );
}
