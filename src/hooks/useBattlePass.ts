import { useState, useCallback } from 'react';
import { BattlePass } from '../types';
import { createBattlePass, addBattlePassXp, generateSeasonalChallenges, getCurrentSeason, upgradeToPremium } from '../services/gamification';

export function useBattlePass(userId: string) {
  const [battlePass, setBattlePass] = useState<BattlePass>(() => createBattlePass(userId));
  const challenges = generateSeasonalChallenges(getCurrentSeason());

  const addXp = useCallback((xp: number) => {
    setBattlePass(prev => {
      const { updatedPass } = addBattlePassXp(prev, xp);
      return updatedPass;
    });
  }, []);

  const upgrade = useCallback(() => {
    setBattlePass(prev => upgradeToPremium(prev));
  }, []);

  return { battlePass, challenges, addXp, upgrade };
}
