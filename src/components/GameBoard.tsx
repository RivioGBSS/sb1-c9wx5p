import React from 'react';
import { Word, Team, GameState } from '../types';

interface GameBoardProps {
  words: Word[];
  teams: Record<string, Team>;
  gameState: GameState;
  isSpymaster: boolean;
  playerTeam: string | null;
  onVote: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  words,
  teams,
  gameState,
  isSpymaster,
  playerTeam,
  onVote,
}) => {
  const canVote = gameState.phase === 'voting' && 
                  playerTeam === gameState.currentTeam && 
                  !isSpymaster;

  return (
    <div className="space-y-4">
      {gameState.currentClue && (
        <div className="text-center mb-6">
          <p className="text-xl">
            Current Clue: <span className="font-bold">{gameState.currentClue}</span>
            {" - "}
            <span className="font-bold">{gameState.currentCount}</span>
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
        {words.map((word, index) => (
          <button
            key={index}
            onClick={() => canVote && onVote(index)}
            disabled={word.revealed || !canVote}
            className={`
              aspect-[3/2] p-2 rounded-lg font-medium text-center
              transition-all transform hover:scale-105
              ${
                word.revealed
                  ? `${teams[word.team].color} opacity-90 cursor-default`
                  : isSpymaster
                  ? `${teams[word.team].color} bg-opacity-20 hover:bg-opacity-30`
                  : 'bg-slate-700 hover:bg-slate-600'
              }
              ${word.votes > 0 && !word.revealed ? 'ring-2 ring-yellow-400' : ''}
            `}
          >
            <span className="block text-lg">{word.value}</span>
            {isSpymaster && !word.revealed && (
              <span className="text-xs opacity-50">
                ({teams[word.team].name})
              </span>
            )}
            {word.votes > 0 && !word.revealed && (
              <span className="text-xs mt-1">
                Votes: {word.votes}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};