import { Season, BattlePass } from '../../types';

const SEASON_DURATION_WEEKS = 10;
const SEASON_DURATION_MS = SEASON_DURATION_WEEKS * 7 * 24 * 60 * 60 * 1000;

// In-memory store
const userBattlePasses: Map<string, BattlePass> = new Map();

const SEASONS: Season[] = [
  {
    id: 'season_1',
    name: 'Season 1: The Beginning',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-03-11T00:00:00.000Z',
    weekDuration: 10,
    totalTiers: 50,
    xpPerTier: 1000,
    theme: 'dawn',
    isActive: false,
  },
  {
    id: 'season_2',
    name: 'Season 2: Ignite',
    startDate: '2024-03-11T00:00:00.000Z',
    endDate: '2024-05-20T00:00:00.000Z',
    weekDuration: 10,
    totalTiers: 50,
    xpPerTier: 1000,
    theme: 'fire',
    isActive: false,
  },
  {
    id: 'season_3',
    name: 'Season 3: Ascension',
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: '2025-03-12T00:00:00.000Z',
    weekDuration: 10,
    totalTiers: 50,
    xpPerTier: 1000,
    theme: 'cosmic',
    isActive: true,
  },
];

export class BattlePassSystem {
  getCurrentSeason(): Season {
    const now = new Date();
    const active = SEASONS.find(
      s => s.isActive && new Date(s.startDate) <= now && new Date(s.endDate) >= now,
    );
    return active ?? SEASONS[SEASONS.length - 1];
  }

  async getUserBattlePass(userId: string): Promise<BattlePass> {
    const existing = userBattlePasses.get(userId);
    if (existing) return existing;

    const season = this.getCurrentSeason();
    const fresh: BattlePass = {
      userId,
      seasonId: season.id,
      tier: 0,
      totalSeasonXp: 0,
      isPremium: false,
      claimedRewards: [],
      updatedAt: new Date().toISOString(),
    };
    userBattlePasses.set(userId, fresh);
    return fresh;
  }

  async claimTierReward(
    userId: string,
    tier: number,
  ): Promise<import('../../types').SeasonalReward> {
    const bp = await this.getUserBattlePass(userId);
    if (tier > bp.tier) {
      throw new Error(`Tier ${tier} not yet reached`);
    }
    const rewardId = `${bp.seasonId}_tier_${tier}`;
    if (bp.claimedRewards.includes(rewardId)) {
      throw new Error(`Reward for tier ${tier} already claimed`);
    }
    bp.claimedRewards = [...bp.claimedRewards, rewardId];
    bp.updatedAt = new Date().toISOString();
    userBattlePasses.set(userId, bp);

    return {
      id: rewardId,
      seasonId: bp.seasonId,
      tier,
      track: tier % 2 === 0 ? 'premium' : 'free',
      type: 'badge',
      name: `Tier ${tier} Reward`,
      description: `You earned the tier ${tier} reward!`,
      icon: tier >= 40 ? '🌟' : tier >= 20 ? '⭐' : '🎁',
      isClaimed: true,
    };
  }

  async addSeasonXp(userId: string, amount: number): Promise<void> {
    const bp = await this.getUserBattlePass(userId);
    bp.totalSeasonXp += amount;
    const season = this.getCurrentSeason();
    bp.tier = Math.min(
      season.totalTiers,
      Math.floor(bp.totalSeasonXp / season.xpPerTier),
    );
    bp.updatedAt = new Date().toISOString();
    userBattlePasses.set(userId, bp);
  }

  getTierProgress(totalSeasonXp: number, season?: Season): {
    currentTier: number;
    xpToNextTier: number;
    progressPercent: number;
  } {
    const s = season ?? this.getCurrentSeason();
    const currentTier = Math.min(s.totalTiers, Math.floor(totalSeasonXp / s.xpPerTier));
    const xpIntoCurrentTier = totalSeasonXp % s.xpPerTier;
    const xpToNextTier = currentTier >= s.totalTiers ? 0 : s.xpPerTier - xpIntoCurrentTier;
    const progressPercent =
      currentTier >= s.totalTiers ? 100 : (xpIntoCurrentTier / s.xpPerTier) * 100;
    return { currentTier, xpToNextTier, progressPercent };
  }
}

export const battlePassSystem = new BattlePassSystem();
