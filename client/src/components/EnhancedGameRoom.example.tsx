// Example integration of all enhanced UI components

import { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedMonopolyBoard from './EnhancedMonopolyBoard';
import Enhanced3DDice from './Enhanced3DDice';
import EnhancedLiveFeed from './EnhancedLiveFeed';
import GlassmorphicPlayerCard from './GlassmorphicPlayerCard';
import AnimatedLogoCenter from './AnimatedLogoCenter';
import EnhancedGameTimer from './EnhancedGameTimer';
import { NotificationToast, useNotifications } from './NotificationToast';
import MoneyTransferEffect, { FloatingMoneyChange } from './MoneyTransferEffect';
import CameraController from './camera/CameraController';
import IsometricToggle, { IsometricView } from './camera/IsometricToggle';
import { useGameEffects } from '../hooks/useGameEffects';
import DiceParticles from './particles/DiceParticles';
import ConfettiParticles from './particles/ConfettiParticles';
import GoldenRingEffect from './particles/GoldenRingEffect';

// Example component showing how to integrate all the enhanced UI components
export default function EnhancedGameRoomExample() {
  // Game state
  const [gameState, setGameState] = useState({
    players: [
      { id: '1', name: 'Alice', avatar: '👩‍💻', money: 1500, position: 0, properties: [], color: '#10b981', inJail: false, jailTurns: 0 },
      { id: '2', name: 'Bob', avatar: '👨‍💻', money: 1500, position: 0, properties: [], color: '#3b82f6', inJail: false, jailTurns: 0 },
      { id: '3', name: 'Charlie', avatar: '🤖', money: 1500, position: 0, properties: [], color: '#f59e0b', inJail: false, jailTurns: 0 },
      { id: '4', name: 'Diana', avatar: '🦊', money: 1500, position: 0, properties: [], color: '#ec4899', inJail: false, jailTurns: 0 },
    ],
    currentPlayerId: '1',
    boardState: [], // Your board properties
  });

  // UI state
  const [events, setEvents] = useState<any[]>([]);
  const [moneyTransfers, setMoneyTransfers] = useState<any[]>([]);
  const [floatingChanges, setFloatingChanges] = useState<any[]>([]);

  // Hooks
  const { notifications, showNotification, closeNotification } = useNotifications();
  const effects = useGameEffects();

  // Event handlers
  const handleDiceRoll = (dice1: number, dice2: number) => {
    const total = dice1 + dice2;
    effects.triggerDiceRoll();
    
    // Add to feed
    const event = {
      id: Date.now().toString(),
      type: 'dice',
      message: `rolled ${total}`,
      timestamp: Date.now(),
      player: 'Alice',
      playerAvatar: '👩‍💻',
    };
    setEvents([...events, event]);
    
    // Show notification
    showNotification('info', 'Dice Rolled!', `Alice rolled ${total}`, 3000);
  };

  const handlePropertyPurchase = (property: any) => {
    effects.triggerPurchaseCelebration(property.color);
    
    showNotification(
      'property',
      'Property Purchased!',
      `Alice bought ${property.name} for $${property.price}`,
      5000
    );

    // Add money change effect
    const change = {
      id: Date.now().toString(),
      amount: -property.price,
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    };
    setFloatingChanges([...floatingChanges, change]);
  };

  const handlePassGo = () => {
    effects.triggerGoPass();
    showNotification('money', 'Passed GO!', 'Collect $200', 4000);
  };

  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
      }}
    >
      {/* Notification toasts */}
      <NotificationToast 
        notifications={notifications}
        onClose={closeNotification}
      />

      {/* Money transfer effects */}
      <MoneyTransferEffect
        transfers={moneyTransfers}
        onComplete={(id) => setMoneyTransfers(transfers => transfers.filter(t => t.id !== id))}
      />

      {/* Floating money changes */}
      {floatingChanges.map((change) => (
        <FloatingMoneyChange
          key={change.id}
          amount={change.amount}
          position={change.position}
          onComplete={() => setFloatingChanges(changes => changes.filter(c => c.id !== change.id))}
        />
      ))}

      {/* Particle effects */}
      <DiceParticles trigger={effects.diceParticles} />
      <ConfettiParticles trigger={effects.confettiParticles} />
      <GoldenRingEffect trigger={effects.goldenRing} />

      {/* Main layout */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Left sidebar - Players */}
          <div className="col-span-3 space-y-4">
            {gameState.players.map((player, index) => (
              <GlassmorphicPlayerCard
                key={player.id}
                player={player}
                isCurrentTurn={player.id === gameState.currentPlayerId}
                isYou={player.id === '1'}
                rank={index + 1}
                totalPlayers={gameState.players.length}
              />
            ))}
          </div>

          {/* Center - Game board */}
          <div className="col-span-6">
            <CameraController enableParallax={true} enableShake={true}>
              <IsometricView>
                <IsometricToggle />
                <EnhancedMonopolyBoard
                  boardState={gameState.boardState}
                  players={gameState.players}
                  currentPlayer={currentPlayer || null}
                  onTileClick={(property) => {
                    // Handle property click
                    if (!property.ownerId) {
                      handlePropertyPurchase(property);
                    }
                  }}
                />
              </IsometricView>
            </CameraController>
          </div>

          {/* Right sidebar */}
          <div className="col-span-3 space-y-4">
            {/* Timer */}
            <EnhancedGameTimer
              duration={180}
              onTimeUp={() => {
                showNotification('error', 'Time Up!', 'Your turn has ended');
              }}
            />

            {/* Dice */}
            <Enhanced3DDice
              onRoll={handleDiceRoll}
              disabled={false}
            />

            {/* Live feed */}
            <div className="h-64">
              <EnhancedLiveFeed
                events={events}
                maxEvents={10}
              />
            </div>
          </div>
        </div>

        {/* Bottom - Logo/Controls (optional position) */}
        <div className="mt-8 h-64">
          <AnimatedLogoCenter
            onAction={(action) => {
              console.log('Action:', action);
            }}
          />
        </div>
      </div>
    </div>
  );
}





