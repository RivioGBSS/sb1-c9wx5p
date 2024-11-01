import React, { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { ClueInput } from './components/ClueInput';
import { GameControls } from './components/GameControls';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { TeamJoin } from './components/TeamJoin';
import { Shield } from 'lucide-react';

function App() {
  const [playerId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  const {
    gameState,
    words,
    teams,
    players,
    currentPlayer,
    isSpymaster,
    playerTeam,
    timeLeft,
    settings,
    handleVote,
    handleClueSubmit,
    handleEndTurn,
    joinTeam,
    updateSettings,
    startNewGame,
  } = useGame(playerId);

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <header className="p-4 border-b border-slate-700">
          <div className="container mx-auto flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Codenames</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <TeamJoin teams={teams} onJoinTeam={joinTeam} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="p-4 border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Codenames</h1>
          </div>
          <div className="flex gap-4">
            <Timer timeLeft={timeLeft} isActive={gameState.status === 'playing'} />
            <Settings settings={settings} onUpdate={updateSettings} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <GameControls
            currentTeam={gameState.currentTeam}
            phase={gameState.phase}
            onNewGame={startNewGame}
          />
        </div>

        {gameState.status === 'playing' && (
          <>
            {isSpymaster && gameState.phase === 'spymaster' && (
              <ClueInput
                currentTeam={gameState.currentTeam}
                onSubmitClue={handleClueSubmit}
              />
            )}
            <GameBoard
              words={words}
              teams={teams}
              gameState={gameState}
              isSpymaster={isSpymaster}
              playerTeam={playerTeam}
              onVote={handleVote}
            />
            {playerTeam === gameState.currentTeam && (
              <button
                onClick={handleEndTurn}
                className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                End Turn
              </button>
            )}
          </>
        )}

        {gameState.status === 'finished' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              {teams[gameState.currentTeam].name} Team Wins!
            </h2>
            <button
              onClick={startNewGame}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Start New Game
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;