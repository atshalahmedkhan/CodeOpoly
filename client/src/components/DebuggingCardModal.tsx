import { motion } from 'framer-motion';

interface DebuggingCard {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
  effect: {
    money?: number;
    move?: number;
    property?: string;
  };
}

interface DebuggingCardModalProps {
  card: DebuggingCard;
  onClose: () => void;
}

export default function DebuggingCardModal({ card, onClose }: DebuggingCardModalProps) {
  const getCardColor = () => {
    switch (card.type) {
      case 'positive':
        return 'from-green-600 to-emerald-600';
      case 'negative':
        return 'from-red-600 to-orange-600';
      default:
        return 'from-blue-600 to-cyan-600';
    }
  };

  const getIcon = () => {
    switch (card.type) {
      case 'positive':
        return '🎉';
      case 'negative':
        return '⚠️';
      default:
        return '📋';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`bg-gradient-to-br ${getCardColor()} rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-white/20`}
        style={{
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-6xl"
          >
            {getIcon()}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white font-mono">{card.title}</h2>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
            <p className="text-white text-lg font-mono leading-relaxed">{card.message}</p>
          </div>

          {card.effect.money && (
            <div className={`text-4xl font-bold font-mono ${card.effect.money > 0 ? 'text-green-200' : 'text-red-200'}`}>
              {card.effect.money > 0 ? '+' : ''}{card.effect.money} Algo-Coins
            </div>
          )}

          {card.effect.move && (
            <div className="text-2xl font-bold text-white font-mono">
              Move {card.effect.move > 0 ? 'forward' : 'backward'} {Math.abs(card.effect.move)} spaces
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all font-mono border-2 border-white/30"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}










