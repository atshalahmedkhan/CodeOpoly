'use client';

import { useState, useEffect } from 'react';
import { GameState, Player, Property, CodeDuel } from '@/types/game';
import { rollDice, movePlayer, canBuyProperty, buyProperty, payRent, receiveRent, getNextPlayer, checkGameOver, calculateRent, canUpgradeProperty, upgradeProperty } from '@/lib/gameLogic';
import { getPropertyAtPosition } from '@/lib/board';
import { getRandomProblem } from '@/lib/problems';
import { getRandomDebugProblem } from '@/lib/debugProblems';
import { getRandomCommunityChestCard, getRandomChanceCard, createGameEvent } from '@/lib/gameEvents';
import { executeCode } from '@/lib/codeExecutor';
import PlayerPanel from './PlayerPanel';
import CodeEditor from './CodeEditor';
import CodeDuelComponent from './CodeDuelComponent';
import BoardVisualization from './BoardVisualization';

interface GameBoardProps {
  gameState: GameState;
  currentPlayer: Player;
  onGameStateChange: (gameState: GameState) => void;
}

export default function GameBoard({ gameState, currentPlayer, onGameStateChange }: GameBoardProps) {
  const [diceRoll, setDiceRoll] = useState<[number, number] | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [activeDuel, setActiveDuel] = useState<CodeDuel | null>(null);
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [landedProperty, setLandedProperty] = useState<Property | null>(null);
  const [actionType, setActionType] = useState<'buy' | 'rent' | 'duel' | 'upgrade' | null>(null);

  const currentPlayerData = gameState.players.find(p => p.id === currentPlayer.id)!;
  const isMyTurn = gameState.currentPlayerId === currentPlayer.id;

  const handleRollDice = () => {
    if (!isMyTurn) return;
    const roll = rollDice();
    setDiceRoll(roll);
    
    const updatedPlayer = movePlayer(currentPlayerData, roll, 40);
    const newPosition = updatedPlayer.position;
    const property = getPropertyAtPosition(newPosition);
    
    const updatedPlayers = gameState.players.map(p => 
      p.id === currentPlayer.id ? updatedPlayer : p
    );
    
    let newGameState: GameState = {
      ...gameState,
      players: updatedPlayers,
      diceRoll: roll,
    };

    // Handle special spaces
    if (property?.id === 'go-to-jail') {
      const jailedPlayer = { ...updatedPlayer, inJail: true, jailTurns: 0, position: 10 };
      newGameState = {
        ...newGameState,
        players: updatedPlayers.map(p => p.id === currentPlayer.id ? jailedPlayer : p),
      };
      onGameStateChange(newGameState);
      return;
    }

    if (property?.id === 'community-chest') {
      const card = getRandomCommunityChestCard();
      const event = createGameEvent(card, [currentPlayer.id]);
      newGameState = { ...newGameState, activeEvent: event };
      if (card.type === 'code-sprint' && event.problem) {
        setCurrentProblem(event.problem);
        setShowCodeEditor(true);
      }
      onGameStateChange(newGameState);
      return;
    }

    if (property?.id === 'chance') {
      const card = getRandomChanceCard();
      alert(`${card.title}\n\n${card.description}`);
      // Store the chaos mode effect for next problem
      newGameState = { ...newGameState, activeEvent: createGameEvent(card, [currentPlayer.id]) };
      onGameStateChange(newGameState);
      return;
    }

    if (property && property.price > 0) {
      setLandedProperty(property);
      
      if (!property.ownerId) {
        // Can buy property
        setActionType('buy');
        const problem = getRandomProblem(property.category, 'easy');
        setCurrentProblem(problem);
        setShowCodeEditor(true);
      } else if (property.ownerId !== currentPlayer.id) {
        // Landed on opponent's property
        setActionType('rent');
        const owner = updatedPlayers.find(p => p.id === property.ownerId);
        if (owner) {
          // Show option to pay rent or challenge to duel
          setActionType('duel');
        }
      } else {
        // Own property - can upgrade
        setLandedProperty(property);
        setActionType('upgrade');
      }
    }

    onGameStateChange(newGameState);
  };

  const handleBuyProperty = (code: string) => {
    if (!landedProperty || !currentProblem) return;

    const result = executeCode(code, currentProblem);
    
    if (result.success) {
      const { player: updatedPlayer, property: updatedProperty } = buyProperty(
        currentPlayerData,
        landedProperty
      );
      
      const updatedPlayers = gameState.players.map(p => 
        p.id === currentPlayer.id ? updatedPlayer : p
      );
      
      const updatedProperties = gameState.properties.map(p => 
        p.id === landedProperty.id ? updatedProperty : p
      );
      
      onGameStateChange({
        ...gameState,
        players: updatedPlayers,
        properties: updatedProperties,
        currentPlayerId: getNextPlayer(currentPlayer.id, updatedPlayers),
        turnNumber: gameState.turnNumber + 1,
      });
      
      setShowCodeEditor(false);
      setLandedProperty(null);
      setCurrentProblem(null);
      setActionType(null);
    } else {
      alert(`Solution incorrect: ${result.error}`);
    }
  };

  const handlePayRent = () => {
    if (!landedProperty) return;
    
    const owner = gameState.players.find(p => p.id === landedProperty.ownerId);
    if (!owner) return;

    const rent = calculateRent(landedProperty);
    const updatedPlayer = payRent(currentPlayerData, landedProperty, owner);
    const updatedOwner = receiveRent(owner, rent);
    
    const updatedPlayers = gameState.players.map(p => {
      if (p.id === currentPlayer.id) return updatedPlayer;
      if (p.id === owner.id) return updatedOwner;
      return p;
    });
    
    onGameStateChange({
      ...gameState,
      players: updatedPlayers,
      currentPlayerId: getNextPlayer(currentPlayer.id, updatedPlayers),
      turnNumber: gameState.turnNumber + 1,
    });
    
    setLandedProperty(null);
    setActionType(null);
  };

  const handleChallengeDuel = () => {
    if (!landedProperty) return;
    
    const owner = gameState.players.find(p => p.id === landedProperty.ownerId);
    if (!owner) return;

    const problem = getRandomProblem(landedProperty.category, 'medium');
    const duel: CodeDuel = {
      id: `duel-${Date.now()}`,
      challengerId: currentPlayer.id,
      defenderId: owner.id,
      propertyId: landedProperty.id,
      problem,
      challengerCode: problem.starterCode,
      defenderCode: problem.starterCode,
      challengerSolved: false,
      defenderSolved: false,
      startTime: Date.now(),
      timeLimit: 300,
      status: 'active',
    };
    
    setActiveDuel(duel);
    setShowCodeEditor(false);
  };

  const handleEndTurn = () => {
    // Handle jail turns
    let updatedPlayers = gameState.players;
    if (currentPlayerData.inJail) {
      const updatedPlayer = {
        ...currentPlayerData,
        jailTurns: currentPlayerData.jailTurns + 1,
      };
      if (updatedPlayer.jailTurns >= 3) {
        updatedPlayer.inJail = false;
        updatedPlayer.jailTurns = 0;
      }
      updatedPlayers = gameState.players.map(p => 
        p.id === currentPlayer.id ? updatedPlayer : p
      );
    }

    onGameStateChange({
      ...gameState,
      players: updatedPlayers,
      currentPlayerId: getNextPlayer(currentPlayer.id, updatedPlayers),
      turnNumber: gameState.turnNumber + 1,
    });
    setDiceRoll(null);
    setLandedProperty(null);
    setActionType(null);
  };

  const handleDebugHell = () => {
    const debugProblem = getRandomDebugProblem();
    setCurrentProblem(debugProblem);
    setShowCodeEditor(true);
  };

  const handleUpgradeProperty = () => {
    if (!landedProperty) return;
    
    if (!canUpgradeProperty(currentPlayerData, landedProperty)) {
      alert('Cannot upgrade this property');
      return;
    }

    const problem = getRandomProblem(landedProperty.category, 'medium');
    setCurrentProblem(problem);
    setShowCodeEditor(true);
  };

  const handleUpgradeSubmit = (code: string) => {
    if (!landedProperty || !currentProblem) return;

    const result = executeCode(code, currentProblem);
    
    if (result.success) {
      const { player: updatedPlayer, property: updatedProperty } = upgradeProperty(
        currentPlayerData,
        landedProperty
      );
      
      const updatedPlayers = gameState.players.map(p => 
        p.id === currentPlayer.id ? updatedPlayer : p
      );
      
      const updatedProperties = gameState.properties.map(p => 
        p.id === landedProperty.id ? updatedProperty : p
      );
      
      onGameStateChange({
        ...gameState,
        players: updatedPlayers,
        properties: updatedProperties,
        currentPlayerId: getNextPlayer(currentPlayer.id, updatedPlayers),
        turnNumber: gameState.turnNumber + 1,
      });
      
      setShowCodeEditor(false);
      setLandedProperty(null);
      setCurrentProblem(null);
      setActionType(null);
    } else {
      alert(`Solution incorrect: ${result.error}`);
    }
  };

  useEffect(() => {
    const gameOver = checkGameOver(gameState);
    if (gameOver.isOver && gameOver.winnerId) {
      const winner = gameState.players.find(p => p.id === gameOver.winnerId);
      alert(`Game Over! ${winner?.name} wins!`);
    }
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Board Area */}
          <div className="lg:col-span-2">
            <BoardVisualization 
              gameState={gameState}
              currentPlayer={currentPlayer}
            />
            
            {/* Game Controls */}
            <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Current Turn: {gameState.players.find(p => p.id === gameState.currentPlayerId)?.name}</p>
                  <p className="text-white/60 text-xs">Turn #{gameState.turnNumber}</p>
                </div>
                
                {isMyTurn && !diceRoll && (
                  <button
                    onClick={handleRollDice}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                  >
                    Roll Dice 🎲
                  </button>
                )}
                
                {diceRoll && (
                  <div className="flex items-center gap-2">
                    <div className="text-white text-2xl font-bold">
                      🎲 {diceRoll[0]} + {diceRoll[1]} = {diceRoll[0] + diceRoll[1]}
                    </div>
                    {!landedProperty && (
                      <button
                        onClick={handleEndTurn}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        End Turn
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Property Action */}
              {landedProperty && actionType === 'rent' && (
                <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
                  <p className="text-white font-semibold mb-2">
                    You landed on {landedProperty.name} (owned by {gameState.players.find(p => p.id === landedProperty.ownerId)?.name})
                  </p>
                  <p className="text-white/80 mb-3">Rent: ${calculateRent(landedProperty)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePayRent}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Pay Rent
                    </button>
                    <button
                      onClick={handleChallengeDuel}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Challenge to Code Duel! ⚔️
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <PlayerPanel 
              players={gameState.players}
              currentPlayerId={currentPlayer.id}
            />
          </div>
        </div>

        {/* Jail/Debug Hell */}
        {currentPlayerData.inJail && isMyTurn && (
          <div className="mt-4 p-4 bg-red-500/20 rounded-lg border border-red-500/50">
            <p className="text-white font-semibold mb-2">🔒 You're in Debug Hell!</p>
            <p className="text-white/80 mb-3">
              Fix the buggy code to get out. Turn {currentPlayerData.jailTurns + 1}/3
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDebugHell}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Debug Code 🐛
              </button>
              <button
                onClick={() => {
                  const updatedPlayer = { ...currentPlayerData, money: currentPlayerData.money - 500, inJail: false, jailTurns: 0 };
                  const updatedPlayers = gameState.players.map(p => 
                    p.id === currentPlayer.id ? updatedPlayer : p
                  );
                  onGameStateChange({ ...gameState, players: updatedPlayers });
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Pay Bail ($500)
              </button>
            </div>
          </div>
        )}

        {/* Property Upgrade Option */}
        {landedProperty && actionType === 'upgrade' && (
          <div className="mt-4 p-4 bg-green-500/20 rounded-lg border border-green-500/50">
            <p className="text-white font-semibold mb-2">
              Upgrade {landedProperty.name}
            </p>
            <p className="text-white/80 mb-3">
              Current: {landedProperty.houses} {landedProperty.houses === 4 ? '🏨' : '🏠'}<br />
              Cost: ${landedProperty.houseCost}
            </p>
            <button
              onClick={handleUpgradeProperty}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Solve Problem to Upgrade
            </button>
          </div>
        )}

        {/* Code Editor Modal */}
        {showCodeEditor && currentProblem && (
          <CodeEditor
            problem={currentProblem}
            onSubmit={(code) => {
              if (actionType === 'buy') {
                handleBuyProperty(code);
              } else if (actionType === 'upgrade') {
                handleUpgradeSubmit(code);
              } else if (currentPlayerData.inJail) {
                // Debug hell solution
                const result = executeCode(code, currentProblem);
                if (result.success) {
                  const updatedPlayer = { ...currentPlayerData, inJail: false, jailTurns: 0 };
                  const updatedPlayers = gameState.players.map(p => 
                    p.id === currentPlayer.id ? updatedPlayer : p
                  );
                  onGameStateChange({ ...gameState, players: updatedPlayers });
                  setShowCodeEditor(false);
                  setCurrentProblem(null);
                } else {
                  alert(`Solution incorrect: ${result.error}`);
                }
              }
            }}
            onClose={() => {
              setShowCodeEditor(false);
              setCurrentProblem(null);
              setActionType(null);
            }}
          />
        )}

        {/* Code Duel Modal */}
        {activeDuel && (
          <CodeDuelComponent
            duel={activeDuel}
            currentPlayer={currentPlayer}
            gameState={gameState}
            onDuelEnd={(result) => {
              // Handle duel result
              setActiveDuel(null);
              setLandedProperty(null);
              setActionType(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

