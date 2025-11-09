import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Home, Trophy } from 'lucide-react';

interface AnimatedLogoCenterProps {
  onAction?: (action: 'solve' | 'buy' | 'win') => void;
}

const FLOATING_SYMBOLS = ['</>', '{}', 'fn', '()', '[]', '=>', '//'];

export default function AnimatedLogoCenter({ onAction }: AnimatedLogoCenterProps) {
  const [taglineText, setTaglineText] = useState('');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const fullTagline = 'Where Code Meets Capitalism';

  // Typewriter effect for tagline
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullTagline.length) {
        setTaglineText(fullTagline.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Floating code symbols background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-400/10 font-mono select-none pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 12}px`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            {FLOATING_SYMBOLS[i % FLOATING_SYMBOLS.length]}
          </motion.div>
        ))}
      </div>

      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at center, #10b981, #3b82f6, #8b5cf6)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo with breathing animation */}
        <motion.div
          className="mb-4"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono tracking-wider relative"
            style={{
              textShadow: '0 0 40px rgba(16, 185, 129, 0.5)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            CODEOPOLY
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
              }}
            />
          </motion.h1>
        </motion.div>

        {/* Tagline with typewriter effect */}
        <div className="h-8 mb-8">
          <motion.p
            className="text-lg text-emerald-400 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {taglineText}
            <motion.span
              className="inline-block w-0.5 h-5 bg-emerald-400 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.p>
        </div>

        {/* Interactive buttons */}
        <div className="space-y-3">
          {[
            { id: 'solve', icon: Code, text: 'Solve Problems', color: 'emerald' },
            { id: 'buy', icon: Home, text: 'Buy Properties', color: 'amber' },
            { id: 'win', icon: Trophy, text: 'Win the Game', color: 'purple' },
          ].map((item) => (
            <motion.div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredButton(item.id)}
              onMouseLeave={() => setHoveredButton(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => onAction?.(item.id as any)}
                className={`
                  flex items-center justify-center gap-3 px-6 py-3 rounded-lg
                  bg-white/5 backdrop-blur-sm border transition-all
                  ${hoveredButton === item.id 
                    ? `border-${item.color}-400 text-${item.color}-400` 
                    : 'border-white/20 text-white/60'
                  }
                  font-mono text-sm font-semibold w-full
                `}
                style={{
                  boxShadow: hoveredButton === item.id
                    ? `0 0 20px ${
                      item.color === 'emerald' ? '#10b981' :
                      item.color === 'amber' ? '#f59e0b' :
                      '#8b5cf6'
                    }60`
                    : 'none',
                }}
              >
                <motion.div
                  animate={hoveredButton === item.id ? {
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon size={20} />
                </motion.div>
                <span>{item.text}</span>
                
                {/* Animated sparkles on hover */}
                <AnimatePresence>
                  {hoveredButton === item.id && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-lg"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: '50%',
                          }}
                          initial={{
                            opacity: 0,
                            scale: 0,
                            y: 0,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            y: [-10, -20, -30],
                          }}
                          transition={{
                            duration: 1,
                            delay: i * 0.2,
                            repeat: Infinity,
                          }}
                        >
                          ✨
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Additional decorative elements */}
        <div className="mt-8 flex justify-center gap-8 text-white/40 text-xs font-mono">
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-emerald-400">♦</span> BUILD
          </motion.div>
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <span className="text-amber-400">♦</span> CONQUER
          </motion.div>
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <span className="text-purple-400">♦</span> DOMINATE
          </motion.div>
        </div>
      </div>
    </div>
  );
}





