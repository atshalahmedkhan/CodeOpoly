import ParticleEngine from './ParticleEngine';

interface CoinSparklesProps {
  trigger: boolean;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export default function CoinSparkles({
  trigger,
  position,
  onComplete,
}: CoinSparklesProps) {
  return (
    <ParticleEngine
      trigger={trigger}
      type="coin-sparkles"
      position={position}
      onComplete={onComplete}
    />
  );
}








