import { motion } from 'framer-motion';

interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  properties: string[];
  position: number;
  inJail: boolean;
}

interface EnhancedPlayerPanelProps {
  players: Player[];
  currentPlayerId: string;
  currentTurn: string;
}

export default function EnhancedPlayerPanel({ 
  players, 
  currentPlayerId, 
  currentTurn 
}: EnhancedPlayerPanelProps) {
  return (
    <div 
      className="glass-panel rounded-xl p-4 shadow-2xl"
      style={{
        background: 'rgba(15, 25, 45, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
      }}
    >
      <h2 className="text-white font-bold text-lg mb-4 font-mono border-b border-slate-600 pb-2">
        PLAYERS
      </h2>
      <div className="space-y-3">
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const isActiveTurn = player.id === currentTurn;
          
          return (
            <motion.div
              key={player.id}
              animate={isActiveTurn ? {
                scale: [1, 1.05, 1],
                borderColor: ['#3b82f6', '#10b981', '#3b82f6'],
              } : {}}
              transition={{ duration: 1, repeat: isActiveTurn ? Infinity : 0 }}
              className={`p-3 rounded-lg border-2 transition-all ${
                isActiveTurn
                  ? 'border-emerald-400'
                  : isCurrentPlayer
                  ? 'border-blue-400'
                  : 'border-slate-600'
              }`}
              style={{
                background: 'rgba(15, 25, 45, 0.5)',
                backdropFilter: 'blur(10px) saturate(180%)',
                boxShadow: isActiveTurn 
                  ? '0 0 20px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.05)'
                  : 'inset 0 1px 2px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{player.avatar}</span>
                  <span className="text-white font-semibold font-mono">{player.name}</span>
                  {isCurrentPlayer && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded font-mono">YOU</span>
                  )}
                  {isActiveTurn && (
                    <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded font-mono animate-pulse">
                      TURN
                    </span>
                  )}
                </div>
              </div>
              <div className="text-white/90 text-sm space-y-2 font-mono">
                <motion.div
                  className="flex items-center gap-2 bg-yellow-500/10 rounded-lg px-2 py-1 border border-yellow-500/30"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
                >
                  <span className="text-2xl">💰</span>
                  <span className="font-bold text-yellow-300">${player.money.toLocaleString()}</span>
                  <span className="text-[10px] text-yellow-400/60 ml-auto">A-C</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-blue-500/10 rounded-lg px-2 py-1 border border-blue-500/30"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                >
                  <span className="text-xl">🏠</span>
                  <span className="font-semibold">{player.properties?.length || 0}</span>
                  <span className="text-xs text-blue-400/60">properties</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-purple-500/10 rounded-lg px-2 py-1 border border-purple-500/30"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
                >
                  <span className="text-xl">📍</span>
                  <span className="font-semibold">Position: {player.position}</span>
                </motion.div>
                {player.inJail && (
                  <motion.div
                    className="text-red-400 text-xs bg-red-500/10 rounded-lg px-2 py-1 border border-red-500/30 flex items-center gap-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span>🔒</span>
                    <span>In Jail</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

