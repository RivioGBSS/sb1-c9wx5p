import { useState, useEffect, useCallback } from 'react';
import { Word, Team, GameSettings, Player, GameState } from '../types';
import { WORD_LIST } from '../data/words';

const INITIAL_SETTINGS: GameSettings = {
  timerDuration: 120,
  minVotesToReveal: 2,
};

const TEAMS: Record<string, Team> = {
  red: {
    name: 'Red',
    color: 'bg-red-500',
    wordCount: 8,
    spymaster: null,
    players: [],
  },
  blue: {
    name: 'Blue',
    color: 'bg-blue-500',
    wordCount: 8,
    spymaster: null,
    players: [],
  },
  neutral: {
    name: 'Neutral',
    color: 'bg-gray-500',
    wordCount: 7,
    spymaster: null,
    players: [],
  },
  assassin: {
    name: 'Assassin',
    color: 'bg-black',
    wordCount: 1,
    spymaster: null,
    players: [],
  },
};

export const useGame = (playerId: string) => {
  const [words, setWords] = useState<Word[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    status: 'setup',
    currentTeam: 'red',
    phase: 'spymaster',
    currentClue: '',
    currentCount: 0,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_SETTINGS.timerDuration);
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);

  const currentPlayer = players.find(p => p.id === playerId);
  const isSpymaster = currentPlayer?.isSpymaster || false;
  const playerTeam = currentPlayer?.team || null;

  const generateWords = useCallback(() => {
    const shuffledWords = [...WORD_LIST].sort(() => Math.random() - 0.5);
    const assignedWords: Word[] = [];
    let wordIndex = 0;

    Object.entries(TEAMS).forEach(([teamId, team]) => {
      for (let i = 0; i < team.wordCount; i++) {
        assignedWords.push({
          value: shuffledWords[wordIndex],
          team: teamId,
          revealed: false,
          votes: 0,
        });
        wordIndex++;
      }
    });

    return assignedWords.sort(() => Math.random() - 0.5);
  }, []);

  const joinTeam = useCallback((team: string, asSpymaster: boolean = false) => {
    setPlayers(prev => {
      const newPlayers = prev.filter(p => p.id !== playerId);
      return [...newPlayers, {
        id: playerId,
        name: `Player ${playerId}`,
        team,
        isSpymaster: asSpymaster,
        hasVoted: false,
      }];
    });
  }, [playerId]);

  const handleVote = useCallback((index: number) => {
    if (!playerTeam || gameState.phase !== 'voting' || 
        playerTeam !== gameState.currentTeam || 
        words[index].revealed) return;

    setPlayers(prev => 
      prev.map(p => p.id === playerId ? { ...p, hasVoted: true } : p)
    );

    setWords(prev => {
      const newWords = [...prev];
      newWords[index] = { 
        ...newWords[index], 
        votes: newWords[index].votes + 1 
      };

      // Check if enough votes to reveal
      if (newWords[index].votes >= settings.minVotesToReveal) {
        newWords[index].revealed = true;
        
        if (newWords[index].team === 'assassin') {
          setGameState(prev => ({
            ...prev,
            status: 'finished',
            currentTeam: prev.currentTeam === 'red' ? 'blue' : 'red',
          }));
        } else if (newWords[index].team !== gameState.currentTeam) {
          setGameState(prev => ({
            ...prev,
            currentTeam: prev.currentTeam === 'red' ? 'blue' : 'red',
            phase: 'spymaster',
          }));
        }

        // Reset votes for next round
        newWords.forEach(w => w.votes = 0);
        setPlayers(prev => 
          prev.map(p => ({ ...p, hasVoted: false }))
        );
      }

      return newWords;
    });
  }, [playerId, playerTeam, gameState, settings.minVotesToReveal, words]);

  const handleClueSubmit = useCallback((clue: string, count: number) => {
    if (!isSpymaster || gameState.phase !== 'spymaster') return;

    setGameState(prev => ({
      ...prev,
      phase: 'voting',
      currentClue: clue,
      currentCount: count,
    }));
    setTimeLeft(settings.timerDuration);
  }, [isSpymaster, gameState.phase, settings.timerDuration]);

  const handleEndTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTeam: prev.currentTeam === 'red' ? 'blue' : 'red',
      phase: 'spymaster',
      currentClue: '',
      currentCount: 0,
    }));
    setTimeLeft(settings.timerDuration);
    setWords(prev => prev.map(w => ({ ...w, votes: 0 })));
    setPlayers(prev => prev.map(p => ({ ...p, hasVoted: false })));
  }, [settings.timerDuration]);

  const startNewGame = useCallback(() => {
    setWords(generateWords());
    setGameState({
      status: 'playing',
      currentTeam: 'red',
      phase: 'spymaster',
      currentClue: '',
      currentCount: 0,
    });
    setTimeLeft(settings.timerDuration);
    setPlayers(prev => prev.map(p => ({ ...p, hasVoted: false })));
  }, [generateWords, settings.timerDuration]);

  useEffect(() => {
    if (gameState.status === 'setup') {
      startNewGame();
    }
  }, [gameState.status, startNewGame]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.status === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleEndTurn();
            return settings.timerDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.status, timeLeft, settings.timerDuration, handleEndTurn]);

  return {
    gameState,
    words,
    teams: TEAMS,
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
    updateSettings: setSettings,
    startNewGame,
  };
};