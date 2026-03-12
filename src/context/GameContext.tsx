import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserLevel, Quest, XpTransaction } from '../types';
import { createUserLevel, addXp as addXpToLevel } from '../services/gamification';

interface GameContextValue {
  userLevel: UserLevel;
  quests: Quest[];
  addXp: (amount: number, source: string, description: string) => { leveledUp: boolean };
  setQuests: (quests: Quest[]) => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameificationProvider({ children, userId }: { children: ReactNode; userId: string }) {
  const [userLevel, setUserLevel] = useState<UserLevel>(() => createUserLevel(userId));
  const [quests, setQuests] = useState<Quest[]>([]);

  const addXp = (amount: number, source: string, description: string) => {
    const validSource = (['quest', 'achievement', 'streak', 'challenge', 'manual'].includes(source)
      ? source
      : 'manual') as XpTransaction['source'];
    const { updatedLevel, leveledUp } = addXpToLevel(userLevel, amount, validSource, description);
    setUserLevel(updatedLevel);
    return { leveledUp };
  };

  return (
    <GameContext.Provider value={{ userLevel, quests, addXp, setQuests }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameificationProvider');
  return ctx;
}
