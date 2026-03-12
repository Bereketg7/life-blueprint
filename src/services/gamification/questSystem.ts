import { Quest, QuestReward, QuestProgress } from '../../types';

const QUEST_STORAGE_KEY = 'quest_data';
const QUEST_PROGRESS_KEY = 'quest_progress';
const QUEST_HISTORY_KEY = 'quest_history';

// In-memory store simulating AsyncStorage for pure RN without external deps
const store: Record<string, string> = {};

function storeGet(key: string): string | null {
  return store[key] ?? null;
}

function storeSet(key: string, value: string): void {
  store[key] = value;
}

export class QuestSystem {
  private quests: Map<string, Quest> = new Map();
  private progress: Map<string, QuestProgress> = new Map();

  getDailyQuests(userId: string, date: string): Quest[] {
    const key = `${QUEST_STORAGE_KEY}:${userId}:${date}`;
    const raw = storeGet(key);
    if (raw) {
      const quests: Quest[] = JSON.parse(raw);
      quests.forEach(q => this.quests.set(q.id, q));
      return quests;
    }
    return [];
  }

  setDailyQuests(userId: string, date: string, quests: Quest[]): void {
    const key = `${QUEST_STORAGE_KEY}:${userId}:${date}`;
    quests.forEach(q => this.quests.set(q.id, q));
    storeSet(key, JSON.stringify(quests));
  }

  async updateQuestProgress(questId: string, progress: number): Promise<Quest> {
    const quest = this.quests.get(questId);
    if (!quest) {
      throw new Error(`Quest ${questId} not found`);
    }
    const updated: Quest = {
      ...quest,
      currentValue: Math.min(progress, quest.targetValue),
    };
    if (updated.currentValue >= updated.targetValue && updated.status === 'active') {
      updated.status = 'completed';
      updated.completedAt = new Date().toISOString();
    }
    this.quests.set(questId, updated);
    this._persistQuest(updated);
    return updated;
  }

  async completeQuest(questId: string): Promise<QuestReward> {
    const quest = this.quests.get(questId);
    if (!quest) {
      throw new Error(`Quest ${questId} not found`);
    }
    if (quest.status === 'completed') {
      return this._buildReward(quest, 1);
    }
    const updated: Quest = {
      ...quest,
      currentValue: quest.targetValue,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    this.quests.set(questId, updated);
    this._persistQuest(updated);
    return this._buildReward(updated, 1);
  }

  async getQuestHistory(userId: string, days: number): Promise<Quest[]> {
    const history: Quest[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayQuests = this.getDailyQuests(userId, dateStr);
      history.push(...dayQuests);
    }
    return history;
  }

  getDailyProgress(userId: string, date: string): QuestProgress {
    const quests = this.getDailyQuests(userId, date);
    const completed = quests.filter(q => q.status === 'completed');
    return {
      userId,
      date,
      totalQuests: quests.length,
      completedQuests: completed.length,
      totalXpEarned: completed.reduce((sum, q) => sum + q.xpReward, 0),
      totalCoinsEarned: completed.reduce((sum, q) => sum + q.coinReward, 0),
      streakDays: this._calculateStreak(userId),
    };
  }

  private _buildReward(quest: Quest, streakMultiplier: number): QuestReward {
    const difficultyMultiplier: Record<string, number> = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      legendary: 3,
    };
    const mult = (difficultyMultiplier[quest.difficulty] ?? 1) * streakMultiplier;
    const xpAwarded = Math.round(quest.xpReward * mult);
    const coinsAwarded = Math.round(quest.coinReward * mult);
    const messages: Record<string, string> = {
      easy: 'Great start! Keep it up!',
      medium: 'Solid effort! You\'re building momentum!',
      hard: 'Incredible work! You crushed it!',
      legendary: '🏆 LEGENDARY! You are unstoppable!',
    };
    return {
      questId: quest.id,
      xpAwarded,
      coinsAwarded,
      bonusMultiplier: mult,
      message: messages[quest.difficulty] ?? 'Quest complete!',
    };
  }

  private _persistQuest(quest: Quest): void {
    const key = `quest_single:${quest.id}`;
    storeSet(key, JSON.stringify(quest));
  }

  private _calculateStreak(userId: string): number {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const quests = this.getDailyQuests(userId, dateStr);
      const allComplete = quests.length > 0 && quests.every(q => q.status === 'completed');
      if (allComplete) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }
}

export const questSystem = new QuestSystem();
