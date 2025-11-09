import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type CameraView = 'default' | 'player-focus' | 'property-focus' | 'dramatic';

interface CameraTransitionProps {
  view: CameraView;
  targetElement?: HTMLElement | null;
  children: React.ReactNode;
}

const VIEW_CONFIGS: Record<CameraView, { scale: number; rotateX: number; rotateY: number; rotateZ: number }> = {
  default: { scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
  'player-focus': { scale: 1.5, rotateX: 0, rotateY: 0, rotateZ: 0 },
  'property-focus': { scale: 1.8, rotateX: 5, rotateY: 5, rotateZ: 0 },
  dramatic: { scale: 1.2, rotateX: 0, rotateY: 0, rotateZ: 3 },
};

export default function CameraTransition({
  view,
  targetElement,
  children,
}: CameraTransitionProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (targetElement && view !== 'default') {
      const rect = targetElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - window.innerWidth / 2;
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
      setPosition({ x: -centerX, y: -centerY });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, [view, targetElement]);

  const config = VIEW_CONFIGS[view];

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
      animate={{
        scale: config.scale,
        rotateX: config.rotateX,
        rotateY: config.rotateY,
        rotateZ: config.rotateZ,
        x: position.x,
        y: position.y,
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}








