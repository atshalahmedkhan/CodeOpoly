import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import axios from 'axios';
import Auth from '../components/Auth';
// import { LoadingOverlay } from '../components/LoadingSpinner'; // Available if needed

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Lobby() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setPlayerName(user.displayName || user.email?.split('@')[0] || 'Player');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      const response = await axios.post(`${API_URL}/games/create`, {
        playerName,
        avatar: '💻',
      });

      const { gameId, roomCode, playerId } = response.data;
      navigate(`/game/${gameId}`, { state: { roomCode, playerId, playerName } });
    } catch (error: any) {
      console.error('Error creating game:', error);
      alert(error.response?.data?.error || 'Failed to create game');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      alert('Please enter your name and room code');
      return;
    }

    setIsJoining(true);
    try {
      const response = await axios.post(`${API_URL}/games/join`, {
        roomCode: roomCode.toUpperCase(),
        playerName,
        avatar: '💻',
      });

      const { gameId, playerId } = response.data;
      navigate(`/game/${gameId}`, { state: { roomCode: roomCode.toUpperCase(), playerId, playerName } });
    } catch (error: any) {
      console.error('Error joining game:', error);
      alert(error.response?.data?.error || 'Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20"
          style={{
            boxShadow: '0 0 40px rgba(147, 51, 234, 0.3), inset 0 0 40px rgba(59, 130, 246, 0.2)',
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🎮 CodeOpoly
            </h1>
            <p className="text-xl text-white/80">Competitive Coding Meets Monopoly</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setUser({ displayName: 'Guest', email: 'guest@codeopoly.com' } as User)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)',
              }}
            >
              🎮 Play as Guest
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">or sign in (optional)</span>
              </div>
            </div>

            <Auth onAuthSuccess={(user) => setUser(user)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20"
        style={{
          boxShadow: '0 0 40px rgba(147, 51, 234, 0.3), inset 0 0 40px rgba(59, 130, 246, 0.2)',
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎮 CodeOpoly
          </h1>
          <p className="text-xl text-white/80">Competitive Coding Meets Monopoly</p>
          <div className="mt-2 text-sm text-white/60">
            Signed in as: <span className="font-semibold">{user.displayName || user.email}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white/90 mb-2 font-semibold">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateGame()}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCreateGame}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              style={{
                boxShadow: isCreating ? 'none' : '0 0 20px rgba(147, 51, 234, 0.5)',
              }}
            >
              {isCreating ? 'Creating...' : 'Create New Game'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">or</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter Room Code (e.g., ABCD)"
                maxLength={4}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3 uppercase transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
              />
              <button
                onClick={handleJoinGame}
                disabled={isJoining}
                className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all border border-white/30"
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-white/60 text-sm text-center">
            🎯 Solve LeetCode problems to buy properties<br />
            ⚔️ Challenge opponents to code duels<br />
            🏆 Win by having the most net worth
          </p>
        </div>
      </div>
    </div>
  );
}
