import React from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface GameControlsProps {
  currentTeam: string;
  isSpymaster: boolean;
  onToggleSpymaster: () => void;
  onNewGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentTeam,
  isSpymaster,
  onToggleSpymaster,
  onNewGame,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <button
          onClick={onToggleSpymaster}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          {isSpymaster ? (
            <>
              <EyeOff className="w-5 h-5" /> Hide Spymaster View
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" /> Spymaster View
            </>
          )}
        </button>
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" /> New Game
        </button>
      </div>
      <div className="text-xl font-semibold">
        Current Team: {currentTeam}
      </div>
    </div>
  );
};