import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';

interface CodeDuelProps {
  duel: any;
  problem: any;
  currentPlayerId: string;
  socket: Socket | null;
  gameId: string;
}

export default function CodeDuel({ duel, problem, currentPlayerId, socket, gameId }: CodeDuelProps) {
  const [code, setCode] = useState(problem?.functionSignatures?.javascript || '');
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [opponentCode, setOpponentCode] = useState('');
  const [status, setStatus] = useState<'active' | 'won' | 'lost'>('active');

  const isChallenger = duel.challengerId === currentPlayerId;
  const isDefender = duel.defenderId === currentPlayerId;

  useEffect(() => {
    if (!socket) return;

    socket.on('duel-progress', (data: any) => {
      if (data.playerId !== currentPlayerId) {
        // Opponent's progress
        setOpponentCode(data.code || '');
      }
    });

    socket.on('duel-ended', (data: any) => {
      if (data.winner === currentPlayerId) {
        setStatus('won');
      } else {
        setStatus('lost');
      }
    });

    return () => {
      socket.off('duel-progress');
      socket.off('duel-ended');
    };
  }, [socket, currentPlayerId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (socket && (isChallenger || isDefender)) {
      socket.emit('submit-duel-code', {
        gameId,
        playerId: currentPlayerId,
        code,
        language,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isChallenger && !isDefender) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 max-w-2xl">
          <h2 className="text-white text-2xl font-bold mb-4">⚔️ Code Duel in Progress</h2>
          <p className="text-white/80">A code duel is happening between other players!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-purple-600 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-xl">⚔️ Code Duel</h2>
              <p className="text-white/80 text-sm">{problem?.title}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeRemaining)}
              </div>
              {status !== 'active' && (
                <div className={`text-lg font-bold mt-2 ${status === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                  {status === 'won' ? '🎉 You Won!' : '😔 You Lost'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Split Screen Code Editors */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4 min-h-0">
          {/* Your Code */}
          <div className="flex flex-col">
            <div className="bg-blue-600 p-2 rounded-t-lg">
              <h3 className="text-white font-semibold">Your Code</h3>
            </div>
            <div className="flex-1 border border-gray-700 rounded-b-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: status !== 'active',
                }}
              />
            </div>
            {status === 'active' && (
              <button
                onClick={handleSubmit}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Submit Solution
              </button>
            )}
          </div>

          {/* Opponent's Code (read-only) */}
          <div className="flex flex-col">
            <div className="bg-red-600 p-2 rounded-t-lg">
              <h3 className="text-white font-semibold">Opponent's Code</h3>
            </div>
            <div className="flex-1 border border-gray-700 rounded-b-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={opponentCode || '// Opponent is coding...'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="p-4 bg-gray-800 border-t border-gray-700 max-h-32 overflow-y-auto">
          <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono">
            {problem?.description}
          </pre>
        </div>
      </div>
    </div>
  );
}

