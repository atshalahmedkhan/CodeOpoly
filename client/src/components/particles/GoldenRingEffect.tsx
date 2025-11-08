import { motion, AnimatePresence } from 'framer-motion';
import CoinSparkles from './CoinSparkles';

interface GoldenRingEffectProps {
  trigger: boolean;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export default function GoldenRingEffect({
  trigger,
  position,
  onComplete,
}: GoldenRingEffectProps) {
  const centerX = position?.x || window.innerWidth / 2;
  const centerY = position?.y || window.innerHeight / 2;

  return (
    <>
      <AnimatePresence>
        {trigger && (
          <>
            {/* Golden Ring Pulse */}
            <motion.div
              className="fixed pointer-events-none z-50"
              style={{
                left: centerX - 300,
                top: centerY - 300,
                width: 600,
                height: 600,
                borderRadius: '50%',
                border: '20px solid rgba(255, 215, 0, 0.8)',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.3)',
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                repeat: 3,
                ease: 'easeInOut',
              }}
              onAnimationComplete={onComplete}
            />

            {/* Floating Text */}
            <motion.div
              className="fixed pointer-events-none z-50"
              style={{
                left: centerX,
                top: centerY,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -100, opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <div
                className="text-3xl font-bold font-mono text-center whitespace-nowrap"
                style={{
                  color: '#FFD700',
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                  WebkitTextStroke: '2px white',
                }}
              >
                $200 COLLECTED
              </div>
            </motion.div>

            {/* Coin Sparkles */}
            <CoinSparkles trigger={trigger} position={position} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}








