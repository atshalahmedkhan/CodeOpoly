import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParticleEffectProps {
  trigger: boolean;
  type: 'success' | 'celebration' | 'coin' | 'dice';
  position?: { x: number; y: number };
}

export default function ParticleEffect({ trigger, type, position }: ParticleEffectProps) {
  const particles = useRef<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      // Generate particles
      particles.current = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: position?.x || Math.random() * window.innerWidth,
        y: position?.y || Math.random() * window.innerHeight,
        delay: Math.random() * 0.5,
      }));
    }
  }, [trigger, position]);

  const getParticleEmoji = () => {
    switch (type) {
      case 'success': return '✅';
      case 'celebration': return '🎉';
      case 'coin': return '💰';
      case 'dice': return '🎲';
      default: return '✨';
    }
  };

  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-3xl"
          initial={{
            x: position?.x || particle.x,
            y: position?.y || particle.y,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: particle.x + (Math.random() - 0.5) * 200,
            y: particle.y - 100 - Math.random() * 100,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        >
          {getParticleEmoji()}
        </motion.div>
      ))}
    </div>
  );
}










