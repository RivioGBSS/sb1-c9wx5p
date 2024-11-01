import React, { useState } from 'react';
import { Team } from '../types';

interface ClueInputProps {
  isSpymaster: boolean;
  currentTeam: string;
  onSubmitClue: (clue: string, count: number) => void;
}

export const ClueInput: React.FC<ClueInputProps> = ({
  isSpymaster,
  currentTeam,
  onSubmitClue,
}) => {
  const [clue, setClue] = useState('');
  const [count, setCount] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clue.trim() && count > 0) {
      onSubmitClue(clue.trim(), count);
      setClue('');
      setCount(1);
    }
  };

  if (!isSpymaster) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 max-w-2xl mx-auto">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-2">Clue Word</label>
          <input
            type="text"
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your clue..."
          />
        </div>
        <div className="w-24">
          <label className="block text-sm mb-2">Count</label>
          <input
            type="number"
            min="0"
            max="9"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Give Clue
        </button>
      </div>
    </form>
  );
};