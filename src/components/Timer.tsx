import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, isActive }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`flex items-center gap-2 ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
      <Clock className="w-5 h-5" />
      <span className="font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};