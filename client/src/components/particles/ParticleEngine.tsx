import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  symbol?: string;
}

interface ParticleEngineProps {
  trigger: boolean;
  type: 'dice-explosion' | 'confetti' | 'golden-ring' | 'coin-sparkles';
  position?: { x: number; y: number };
  color?: string;
  onComplete?: () => void;
}

const MAX_PARTICLES = 500;
const PARTICLE_POOL: Particle[] = [];

export default function ParticleEngine({
  trigger,
  type,
  position,
  color,
  onComplete,
}: ParticleEngineProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!trigger) {
      setParticles([]);
      particlesRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Generate particles based on type
    const newParticles = generateParticles(type, position, color);
    particlesRef.current = newParticles;
    setParticles([...newParticles]);

    let lastTime = performance.now();

    // Animation loop
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      const updated = particlesRef.current
        .map((p) => {
          // Update physics with delta time
          p.x += p.vx * deltaTime;
          p.y += p.vy * deltaTime;
          p.vy += 200 * deltaTime; // gravity
          p.life -= deltaTime;
          p.rotation += p.rotationSpeed * deltaTime;

          // Apply drag
          p.vx *= Math.pow(0.98, deltaTime * 60);
          p.vy *= Math.pow(0.98, deltaTime * 60);

          return p;
        })
        .filter((p) => p.life > 0);

      particlesRef.current = updated;
      setParticles([...updated]);

      if (updated.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    lastTime = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, type, position, color, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: `${particle.size}px`,
            color: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
          }}
          animate={{
            opacity: [1, 1, 0],
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: particle.maxLife,
            ease: 'easeOut',
          }}
        >
          {particle.symbol || '✨'}
        </motion.div>
      ))}
    </div>
  );
}

function generateParticles(
  type: string,
  position?: { x: number; y: number },
  color?: string
): Particle[] {
  const centerX = position?.x || window.innerWidth / 2;
  const centerY = position?.y || window.innerHeight / 2;
  const particles: Particle[] = [];

  switch (type) {
    case 'dice-explosion': {
      const symbols = ['{}', '</>', 'fn', '()', '[]', '=>', '//'];
      const colors = ['#00D9FF', '#00FF88', '#B87EFF'];
      const count = 25;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 100 + Math.random() * 100;
        particles.push({
          id: i,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.5 + Math.random() * 0.5,
          maxLife: 1.5 + Math.random() * 0.5,
          size: 16 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 360,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
        });
      }
      break;
    }

    case 'confetti': {
      const shapes = ['■', '●', '▲'];
      const baseColor = color || '#FFD700';
      const count = 60;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI / 3) + (Math.random() * Math.PI / 3); // 120 degree cone upward
        const speed = 300 + Math.random() * 100;
        particles.push({
          id: i,
          x: centerX + (Math.random() - 0.5) * 50,
          y: centerY,
          vx: Math.cos(angle) * speed * (Math.random() - 0.5) * 0.5,
          vy: -Math.sin(angle) * speed,
          life: 2.5 + Math.random() * 0.5,
          maxLife: 2.5 + Math.random() * 0.5,
          size: 8 + Math.random() * 6,
          color: baseColor,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 720,
          symbol: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
      break;
    }

    case 'coin-sparkles': {
      const count = 18;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const radius = 50 + Math.random() * 30;
        particles.push({
          id: i,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * 50,
          vy: Math.sin(angle) * 50,
          life: 1.5,
          maxLife: 1.5,
          size: 20 + Math.random() * 10,
          color: '#FFD700',
          rotation: angle * (180 / Math.PI),
          rotationSpeed: 180,
          symbol: '💰',
        });
      }
      break;
    }

    case 'golden-ring': {
      // This is handled separately as a CSS animation
      break;
    }
  }

  return particles;
}

