import { Quest, QuestReward } from '../../types';

// In-memory store for coins and rewards
const userCoins: Map<string, number> = new Map();
const userStreaks: Map<string, number> = new Map();
const distributedRewards: Map<string, QuestReward[]> = new Map();

const DIFFICULTY_XP_MULTIPLIERS: Record<string, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  legendary: 3.5,
};

const DIFFICULTY_COIN_MULTIPLIERS: Record<string, number> = {
  easy: 1.0,
  medium: 1.25,
  hard: 1.75,
  legendary: 3.0,
};

export function calculateReward(quest: Quest): QuestReward {
  const diffXpMult = DIFFICULTY_XP_MULTIPLIERS[quest.difficulty] ?? 1;
  const streakMult = 1; // default; use getStreakBonus in distributeReward
  const xpAwarded = Math.round(quest.xpReward * diffXpMult * streakMult);
  const coinsAwarded = Math.round(
    quest.coinReward * (DIFFICULTY_COIN_MULTIPLIERS[quest.difficulty] ?? 1),
  );

  const messages: Record<string, string> = {
    easy: '✅ Quest Complete! Keep building those habits!',
    medium: '🎯 Solid Work! You\'re leveling up fast!',
    hard: '🔥 Impressive! That was a tough one!',
    legendary: '👑 LEGENDARY COMPLETE! You are a champion!',
  };

  return {
    questId: quest.id,
    xpAwarded,
    coinsAwarded,
    bonusMultiplier: diffXpMult * streakMult,
    message: messages[quest.difficulty] ?? 'Quest Complete!',
  };
}

export async function distributeReward(
  userId: string,
  reward: QuestReward,
): Promise<void> {
  const streakMult = getStreakBonus(userId);
  const bonusXp = Math.round(reward.xpAwarded * (streakMult - 1));
  const finalReward: QuestReward = {
    ...reward,
    xpAwarded: reward.xpAwarded + bonusXp,
    bonusMultiplier: reward.bonusMultiplier * streakMult,
  };

  // Award coins
  const current = userCoins.get(userId) ?? 0;
  userCoins.set(userId, current + finalReward.coinsAwarded);

  // Record reward
  const history = distributedRewards.get(userId) ?? [];
  distributedRewards.set(userId, [...history, finalReward]);
}

export function getStreakBonus(userId: string): number {
  const streak = userStreaks.get(userId) ?? 0;
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.75;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
}

export function setUserStreak(userId: string, days: number): void {
  userStreaks.set(userId, days);
}

export function getUserCoins(userId: string): number {
  return userCoins.get(userId) ?? 0;
}

export function getRewardHistory(userId: string): QuestReward[] {
  return distributedRewards.get(userId) ?? [];
}
