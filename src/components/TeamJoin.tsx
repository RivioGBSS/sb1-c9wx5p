import React from 'react';
import { Team } from '../types';

interface TeamJoinProps {
  teams: Record<string, Team>;
  onJoinTeam: (team: string, asSpymaster: boolean) => void;
}

export const TeamJoin: React.FC<TeamJoinProps> = ({ teams, onJoinTeam }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-slate-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Join a Team</h2>
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(teams).map(([teamId, team]) => (
          teamId !== 'neutral' && teamId !== 'assassin' && (
            <div key={teamId} className="space-y-4">
              <h3 className="text-xl font-semibold">{team.name} Team</h3>
              <div className="space-y-2">
                <button
                  onClick={() => onJoinTeam(teamId, false)}
                  className={`w-full px-4 py-2 ${team.color} bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-colors`}
                >
                  Join as Player
                </button>
                {!team.spymaster && (
                  <button
                    onClick={() => onJoinTeam(teamId, true)}
                    className={`w-full px-4 py-2 ${team.color} bg-opacity-50 hover:bg-opacity-70 rounded-lg transition-colors`}
                  >
                    Join as Spymaster
                  </button>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};