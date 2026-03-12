import { useState, useCallback } from 'react';
import { BattlePass } from '../types';
import {
  createBattlePass,
  addBattlePassXp,
  getAvailableRewards,
  claimReward,
} from '../services/gamification/battlePassSystem';
import { getCurrentSeason, getDaysRemaining, getSeasonProgress } from '../services/gamification/seasonManager';

export function useBattlePass(userId: string) {
  const [battlePass, setBattlePass] = useState<BattlePass | null>(null);

  const activateBattlePass = useCallback(
    (track: 'free' | 'premium') => {
      const bp = createBattlePass(userId, track);
      setBattlePass(bp);
      return bp;
    },
    [userId]
  );

  const earnXp = useCallback(
    (amount: number) => {
      if (!battlePass) return;
      const { updated, leveledUp, newLevel } = addBattlePassXp(battlePass, amount);
      setBattlePass(updated);
      return { leveledUp, newLevel };
    },
    [battlePass]
  );

  const claimAvailableReward = useCallback(
    (rewardId: string) => {
      if (!battlePass) return;
      setBattlePass(claimReward(battlePass, rewardId));
    },
    [battlePass]
  );

  const availableRewards = battlePass ? getAvailableRewards(battlePass) : [];
  const currentSeason = getCurrentSeason();
  const daysRemaining = getDaysRemaining();
  const seasonProgress = getSeasonProgress();

  return {
    battlePass,
    currentSeason,
    daysRemaining,
    seasonProgress,
    availableRewards,
    activateBattlePass,
    earnXp,
    claimReward: claimAvailableReward,
  };
}
