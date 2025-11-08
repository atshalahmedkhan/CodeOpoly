import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  dice: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  purchase: 'text-green-400 bg-green-400/10 border-green-400/30',
  rent: 'text-red-400 bg-red-400/10 border-red-400/30',
  land: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  special: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  duel: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  upgrade: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  bankrupt: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
};

export default function EnhancedLiveFeed({ events, maxEvents = 10 }: EnhancedLiveFeedProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  
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
    return date.toLocaleTimeString();
  };

  const getEventDetails = (event: FeedEvent) => {
    const details: string[] = [];
    
    switch (event.type) {
      case 'purchase':
        if (event.property) details.push(`Property: ${event.property}`);
        if (event.amount) details.push(`Price: $${event.amount}`);
        break;
      case 'rent':
        if (event.property) details.push(`Property: ${event.property}`);
        if (event.amount) details.push(`Rent: $${event.amount}`);
        break;
      case 'dice':
        const match = event.message.match(/rolled (\d+)/);
        if (match) details.push(`Moving ${match[1]} spaces`);
        break;
      case 'duel':
        details.push('Code duel in progress!');
        break;
      case 'bankrupt':
        details.push('Player eliminated from game');
        break;
    }
    
    return details;
  };

  const recentEvents = events.slice(-maxEvents);

  return (
    <div 
      className="h-full flex flex-col rounded-xl overflow-hidden relative"
      style={{
        background: 'rgba(15, 25, 45, 0.6)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(79, 209, 197, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Animated top border scan line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 z-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #4FD1C5 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-emerald-400/20 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-emerald-400 rounded-full"
              style={{
                boxShadow: '0 0 10px #4FD1C5',
              }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h3 className="text-emerald-400 font-bold font-mono text-sm uppercase tracking-wider">
              LIVE FEED
            </h3>
          </div>
          <span className="text-white/50 text-xs bg-emerald-400/10 px-3 py-1 rounded-full">
            {events.length} events
          </span>
        </div>
      </div>

      {/* Events list */}
      <div 
        ref={feedRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {recentEvents.map((event) => {
            const borderColorMap: { [key: string]: string } = {
              dice: '#4FD1C5',
              land: '#FC8181',
              purchase: '#68D391',
              rent: '#F6E05E',
              special: '#FBD38D',
              duel: '#FC8181',
              upgrade: '#68D391',
              bankrupt: '#9CA3AF',
            };
            
            return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.9 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              className={`relative rounded-lg p-3 cursor-pointer transition-all ${
                EVENT_COLORS[event.type]
              } ${hoveredEvent === event.id ? 'scale-[1.02]' : ''}`}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderLeft: `3px solid ${borderColorMap[event.type] || '#4FD1C5'}`,
                boxShadow: hoveredEvent === event.id 
                  ? `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px ${borderColorMap[event.type]}40`
                  : 'none',
              }}
            >
              {/* Main content */}
              <div className="flex items-start gap-3">
                {/* Enhanced Icon */}
                <motion.div
                  className="text-2xl flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                  style={{
                    background: `rgba(${event.type === 'dice' ? '79, 209, 197' : event.type === 'purchase' ? '104, 211, 145' : event.type === 'rent' ? '252, 129, 129' : '246, 224, 94'}, 0.2)`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                  animate={hoveredEvent === event.id ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {EVENT_ICONS[event.type]}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {event.playerAvatar && (
                      <span className="text-sm">{event.playerAvatar}</span>
                    )}
                    <span className="text-xs font-semibold font-mono text-emerald-400">
                      {event.player}
                    </span>
                    <span className="text-xs text-white/40 ml-auto font-mono">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm font-mono leading-relaxed text-white/80">
                    {event.message}
                  </div>
                  {event.amount && (
                    <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      event.amount > 0 ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
                    }`}>
                      <span>{event.amount > 0 ? '+' : ''}</span>
                      <span>$</span>
                      <span>{Math.abs(event.amount)}</span>
                    </div>
                  )}

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedEvent === event.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 pt-2 border-t border-white/10 text-xs space-y-1"
                      >
                        {getEventDetails(event).map((detail, idx) => (
                          <div key={idx} className="opacity-80">
                            {detail}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* New event indicator */}
              {event.timestamp > Date.now() - 3000 && (
                <motion.div
                  className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    boxShadow: '0 0 10px #4FD1C5',
                  }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 1],
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {recentEvents.length === 0 && (
          <div className="text-center text-white/40 text-sm font-mono py-8">
            No events yet...
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}


