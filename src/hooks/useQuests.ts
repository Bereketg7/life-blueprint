import { useState, useCallback } from 'react';
import { Quest } from '../types';
import { generateDailyQuests, updateQuestProgress, checkQuestDeadlines, getActiveQuests, getCompletedQuests, calcTotalQuestRewards } from '../services/gamification/questSystem';
import { distributeQuestReward, questRewardToXpTransaction } from '../services/gamification/questRewards';
import { awardXp } from '../services/gamification/xpManager';

export function useQuests(userId: string) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedToday, setCompletedToday] = useState<number>(0);

  const generateQuests = useCallback(
    (count: number = 3) => {
      const newQuests = generateDailyQuests(userId, count);
      setQuests(newQuests);
    },
    [userId]
  );

  const updateProgress = useCallback(
    (questId: string, progress: number) => {
      setQuests((prev) => {
        const updated = prev.map((q) => {
          if (q.id !== questId) return q;
          const updatedQuest = updateQuestProgress(q, progress);
          if (updatedQuest.status === 'completed' && q.status !== 'completed') {
            const reward = distributeQuestReward(updatedQuest, completedToday);
            const transaction = questRewardToXpTransaction(reward);
            awardXp(userId, transaction.amount, transaction.source, transaction.description);
            setCompletedToday((c) => c + 1);
          }
          return updatedQuest;
        });
        return checkQuestDeadlines(updated);
      });
    },
    [userId, completedToday]
  );

  const activeQuests = getActiveQuests(quests);
  const doneQuests = getCompletedQuests(quests);
  const totalRewards = calcTotalQuestRewards(quests);

  return {
    quests,
    activeQuests,
    completedQuests: doneQuests,
    totalRewards,
    generateQuests,
    updateProgress,
  };
}
