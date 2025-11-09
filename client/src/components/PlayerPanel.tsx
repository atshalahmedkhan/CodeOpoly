import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DollarSign, Home, MapPin, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  position: number;
}

interface PlayerPanelProps {
  player: Player;
  propertyCount: number;
  properties?: Array<{ name: string; color: string }>;
  isMyTurn: boolean;
  onRollDice?: () => void;
  canRoll?: boolean;
}

export default function PlayerPanel({
  player,
  propertyCount,
  properties = [],
  isMyTurn,
  onRollDice,
  canRoll = false,
}: PlayerPanelProps) {
  const [showProperties, setShowProperties] = useState(false);
  const [moneyChange, setMoneyChange] = useState<number | null>(null);
  const [previousMoney, setPreviousMoney] = useState(player.money);

  // Track money changes for animation
  useEffect(() => {
    if (player.money !== previousMoney) {
      const change = player.money - previousMoney;
      setMoneyChange(change);
      setPreviousMoney(player.money);
      setTimeout(() => setMoneyChange(null), 2000);
    }
  }, [player.money, previousMoney]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black rounded-2xl border-2 p-5 shadow-2xl relative overflow-hidden"
      style={{
        borderColor: isMyTurn ? '#10B981' : '#334155',
        boxShadow: isMyTurn 
          ? '0 0 40px rgba(16, 185, 129, 0.5), 0 10px 40px rgba(0,0,0,0.5)' 
          : '0 10px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: isMyTurn
            ? 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #8B5CF6 100%)'
            : 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        }}
        animate={isMyTurn ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : {}}
        transition={{
          duration: 3,
          repeat: isMyTurn ? Infinity : 0,
          ease: 'linear',
        }}
      />

      {/* Avatar & Name */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br from-cyan-500 via-purple-500 to-green-500 shadow-xl relative overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
          style={{
            boxShadow: '0 8px 30px rgba(6, 182, 212, 0.5)'
          }}
        >
          {isMyTurn && (
            <motion.div
              className="absolute inset-0 bg-emerald-400/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
          <span className="relative z-10">{player.avatar || '💻'}</span>
        </motion.div>
        <div className="flex-1">
          <h3 className="text-white font-black text-xl mb-1 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            {player.name}
          </h3>
          {isMyTurn && (
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/50"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(16, 185, 129, 0.3)',
                  '0 0 20px rgba(16, 185, 129, 0.6)',
                  '0 0 10px rgba(16, 185, 129, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-2 h-2 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              YOUR TURN!
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-3 mb-4 relative z-10">
        {/* Compute Credits (Money) */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-xl p-4 border-2 border-yellow-500/40 relative overflow-hidden"
          whileHover={{ scale: 1.03, borderColor: 'rgba(251, 191, 36, 0.6)' }}
          style={{
            boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)'
          }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-200 text-sm font-bold">Compute Credits</span>
            </div>
            <div className="flex items-center gap-2">
              {moneyChange && (
                <motion.span
                  initial={{ opacity: 0, y: -20, scale: 1.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`text-sm font-bold ${moneyChange > 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {moneyChange > 0 ? '+' : ''}${moneyChange}
                </motion.span>
              )}
              <motion.span
                key={player.money}
                initial={{ scale: 1.3, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                className="text-yellow-300 font-black text-2xl font-mono"
                style={{
                  textShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                }}
              >
                ${player.money.toLocaleString()}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Properties */}
        <motion.div
          className="bg-gray-900/50 rounded-xl p-3 border border-cyan-500/30 cursor-pointer backdrop-blur-sm"
          onClick={() => setShowProperties(!showProperties)}
          whileHover={{ scale: 1.02, borderColor: 'rgba(6, 182, 212, 0.6)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300 text-xs font-medium">Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold text-xl">{propertyCount}</span>
              {properties.length > 0 && (
                <motion.div
                  animate={{ rotate: showProperties ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showProperties ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Properties List */}
          <AnimatePresence>
            {showProperties && properties.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {properties.map((prop, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="text-xs text-gray-300 flex items-center gap-2 p-2 rounded-lg border border-gray-700/50"
                    style={{ 
                      backgroundColor: prop.color + '15',
                      borderColor: prop.color + '40',
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: prop.color,
                        boxShadow: `0 0 8px ${prop.color}`,
                      }}
                    />
                    <span className="flex-1">{prop.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Position */}
        <div className="bg-gray-900/50 rounded-xl p-3 border border-purple-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-xs font-medium">Position</span>
            </div>
            <span className="text-purple-400 font-bold text-lg font-mono">Space {player.position}</span>
          </div>
        </div>
      </div>

      {/* Roll Dice Button */}
      {isMyTurn && onRollDice && (
        <motion.button
          onClick={onRollDice}
          disabled={!canRoll}
          className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
          whileHover={canRoll ? { scale: 1.02 } : {}}
          whileTap={canRoll ? { scale: 0.98 } : {}}
          style={{
            boxShadow: canRoll 
              ? '0 0 30px rgba(6, 182, 212, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)'
              : '0 4px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <motion.span
            className="text-2xl relative z-10"
            animate={canRoll ? {
              rotate: [0, 10, -10, 0],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: canRoll ? Infinity : 0,
              repeatDelay: 1,
            }}
          >
            🎲
          </motion.span>
          <span className="relative z-10">Roll Dice</span>
          {canRoll && (
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
