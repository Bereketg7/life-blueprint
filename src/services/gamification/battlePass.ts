import { BattlePass, SeasonalReward, SeasonalChallenge } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const SEASON_DURATION_WEEKS = 10;
const TIERS_PER_SEASON = 50;
const XP_PER_TIER = 500;

// Get current season number (weeks since a fixed epoch)
const EPOCH = new Date('2024-01-01').getTime();
export function getCurrentSeason(): number {
  const weeksElapsed = (Date.now() - EPOCH) / (7 * 24 * 60 * 60 * 1000);
  return Math.floor(weeksElapsed / SEASON_DURATION_WEEKS) + 1;
}

export function getSeasonEndDate(season: number): string {
  const endMs = EPOCH + season * SEASON_DURATION_WEEKS * 7 * 24 * 60 * 60 * 1000;
  return new Date(endMs).toISOString();
}

// 100 auto-generated seasonal rewards (50 free + 50 premium)
export function generateSeasonRewards(season: number): SeasonalReward[] {
  const rewardTypes: SeasonalReward['type'][] = [
    'xp_boost', 'badge', 'title', 'avatar_frame', 'coin_bundle',
  ];
  const rewards: SeasonalReward[] = [];

  for (let tier = 1; tier <= TIERS_PER_SEASON; tier++) {
    const freeType = rewardTypes[tier % rewardTypes.length];
    rewards.push({
      id: generateId(),
      name: `Season ${season} - Tier ${tier} Free Reward`,
      type: freeType,
      icon: getRewardIcon(freeType),
      tier,
      isPremium: false,
    });

    const premiumType = rewardTypes[(tier + 2) % rewardTypes.length];
    rewards.push({
      id: generateId(),
      name: `Season ${season} - Tier ${tier} Premium Reward`,
      type: premiumType,
      icon: getRewardIcon(premiumType),
      tier,
      isPremium: true,
    });
  }

  return rewards;
}

function getRewardIcon(type: SeasonalReward['type']): string {
  const icons: Record<SeasonalReward['type'], string> = {
    xp_boost: '⚡',
    badge: '🏅',
    title: '👑',
    avatar_frame: '🖼️',
    coin_bundle: '💰',
  };
  return icons[type];
}

export function createBattlePass(userId: string): BattlePass {
  const season = getCurrentSeason();
  return {
    id: generateId(),
    userId,
    season,
    tier: 0,
    progress: 0,
    isPremium: false,
    rewards: generateSeasonRewards(season),
    createdAt: new Date().toISOString(),
  };
}

export function addBattlePassXp(
  battlePass: BattlePass,
  xp: number,
): { updatedPass: BattlePass; newTiersUnlocked: number; unlockedRewards: SeasonalReward[] } {
  let newProgress = battlePass.progress + xp;
  let newTier = battlePass.tier;
  let newTiersUnlocked = 0;
  const unlockedRewards: SeasonalReward[] = [];

  while (newProgress >= XP_PER_TIER && newTier < TIERS_PER_SEASON) {
    newProgress -= XP_PER_TIER;
    newTier++;
    newTiersUnlocked++;

    // Unlock rewards for this tier
    const tierRewards = battlePass.rewards.filter(r =>
      r.tier === newTier && (!r.isPremium || battlePass.isPremium),
    );
    for (const reward of tierRewards) {
      unlockedRewards.push({ ...reward, unlockedAt: new Date().toISOString() });
    }
  }

  const updatedPass: BattlePass = {
    ...battlePass,
    tier: newTier,
    progress: newProgress,
    rewards: battlePass.rewards.map(r => {
      const unlocked = unlockedRewards.find(ur => ur.id === r.id);
      return unlocked ? { ...r, unlockedAt: unlocked.unlockedAt } : r;
    }),
  };

  return { updatedPass, newTiersUnlocked, unlockedRewards };
}

// Generate seasonal weekly challenges
export function generateSeasonalChallenges(season: number): SeasonalChallenge[] {
  const seasonEnd = new Date(getSeasonEndDate(season));
  const daysRemaining = Math.max(0, Math.floor((seasonEnd.getTime() - Date.now()) / 86400000));

  return [
    {
      id: generateId(),
      title: 'Marathon Month',
      description: 'Log 100km of running this season',
      target: 100,
      current: 0,
      reward: { xp: 1000, coins: 200, badge: 'marathon_badge' },
      daysRemaining,
      season,
    },
    {
      id: generateId(),
      title: 'Clean Eating Champion',
      description: 'Log nutrition for 50 days this season',
      target: 50,
      current: 0,
      reward: { xp: 800, coins: 150 },
      daysRemaining,
      season,
    },
    {
      id: generateId(),
      title: 'Sleep Optimizer',
      description: 'Achieve 7+ hours sleep for 30 nights',
      target: 30,
      current: 0,
      reward: { xp: 600, coins: 120, badge: 'sleep_champion' },
      daysRemaining,
      season,
    },
    {
      id: generateId(),
      title: 'Consistency King',
      description: 'Maintain a 21-day activity streak',
      target: 21,
      current: 0,
      reward: { xp: 1200, coins: 250, badge: 'consistency_king' },
      daysRemaining,
      season,
    },
  ];
}

export function upgradeToPremium(battlePass: BattlePass): BattlePass {
  return { ...battlePass, isPremium: true };
}
