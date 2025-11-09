import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface MoneyTransfer {
  id: string;
  amount: number;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
}

interface MoneyTransferEffectProps {
  transfers: MoneyTransfer[];
  onComplete?: (id: string) => void;
}

export default function MoneyTransferEffect({ transfers, onComplete }: MoneyTransferEffectProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {transfers.map((transfer) => (
          <TransferAnimation
            key={transfer.id}
            transfer={transfer}
            onComplete={() => onComplete?.(transfer.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function TransferAnimation({ transfer, onComplete }: { transfer: MoneyTransfer; onComplete: () => void }) {
  const [coins, setCoins] = useState<{ id: number; delay: number }[]>([]);

  useEffect(() => {
    // Create multiple coins for the transfer effect
    const coinArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.1,
    }));
    setCoins(coinArray);

    // Complete animation after all coins finish
    const timeout = setTimeout(onComplete, 1500);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  const isPositive = transfer.amount > 0;

  return (
    <>
      {/* Amount label at starting position */}
      <motion.div
        className="absolute"
        style={{
          left: transfer.fromPosition.x,
          top: transfer.fromPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        <div
          className={`px-4 py-2 rounded-full font-bold font-mono text-lg ${
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
          style={{
            border: `2px solid ${isPositive ? '#10b981' : '#ef4444'}`,
            boxShadow: `0 0 20px ${isPositive ? '#10b98160' : '#ef444460'}`,
          }}
        >
          {isPositive ? '+' : '-'}${Math.abs(transfer.amount)}
        </div>
      </motion.div>

      {/* Flying coins */}
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute"
          style={{
            left: transfer.fromPosition.x,
            top: transfer.fromPosition.y,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: transfer.toPosition.x - transfer.fromPosition.x + (Math.random() - 0.5) * 30,
            y: transfer.toPosition.y - transfer.fromPosition.y + (Math.random() - 0.5) * 30,
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: coin.delay,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600"
            style={{
              boxShadow: '0 0 15px rgba(251, 191, 36, 0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <DollarSign className="text-yellow-900" size={20} />
          </motion.div>
        </motion.div>
      ))}

      {/* Impact effect at destination */}
      <motion.div
        className="absolute"
        style={{
          left: transfer.toPosition.x,
          top: transfer.toPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 0.5, 0] }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div
          className="w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${isPositive ? '#10b98140' : '#ef444440'}, transparent)`,
          }}
        />
      </motion.div>
    </>
  );
}

// Floating number effect for in-place money changes
export function FloatingMoneyChange({ 
  amount, 
  position,
  onComplete,
}: { 
  amount: number; 
  position: { x: number; y: number };
  onComplete?: () => void;
}) {
  const isPositive = amount > 0;

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ y: 0, opacity: 1, scale: 0.8 }}
      animate={{ y: -60, opacity: 0, scale: 1.2 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className={`font-bold font-mono text-3xl ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}
        style={{
          textShadow: `0 0 20px ${isPositive ? '#10b98160' : '#ef444460'}`,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.5,
        }}
      >
        {isPositive ? '+' : ''}{amount}
      </motion.div>
    </motion.div>
  );
}





