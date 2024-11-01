export interface Word {
  value: string;
  team: string;
  revealed: boolean;
  votes: number;
}

export interface Team {
  name: string;
  color: string;
  wordCount: number;
  spymaster: string | null;
  players: string[];
}

export interface Player {
  id: string;
  name: string;
  team: string | null;
  isSpymaster: boolean;
  hasVoted: boolean;
}

export interface GameSettings {
  timerDuration: number;
  minVotesToReveal: number;
}

export interface GameState {
  status: 'setup' | 'playing' | 'finished';
  currentTeam: string;
  phase: 'spymaster' | 'voting';
  currentClue: string;
  currentCount: number;
}