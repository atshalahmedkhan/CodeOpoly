import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  price: number;
  rent: number;
  rentWithHouse?: number[];
  color: string;
  position: number;
  ownerId?: string;
  houses?: number;
  category?: string;
  difficulty?: string;
}

interface PropertyCardModalProps {
  property: Property | null;
  owner?: { name: string; avatar: string } | null;
  currentPlayerMoney: number;
  isOpen: boolean;
  onClose: () => void;
  onBuy: () => void;
  onSkip: () => void;
  onPayRent?: () => void;
}

export default function PropertyCardModal({
  property,
  owner,
  currentPlayerMoney,
  isOpen,
  onClose,
  onBuy,
  onSkip,
  onPayRent,
}: PropertyCardModalProps) {
  if (!isOpen || !property) return null;

  const isOwned = !!property.ownerId;
  const canAfford = currentPlayerMoney >= property.price;
  const rentAmount = property.houses && property.houses > 0 && property.rentWithHouse
    ? property.rentWithHouse[Math.min(property.houses - 1, property.rentWithHouse.length - 1)]
    : property.rent;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 max-w-lg w-full border-4 shadow-2xl relative overflow-hidden"
          style={{
            borderColor: property.color,
            boxShadow: `0 0 60px ${property.color}80, 0 0 100px ${property.color}40, inset 0 0 50px ${property.color}20`,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Color bar */}
          <div
            className="h-4 w-full absolute top-0 left-0"
            style={{ backgroundColor: property.color }}
          />

          {/* Property Header */}
          <div className="text-center mb-6 mt-4">
            <motion.h2
              className="text-4xl font-bold mb-3 font-mono"
              style={{
                background: `linear-gradient(135deg, ${property.color}, ${property.color}dd)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {property.name}
            </motion.h2>
            {property.category && (
              <div className="inline-block bg-slate-700/50 px-3 py-1 rounded-full text-sm text-emerald-400 font-mono">
                {property.category}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-4 mb-6">
            {/* Price */}
            <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-white font-mono font-semibold">Purchase Price</span>
                </div>
                <span className="text-2xl font-bold text-yellow-400 font-mono">
                  ${property.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Rent Information */}
            <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-4">
              <div className="text-white font-mono font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">💵</span>
                <span>Rent Information</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/80">
                  <span>Base Rent:</span>
                  <span className="text-blue-400 font-semibold">${property.rent}</span>
                </div>
                {property.rentWithHouse && property.rentWithHouse.length > 0 && (
                  <>
                    {property.rentWithHouse.map((rent, idx) => (
                      <div key={idx} className="flex justify-between text-white/80">
                        <span>With {idx + 1} Solution{idx + 1 > 1 ? 's' : ''}:</span>
                        <span className="text-blue-400 font-semibold">${rent}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Owner Information */}
            {isOwned && owner && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{owner.avatar}</span>
                    <div>
                      <div className="text-white/60 text-xs font-mono">Owned by</div>
                      <div className="text-white font-mono font-semibold">{owner.name}</div>
                    </div>
                  </div>
                  {property.houses && property.houses > 0 && (
                    <div className="text-right">
                      <div className="text-white/60 text-xs font-mono">Solutions</div>
                      <div className="text-emerald-400 font-mono font-bold text-lg">
                        {'💻'.repeat(Math.min(property.houses, 4))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Player Money */}
            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 font-mono text-sm">Your Balance:</span>
                <span className={`font-bold font-mono ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${currentPlayerMoney.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isOwned ? (
              <>
                <motion.button
                  onClick={onBuy}
                  disabled={!canAfford}
                  whileHover={canAfford ? { scale: 1.05 } : {}}
                  whileTap={canAfford ? { scale: 0.95 } : {}}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold font-mono text-lg transition-all ${
                    canAfford
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                  style={{
                    boxShadow: canAfford ? '0 0 30px rgba(16, 185, 129, 0.5)' : 'none',
                  }}
                >
                  {canAfford ? '💻 Solve & Buy' : 'Insufficient Funds'}
                </motion.button>
                <motion.button
                  onClick={onSkip}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 rounded-xl font-bold font-mono bg-slate-700 hover:bg-slate-600 text-white transition-all"
                >
                  Skip
                </motion.button>
              </>
            ) : (
              <>
                {onPayRent && (
                  <motion.button
                    onClick={onPayRent}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-4 px-6 rounded-xl font-bold font-mono text-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                    style={{
                      boxShadow: '0 0 30px rgba(234, 179, 8, 0.5)',
                    }}
                  >
                    💰 Pay ${rentAmount} Rent
                  </motion.button>
                )}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 rounded-xl font-bold font-mono bg-slate-700 hover:bg-slate-600 text-white transition-all"
                >
                  Close
                </motion.button>
              </>
            )}
          </div>

          {/* Info text */}
          {!isOwned && (
            <p className="text-center text-white/50 text-xs font-mono mt-4">
              💡 Solve a LeetCode problem to purchase this property
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}










