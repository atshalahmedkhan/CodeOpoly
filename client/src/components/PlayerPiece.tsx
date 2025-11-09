import { motion } from 'framer-motion';

interface PlayerPieceProps {
  player: {
    id: string;
    name: string;
    avatar: string;
    position: number;
    color: string;
  };
  isCurrentPlayer: boolean;
  offset?: number; // For multiple players on same space
}

export default function PlayerPiece({ player, isCurrentPlayer, offset = 0 }: PlayerPieceProps) {
  // Convert position (0-39) to grid coordinates
  const getGridPosition = (pos: number) => {
    if (pos <= 10) {
      // Bottom row: right to left
      return { row: 10, col: 10 - pos };
    } else if (pos <= 19) {
      // Left column: bottom to top
      return { row: 10 - (pos - 10), col: 0 };
    } else if (pos <= 30) {
      // Top row: left to right
      return { row: 0, col: pos - 20 };
    } else {
      // Right column: top to bottom
      return { row: pos - 30, col: 10 };
    }
  };

  const gridPos = getGridPosition(player.position);
  const offsetMap = [
    { x: 0, y: 0 },
    { x: 18, y: -18 },
    { x: -18, y: -18 },
    { x: 18, y: 18 },
    { x: -18, y: 18 },
  ];
  const { x: offsetX, y: offsetY } = offsetMap[offset] || { x: 0, y: 0 };

  return (
    <motion.div
      className="relative z-30 flex items-center justify-center pointer-events-none"
      style={{
        gridRow: gridPos.row + 1,
        gridColumn: gridPos.col + 1,
      }}
      animate={{
        x: offsetX,
        y: offsetY,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="relative pointer-events-auto group"
        whileHover={{ scale: 1.3, zIndex: 50 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Glow effect for current player */}
        {isCurrentPlayer && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              backgroundColor: player.color,
              opacity: 0.6,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        {/* Main token */}
        <motion.div
          className="w-14 h-14 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-2xl relative"
          style={{
            background: `linear-gradient(135deg, ${player.color} 0%, ${player.color}dd 100%)`,
            boxShadow: isCurrentPlayer 
              ? `0 0 30px ${player.color}, 0 0 60px ${player.color}80, 0 0 90px ${player.color}40, inset 0 0 20px rgba(255,255,255,0.3)`
              : '0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
          }}
          animate={isCurrentPlayer ? {
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{ duration: 2, repeat: isCurrentPlayer ? Infinity : 0 }}
        >
          {/* Inner shine effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%)',
            }}
          />
          
          {/* Avatar */}
          <span className="relative z-10 drop-shadow-lg">{player.avatar}</span>
          
          {/* Current player indicator */}
          {isCurrentPlayer && (
            <>
              <motion.div
                className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-lg"
                animate={{ 
                  scale: [1, 1.4, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap border border-white"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                YOUR TURN
              </motion.div>
            </>
          )}
        </motion.div>
        
        {/* Pulse ring for current player */}
        {isCurrentPlayer && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      {/* Enhanced player name tooltip */}
      <motion.div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs font-bold rounded-lg px-3 py-2 shadow-2xl border-2 border-emerald-400 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-lg">{player.avatar}</span>
            <span>{player.name}</span>
            {isCurrentPlayer && (
              <span className="text-emerald-400 text-[10px]">●</span>
            )}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      </motion.div>
    </motion.div>
  );
}

