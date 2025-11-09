# CODEOPOLY UI/UX Features Integration Guide

This guide shows how to integrate all the new UI/UX features into your game.

## Features Implemented

1. ✅ Animated Property Cards on Hover
2. ✅ Enhanced Particle Effects System
3. ✅ Dynamic Board Perspective & Camera
4. ✅ Player Avatars & Personalities
5. ✅ Sound Effects System
6. ✅ Camera Shake Effects

## Quick Start

### 1. Wrap Your Board with Camera Controller

```tsx
import CameraController from './components/camera/CameraController';
import IsometricToggle, { IsometricView } from './components/camera/IsometricToggle';

function GameBoard() {
  return (
    <CameraController enableParallax={true} enableShake={true}>
      <IsometricView>
        <IsometricToggle />
        {/* Your board component */}
      </IsometricView>
    </CameraController>
  );
}
```

### 2. Add Particle Effects

```tsx
import DiceParticles from './components/particles/DiceParticles';
import ConfettiParticles from './components/particles/ConfettiParticles';
import GoldenRingEffect from './components/particles/GoldenRingEffect';
import { useGameEffects } from './hooks/useGameEffects';

function GameRoom() {
  const {
    diceParticles,
    confettiParticles,
    goldenRing,
    triggerDiceRoll,
    triggerPurchaseCelebration,
    triggerGoPass,
  } = useGameEffects();

  const handleDiceRoll = () => {
    triggerDiceRoll({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    // Your dice roll logic
  };

  return (
    <>
      <DiceParticles trigger={diceParticles} />
      <ConfettiParticles trigger={confettiParticles} />
      <GoldenRingEffect trigger={goldenRing} />
      {/* Your game UI */}
    </>
  );
}
```

### 3. Use Animated Property Cards

```tsx
import AnimatedPropertyCard from './components/AnimatedPropertyCard';
import { useState } from 'react';

function PropertyTile({ property, owner }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatedPropertyCard
      property={property}
      owner={owner}
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full"
    />
  );
}
```

### 4. Add Player Avatars with Personalities

```tsx
import PlayerPersonality from './components/PlayerPersonality';

function PlayerPanel({ player, isActive, gameEvent }) {
  return (
    <PlayerPersonality
      avatar={player.avatar}
      name={player.name}
      personality="optimizer" // or 'bug-hunter', 'architect', 'cowboy-coder'
      isActive={isActive}
      gameEvent={gameEvent} // 'dice-roll', 'purchased-property', 'passed-go', etc.
    />
  );
}
```

## Complete Integration Example

```tsx
import { useState } from 'react';
import CameraController from './components/camera/CameraController';
import IsometricToggle, { IsometricView } from './components/camera/IsometricToggle';
import DiceParticles from './components/particles/DiceParticles';
import ConfettiParticles from './components/particles/ConfettiParticles';
import GoldenRingEffect from './components/particles/GoldenRingEffect';
import AnimatedPropertyCard from './components/AnimatedPropertyCard';
import PlayerPersonality from './components/PlayerPersonality';
import { useGameEffects } from './hooks/useGameEffects';

export default function EnhancedGameRoom() {
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [currentGameEvent, setCurrentGameEvent] = useState<string>('');

  const {
    diceParticles,
    confettiParticles,
    goldenRing,
    triggerDiceRoll,
    triggerPurchaseCelebration,
    triggerGoPass,
    triggerShake,
    triggerVictory,
  } = useGameEffects();

  const handleDiceRoll = () => {
    triggerDiceRoll();
    setCurrentGameEvent('dice-roll');
    // Your dice roll logic
  };

  const handlePropertyPurchase = (property: any) => {
    triggerPurchaseCelebration(property.color);
    setCurrentGameEvent('purchased-property');
    // Your purchase logic
  };

  const handlePassGo = () => {
    triggerGoPass();
    setCurrentGameEvent('passed-go');
    // Your GO logic
  };

  const handleBankruptcy = () => {
    triggerShake(15, 500);
    setCurrentGameEvent('bankrupt');
    // Your bankruptcy logic
  };

  const handleVictory = () => {
    triggerVictory();
    setCurrentGameEvent('won');
    // Your victory logic
  };

  return (
    <CameraController enableParallax={true} enableShake={true}>
      <IsometricView>
        <IsometricToggle />
        
        {/* Particle Effects */}
        <DiceParticles trigger={diceParticles} />
        <ConfettiParticles trigger={confettiParticles} />
        <GoldenRingEffect trigger={goldenRing} />

        {/* Game Board */}
        <div className="game-board">
          {properties.map((property) => (
            <AnimatedPropertyCard
              key={property.id}
              property={property}
              owner={getOwner(property)}
              isHovered={hoveredProperty === property.position}
              onMouseEnter={() => setHoveredProperty(property.position)}
              onMouseLeave={() => setHoveredProperty(null)}
            />
          ))}
        </div>

        {/* Player Panels */}
        <div className="player-panels">
          {players.map((player) => (
            <PlayerPersonality
              key={player.id}
              avatar={player.avatar}
              name={player.name}
              personality={player.personality || 'optimizer'}
              isActive={currentPlayer?.id === player.id}
              gameEvent={currentPlayer?.id === player.id ? currentGameEvent : undefined}
            />
          ))}
        </div>
      </IsometricView>
    </CameraController>
  );
}
```

## Event Types for Player Personalities

- `'dice-roll'` - When player rolls dice
- `'landed-expensive'` - When landing on expensive property
- `'purchased-property'` - When purchasing a property
- `'passed-go'` - When passing GO
- `'bankrupt'` - When going bankrupt
- `'won'` - When winning the game
- `'waiting'` - When waiting for turn
- `'low-money'` - When low on money

## Camera Shake Triggers

```tsx
// Trigger camera shake programmatically
if ((window as any).triggerCameraShake) {
  (window as any).triggerCameraShake(intensity, duration);
}

// Or use the hook
const { triggerShake } = useGameEffects();
triggerShake(10, 300); // intensity, duration in ms
```

## Sound Control

```tsx
import { soundManager } from './lib/soundEffects';

// Disable sounds
soundManager.disable();

// Enable sounds
soundManager.enable();
```

## Keyboard Shortcuts

- `V` - Toggle isometric view

## Performance Tips

1. Particle effects are automatically cleaned up after animation
2. Camera effects use GPU acceleration via CSS transforms
3. Sound effects use Web Audio API (no external files needed)
4. All animations respect `prefers-reduced-motion` media query

## Next Steps

1. Integrate into your existing GameRoom component
2. Connect game events to effect triggers
3. Customize personality types and catchphrases
4. Add more property stories to AnimatedPropertyCard
5. Fine-tune particle counts and timings for your needs








