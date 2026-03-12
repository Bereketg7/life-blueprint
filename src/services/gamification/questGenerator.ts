import { Quest, UserProfile } from '../../types';

type QuestType = Quest['type'];
type Difficulty = Quest['difficulty'];

interface QuestTemplate {
  type: QuestType;
  title: string;
  description: string;
  unit: string;
  baseTarget: number;
  baseXp: number;
  baseCoins: number;
}

const QUEST_TEMPLATES: QuestTemplate[] = [
  { type: 'workout', title: 'Power Session', description: 'Complete a workout session', unit: 'sessions', baseTarget: 1, baseXp: 100, baseCoins: 20 },
  { type: 'workout', title: 'Endurance Challenge', description: 'Exercise for a total duration', unit: 'minutes', baseTarget: 30, baseXp: 120, baseCoins: 25 },
  { type: 'steps', title: 'Step Master', description: 'Walk a target number of steps', unit: 'steps', baseTarget: 8000, baseXp: 80, baseCoins: 15 },
  { type: 'steps', title: 'Walking Warrior', description: 'Hit your daily step goal', unit: 'steps', baseTarget: 10000, baseXp: 100, baseCoins: 20 },
  { type: 'nutrition', title: 'Calorie Control', description: 'Stay within your calorie target', unit: 'kcal', baseTarget: 2000, baseXp: 90, baseCoins: 18 },
  { type: 'nutrition', title: 'Protein Power', description: 'Hit your protein intake goal', unit: 'g', baseTarget: 120, baseXp: 100, baseCoins: 20 },
  { type: 'water', title: 'Hydration Hero', description: 'Drink enough water today', unit: 'ml', baseTarget: 2000, baseXp: 70, baseCoins: 12 },
  { type: 'water', title: 'Water Champion', description: 'Reach your premium hydration goal', unit: 'ml', baseTarget: 3000, baseXp: 90, baseCoins: 18 },
  { type: 'sleep', title: 'Rest & Recover', description: 'Get enough sleep tonight', unit: 'hours', baseTarget: 7, baseXp: 80, baseCoins: 15 },
  { type: 'sleep', title: 'Sleep Architect', description: 'Achieve optimal sleep duration', unit: 'hours', baseTarget: 8, baseXp: 100, baseCoins: 20 },
  { type: 'meditation', title: 'Mindful Moments', description: 'Meditate to clear your mind', unit: 'minutes', baseTarget: 10, baseXp: 75, baseCoins: 14 },
  { type: 'meditation', title: 'Zen Master', description: 'Deep meditation session', unit: 'minutes', baseTarget: 20, baseXp: 100, baseCoins: 22 },
];

const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  easy: 0.7,
  medium: 1.0,
  hard: 1.5,
  legendary: 2.5,
};

function getDifficultyForLevel(level: number): Difficulty {
  if (level <= 5) return 'easy';
  if (level <= 15) return 'medium';
  if (level <= 30) return 'hard';
  return 'legendary';
}

function weightedDifficulty(level: number): Difficulty {
  const base = getDifficultyForLevel(level);
  const rand = Math.random();
  if (base === 'easy') {
    return rand < 0.7 ? 'easy' : 'medium';
  } else if (base === 'medium') {
    if (rand < 0.2) return 'easy';
    if (rand < 0.7) return 'medium';
    return 'hard';
  } else if (base === 'hard') {
    if (rand < 0.1) return 'medium';
    if (rand < 0.6) return 'hard';
    return 'legendary';
  }
  return rand < 0.3 ? 'hard' : 'legendary';
}

function getRecentQuestTypes(history: Quest[], days: number): Set<string> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const recent = history.filter(q => new Date(q.createdAt) >= cutoff);
  // Deduplicate by type+title combo to avoid same quest within 3 days
  return new Set(recent.map(q => `${q.type}:${q.title}`));
}

export function generateDailyQuests(
  userProfile: UserProfile,
  history: Quest[],
  userLevel: number = 1,
): Quest[] {
  const recentKeys = getRecentQuestTypes(history, 3);
  const today = new Date().toISOString().split('T')[0];
  const userId = userProfile.id;

  // Filter templates not recently used
  const available = QUEST_TEMPLATES.filter(
    t => !recentKeys.has(`${t.type}:${t.title}`),
  );

  // Fallback: if all quests were used recently, allow repeats
  const pool = available.length >= 5 ? available : QUEST_TEMPLATES;

  // Shuffle pool deterministically-ish
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Determine quest count (3-5) based on level
  const questCount = Math.min(5, Math.max(3, Math.floor(userLevel / 5) + 3));

  // Ensure variety across types
  const usedTypes = new Set<QuestType>();
  const selected: QuestTemplate[] = [];
  for (const template of shuffled) {
    if (selected.length >= questCount) break;
    if (!usedTypes.has(template.type) || selected.length < 3) {
      selected.push(template);
      usedTypes.add(template.type);
    }
  }

  return selected.map((template, index) => {
    const difficulty = weightedDifficulty(userLevel);
    const mult = DIFFICULTY_MULTIPLIERS[difficulty];
    const target = Math.round(template.baseTarget * mult);
    const xpReward = Math.round(template.baseXp * mult * (1 + userLevel * 0.05));
    const coinReward = Math.round(template.baseCoins * mult);

    return {
      id: `quest_${today}_${userId}_${index}_${Date.now()}`,
      userId,
      date: today,
      type: template.type,
      title: template.title,
      description: template.description,
      difficulty,
      targetValue: target,
      currentValue: 0,
      unit: template.unit,
      xpReward,
      coinReward,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };
  });
}
