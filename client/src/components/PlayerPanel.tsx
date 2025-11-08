interface PlayerPanelProps {
  players: any[];
  currentPlayerId: string;
}

export default function PlayerPanel({ players, currentPlayerId }: PlayerPanelProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
      <h2 className="text-white font-bold text-lg mb-4">Players</h2>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg border-2 ${
              player.id === currentPlayerId
                ? 'border-blue-400 bg-blue-500/20'
                : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{player.avatar}</span>
                <span className="text-white font-semibold">{player.name}</span>
                {player.id === currentPlayerId && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">You</span>
                )}
              </div>
            </div>
            <div className="text-white/80 text-sm space-y-1">
              <div>💰 ${player.money}</div>
              <div>🏠 {player.properties?.length || 0} properties</div>
              <div>📍 Position: {player.position}</div>
              {player.inJail && (
                <div className="text-red-400">🔒 In Jail ({player.jailTurns} turns)</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

