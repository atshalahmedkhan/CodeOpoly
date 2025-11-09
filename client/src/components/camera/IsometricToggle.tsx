import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export type ViewMode = 'top-down' | 'isometric' | 'close-isometric';

interface IsometricToggleProps {
  onViewChange?: (view: ViewMode) => void;
}

const VIEW_MODES: Record<ViewMode, { rotateX: number; rotateY: number; scale: number }> = {
  'top-down': { rotateX: 0, rotateY: 0, scale: 1.0 },
  isometric: { rotateX: 30, rotateY: 45, scale: 1.1 },
  'close-isometric': { rotateX: 45, rotateY: 45, scale: 1.3 },
};

export function useIsometricView() {
  const [viewMode, setViewMode] = useState<ViewMode>('top-down');

  const toggleView = () => {
    const modes: ViewMode[] = ['top-down', 'isometric', 'close-isometric'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  return { viewMode, setViewMode, toggleView, config: VIEW_MODES[viewMode] };
}

export default function IsometricToggle({ onViewChange }: IsometricToggleProps) {
  const { viewMode, toggleView, config } = useIsometricView();

  const handleToggle = () => {
    const newMode = viewMode === 'top-down' ? 'isometric' : viewMode === 'isometric' ? 'close-isometric' : 'top-down';
    toggleView();
    onViewChange?.(newMode);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'v' || e.key === 'V') {
        handleToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode]);

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 z-50 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border-2 border-emerald-400/50 hover:border-emerald-400 transition-all shadow-lg"
      title="Toggle View (V)"
    >
      <div className="text-white text-xl">🎲</div>
      <div className="text-xs text-emerald-400 font-mono mt-1">
        {viewMode === 'top-down' && '2D'}
        {viewMode === 'isometric' && '3D'}
        {viewMode === 'close-isometric' && '3D+'}
      </div>
    </motion.button>
  );
}

export function IsometricView({ children }: { children: React.ReactNode }) {
  const { config } = useIsometricView();

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
      animate={{
        rotateX: `${config.rotateX}deg`,
        rotateY: `${config.rotateY}deg`,
        scale: config.scale,
      }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

