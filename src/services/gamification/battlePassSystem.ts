// Battle Pass system – core logic
import { BattlePass, SeasonalReward } from '../../types';
import { SEASONAL_REWARDS } from './battlePassRewards';

function generateId(): string {
  return `bp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const BATTLE_PASS_XP_PER_LEVEL = 500;
export const BATTLE_PASS_LEVELS = 50;
export const SEASON_DURATION_WEEKS = 10;

export function getCurrentSeasonNumber(): number {
  const epoch = new Date('2024-01-01').getTime();
  const now = Date.now();
  const weeksElapsed = Math.floor((now - epoch) / (7 * 24 * 60 * 60 * 1000));
  return Math.floor(weeksElapsed / SEASON_DURATION_WEEKS) + 1;
}

export function getSeasonDates(seasonNumber: number): { start: string; end: string } {
  const epochMs = new Date('2024-01-01').getTime();
  const seasonOffsetWeeks = (seasonNumber - 1) * SEASON_DURATION_WEEKS;
  const startMs = epochMs + seasonOffsetWeeks * 7 * 24 * 60 * 60 * 1000;
  const endMs = startMs + SEASON_DURATION_WEEKS * 7 * 24 * 60 * 60 * 1000;
  return {
    start: new Date(startMs).toISOString().split('T')[0],
    end: new Date(endMs).toISOString().split('T')[0],
  };
}

export function createBattlePass(userId: string, track: 'free' | 'premium'): BattlePass {
  const seasonNumber = getCurrentSeasonNumber();
  const { start, end } = getSeasonDates(seasonNumber);
  return {
    id: generateId(),
    userId,
    seasonNumber,
    level: 0,
    xp: 0,
    track,
    rewardsClaimed: [],
    startDate: start,
    endDate: end,
  };
}

export function addBattlePassXp(
  battlePass: BattlePass,
  xpAmount: number
): { updated: BattlePass; leveledUp: boolean; newLevel: number } {
  const newXp = battlePass.xp + xpAmount;
  const newLevel = Math.min(
    BATTLE_PASS_LEVELS,
    Math.floor(newXp / BATTLE_PASS_XP_PER_LEVEL)
  );
  const leveledUp = newLevel > battlePass.level;
  return {
    updated: { ...battlePass, xp: newXp, level: newLevel },
    leveledUp,
    newLevel,
  };
}

export function getAvailableRewards(
  battlePass: BattlePass
): SeasonalReward[] {
  return SEASONAL_REWARDS.filter(
    (r) =>
      r.seasonNumber === battlePass.seasonNumber &&
      r.level <= battlePass.level &&
      !battlePass.rewardsClaimed.includes(r.id) &&
      (r.trackRequired === 'both' || r.trackRequired === battlePass.track)
  );
}

export function claimReward(
  battlePass: BattlePass,
  rewardId: string
): BattlePass {
  if (battlePass.rewardsClaimed.includes(rewardId)) return battlePass;
  return {
    ...battlePass,
    rewardsClaimed: [...battlePass.rewardsClaimed, rewardId],
  };
}
