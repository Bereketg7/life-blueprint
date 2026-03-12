import { Quest, QuestReward, UserLevel } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const QUEST_TEMPLATES = [
  { type: 'activity' as const, title: 'Morning Warrior', description: 'Complete a workout before 9 AM', baseTarget: 1 },
  { type: 'activity' as const, title: 'Step Master', description: 'Hit {target} steps today', baseTarget: 8000 },
  { type: 'activity' as const, title: 'Endurance Run', description: 'Run for {target} minutes', baseTarget: 30 },
  { type: 'nutrition' as const, title: 'Protein Power', description: 'Hit your protein goal ({target}g)', baseTarget: 80 },
  { type: 'nutrition' as const, title: 'Hydration Hero', description: 'Drink {target}ml of water', baseTarget: 2000 },
  { type: 'nutrition' as const, title: 'Veggie Victory', description: 'Eat {target} servings of vegetables', baseTarget: 3 },
  { type: 'meditation' as const, title: 'Mindful Moment', description: 'Meditate for {target} minutes', baseTarget: 10 },
  { type: 'meditation' as const, title: 'Deep Breather', description: 'Complete {target} breathing exercises', baseTarget: 3 },
  { type: 'social' as const, title: 'Community Builder', description: 'Share your progress with {target} friend', baseTarget: 1 },
  { type: 'challenge' as const, title: 'Weekend Warrior', description: 'Complete {target} workouts this weekend', baseTarget: 2 },
];

function getDifficultyForLevel(level: number): 1 | 2 | 3 | 4 | 5 {
  if (level >= 80) return 5;
  if (level >= 60) return 4;
  if (level >= 40) return 3;
  if (level >= 20) return 2;
  return 1;
}

function calculateTarget(baseTarget: number, difficulty: number, streakMultiplier: number): number {
  const scaledTarget = Math.round(baseTarget * (1 + (difficulty - 1) * 0.25) * streakMultiplier);
  return Math.max(1, scaledTarget);
}

function calculateReward(difficulty: number, streakMultiplier: number): QuestReward {
  const baseXp = difficulty * 50;
  const baseCoins = difficulty * 10;
  return {
    xp: Math.round(baseXp * streakMultiplier),
    coins: Math.round(baseCoins * streakMultiplier),
    badge: difficulty >= 4 ? `quest_difficulty_${difficulty}` : undefined,
  };
}

// Exponential difficulty scaling: each level adds ~18% XP requirement
export function generateDailyQuests(
  userId: string,
  userLevel: UserLevel,
  currentStreak: number = 0,
): Quest[] {
  const difficulty = getDifficultyForLevel(userLevel.level);
  const streakMultiplier = 1 + Math.min(currentStreak, 50) * 0.02; // max 2x at 50-day streak

  // Shuffle templates and pick 3-5
  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
  const count = difficulty >= 4 ? 5 : difficulty >= 3 ? 4 : 3;
  const selected = shuffled.slice(0, count);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return selected.map(template => {
    const target = calculateTarget(template.baseTarget, difficulty, streakMultiplier);
    return {
      id: generateId(),
      userId,
      type: template.type,
      title: template.title,
      description: template.description.replace('{target}', String(target)),
      difficulty,
      target,
      current: 0,
      reward: calculateReward(difficulty, streakMultiplier),
      status: 'active' as const,
      expiresAt: tomorrow.toISOString(),
      createdAt: new Date().toISOString(),
    };
  });
}

export function updateQuestProgress(quest: Quest, progress: number): Quest {
  const newCurrent = Math.min(quest.target, quest.current + progress);
  const completed = newCurrent >= quest.target;
  return {
    ...quest,
    current: newCurrent,
    status: completed ? 'completed' : quest.status,
  };
}

export function expireOldQuests(quests: Quest[]): Quest[] {
  const now = new Date();
  return quests.map(q =>
    q.status === 'active' && new Date(q.expiresAt) < now
      ? { ...q, status: 'expired' as const }
      : q,
  );
}

export function getCompletedQuestRewards(quests: Quest[]): QuestReward {
  const completed = quests.filter(q => q.status === 'completed');
  return completed.reduce(
    (total, q) => ({
      xp: total.xp + q.reward.xp,
      coins: total.coins + q.reward.coins,
    }),
    { xp: 0, coins: 0 },
  );
}
