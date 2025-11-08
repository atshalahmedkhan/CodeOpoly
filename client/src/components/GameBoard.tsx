import { Socket } from 'socket.io-client';

interface GameBoardProps {
  gameState: any;
  currentPlayer: any;
  isMyTurn: boolean;
  onRollDice: () => void;
  onEndTurn: () => void;
  socket: Socket | null;
  gameId: string;
  playerId: string;
}

export default function GameBoard({
  gameState,
  currentPlayer,
  isMyTurn,
  onRollDice,
  onEndTurn,
  socket,
  gameId,
  playerId,
}: GameBoardProps) {
  const getPropertyAtPosition = (position: number) => {
    return gameState.boardState.find((p: any) => p.position === position);
  };

  const handleChallengeDuel = (property: any) => {
    const owner = gameState.players.find((p: any) => p.id === property.ownerId);
    if (socket && owner) {
      socket.emit('challenge-duel', {
        gameId,
        challengerId: playerId,
        defenderId: property.ownerId,
        propertyId: property.id,
      });
    }
  };

  const handlePayRent = (property: any) => {
    // This would be handled by the server
    // For now, just end turn
    onEndTurn();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
      <h2 className="text-white font-bold text-xl mb-4">Game Board</h2>

      {/* Simplified Board Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {gameState.boardState
          .filter((p: any) => p.price > 0)
          .slice(0, 12)
          .map((property: any) => {
            const owner = gameState.players.find((p: any) => p.id === property.ownerId);
            const playersHere = gameState.players.filter(
              (p: any) => p.position === property.position
            );

            return (
              <div
                key={property.id}
                className={`p-3 rounded-lg border-2 ${
                  property.ownerId === playerId
                    ? 'border-green-400 bg-green-500/20'
                    : property.ownerId
                    ? 'border-red-400 bg-red-500/20'
                    : 'border-white/20 bg-white/5'
                }`}
                style={{ backgroundColor: property.color + '40' }}
              >
                <div className="text-white text-xs font-semibold mb-1 truncate">
                  {property.name}
                </div>
                <div className="text-white/80 text-xs">${property.price}</div>
                {owner && (
                  <div className="text-white/60 text-xs mt-1">
                    {owner.avatar} {owner.name}
                  </div>
                )}
                {property.houses > 0 && (
                  <div className="text-yellow-400 text-xs mt-1">
                    {'🏠'.repeat(Math.min(property.houses, 4))}
                  </div>
                )}
                {playersHere.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {playersHere.map((p: any) => (
                      <span key={p.id} className="text-lg">
                        {p.avatar}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Player Position Info */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <h3 className="text-white font-semibold mb-2">Your Position</h3>
        <div className="text-white text-sm">
          Position: {currentPlayer?.position || 0} / 40
          <br />
          Money: ${currentPlayer?.money || 0}
          <br />
          Properties: {currentPlayer?.properties?.length || 0}
        </div>
      </div>

      {/* Game Controls */}
      <div className="mt-4 flex gap-2">
        {isMyTurn && (
          <>
            <button
              onClick={onRollDice}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              Roll Dice 🎲
            </button>
            <button
              onClick={onEndTurn}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              End Turn
            </button>
          </>
        )}
      </div>

      {/* Landed on Property Actions */}
      {currentPlayer && getPropertyAtPosition(currentPlayer.position) && (
        <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
          {(() => {
            const property = getPropertyAtPosition(currentPlayer.position);
            if (!property.ownerId) {
              return (
                <div>
                  <p className="text-white font-semibold mb-2">
                    You landed on {property.name} (${property.price})
                  </p>
                  <p className="text-white/80">Solve a problem to buy it!</p>
                </div>
              );
            } else if (property.ownerId === playerId) {
              return (
                <div>
                  <p className="text-white font-semibold mb-2">
                    You own {property.name}
                  </p>
                  <p className="text-white/80">You can upgrade it on your turn.</p>
                </div>
              );
            } else {
              const owner = gameState.players.find((p: any) => p.id === property.ownerId);
              const rent = property.houses === 0 
                ? property.rent 
                : property.houses === 4 
                ? property.rentWithHotel 
                : property.rentWithHouse[property.houses - 1] || property.rent;
              
              return (
                <div>
                  <p className="text-white font-semibold mb-2">
                    You landed on {property.name} (owned by {owner?.name})
                  </p>
                  <p className="text-white/80 mb-3">Rent: ${rent}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePayRent(property)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Pay Rent
                    </button>
                    <button
                      onClick={() => handleChallengeDuel(property)}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Challenge to Duel! ⚔️
                    </button>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
}

