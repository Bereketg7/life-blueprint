import { useState, useEffect, useCallback } from 'react';
import { XpTransaction, UserLevel, LevelUnlock } from '../types';
import {
  getLevelProgress,
  getTier,
  getXpRequiredForLevel,
  buildUserLevel,
} from '../services/gamification/levelingSystem';
import {
  awardXp as awardXpService,
  getXpHistory,
  getTotalXp,
} from '../services/gamification/xpManager';
import { getUnlockedFeatures, getUnlocksAtLevel } from '../services/gamification/unlockables';

const DEFAULT_USER_ID = 'user_1';

interface UseLevelReturn {
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  progressPercent: number;
  tier: UserLevel['tier'];
  levelHistory: XpTransaction[];
  unlocks: LevelUnlock[];
  levelUpVisible: boolean;
  levelUpUnlocks: LevelUnlock[];
  newLevel: number;
  awardXp: (amount: number, source: XpTransaction['source'], description?: string) => Promise<void>;
  dismissLevelUp: () => void;
  refreshLevel: () => Promise<void>;
}

export function useLevel(userId: string = DEFAULT_USER_ID): UseLevelReturn {
  const [totalXp, setTotalXp] = useState(0);
  const [levelHistory, setLevelHistory] = useState<XpTransaction[]>([]);
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [levelUpUnlocks, setLevelUpUnlocks] = useState<LevelUnlock[]>([]);
  const [pendingNewLevel, setPendingNewLevel] = useState(1);

  const refreshLevel = useCallback(async () => {
    const xp = await getTotalXp(userId);
    const history = await getXpHistory(userId, 50);
    setTotalXp(xp);
    setLevelHistory(history);
  }, [userId]);

  useEffect(() => {
    refreshLevel();
  }, [refreshLevel]);

  const { level, currentXp, xpToNextLevel, progressPercent } = getLevelProgress(totalXp);

  const awardXp = useCallback(
    async (
      amount: number,
      source: XpTransaction['source'],
      description?: string,
    ) => {
      const prevLevel = getLevelProgress(totalXp).level;
      await awardXpService(userId, amount, source, description);
      const newTotalXp = await getTotalXp(userId);
      const newLevel = getLevelProgress(newTotalXp).level;
      setTotalXp(newTotalXp);

      if (newLevel > prevLevel) {
        const unlocks = getUnlocksAtLevel(newLevel);
        setPendingNewLevel(newLevel);
        setLevelUpUnlocks(unlocks);
        setLevelUpVisible(true);
      }

      const history = await getXpHistory(userId, 50);
      setLevelHistory(history);
    },
    [userId, totalXp],
  );

  const dismissLevelUp = useCallback(() => {
    setLevelUpVisible(false);
    setLevelUpUnlocks([]);
  }, []);

  const unlocks = getUnlockedFeatures(level);

  return {
    level,
    totalXp,
    xpToNextLevel,
    progressPercent,
    tier: getTier(level),
    levelHistory,
    unlocks,
    levelUpVisible,
    levelUpUnlocks,
    newLevel: pendingNewLevel,
    awardXp,
    dismissLevelUp,
    refreshLevel,
  };
}
