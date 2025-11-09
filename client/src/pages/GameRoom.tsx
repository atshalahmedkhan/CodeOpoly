import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import EnhancedMonopolyBoard from '../components/EnhancedMonopolyBoard';
import CurrentActionDisplay from '../components/CurrentActionDisplay';
import FullCodeChallengeModal from '../components/FullCodeChallengeModal';
import CodeDuelModal from '../components/CodeDuelModal';
import EnhancedGameTimer from '../components/EnhancedGameTimer';
import GameOverModal from '../components/GameOverModal';
import GameEventLog from '../components/GameEventLog';
import EnhancedLiveFeed from '../components/EnhancedLiveFeed';
import DebuggingCardModal from '../components/DebuggingCardModal';
import GlassmorphicPlayerCard from '../components/GlassmorphicPlayerCard';
import Enhanced3DDice from '../components/Enhanced3DDice';
import PropertyCardModal from '../components/PropertyCardModal';
import { NotificationToast, useNotifications } from '../components/NotificationToast';
import MoneyTransferEffect, { FloatingMoneyChange } from '../components/MoneyTransferEffect';
import CameraController from '../components/camera/CameraController';
import IsometricToggle, { IsometricView } from '../components/camera/IsometricToggle';
import { useGameEffects } from '../hooks/useGameEffects';
import DiceParticles from '../components/particles/DiceParticles';
import ConfettiParticles from '../components/particles/ConfettiParticles';
import GoldenRingEffect from '../components/particles/GoldenRingEffect';
import { getProblemForProperty, getRandomProblemByDifficulty } from '../data/problemBank';
import { executeCode } from '../services/judge0Service';
import type { Problem } from '../data/problemBank';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

interface GameState {
  _id: string;
  roomCode: string;
  status: string;
  players: any[];
  currentTurn: string;
  turnNumber: number;
  boardState: any[];
  activeDuel?: any;
  startTime?: number;
}

interface GameEvent {
  id: string;
  type: 'info' | 'dice' | 'purchase' | 'rent' | 'duel' | 'special' | 'upgrade' | 'bankrupt' | 'land';
  message: string;
  timestamp: number;
  player?: string;
  playerAvatar?: string;
  property?: string;
  amount?: number;
}

const COLOR_TO_TIER: Record<string, 'brown' | 'lightblue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'darkblue' | 'railroad' | 'utility' | 'special'> = {
  '#8B4513': 'brown',
  '#87CEEB': 'lightblue',
  '#FF69B4': 'pink',
  '#FF8C00': 'orange',
  '#DC143C': 'red',
  '#FFD700': 'yellow',
  '#228B22': 'green',
  '#00008B': 'darkblue',
  '#000000': 'railroad',
  '#FFFFFF': 'utility',
  transparent: 'special',
};

const TIER_TO_DIFFICULTY: Record<string, 'easy' | 'medium' | 'hard'> = {
  brown: 'easy',
  lightblue: 'easy',
  pink: 'medium',
  orange: 'medium',
  red: 'medium',
  yellow: 'hard',
  green: 'hard',
  darkblue: 'hard',
  railroad: 'medium',
  utility: 'medium',
  special: 'medium',
};

const getPropertyTier = (property: any): string | null => {
  if (!property) return null;
  if (property.isRailroad) return 'railroad';
  if (property.isUtility) return 'utility';
  if (property.isSpecial) return 'special';
  const tier = COLOR_TO_TIER[property.color as keyof typeof COLOR_TO_TIER];
  return tier || null;
};

const getDifficultyForProperty = (property: any): 'easy' | 'medium' | 'hard' => {
  const tier = getPropertyTier(property);
  if (!tier) {
    // fallback by price
    if (property.price <= 100) return 'easy';
    if (property.price <= 200) return 'medium';
    return 'hard';
  }
  return TIER_TO_DIFFICULTY[tier];
};

const describeProperty = (property: any) => {
  if (!property) return 'Unknown space';
  if (property.specialType) {
    return property.name;
  }
  return property.name;
};

const getPlayerNameById = (players: any[], id: string | null | undefined) => {
  if (!id) return 'Player';
  const player = players?.find?.((p: any) => p.id === id);
  return player?.name || 'Player';
};

