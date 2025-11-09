import { motion, AnimatePresence } from 'framer-motion';

interface CurrentActionDisplayProps {
  actionType: 'awaiting-action' | 'dice-rolling' | 'landed-unowned' | 'landed-owned' | 'landed-opponent' | 'landed-special' | 'landed-tax' | null;
  diceResult?: { dice1: number; dice2: number; total: number };
  property?: any;
  owner?: any;
  rent?: number;
  onSolveAndBuy?: () => void;
  onSkip?: () => void;
  onPayRent?: () => void;
  onCodeDuel?: () => void;
  onUpgrade?: () => void;
  onContinue?: () => void;
  onRollDice?: () => void;
}

export default function CurrentActionDisplay({
  actionType,
  diceResult,
  property,
  owner,
  rent,
  onSolveAndBuy,
  onSkip,
  onPayRent,
  onCodeDuel,
  onUpgrade,
  onContinue,
  onRollDice,
}: CurrentActionDisplayProps) {
  if (!actionType) return null;

  const getDifficultyStars = (price: number) => {
    if (price <= 100) return '⭐ Easy';
    if (price <= 200) return '⭐⭐ Medium';
    return '⭐⭐⭐ Hard';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel rounded-2xl p-8 border-4 border-emerald-400 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
          style={{
            background: 'rgba(15, 25, 45, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 0 60px rgba(16, 185, 129, 0.6), 0 0 100px rgba(16, 185, 129, 0.3)',
          }}
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.4), transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Awaiting action */}
          {actionType === 'awaiting-action' && (
            <div className="text-center space-y-4 relative z-10">
              {/* Animated logo */}
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎯
              </motion.div>
              
              {/* Enhanced logo text */}
              <motion.h1
                className="text-6xl font-black font-mono mb-2"
                style={{
                  background: 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 25%, #68D391 50%, #4FD1C5 75%, #38B2AC 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 20px rgba(79, 209, 197, 0.4))',
                  letterSpacing: '4px',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                CODEOPOLY
              </motion.h1>
              
              {/* Tagline */}
              <motion.p
                className="text-emerald-400/80 text-lg font-light font-mono mb-6"
                style={{
                  letterSpacing: '2px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Where Code Meets Capitalism
              </motion.p>
              
              {/* Action buttons */}
              <div className="space-y-3 mt-8">
                <motion.p
                  className="text-white/60 text-sm font-mono mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Roll the dice to advance, buy properties, or challenge rivals.
                </motion.p>
                {onRollDice && (
                  <motion.button
                    onClick={onRollDice}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-2xl font-mono text-xl relative overflow-hidden group"
                    style={{
                      boxShadow: '0 0 40px rgba(16, 185, 129, 0.7), 0 0 80px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(255,255,255,0.2)',
                    }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="text-2xl"
                      >
                        🎲
                      </motion.span>
                      <span>ROLL DICE</span>
                    </span>
                  </motion.button>
                )}
              </div>
            </div>
          )}

          {/* Dice Rolling */}
          {actionType === 'dice-rolling' && diceResult && (
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🎲
              </motion.div>
              <h2 className="text-3xl font-bold text-white font-mono mb-2">
                You Rolled {diceResult.total}!
              </h2>
              <p className="text-emerald-400 text-lg font-mono">
                Moving {diceResult.total} spaces...
              </p>
              <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="bg-emerald-500 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Landed on Unowned Property */}
          {actionType === 'landed-unowned' && property && (
            <div className="text-center">
              <div 
                className="h-4 w-full rounded-t-lg mb-4"
                style={{ backgroundColor: property.color }}
              />
              <h2 className="text-2xl font-bold text-white font-mono mb-2">
                {property.name}
              </h2>
              <div className="space-y-3 mb-6">
                <p className="text-yellow-400 text-xl font-mono font-bold">
                  ${property.price}
                </p>
                <p className="text-emerald-400 text-sm font-mono">
                  {getDifficultyStars(property.price)}
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={onSolveAndBuy}
                  className="action-button solve-problems-btn flex-1 relative overflow-hidden"
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(15, 25, 45, 0.7)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '2px solid rgba(79, 209, 197, 0.4)',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -6,
                    borderColor: '#4FD1C5',
                    boxShadow: '0 12px 32px rgba(79, 209, 197, 0.4), 0 0 60px rgba(79, 209, 197, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(79, 209, 197, 0.1) 0%, rgba(56, 178, 172, 0.1) 50%, rgba(79, 209, 197, 0.1) 100%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    whileHover={{ opacity: 1 }}
                  />
                  <motion.span
                    className="button-icon text-3xl relative z-10"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(79, 209, 197, 0.6))',
                    }}
                    whileHover={{
                      scale: 1.3,
                      rotate: 15,
                      filter: 'drop-shadow(0 4px 16px rgba(79, 209, 197, 0.9))',
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    💻
                  </motion.span>
                  <motion.span
                    className="button-text relative z-10 font-mono"
                    whileHover={{
                      textShadow: '0 0 20px rgba(79, 209, 197, 0.8)',
                      letterSpacing: '1px',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    SOLVE & BUY
                  </motion.span>
                </motion.button>
                <motion.button
                  onClick={onSkip}
                  className="action-button flex-1 relative overflow-hidden"
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(15, 25, 45, 0.7)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '2px solid rgba(148, 163, 184, 0.4)',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -6,
                    borderColor: '#94a3b8',
                    boxShadow: '0 12px 32px rgba(148, 163, 184, 0.4), 0 0 60px rgba(148, 163, 184, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="button-icon text-3xl relative z-10"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(148, 163, 184, 0.6))',
                    }}
                    whileHover={{
                      scale: 1.3,
                      rotate: 15,
                      filter: 'drop-shadow(0 4px 16px rgba(148, 163, 184, 0.9))',
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    ⏭️
                  </motion.span>
                  <motion.span
                    className="button-text relative z-10 font-mono"
                    whileHover={{
                      textShadow: '0 0 20px rgba(148, 163, 184, 0.8)',
                      letterSpacing: '1px',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    SKIP
                  </motion.span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Landed on Opponent's Property */}
          {actionType === 'landed-opponent' && property && owner && rent && (
            <div className="text-center">
              <div 
                className="h-4 w-full rounded-t-lg mb-4"
                style={{ backgroundColor: property.color }}
              />
              <h2 className="text-2xl font-bold text-white font-mono mb-2">
                {property.name}
              </h2>
              <p className="text-red-400 text-lg mb-2">
                Owned by {owner.name}
              </p>
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
                <p className="text-yellow-400 text-3xl font-bold font-mono mb-1">
                  ${rent}
                </p>
                <p className="text-white/80 text-sm">Rent Due</p>
                {property.houses > 0 && (
                  <p className="text-white/60 text-xs mt-1">
                    {property.houses} {property.houses === 1 ? 'house' : 'houses'} • Rent: ${rent}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={onCodeDuel}
                  className="action-button flex-1 relative overflow-hidden"
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(15, 25, 45, 0.7)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '2px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -6,
                    borderColor: '#EF4444',
                    boxShadow: '0 12px 32px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)',
                      '0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.5)',
                      '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)',
                    ],
                  }}
                  transition={{
                    boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 50%, rgba(239, 68, 68, 0.1) 100%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    whileHover={{ opacity: 1 }}
                  />
                  <motion.span
                    className="button-icon text-3xl relative z-10"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.6))',
                    }}
                    whileHover={{
                      scale: 1.3,
                      rotate: -15,
                      filter: 'drop-shadow(0 4px 16px rgba(239, 68, 68, 0.9))',
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    ⚔️
                  </motion.span>
                  <motion.span
                    className="button-text relative z-10 font-mono"
                    whileHover={{
                      textShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
                      letterSpacing: '1px',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    CODE DUEL
                  </motion.span>
                </motion.button>
                <motion.button
                  onClick={onPayRent}
                  className="action-button buy-properties-btn flex-1 relative overflow-hidden"
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(234, 179, 8, 0.4)',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -6,
                    borderColor: '#EAB308',
                    boxShadow: '0 12px 32px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.1) 50%, rgba(234, 179, 8, 0.1) 100%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <span className="button-icon text-2xl relative z-10">💰</span>
                  <span className="button-text relative z-10 font-mono">PAY ${rent}</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Landed on Your Own Property */}
          {actionType === 'landed-owned' && property && (
            <div className="text-center">
              <div 
                className="h-4 w-full rounded-t-lg mb-4"
                style={{ backgroundColor: property.color }}
              />
              <h2 className="text-2xl font-bold text-white font-mono mb-2">
                ✅ You own this property!
              </h2>
              <p className="text-emerald-400 text-lg mb-4">
                {property.name}
              </p>
              {property.houses < 5 && (
                <button
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg font-mono mb-3"
                >
                  ⬆️ UPGRADE (Add House)
                </button>
              )}
              <p className="text-white/60 text-sm">
                Current rent: ${rent || property.price * 0.1}
              </p>
              <button
                onClick={onContinue}
                className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all font-mono"
              >
                Continue
              </button>
            </div>
          )}

          {/* Landed on Special Space */}
          {actionType === 'landed-special' && property && (
            <div className="text-center">
              <div className="text-6xl mb-4">
                {property.specialType === 'go' && '🎯'}
                {property.specialType === 'chance' && '🎲'}
                {property.specialType === 'community-chest' && '📦'}
                {property.specialType === 'free-parking' && '🅿️'}
                {property.specialType === 'jail' && '🔒'}
                {property.specialType === 'go-to-jail' && '🚨'}
              </div>
              <h2 className="text-2xl font-bold text-white font-mono mb-2">
                {property.name.toUpperCase()}
              </h2>
              <p className="text-emerald-400 text-sm mb-4">
                {property.specialType === 'go' && 'Collect $200 as you pass!'}
                {property.specialType === 'chance' && 'Draw a Chance card!'}
                {property.specialType === 'community-chest' && 'Draw a Community Chest card!'}
                {property.specialType === 'free-parking' && 'Free parking - no action needed!'}
                {property.specialType === 'jail' && 'Just visiting...'}
                {property.specialType === 'go-to-jail' && 'Go directly to Jail!'}
              </p>
              <button
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all font-mono"
              >
                Continue
              </button>
            </div>
          )}

          {/* Landed on Tax */}
          {actionType === 'landed-tax' && property && (
            <div className="text-center">
              <div className="text-6xl mb-4">💸</div>
              <h2 className="text-2xl font-bold text-white font-mono mb-2">
                Pay Tax
              </h2>
              <p className="text-red-400 text-3xl font-bold font-mono mb-4">
                ${property.price || 200}
              </p>
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl mb-4"
              >
                💰
              </motion.div>
              <button
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all font-mono"
              >
                Pay Tax
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

