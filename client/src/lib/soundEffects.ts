// Sound Effects System for CODEOPOLY
// Uses Web Audio API for programmatic sound generation

class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundsEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  enable() {
    this.soundsEnabled = true;
  }

  disable() {
    this.soundsEnabled = false;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.soundsEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Dice roll sound
  playDiceRoll() {
    if (!this.soundsEnabled || !this.audioContext) return;

    const frequencies = [200, 300, 400, 500];
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.1, 'square', 0.2);
      }, i * 50);
    });
  }

  // Dice explosion sound
  playDiceExplosion() {
    if (!this.soundsEnabled || !this.audioContext) return;
    this.playTone(600, 0.1, 'sawtooth', 0.3);
    setTimeout(() => {
      this.playTone(400, 0.1, 'square', 0.2);
    }, 50);
  }

  // Purchase success sound (cash register)
  playPurchaseSuccess() {
    if (!this.soundsEnabled || !this.audioContext) return;
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G chord
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.25);
      }, i * 100);
    });
  }

  // Confetti pop
  playConfettiPop() {
    if (!this.soundsEnabled || !this.audioContext) return;
    this.playTone(800, 0.15, 'sine', 0.2);
    setTimeout(() => {
      this.playTone(1000, 0.1, 'sine', 0.15);
    }, 50);
  }

  // GO pass sound (triumphant ding)
  playGoPass() {
    if (!this.soundsEnabled || !this.audioContext) return;
    this.playTone(523.25, 0.2, 'sine', 0.3);
    setTimeout(() => {
      this.playTone(659.25, 0.2, 'sine', 0.3);
    }, 100);
    setTimeout(() => {
      this.playTone(783.99, 0.3, 'sine', 0.3);
    }, 200);
  }

  // Coin clinking
  playCoins() {
    if (!this.soundsEnabled || !this.audioContext) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(800 + Math.random() * 200, 0.1, 'square', 0.15);
      }, i * 100);
    }
  }

  // Property landing zoom
  playPropertyLanding() {
    if (!this.soundsEnabled || !this.audioContext) return;
    this.playTone(400, 0.15, 'sine', 0.2);
  }

  // Camera shake (dramatic moment)
  playCameraShake() {
    if (!this.soundsEnabled || !this.audioContext) return;
    this.playTone(150, 0.1, 'sawtooth', 0.4);
    setTimeout(() => {
      this.playTone(100, 0.1, 'sawtooth', 0.3);
    }, 50);
  }

  // Victory fanfare
  playVictory() {
    if (!this.soundsEnabled || !this.audioContext) return;
    const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'sine', 0.3);
      }, i * 150);
    });
  }

  // Sad trombone (bankruptcy)
  playBankruptcy() {
    if (!this.soundsEnabled || !this.audioContext) return;
    const frequencies = [440, 392, 349, 330];
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.4, 'sawtooth', 0.3);
      }, i * 200);
    });
  }

  // Code challenge success
  playCodeSuccess() {
    if (!this.soundsEnabled || !this.audioContext) return;
    this.playTone(659.25, 0.2, 'sine', 0.3);
    setTimeout(() => {
      this.playTone(783.99, 0.2, 'sine', 0.3);
    }, 100);
    setTimeout(() => {
      this.playTone(987.77, 0.3, 'sine', 0.3);
    }, 200);
  }

  // Code challenge failure
  playCodeFailure() {
    if (!this.soundsEnabled || !this.audioContext) return;
    this.playTone(200, 0.3, 'sawtooth', 0.3);
  }
}

export const soundManager = new SoundManager();








