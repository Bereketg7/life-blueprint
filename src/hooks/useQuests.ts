import { useState, useEffect, useCallback } from 'react';
import { Quest, QuestReward, QuestProgress } from '../types';
import { questSystem } from '../services/gamification/questSystem';
import { generateDailyQuests } from '../services/gamification/questGenerator';
import { calculateReward, distributeReward, getStreakBonus } from '../services/gamification/questRewards';
import { awardXp } from '../services/gamification/xpManager';

const MOCK_USER_ID = 'user_1';
const MOCK_USER_LEVEL = 5;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function buildMockProfile() {
  return {
    id: MOCK_USER_ID,
    name: 'Player',
    age: 25,
    gender: 'other' as const,
    height: 175,
    weight: 70,
    goalType: 'maintenance' as const,
    activityLevel: 'moderately_active' as const,
    dietaryPreferences: [],
    healthConditions: [],
    workoutNotificationsEnabled: true,
    mealNotificationsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface UseQuestsReturn {
  quests: Quest[];
  loading: boolean;
  questProgress: QuestProgress | null;
  dailyXpProgress: number;
  streak: number;
  activeReward: QuestReward | null;
  rewardVisible: boolean;
  completeQuest: (id: string) => Promise<void>;
  updateProgress: (id: string, value: number) => Promise<void>;
  dismissReward: () => void;
  refresh: () => void;
}

export function useQuests(): UseQuestsReturn {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReward, setActiveReward] = useState<QuestReward | null>(null);
  const [rewardVisible, setRewardVisible] = useState(false);

  const userId = MOCK_USER_ID;
  const today = getTodayString();

  const loadQuests = useCallback(async () => {
    setLoading(true);
    try {
      let dayQuests = questSystem.getDailyQuests(userId, today);
      if (dayQuests.length === 0) {
        const history = await questSystem.getQuestHistory(userId, 7);
        const profile = buildMockProfile();
        const generated = generateDailyQuests(profile, history, MOCK_USER_LEVEL);
        questSystem.setDailyQuests(userId, today, generated);
        dayQuests = generated;
      }
      setQuests([...dayQuests]);
    } finally {
      setLoading(false);
    }
  }, [userId, today]);

  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  const completeQuest = useCallback(async (id: string) => {
    const reward = await questSystem.completeQuest(id);
    await distributeReward(userId, reward);
    await awardXp(userId, reward.xpAwarded, 'quest_complete', `Completed quest: ${id}`);
    const updated = questSystem.getDailyQuests(userId, today);
    setQuests([...updated]);
    setActiveReward(reward);
    setRewardVisible(true);
  }, [userId, today]);

  const updateProgress = useCallback(async (id: string, value: number) => {
    await questSystem.updateQuestProgress(id, value);
    const updated = questSystem.getDailyQuests(userId, today);
    setQuests([...updated]);
  }, [userId, today]);

  const dismissReward = useCallback(() => {
    setRewardVisible(false);
    setActiveReward(null);
  }, []);

  const questProgress = quests.length > 0
    ? questSystem.getDailyProgress(userId, today)
    : null;

  const dailyXpProgress = questProgress?.totalXpEarned ?? 0;
  const streak = questProgress?.streakDays ?? 0;

  return {
    quests,
    loading,
    questProgress,
    dailyXpProgress,
    streak,
    activeReward,
    rewardVisible,
    completeQuest,
    updateProgress,
    dismissReward,
    refresh: loadQuests,
  };
}
