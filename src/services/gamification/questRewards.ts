// Quest reward distribution
import { Quest, XpTransaction } from '../../types';

function generateId(): string {
  return `xp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export interface QuestReward {
  questId: string;
  userId: string;
  xpGranted: number;
  coinsGranted: number;
  badgeGranted?: string;
  bonusMultiplier: number;
}

export function distributeQuestReward(
  quest: Quest,
  completionChain: number = 0
): QuestReward {
  const bonusMultiplier = 1 + completionChain * 0.1; // +10% per chained completion
  return {
    questId: quest.id,
    userId: quest.userId,
    xpGranted: Math.round(quest.reward.xp * bonusMultiplier),
    coinsGranted: Math.round(quest.reward.coins * bonusMultiplier),
    badgeGranted: quest.reward.badge,
    bonusMultiplier,
  };
}

export function questRewardToXpTransaction(reward: QuestReward): XpTransaction {
  return {
    id: generateId(),
    userId: reward.userId,
    amount: reward.xpGranted,
    source: 'quest',
    description: `Quest reward (×${reward.bonusMultiplier.toFixed(1)} multiplier)`,
    timestamp: new Date().toISOString(),
  };
}

export function calcDailyQuestBonusXp(completedCount: number): number {
  if (completedCount >= 5) return 200;
  if (completedCount >= 3) return 100;
  return 0;
}
