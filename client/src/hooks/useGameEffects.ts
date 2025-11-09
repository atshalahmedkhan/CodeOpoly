import { useState, useEffect, useRef } from 'react';
import { soundManager } from '../lib/soundEffects';

interface GameEffectsConfig {
  enableSounds?: boolean;
  enableParticles?: boolean;
  enableCamera?: boolean;
}

export function useGameEffects(config: GameEffectsConfig = {}) {
  const {
    enableSounds = true,
    enableParticles = true,
    enableCamera = true,
  } = config;

  const [diceParticles, setDiceParticles] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState(false);
  const [goldenRing, setGoldenRing] = useState(false);
  const [cameraShake, setCameraShake] = useState(false);

  // Sound effects
  useEffect(() => {
    if (!enableSounds) {
      soundManager.disable();
    } else {
      soundManager.enable();
    }
  }, [enableSounds]);

  // Trigger dice roll effects
  const triggerDiceRoll = (position?: { x: number; y: number }) => {
    if (enableSounds) soundManager.playDiceRoll();
    if (enableParticles) {
      setDiceParticles(true);
      setTimeout(() => setDiceParticles(false), 2000);
    }
    if (enableSounds) {
      setTimeout(() => soundManager.playDiceExplosion(), 800);
    }
  };

  // Trigger property purchase celebration
  const triggerPurchaseCelebration = (color: string, position?: { x: number; y: number }) => {
    if (enableSounds) soundManager.playPurchaseSuccess();
    if (enableParticles) {
      setConfettiParticles(true);
      setTimeout(() => setConfettiParticles(false), 3000);
    }
    if (enableSounds) {
      setTimeout(() => soundManager.playConfettiPop(), 100);
    }
  };

  // Trigger GO pass celebration
  const triggerGoPass = (position?: { x: number; y: number }) => {
    if (enableSounds) soundManager.playGoPass();
    if (enableParticles) {
      setGoldenRing(true);
      setTimeout(() => setGoldenRing(false), 2000);
    }
    if (enableSounds) {
      setTimeout(() => soundManager.playCoins(), 300);
    }
  };

  // Trigger camera shake
  const triggerShake = (intensity: number = 10, duration: number = 300) => {
    if (enableCamera && (window as any).triggerCameraShake) {
      (window as any).triggerCameraShake(intensity, duration);
    }
    if (enableSounds) soundManager.playCameraShake();
  };

  // Trigger victory
  const triggerVictory = () => {
    if (enableSounds) soundManager.playVictory();
    if (enableParticles) {
      setConfettiParticles(true);
      setTimeout(() => setConfettiParticles(false), 5000);
    }
  };

  // Trigger bankruptcy
  const triggerBankruptcy = () => {
    if (enableSounds) soundManager.playBankruptcy();
    triggerShake(15, 500);
  };

  // Trigger code challenge success
  const triggerCodeSuccess = () => {
    if (enableSounds) soundManager.playCodeSuccess();
    if (enableParticles) {
      setConfettiParticles(true);
      setTimeout(() => setConfettiParticles(false), 2000);
    }
  };

  // Trigger code challenge failure
  const triggerCodeFailure = () => {
    if (enableSounds) soundManager.playCodeFailure();
  };

  return {
    // Particle states
    diceParticles,
    confettiParticles,
    goldenRing,
    cameraShake,
    
    // Trigger functions
    triggerDiceRoll,
    triggerPurchaseCelebration,
    triggerGoPass,
    triggerShake,
    triggerVictory,
    triggerBankruptcy,
    triggerCodeSuccess,
    triggerCodeFailure,
  };
}








