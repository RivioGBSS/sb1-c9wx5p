import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsProps {
  settings: GameSettings;
  onUpdate: (settings: GameSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="relative group">
      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
        <SettingsIcon className="w-6 h-6" />
      </button>
      
      <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Game Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Timer Duration (seconds)</label>
              <input
                type="number"
                value={settings.timerDuration}
                onChange={(e) => onUpdate({ ...settings, timerDuration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                min="30"
                max="300"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.traitorMode}
                  onChange={(e) => onUpdate({ ...settings, traitorMode: e.target.checked })}
                  className="rounded"
                />
                <span>Traitor Mode</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};