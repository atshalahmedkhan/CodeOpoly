import { motion, AnimatePresence } from 'framer-motion';

interface Property {
  id: string;
  name: string;
  price: number;
  color: string;
  ownerId?: string;
  houses: number;
}

interface PropertyLandingModalProps {
  property: Property | null;
  currentPlayer: any;
  owner?: any;
  onSolveProblem: () => void;
  onBuyDirectly: () => void;
  onSkip: () => void;
  onPayRent: () => void;
}

export default function PropertyLandingModal({
  property,
  currentPlayer,
  owner,
  onSolveProblem,
  onBuyDirectly,
  onSkip,
  onPayRent,
}: PropertyLandingModalProps) {
  if (!property) return null;

  const isOwned = !!property.ownerId;
  const isOwnedByMe = property.ownerId === currentPlayer?.id;
  const rent = Math.floor(property.price * 0.1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-6 max-w-md w-full border-2"
          style={{
            borderColor: property.color,
            boxShadow: `0 0 30px ${property.color}80, inset 0 0 30px ${property.color}20`,
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎯 You Landed On
            </h2>
            <div 
              className="text-2xl font-bold py-3 px-6 rounded-lg inline-block mb-2"
              style={{
                background: `linear-gradient(135deg, ${property.color}40, ${property.color}60)`,
                border: `2px solid ${property.color}`,
                boxShadow: `0 0 20px ${property.color}60`,
              }}
            >
              {property.name}
            </div>
            <p className="text-white/80 text-lg">
              Price: <span className="font-bold text-yellow-400">${property.price}</span>
            </p>
          </div>

          {isOwnedByMe ? (
            <div className="text-center">
              <p className="text-green-400 text-xl font-semibold mb-4">
                ✅ You own this property!
              </p>
              <button
                onClick={onSkip}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Continue
              </button>
            </div>
          ) : isOwned ? (
            <div className="space-y-4">
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">
                  ⚠️ This property is owned by <span className="text-red-400">{owner?.name}</span>
                </p>
                <p className="text-white/80">
                  Rent: <span className="font-bold text-yellow-400">${rent}</span>
                </p>
              </div>
              <button
                onClick={onPayRent}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Pay Rent (${rent})
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={onSolveProblem}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                style={{
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
                }}
              >
                💻 Solve Problem to Buy (Free!)
              </button>
              
              {currentPlayer?.money >= property.price && (
                <button
                  onClick={onBuyDirectly}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  💰 Buy Directly (${property.price})
                </button>
              )}
              
              <button
                onClick={onSkip}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Skip
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

