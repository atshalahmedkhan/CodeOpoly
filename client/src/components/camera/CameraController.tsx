import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CameraControllerProps {
  children: React.ReactNode;
  enableParallax?: boolean;
  enableShake?: boolean;
  shakeIntensity?: number;
  shakeDuration?: number;
}

export function useCameraTilt(enabled: boolean = true) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;
      
      mouseX.set(deltaX * 5); // Max 5 degrees
      mouseY.set(deltaY * 5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, mouseX, mouseY]);

  useEffect(() => {
    const unsubscribeX = springX.on('change', (latest) => {
      setTilt((prev) => ({ ...prev, x: latest }));
    });
    const unsubscribeY = springY.on('change', (latest) => {
      setTilt((prev) => ({ ...prev, y: latest }));
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [springX, springY]);

  return tilt;
}

export function useCameraShake() {
  const [shake, setShake] = useState({ x: 0, y: 0 });

  const triggerShake = (intensity: number = 10, duration: number = 300) => {
    let elapsed = 0;
    const interval = 50; // Update every 50ms
    const steps = duration / interval;

    const animate = () => {
      elapsed += interval;
      const progress = elapsed / duration;
      const currentIntensity = intensity * (1 - progress);

      setShake({
        x: (Math.random() - 0.5) * currentIntensity,
        y: (Math.random() - 0.5) * currentIntensity,
      });

      if (progress < 1) {
        setTimeout(animate, interval);
      } else {
        setShake({ x: 0, y: 0 });
      }
    };

    animate();
  };

  return { shake, triggerShake };
}

export default function CameraController({
  children,
  enableParallax = true,
  enableShake = true,
  shakeIntensity = 10,
  shakeDuration = 300,
}: CameraControllerProps) {
  const tilt = useCameraTilt(enableParallax);
  const { shake, triggerShake } = useCameraShake();

  // Expose shake function globally for game events
  useEffect(() => {
    (window as any).triggerCameraShake = (intensity?: number, duration?: number) => {
      triggerShake(intensity || shakeIntensity, duration || shakeDuration);
    };
  }, [triggerShake, shakeIntensity, shakeDuration]);

  return (
    <motion.div
      style={{
        perspective: '1500px',
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        x: shake.x,
        y: shake.y,
      }}
      transition={{
        rotateX: { type: 'spring', stiffness: 50, damping: 20 },
        rotateY: { type: 'spring', stiffness: 50, damping: 20 },
        x: { duration: 0.05 },
        y: { duration: 0.05 },
      }}
    >
      {children}
    </motion.div>
  );
}








