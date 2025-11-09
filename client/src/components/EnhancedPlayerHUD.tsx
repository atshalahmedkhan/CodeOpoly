import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DollarSign, Home, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  position: number;
}

interface EnhancedPlayerHUDProps {
  player: Player;
  propertyCount: number;
  properties?: Array<{ name: string; color: string }>;
  isMyTurn: boolean;
  onRollDice?: () => void;
  canRoll?: boolean;
}

export default function EnhancedPlayerHUD({
  player,
  propertyCount,
  properties = [],
  isMyTurn,
  onRollDice,
  canRoll = false,
}: EnhancedPlayerHUDProps) {
  const [showProperties, setShowProperties] = useState(false);
  const [moneyChange, setMoneyChange] = useState<number | null>(null);

  // Animate money changes
  const displayMoney = player.money;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 p-5 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderColor: isMyTurn ? '#10B981' : 'rgba(51, 65, 85, 0.5)',
        boxShadow: isMyTurn ? '0 0 30px rgba(16, 185, 129, 0.4), 0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.3)',
      }}
    >
      {/* Avatar & Name */}
      <div className="flex items-center gap-4 mb-5 relative">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br from-cyan-500 to-purple-500 shadow-xl relative overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
          style={{
            boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)'
          }}
        >
          {isMyTurn && (
            <div className="absolute inset-0 bg-emerald-400/20" />
          )}
          <span className="relative z-10">{player.avatar}</span>
        </motion.div>
        <div className="flex-1">
          <h3 className="text-white font-black text-xl mb-1">{player.name}</h3>
          {isMyTurn && (
            <motion.div
              className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30"
              animate={{ 
                boxShadow: ['0 0 10px rgba(16, 185, 129, 0.3)', '0 0 20px rgba(16, 185, 129, 0.6)', '0 0 10px rgba(16, 185, 129, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-2 h-2 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              YOUR TURN
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-2 mb-4">
        {/* Money */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border-2 border-yellow-500/40 relative overflow-hidden"
          whileHover={{ scale: 1.03, borderColor: 'rgba(251, 191, 36, 0.6)' }}
          style={{
            boxShadow: '0 4px 15px rgba(251, 191, 36, 0.2)'
          }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-200 text-sm font-bold">Balance</span>
            </div>
            <motion.span
              key={displayMoney}
              initial={{ scale: 1.3, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              className="text-yellow-300 font-black text-2xl font-mono"
              style={{
                textShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
              }}
            >
              ${displayMoney.toLocaleString()}
            </motion.span>
          </div>
        </motion.div>

        {/* Properties */}
        <motion.div
          className="bg-bg-dark rounded-lg p-3 border border-code-blue/30 cursor-pointer"
          onClick={() => setShowProperties(!showProperties)}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-code-blue" />
              <span className="text-text-muted text-xs font-medium">Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-code-blue font-bold text-xl">{propertyCount}</span>
              {properties.length > 0 && (
                <motion.div
                  animate={{ rotate: showProperties ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showProperties ? (
                    <ChevronUp className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
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
                className="mt-2 space-y-1 overflow-hidden"
              >
                {properties.map((prop, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="text-xs text-text-muted flex items-center gap-2 p-1 rounded"
                    style={{ backgroundColor: prop.color + '20' }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: prop.color }}
                    />
                    {prop.name}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Position */}
        <div className="bg-bg-dark rounded-lg p-3 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-text-muted text-xs font-medium">Position</span>
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
          className="w-full bg-gradient-to-r from-code-blue to-code-purple text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={canRoll ? { scale: 1.02 } : {}}
          whileTap={canRoll ? { scale: 0.98 } : {}}
        >
          <span className="text-xl">🎲</span>
          Roll Dice
        </motion.button>
      )}
    </motion.div>
  );
}

