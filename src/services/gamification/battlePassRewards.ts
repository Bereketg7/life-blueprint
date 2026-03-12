import { SeasonalReward } from '../../types';

type RewardType = SeasonalReward['type'];

interface RewardTemplate {
  tier: number;
  track: 'free' | 'premium';
  type: RewardType;
  name: string;
  description: string;
  icon: string;
}

function buildTemplate(
  tier: number,
  track: 'free' | 'premium',
  type: RewardType,
  name: string,
  desc: string,
  icon: string,
): RewardTemplate {
  return { tier, track, type, name, description: desc, icon };
}

const FREE_REWARD_PATTERNS: Array<[RewardType, string, string, string]> = [
  ['coin_bundle',  'Coin Cache',       '50 bonus coins',                '🪙'],
  ['xp_boost',     'XP Surge',         '1.25x XP for 24 hours',        '⚡'],
  ['badge',        'Season Badge',     'Exclusive season badge',        '🏅'],
  ['coin_bundle',  'Coin Chest',       '100 bonus coins',               '💰'],
  ['xp_boost',     'Double XP',        '2x XP for 12 hours',           '🚀'],
];

const PREMIUM_REWARD_PATTERNS: Array<[RewardType, string, string, string]> = [
  ['theme',        'Neon Theme',       'Unlock the neon color theme',   '🎨'],
  ['avatar_frame', 'Gold Frame',       'Exclusive golden avatar frame', '🖼️'],
  ['title',        'Elite Title',      'Display "Elite" on profile',    '👑'],
  ['xp_boost',     'Mega XP Surge',    '3x XP for 24 hours',           '💥'],
  ['badge',        'Prestige Badge',   'Limited season prestige badge', '🌟'],
  ['coin_bundle',  'Legendary Vault',  '500 bonus coins',               '🏆'],
];

export function generateSeasonRewards(seasonId: string): SeasonalReward[] {
  const rewards: SeasonalReward[] = [];
  for (let tier = 1; tier <= 50; tier++) {
    const freePattern = FREE_REWARD_PATTERNS[(tier - 1) % FREE_REWARD_PATTERNS.length];
    rewards.push({
      id: `${seasonId}_free_${tier}`,
      seasonId,
      tier,
      track: 'free',
      type: freePattern[0],
      name: `${freePattern[1]} (T${tier})`,
      description: freePattern[2],
      icon: freePattern[3],
      isClaimed: false,
    });

    const premiumPattern = PREMIUM_REWARD_PATTERNS[(tier - 1) % PREMIUM_REWARD_PATTERNS.length];
    rewards.push({
      id: `${seasonId}_premium_${tier}`,
      seasonId,
      tier,
      track: 'premium',
      type: premiumPattern[0],
      name: `${premiumPattern[1]} (T${tier})`,
      description: premiumPattern[2],
      icon: premiumPattern[3],
      isClaimed: false,
    });
  }
  return rewards;
}

export function getFreeTrackRewards(seasonId: string): SeasonalReward[] {
  return generateSeasonRewards(seasonId).filter(r => r.track === 'free');
}

export function getPremiumTrackRewards(seasonId: string): SeasonalReward[] {
  return generateSeasonRewards(seasonId).filter(r => r.track === 'premium');
}

export function getRewardsByTier(
  seasonId: string,
  tier: number,
): SeasonalReward[] {
  return generateSeasonRewards(seasonId).filter(r => r.tier === tier);
}
