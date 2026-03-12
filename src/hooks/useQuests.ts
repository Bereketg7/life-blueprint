import { useState, useCallback, useEffect } from 'react';
import { Quest, UserLevel } from '../types';
import { generateDailyQuests, updateQuestProgress, expireOldQuests, getCompletedQuestRewards } from '../services/gamification';

export function useQuests(userId: string, userLevel: UserLevel, streak: number = 0) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const refreshQuests = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastGenerated !== today) {
      const newQuests = generateDailyQuests(userId, userLevel, streak);
      setQuests(prev => {
        const expired = expireOldQuests(prev);
        const active = expired.filter(q => q.status === 'active');
        return [...active, ...newQuests];
      });
      setLastGenerated(today);
    }
  }, [userId, userLevel, streak, lastGenerated]);

  useEffect(() => {
    refreshQuests();
  }, [refreshQuests]);

  const updateProgress = useCallback((questId: string, progress: number) => {
    setQuests(prev => prev.map(q =>
      q.id === questId ? updateQuestProgress(q, progress) : q
    ));
  }, []);

  const completedRewards = getCompletedQuestRewards(quests);

  return { quests, updateProgress, refreshQuests, completedRewards };
}
