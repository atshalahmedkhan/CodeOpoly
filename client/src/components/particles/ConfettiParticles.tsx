import ParticleEngine from './ParticleEngine';

interface ConfettiParticlesProps {
  trigger: boolean;
  position?: { x: number; y: number };
  color?: string;
  onComplete?: () => void;
}

export default function ConfettiParticles({
  trigger,
  position,
  color,
  onComplete,
}: ConfettiParticlesProps) {
  return (
    <ParticleEngine
      trigger={trigger}
      type="confetti"
      position={position}
      color={color}
      onComplete={onComplete}
    />
  );
}








