import { useState, useEffect, useCallback } from 'react';
import { BattlePass, Season, SeasonalReward, SeasonalChallenge } from '../types';
import { battlePassSystem } from '../services/gamification/battlePassSystem';
import {
  getCurrentSeason,
  getSeasonDaysRemaining,
  getSeasonWeekNumber,
} from '../services/gamification/seasonManager';
import { generateSeasonRewards } from '../services/gamification/battlePassRewards';

const DEFAULT_USER_ID = 'user_1';

function buildMockChallenges(season: Season): SeasonalChallenge[] {
  const week = getSeasonWeekNumber();
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()));

  return [
    {
      id: `${season.id}_challenge_${week}_1`,
      seasonId: season.id,
      weekNumber: week,
      title: 'Weekly Step Warrior',
      description: 'Walk 50,000 steps this week',
      xpReward: 500,
      targetValue: 50000,
      currentValue: 12400,
      type: 'steps',
      expiresAt: weekEnd.toISOString(),
    },
    {
      id: `${season.id}_challenge_${week}_2`,
      seasonId: season.id,
      weekNumber: week,
      title: 'Hydration Master',
      description: 'Drink 2L of water every day this week',
      xpReward: 350,
      targetValue: 7,
      currentValue: 3,
      type: 'water',
      expiresAt: weekEnd.toISOString(),
    },
    {
      id: `${season.id}_challenge_${week}_3`,
      seasonId: season.id,
      weekNumber: week,
      title: 'Workout Streak',
      description: 'Complete 5 workouts this week',
      xpReward: 750,
      targetValue: 5,
      currentValue: 2,
      type: 'workout',
      expiresAt: weekEnd.toISOString(),
    },
  ];
}

interface UseBattlePassReturn {
  battlePass: BattlePass | null;
  currentSeason: Season;
  seasonRewards: SeasonalReward[];
  seasonChallenges: SeasonalChallenge[];
  daysRemaining: number;
  loading: boolean;
  claimReward: (tier: number) => Promise<void>;
  addSeasonXp: (amount: number) => Promise<void>;
  tierProgress: { currentTier: number; xpToNextTier: number; progressPercent: number };
}

export function useBattlePass(userId: string = DEFAULT_USER_ID): UseBattlePassReturn {
  const [battlePass, setBattlePass] = useState<BattlePass | null>(null);
  const [loading, setLoading] = useState(true);
  const currentSeason = getCurrentSeason();
  const daysRemaining = getSeasonDaysRemaining();

  const loadBattlePass = useCallback(async () => {
    setLoading(true);
    try {
      const bp = await battlePassSystem.getUserBattlePass(userId);
      setBattlePass(bp);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadBattlePass();
  }, [loadBattlePass]);

  const claimReward = useCallback(
    async (tier: number) => {
      await battlePassSystem.claimTierReward(userId, tier);
      const bp = await battlePassSystem.getUserBattlePass(userId);
      setBattlePass({ ...bp });
    },
    [userId],
  );

  const addSeasonXp = useCallback(
    async (amount: number) => {
      await battlePassSystem.addSeasonXp(userId, amount);
      const bp = await battlePassSystem.getUserBattlePass(userId);
      setBattlePass({ ...bp });
    },
    [userId],
  );

  const seasonRewards = generateSeasonRewards(currentSeason.id).map(r => ({
    ...r,
    isClaimed: battlePass?.claimedRewards.includes(r.id) ?? false,
  }));

  const tierProgress = battlePass
    ? battlePassSystem.getTierProgress(battlePass.totalSeasonXp, currentSeason)
    : { currentTier: 0, xpToNextTier: currentSeason.xpPerTier, progressPercent: 0 };

  const seasonChallenges = buildMockChallenges(currentSeason);

  return {
    battlePass,
    currentSeason,
    seasonRewards,
    seasonChallenges,
    daysRemaining,
    loading,
    claimReward,
    addSeasonXp,
    tierProgress,
  };
}