export default function GameRoom() {
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId, playerName } = location.state || {};

  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showPropertyCardModal, setShowPropertyCardModal] = useState(false);
  const [landedProperty, setLandedProperty] = useState<any>(null);
  const [landedPosition, setLandedPosition] = useState<number | undefined>();
  const [actionType, setActionType] = useState<'awaiting-action' | 'dice-rolling' | 'landed-unowned' | 'landed-owned' | 'landed-opponent' | 'landed-special' | 'landed-tax' | null>('awaiting-action');
  const [diceResult, setDiceResult] = useState<{ dice1: number; dice2: number; total: number } | null>(null);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [duelOpponentCode, setDuelOpponentCode] = useState('');
  const [duelOpponentStatus, setDuelOpponentStatus] = useState<'solving' | 'completed' | 'failed'>('solving');
  const [myDuelCode, setMyDuelCode] = useState('');
  const [debuggingCard, setDebuggingCard] = useState<any>(null);
  const [moneyTransfers, setMoneyTransfers] = useState<any[]>([]);
  const [floatingChanges, setFloatingChanges] = useState<any[]>([]);

  const hasLoggedStartRef = useRef(false);
  const previousTurnRef = useRef<string | null>(null);
  const playersRef = useRef<any[]>([]);
  const previousMoneyRef = useRef<{ [key: string]: number }>({});

  // Enhanced UI hooks
  const { notifications, showNotification, closeNotification } = useNotifications();
  const effects = useGameEffects();

  useEffect(() => {
    if (!gameId || !playerId) {
      console.error('Missing gameId or playerId:', { gameId, playerId });
      navigate('/');
      return;
    }

    console.log('Connecting to socket:', SOCKET_URL);
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Connection error handling
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      alert('Failed to connect to game server. Please refresh the page.');
    });

    // Join game
    console.log('Joining game:', { gameId, playerId });
    newSocket.emit('join-game', { gameId, playerId });

    // Listen for game state updates
    newSocket.on('game-state', (state: GameState) => {
      console.log('Received game state:', state);
      if (!state || !state.boardState || state.boardState.length === 0) {
        console.error('Invalid game state received:', state);
        return;
      }

      const normalizedState: GameState = {
        ...state,
        startTime: state.startTime
          ? new Date(state.startTime).getTime()
          : gameState?.startTime || Date.now(),
      };

      setGameState(normalizedState);
      playersRef.current = normalizedState.players;

      if (!hasLoggedStartRef.current) {
        const firstPlayerName = getPlayerNameById(normalizedState.players, normalizedState.currentTurn);
        addEvent({
          type: 'info',
          message: `🎮 Game started! ${firstPlayerName}'s turn`,
        });
        hasLoggedStartRef.current = true;
        previousTurnRef.current = normalizedState.currentTurn;
      } else if (previousTurnRef.current !== normalizedState.currentTurn) {
        const nextPlayerName = getPlayerNameById(normalizedState.players, normalizedState.currentTurn);
        addEvent({
          type: 'info',
          message: `🎯 ${nextPlayerName}'s turn`,
        });
        previousTurnRef.current = normalizedState.currentTurn;
      }

      if (normalizedState.status === 'finished') {
        setShowGameOver(true);
      }
    });

    newSocket.on('joined-game', () => {
      // Request game state immediately after joining
      newSocket.emit('get-game-state', { gameId });
    });

    // Listen for when other players join
    newSocket.on('player-joined', (data: any) => {
      console.log('Player joined:', data);
      const { playerName, playerAvatar } = data;
      
      // Show notification
      showNotification('success', 'Player Joined!', `${playerName} joined the game`, 3000);
      
      // Add event to log
      addEvent({
        type: 'info',
        message: `🎮 ${playerName} joined the game`,
        timestamp: Date.now(),
        player: playerName,
        playerAvatar: playerAvatar,
      });
      
      // Game state will be automatically updated via the 'game-state' event
    });

    // Also request game state immediately in case we missed the joined-game event
    setTimeout(() => {
      newSocket.emit('get-game-state', { gameId });
    }, 100);

    newSocket.on('dice-rolled', (data: any) => {
      const rollerId = data.playerId;
      const rollerName = getPlayerNameById(playersRef.current, rollerId);

      // Only update dice result and action type if it's the current player
      if (rollerId === playerId) {
        setDiceResult({ dice1: data.dice[0], dice2: data.dice[1], total: data.total });
        setActionType('dice-rolling');
        setLandedPosition(data.newPosition);
      }
      
      // Trigger particle effects
      if (rollerId === playerId) {
        effects.triggerDiceRoll();
      }
      
      addEvent({
        type: 'dice',
        message: `${rollerName} rolled ${data.total} (${data.dice[0]} + ${data.dice[1]})`,
        timestamp: Date.now(),
        player: rollerName,
        playerAvatar: playersRef.current.find(p => p.id === rollerId)?.avatar,
      });
      
      showNotification('info', 'Dice Rolled!', `${rollerName} rolled ${data.total}`, 3000);
      
      setTimeout(() => {
        newSocket.emit('get-game-state', { gameId });
      }, 2000);
    });

    newSocket.on('landed-on-space', (data: any) => {
      if (!data.property) return;

      const landedPlayerId = data.playerId;
      const property = data.property;
      
      // Only update state for the player who actually landed
      if (landedPlayerId === playerId) {
        setLandedProperty(property);
        setLandedPosition(property.position);
      }

      const activePlayerName = getPlayerNameById(playersRef.current, landedPlayerId);
      const propertyName = describeProperty(property);

      const activePlayer = playersRef.current.find((p: any) => p.id === landedPlayerId);
      addEvent({
        type: property.isSpecial ? 'special' : 'land',
        message: `${activePlayerName} landed on ${propertyName}`,
        timestamp: Date.now(),
        player: activePlayerName,
        playerAvatar: activePlayer?.avatar,
        property: propertyName,
      });

      // Only process actions for the player who landed
      if (landedPlayerId !== playerId) return;

      if (property.isSpecial) {
        setActionType('landed-special');
        handleSpecialSpace(property);
        return;
      }

      if (property.specialType === 'income-tax' || property.specialType === 'luxury-tax') {
        setActionType('landed-tax');
        addEvent({
          type: 'rent',
          message: `💸 ${activePlayerName} must pay ${property.name}`,
          player: playerId,
        });
        return;
      }

      // Show property card modal for all properties
      setShowPropertyCardModal(true);
      
      if (data.canBuy) {
        setActionType('landed-unowned');
        const difficulty = getDifficultyForProperty(property);
        const problem = getProblemForProperty(property) || getRandomProblemByDifficulty(difficulty);
        if (problem) {
          setCurrentProblem(problem);
        }
        return;
      }

      if (data.mustPayRent) {
        setActionType('landed-opponent');
        const ownerName = getPlayerNameById(playersRef.current, property.ownerId);
        const rentAmount = property.houses === 0
          ? property.rent
          : property.rentWithHouse?.[Math.max(property.houses - 1, 0)] || property.rent;
        addEvent({
          type: 'rent',
          message: `💰 ${activePlayerName} owes $${rentAmount} to ${ownerName}`,
          player: playerId,
        });
        return;
      }

      if (property.ownerId === playerId) {
        setActionType('landed-owned');
        addEvent({
          type: 'info',
          message: `🏠 ${activePlayerName} is visiting their own ${propertyName}`,
          player: playerId,
        });
      } else {
        setActionType('awaiting-action');
      }
    });

    newSocket.on('property-bought', (data: any) => {
      const property = gameState?.boardState.find((p: any) => p.id === data.propertyId);
      
      // Trigger celebration effects
      if (data.playerId === playerId && property) {
        effects.triggerPurchaseCelebration(property.color);
      }
      
      addEvent({
        type: 'purchase',
        message: `${data.playerName || 'Player'} bought ${data.propertyName}`,
        timestamp: Date.now(),
        player: data.playerName || 'Player',
        playerAvatar: playersRef.current.find(p => p.id === data.playerId)?.avatar,
        property: data.propertyName,
        amount: property?.price,
      });
      
      showNotification('property', 'Property Purchased!', `${data.playerName} bought ${data.propertyName}`, 5000);
      
      setShowChallengeModal(false);
      setLandedProperty(null);
      setLandedPosition(undefined);
      setCurrentProblem(null);
      setActionType(null);
      newSocket.emit('get-game-state', { gameId });
    });

    newSocket.on('duel-started', (data: any) => {
      const problem = data.problem;
      setCurrentProblem(problem);
      setShowDuelModal(true);
      setDuelOpponentCode('');
      setDuelOpponentStatus('solving');
      setMyDuelCode('');
      
      addEvent({
        type: 'duel',
        message: `⚔️ Code Duel started!`,
        player: data.challengerId,
      });
    });

    newSocket.on('duel-code-update', (data: any) => {
      if (data.playerId !== playerId) {
        setDuelOpponentCode(data.code);
      }
    });

    newSocket.on('duel-progress', (data: any) => {
      if (data.playerId !== playerId) {
        setDuelOpponentStatus(data.solved ? 'completed' : 'failed');
      }
    });

    newSocket.on('duel-ended', (data: any) => {
      const winner = playersRef.current.find((p: any) => p.id === data.winner);
      addEvent({
        type: 'duel',
        message: `🏆 ${winner?.name || 'Player'} won the code duel!`,
        player: data.winner,
      });
      toast.success(data.winner === playerId ? '🎉 You won the duel!' : '💔 You lost the duel');
      setShowDuelModal(false);
      setCurrentProblem(null);
      newSocket.emit('get-game-state', { gameId });
    });

    newSocket.on('turn-ended', (data: any) => {
      setActionType(null);
      setDiceResult(null);
      newSocket.emit('get-game-state', { gameId });
    });

    newSocket.on('debugging-card-drawn', (data: any) => {
      setDebuggingCard(data.card);
      addEvent({
        type: 'special',
        message: `🎴 ${getPlayerNameById(playersRef.current, data.playerId)} drew: ${data.card.title} - ${data.card.message}`,
        player: data.playerId,
      });
    });

    newSocket.on('card-effect', (data: any) => {
      if (data.moneyChange) {
        addEvent({
          type: data.moneyChange > 0 ? 'special' : 'rent',
          message: `💰 ${data.message}`,
          player: data.playerId,
        });
      }
      newSocket.emit('get-game-state', { gameId });
    });

    newSocket.on('error', (error: any) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    });

    newSocket.on('disconnect', () => {
      console.warn('Socket disconnected');
    });

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.close();
    };
  }, [gameId, playerId, navigate]);

  const addEvent = (event: Omit<GameEvent, 'id' | 'timestamp'>) => {
    setGameEvents(prev => {
      const entry: GameEvent = {
        ...event,
        id: `event-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      const next = [...prev, entry];
      return next.slice(-10);
    });
  };

  const handleSpecialSpace = (property: any) => {
    if (property.specialType === 'go-to-jail') {
      // Move to jail
      toast.error('🚨 Go to Jail!');
      addEvent({ type: 'special', message: '🚨 Sent directly to Jail!', player: playerId });
    } else if (property.specialType === 'chance') {
      // Draw chance card
      toast('🎲 Chance card drawn!', { icon: '🎲' });
      addEvent({ type: 'special', message: '🎲 Drew a Chance card', player: playerId });
    } else if (property.specialType === 'community-chest') {
      // Draw community chest card
      toast('📦 Community Chest card drawn!', { icon: '📦' });
      addEvent({ type: 'special', message: '📦 Drew a Community Chest card', player: playerId });
      } else if (property.specialType === 'go') {
      // Trigger GO celebration
      if (playerId) {
        effects.triggerGoPass();
      }
      showNotification('money', 'Passed GO!', 'Collect $200', 4000);
      addEvent({ type: 'special', message: 'Passed GO and collected $200', player: playerId });
    }
  };

  const handleRollDice = (dice1?: number, dice2?: number) => {
    if (!socket || !gameId || !playerId) return;

    if (playersRef.current.length < 2) {
      toast.error('You need at least 2 players. Share your room code and wait for a friend to join.');
      return;
    }

    // If dice values are provided (from EnhancedDiceRoller), we still let the server roll
    // The server will generate the actual dice values
    socket.emit('roll-dice', { gameId, playerId });
  };

  const handleSolveAndBuy = async (code: string, language: string) => {
    if (!currentProblem || !landedProperty || !socket || !gameId || !playerId) return;

    // MOCKED: Always succeed for demo
    const playerName = getPlayerNameById(playersRef.current, playerId);
    const coinsEarned = landedProperty.price;
    
    // Show success notification
    toast.success(`✅ PASS: Accepted Solution! +${coinsEarned} Algo-Coins`, {
      duration: 4000,
      icon: '🎉',
    });

    addEvent({
      type: 'purchase',
      message: `✅ ${playerName} solved "${currentProblem.title}"! +${coinsEarned} A-C`,
      player: playerId,
    });

    // Automatically deduct cost and buy property
    socket.emit('buy-property', {
      gameId,
      playerId,
      propertyId: landedProperty.id,
      code,
      language,
    });

    // Close modal after a brief delay
    setTimeout(() => {
      setShowChallengeModal(false);
      setCurrentProblem(null);
      setLandedProperty(null);
      setActionType(null);
    }, 1500);
  };

  const handlePayRent = () => {
    if (socket && gameId && playerId && landedProperty) {
      // Emit pay rent event
      socket.emit('pay-rent', { gameId, playerId, propertyId: landedProperty.id });
      const ownerName = getPlayerNameById(playersRef.current, landedProperty.ownerId);
      const rentAmount = landedProperty.houses === 0
        ? landedProperty.rent
        : landedProperty.rentWithHouse?.[Math.max(landedProperty.houses - 1, 0)] || landedProperty.rent;
      addEvent({
        type: 'rent',
        message: `💸 ${getPlayerNameById(playersRef.current, playerId)} paid $${rentAmount} to ${ownerName}`,
        player: playerId,
      });
      setActionType(null);
      setLandedProperty(null);
    }
  };

  const handleCodeDuel = () => {
    if (socket && gameId && playerId && landedProperty) {
      const owner = playersRef.current.find((p: any) => p.id === landedProperty.ownerId);
      if (owner) {
        socket.emit('challenge-duel', {
          gameId,
          challengerId: playerId,
          defenderId: owner.id,
          propertyId: landedProperty.id,
        });
        addEvent({
          type: 'duel',
          message: `⚔️ ${getPlayerNameById(playersRef.current, playerId)} challenged ${owner.name} to a code duel!`,
          player: playerId,
        });
      }
    }
  };

  const handlePropertyCardBuy = () => {
    if (!currentProblem) {
      // Get problem if not already set
      const difficulty = getDifficultyForProperty(landedProperty);
      const problem = getProblemForProperty(landedProperty) || getRandomProblemByDifficulty(difficulty);
      if (problem) {
        setCurrentProblem(problem);
      }
    }
    setShowPropertyCardModal(false);
    setShowChallengeModal(true);
  };

  const handlePropertyCardSkip = () => {
    setShowPropertyCardModal(false);
    setActionType(null);
    setLandedProperty(null);
    setLandedPosition(undefined);
  };

  const handleUpgrade = () => {
    if (socket && gameId && playerId && landedProperty) {
      socket.emit('upgrade-property', {
        gameId,
        playerId,
        propertyId: landedProperty.id,
      });
      toast.success('🏠 Property upgraded!');
      addEvent({
        type: 'upgrade',
        message: `🏠 ${getPlayerNameById(playersRef.current, playerId)} upgraded ${describeProperty(landedProperty)}`,
        player: playerId,
      });
      setActionType(null);
      setLandedProperty(null);
    }
  };

  const handleDuelCodeUpdate = (code: string) => {
    setMyDuelCode(code);
    if (socket && gameId && playerId) {
      socket.emit('duel-code-update', { gameId, playerId, code });
    }
  };

  const handleDuelWin = () => {
    if (socket && gameId && playerId) {
      socket.emit('submit-duel-code', {
        gameId,
        playerId,
        code: myDuelCode,
        language: 'javascript',
      });
    }
  };

  const handleDuelLose = () => {
    // Duel lost - handled by server
  };

  const handleTimeUp = () => {
    if (socket && gameId) {
      socket.emit('game-time-up', { gameId });
    }
    addEvent({
      type: 'info',
      message: '⏰ Time is up! Calculating winner...',
      player: playerId,
    });
  };

  const calculateNetWorth = (player: any) => {
    const propertyValue = gameState?.boardState
      .filter(p => p.ownerId === player.id)
      .reduce((sum, p) => sum + p.price + (p.houses * p.houseCost || 0), 0) || 0;
    return player.money + propertyValue;
  };

  useEffect(() => {
    if (!gameState) return;

    const isPlayersTurn = gameState.currentTurn === playerId;

    if (isPlayersTurn) {
      if (!diceResult && !showChallengeModal && !showDuelModal && !landedProperty) {
        setActionType(prev => (prev === null ? 'awaiting-action' : prev));
      }
    } else if (actionType === 'awaiting-action') {
      setActionType(null);
    }
  }, [gameState, playerId, diceResult, showChallengeModal, showDuelModal, landedProperty, actionType]);

  // Track money changes for animations - MUST be before early return
  useEffect(() => {
    if (!gameState || !gameState.players) return;
    
    gameState.players.forEach((player: any) => {
      const prevMoney = previousMoneyRef.current[player.id] || player.money;
      if (prevMoney !== player.money) {
        const change = player.money - prevMoney;
        if (change !== 0 && Math.abs(change) > 0) {
          // Add floating money change
          const floatingChange = {
            id: `${player.id}-${Date.now()}`,
            amount: change,
            position: { 
              x: window.innerWidth / 2, 
              y: window.innerHeight / 2 
            },
          };
          setFloatingChanges(prev => [...prev, floatingChange]);
          
          // Show notification for significant changes
          if (Math.abs(change) >= 200) {
            showNotification(
              'money',
              change > 0 ? 'Money Received!' : 'Money Spent!',
              `${change > 0 ? '+' : ''}$${Math.abs(change)}`,
              3000
            );
          }
        }
        previousMoneyRef.current[player.id] = player.money;
      }
    });
  }, [gameState?.players, showNotification]);

  if (!gameState || !gameState.boardState || gameState.boardState.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center flex-col gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
        <div className="text-white text-lg font-mono">Loading game board...</div>
        {socket && (
          <div className="text-white/60 text-sm font-mono">
            Socket: {socket.connected ? '✅ Connected' : '❌ Disconnected'}
          </div>
        )}
        {gameId && (
          <div className="text-white/60 text-sm font-mono">
            Game ID: {gameId}
          </div>
        )}
        {playerId && (
          <div className="text-white/60 text-sm font-mono">
            Player ID: {playerId}
          </div>
        )}
        <button
          onClick={() => {
            if (socket && gameId) {
              console.log('Manually requesting game state');
              socket.emit('get-game-state', { gameId });
            }
          }}
          className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-mono"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const totalPlayers = gameState.players.length;
  const hasEnoughPlayers = totalPlayers >= 2;
  const playersNeeded = Math.max(0, 2 - totalPlayers);
  const isMyTurn = gameState.currentTurn === playerId;
  const propertyOwner = landedProperty?.ownerId 
    ? gameState.players.find((p: any) => p.id === landedProperty.ownerId)
    : null;
  const rent = landedProperty && propertyOwner 
    ? (landedProperty.houses === 0 
        ? landedProperty.rent 
        : landedProperty.rentWithHouse?.[landedProperty.houses - 1] || landedProperty.rent)
    : 0;

  // Calculate winner for game over
  const winner = gameState.status === 'finished' 
    ? gameState.players.reduce((prev, curr) => 
        calculateNetWorth(curr) > calculateNetWorth(prev) ? curr : prev
      )
    : null;

  return (
    <div className="game-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: '#fff',
            border: '2px solid #10b981',
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            fontSize: '15px',
            fontWeight: '600',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg rounded-xl p-4 border-2 border-emerald-500/50 shadow-2xl"
          style={{
            background: 'rgba(15, 25, 45, 0.7)',
            backdropFilter: 'blur(10px) saturate(180%)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="text-2xl"
            >
              🎮
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-mono">ROOM: </h1>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(gameState.roomCode);
                    showNotification('success', 'Copied!', `Room code ${gameState.roomCode} copied to clipboard`, 2000);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold text-xl transition-colors cursor-pointer"
                  title="Click to copy"
                >
                  {gameState.roomCode}
                </button>
              </div>
              <p className="text-emerald-400 text-sm font-mono">Turn #{gameState.turnNumber}</p>
            </div>
          </div>
        </motion.div>
        
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
          <EnhancedGameTimer
            duration={180}
            onTimeUp={handleTimeUp}
            isPaused={!hasEnoughPlayers}
          />
        </motion.div>
      </div>

      {/* Main Game Area - YC Demo Layout */}
      <div className="pt-20 pb-2 h-[calc(100vh-5rem)] overflow-hidden">
        <div className="container mx-auto max-w-[1800px] px-6 h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full"
          >
            {/* Board - Center Focus 70% */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8 flex items-center justify-center"
            >
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 rounded-3xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm p-4">
                <CameraController enableParallax={true} enableShake={true}>
                  <IsometricView>
                    <IsometricToggle />
                    <EnhancedMonopolyBoard
                      boardState={gameState.boardState}
                      players={gameState.players}
                      currentPlayer={currentPlayer}
                      onTileClick={(property) => {
                        setLandedProperty(property);
                      }}
                      landedPosition={landedPosition}
                    />
                  </IsometricView>
                </CameraController>

                {!hasEnoughPlayers && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 gap-4 z-30 pointer-events-none">
                    <div className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-8 border-4 border-emerald-400 shadow-2xl pointer-events-auto">
                      <div className="text-3xl">👥</div>
                      <h2 className="text-2xl font-bold text-white font-mono mt-4">Waiting for more players</h2>
                      <p className="text-white/70 font-mono text-sm mt-2">
                        Share room code <span className="text-emerald-400 font-semibold text-lg">{gameState.roomCode}</span> with a friend
                      </p>
                      <p className="text-white/50 text-xs font-mono mt-2">
                        {playersNeeded === 1 ? 'Need 1 more player to start.' : `Need ${playersNeeded} more players to start.`}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Current Action Display in Center */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="pointer-events-auto" id="board-center">
                      <CurrentActionDisplay
                        actionType={actionType}
                        diceResult={diceResult || undefined}
                        property={landedProperty}
                        owner={propertyOwner}
                        rent={rent}
                        onRollDice={handleRollDice}
                        onSolveAndBuy={() => {
                          if (currentProblem) {
                            setShowChallengeModal(true);
                          }
                        }}
                        onSkip={() => {
                          setActionType(null);
                          setLandedProperty(null);
                        }}
                        onPayRent={handlePayRent}
                        onCodeDuel={handleCodeDuel}
                        onUpgrade={handleUpgrade}
                        onContinue={() => {
                          setActionType(null);
                          setLandedProperty(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar - 25% */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 space-y-4 overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 6rem)' }}
            >
              {/* Player Cards - Premium Design */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2 px-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  Players ({gameState.players.length})
                </div>
                {gameState.players.map((player, index) => {
                  const playerProperties = gameState.boardState
                    .filter((p: any) => p.ownerId === player.id)
                    .map((p: any) => ({
                      id: p.id,
                      name: p.name,
                      color: p.color,
                    }));
                  return (
                    <GlassmorphicPlayerCard
                      key={player.id}
                      player={{
                        ...player,
                        properties: player.properties || [],
                      }}
                      isCurrentTurn={player.id === gameState.currentTurn}
                      isYou={player.id === playerId}
                      properties={playerProperties}
                      rank={index + 1}
                      totalPlayers={gameState.players.length}
                    />
                  );
                })}
              </div>
              
              <div className="flex-1 min-h-[300px]">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  Live Activity Feed
                </div>
                <EnhancedLiveFeed 
                  events={gameEvents.map(e => {
                    const player = gameState.players.find((p: any) => p.id === e.player || p.name === e.player);
                    return {
                      id: e.id,
                      type: (e.type === 'info' ? 'special' : e.type) as any,
                      message: e.message,
                      timestamp: e.timestamp,
                      player: e.player || player?.name || 'Player',
                      playerAvatar: player?.avatar,
                    };
                  })}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Dice Roller - Show to all players, but only enable for current player */}
      {(!actionType || actionType === 'awaiting-action') && (
        <div className="fixed bottom-8 right-8 z-20">
          <Enhanced3DDice 
            onRoll={handleRollDice} 
            disabled={!isMyTurn || !hasEnoughPlayers} 
          />
          {!isMyTurn && hasEnoughPlayers && (
            <div className="mt-3 bg-blue-500/20 border border-blue-400 text-blue-200 text-sm font-mono px-4 py-2 rounded-lg text-center">
              {getPlayerNameById(gameState.players, gameState.currentTurn)}'s turn
            </div>
          )}
          {!hasEnoughPlayers && (
            <div className="mt-3 bg-yellow-500/20 border border-yellow-400 text-yellow-200 text-sm font-mono px-4 py-2 rounded-lg">
              Waiting for another player. Share room code <span className="font-semibold">{gameState.roomCode}</span>.
            </div>
          )}
        </div>
      )}

      {/* Particle Effects */}
      <DiceParticles trigger={effects.diceParticles} />
      <ConfettiParticles trigger={effects.confettiParticles} />
      <GoldenRingEffect trigger={effects.goldenRing} />

      {/* Notification Toasts */}
      <NotificationToast 
        notifications={notifications}
        onClose={closeNotification}
      />

      {/* Money Transfer Effects */}
      <MoneyTransferEffect
        transfers={moneyTransfers}
        onComplete={(id) => setMoneyTransfers(transfers => transfers.filter(t => t.id !== id))}
      />

      {/* Floating Money Changes */}
      {floatingChanges.map((change) => (
        <FloatingMoneyChange
          key={change.id}
          amount={change.amount}
          position={change.position}
          onComplete={() => setFloatingChanges(changes => changes.filter(c => c.id !== change.id))}
        />
      ))}

      {/* Property Card Modal */}
      {showPropertyCardModal && landedProperty && (
        <PropertyCardModal
          property={landedProperty}
          owner={landedProperty.ownerId ? gameState?.players.find((p: any) => p.id === landedProperty.ownerId) : null}
          currentPlayerMoney={currentPlayer?.money || 0}
          isOpen={showPropertyCardModal}
          onClose={handlePropertyCardSkip}
          onBuy={handlePropertyCardBuy}
          onSkip={handlePropertyCardSkip}
          onPayRent={actionType === 'landed-opponent' ? handlePayRent : undefined}
        />
      )}

      {/* Code Challenge Modal */}
      {showChallengeModal && currentProblem && landedProperty && (
        <FullCodeChallengeModal
          problem={currentProblem}
          propertyName={landedProperty.name}
          propertyPrice={landedProperty.price}
          onSubmit={handleSolveAndBuy}
          onGiveUp={() => {
            setShowChallengeModal(false);
            setCurrentProblem(null);
            setLandedProperty(null);
            setActionType(null);
          }}
          timeLimit={300}
        />
      )}

      {/* Code Duel Modal */}
      {showDuelModal && currentProblem && gameState.activeDuel && (
        <CodeDuelModal
          problem={currentProblem}
          opponent={gameState.players.find((p: any) => 
            p.id === (gameState.activeDuel.challengerId === playerId 
              ? gameState.activeDuel.defenderId 
              : gameState.activeDuel.challengerId)
          )}
          onWin={handleDuelWin}
          onLose={handleDuelLose}
          onCodeUpdate={handleDuelCodeUpdate}
          opponentCode={duelOpponentCode}
          opponentStatus={duelOpponentStatus}
          timeLimit={300}
        />
      )}

      {/* Debugging Card Modal */}
      {debuggingCard && (
        <DebuggingCardModal
          card={debuggingCard}
          onClose={() => {
            setDebuggingCard(null);
            socket?.emit('get-game-state', { gameId });
          }}
        />
      )}

      {/* Game Over Modal */}
      {showGameOver && winner && (
        <GameOverModal
          players={gameState.players.map((p: any) => ({
            ...p,
            netWorth: calculateNetWorth(p),
          }))}
          winner={{
            ...winner,
            netWorth: calculateNetWorth(winner),
          }}
          onClose={() => navigate('/')}
        />
      )}
    </div>
  );
}
