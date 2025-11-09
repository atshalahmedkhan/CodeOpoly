import ParticleEngine, { Particle } from './ParticleEngine';

interface DiceParticlesProps {
  trigger: boolean;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export default function DiceParticles({ trigger, position, onComplete }: DiceParticlesProps) {
  return (
    <ParticleEngine
      trigger={trigger}
      type="dice-explosion"
      position={position}
      onComplete={onComplete}
    />
  );
}








