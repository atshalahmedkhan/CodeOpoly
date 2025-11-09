import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign } from 'lucide-react';
import Confetti from 'react-confetti';

interface Player {
  id: string;
  name: string;
  avatar: string;
  money: number;
  properties: any[];
  netWorth: number;
}

interface GameOverModalProps {
  players: Player[];
  winner: Player;
  onClose: () => void;
}

export default function GameOverModal({ players, winner, onClose }: GameOverModalProps) {
  const sortedPlayers = [...players].sort((a, b) => b.netWorth - a.netWorth);

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border-4 border-yellow-500"
          style={{
            boxShadow: '0 0 60px rgba(234, 179, 8, 0.5)',
          }}
        >
          {/* Winner Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-8 rounded-t-xl text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h1 className="text-4xl font-bold text-white font-mono mb-2">GAME OVER</h1>
            <h2 className="text-2xl font-bold text-white font-mono">
              {winner.name} Wins!
            </h2>
          </div>

          {/* Leaderboard */}
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Final Rankings
            </h3>
            
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  index === 0
                    ? 'bg-yellow-900/30 border-yellow-500'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-white/60 font-mono w-8">
                      #{index + 1}
                    </div>
                    <div className="text-3xl">{player.avatar}</div>
                    <div>
                      <div className="text-lg font-bold text-white font-mono">
                        {player.name}
                      </div>
                      <div className="text-sm text-white/60 font-mono">
                        {player.properties.length} properties
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400 font-mono">
                      ${player.netWorth.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/60 font-mono">Net Worth</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="p-6 bg-slate-800/30 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  ${winner.money.toLocaleString()}
                </div>
                <div className="text-xs text-white/60 font-mono">Cash</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 font-mono">
                  {winner.properties.length}
                </div>
                <div className="text-xs text-white/60 font-mono">Properties</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 font-mono">
                  ${winner.netWorth.toLocaleString()}
                </div>
                <div className="text-xs text-white/60 font-mono">Total Worth</div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="p-6">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all font-mono"
            >
              Return to Lobby
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

