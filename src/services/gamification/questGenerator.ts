// AI quest generator – adapts quests to user level and history
import { Quest } from '../../types';
import { generateDailyQuests } from './questSystem';

function generateId(): string {
  return `quest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getTodayMidnight(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export function generateAdaptiveQuests(
  userId: string,
  userLevel: number,
  recentCompletedTypes: Quest['type'][]
): Quest[] {
  const base = generateDailyQuests(userId, 5);

  // Scale difficulty to user level
  return base.map((quest) => {
    let difficulty: Quest['difficulty'] = 'easy';
    if (userLevel >= 20) difficulty = 'medium';
    if (userLevel >= 50) difficulty = 'hard';

    // Prefer quest types not recently completed
    const boostedXp = recentCompletedTypes.includes(quest.type)
      ? quest.reward.xp
      : Math.round(quest.reward.xp * 1.2);

    return {
      ...quest,
      difficulty,
      reward: { ...quest.reward, xp: boostedXp },
    };
  });
}

export function generateBonusQuest(userId: string, streakDays: number): Quest {
  const bonusXp = 100 + streakDays * 10;
  return {
    id: generateId(),
    userId,
    title: `${streakDays}-Day Streak Bonus`,
    description: `Celebrate your ${streakDays}-day streak with a bonus challenge!`,
    type: 'workout',
    difficulty: 'hard',
    target: 1,
    current: 0,
    reward: { xp: bonusXp, coins: bonusXp / 2, badge: 'streak_master' },
    deadline: getTodayMidnight(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
