// Quest system – generation and tracking
import { Quest } from '../../types';

const QUEST_TEMPLATES: Array<Omit<Quest, 'id' | 'userId' | 'current' | 'status' | 'createdAt' | 'deadline'>> = [
  {
    title: 'Morning Workout',
    description: 'Complete a workout before noon',
    type: 'workout',
    difficulty: 'medium',
    target: 1,
    reward: { xp: 100, coins: 50 },
  },
  {
    title: 'Protein Goal',
    description: 'Hit your daily protein target',
    type: 'nutrition',
    difficulty: 'medium',
    target: 1,
    reward: { xp: 80, coins: 40 },
  },
  {
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water',
    type: 'water',
    difficulty: 'easy',
    target: 8,
    reward: { xp: 50, coins: 25 },
  },
  {
    title: 'Sleep Champion',
    description: 'Get 8 hours of sleep',
    type: 'sleep',
    difficulty: 'medium',
    target: 8,
    reward: { xp: 90, coins: 45 },
  },
  {
    title: 'Mindful Moment',
    description: 'Complete a 10-minute meditation',
    type: 'meditation',
    difficulty: 'easy',
    target: 10,
    reward: { xp: 60, coins: 30 },
  },
  {
    title: 'Cardio King',
    description: 'Run or cycle for 30 minutes',
    type: 'workout',
    difficulty: 'hard',
    target: 30,
    reward: { xp: 150, coins: 75, badge: 'cardio_king' },
  },
];

function generateId(): string {
  return `quest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getTodayMidnight(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export function generateDailyQuests(userId: string, count: number = 3): Quest[] {
  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((template) => ({
    ...template,
    id: generateId(),
    userId,
    current: 0,
    status: 'pending' as const,
    deadline: getTodayMidnight(),
    createdAt: new Date().toISOString(),
  }));
}

export function updateQuestProgress(quest: Quest, progress: number): Quest {
  const current = Math.min(quest.target, quest.current + progress);
  const status: Quest['status'] = current >= quest.target ? 'completed' : quest.status;
  return { ...quest, current, status };
}

export function checkQuestDeadlines(quests: Quest[]): Quest[] {
  const now = new Date().toISOString();
  return quests.map((q) => {
    if (q.status === 'pending' && q.deadline < now) {
      return { ...q, status: 'failed' as const };
    }
    return q;
  });
}

export function getActiveQuests(quests: Quest[]): Quest[] {
  return quests.filter((q) => q.status === 'pending');
}

export function getCompletedQuests(quests: Quest[]): Quest[] {
  return quests.filter((q) => q.status === 'completed');
}

export function calcTotalQuestRewards(
  quests: Quest[]
): { xp: number; coins: number } {
  return quests
    .filter((q) => q.status === 'completed')
    .reduce(
      (acc, q) => ({
        xp: acc.xp + q.reward.xp,
        coins: acc.coins + q.reward.coins,
      }),
      { xp: 0, coins: 0 }
    );
}
