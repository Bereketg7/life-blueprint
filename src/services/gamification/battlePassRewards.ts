// Battle Pass rewards catalogue
import { SeasonalReward } from '../../types';

export const SEASONAL_REWARDS: SeasonalReward[] = [
  // Season 1 – Free track
  { id: 'S1_L5_FREE', seasonNumber: 1, level: 5, type: 'badge', reward: 'starter_badge', trackRequired: 'both' },
  { id: 'S1_L10_FREE', seasonNumber: 1, level: 10, type: 'coins', reward: '100_coins', trackRequired: 'both' },
  { id: 'S1_L20_FREE', seasonNumber: 1, level: 20, type: 'badge', reward: 'consistency_badge', trackRequired: 'both' },
  { id: 'S1_L30_FREE', seasonNumber: 1, level: 30, type: 'title', reward: 'Season Veteran', trackRequired: 'both' },
  { id: 'S1_L50_FREE', seasonNumber: 1, level: 50, type: 'badge', reward: 'season_finisher_badge', trackRequired: 'both' },

  // Season 1 – Premium track
  { id: 'S1_L5_PREM', seasonNumber: 1, level: 5, type: 'cosmetic', reward: 'gold_profile_frame', trackRequired: 'premium' },
  { id: 'S1_L10_PREM', seasonNumber: 1, level: 10, type: 'coins', reward: '250_coins', trackRequired: 'premium' },
  { id: 'S1_L15_PREM', seasonNumber: 1, level: 15, type: 'cosmetic', reward: 'flame_avatar_border', trackRequired: 'premium' },
  { id: 'S1_L25_PREM', seasonNumber: 1, level: 25, type: 'badge', reward: 'elite_badge', trackRequired: 'premium' },
  { id: 'S1_L40_PREM', seasonNumber: 1, level: 40, type: 'title', reward: 'Elite Challenger', trackRequired: 'premium' },
  { id: 'S1_L50_PREM', seasonNumber: 1, level: 50, type: 'cosmetic', reward: 'legendary_profile_theme', trackRequired: 'premium' },
];

export function getRewardsForSeason(
  seasonNumber: number,
  track: 'free' | 'premium' | 'both'
): SeasonalReward[] {
  return SEASONAL_REWARDS.filter(
    (r) =>
      r.seasonNumber === seasonNumber &&
      (track === 'both' || r.trackRequired === 'both' || r.trackRequired === track)
  );
}

export function getRewardByLevel(
  seasonNumber: number,
  level: number
): SeasonalReward | null {
  return (
    SEASONAL_REWARDS.find((r) => r.seasonNumber === seasonNumber && r.level === level) ?? null
  );
}
