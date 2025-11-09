import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Animated Logo Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-cyan-500/20 border-t-cyan-500`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={`absolute inset-2 rounded-full border-4 border-purple-500/20 border-b-purple-500`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg" 
            style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' }}
          />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.div
        className={`${textSizes[size]} font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.div>

      {/* Loading dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Full-screen loading overlay
export function LoadingOverlay({ message = 'Loading game...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="text-center">
        {/* CODEOPOLY Logo */}
        <motion.h1
          className="text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            backgroundSize: '200% 200%',
            textShadow: '0 0 40px rgba(6, 182, 212, 0.5)',
          }}
        >
          CODEOPOLY
        </motion.h1>
        
        <LoadingSpinner message={message} size="lg" />
        
        {/* Flavor text */}
        <motion.p
          className="mt-8 text-gray-400 text-sm font-mono"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Where Code Meets Capitalism
        </motion.p>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400/20 font-mono text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {['</>', '{}', '()', '[]', '=>', 'fn'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

