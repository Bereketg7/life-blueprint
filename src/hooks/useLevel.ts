import { useState, useCallback } from 'react';
import { UserLevel, XpTransaction } from '../types';
import { createUserLevel, getLevelTitle } from '../services/gamification/levelingSystem';
import { awardXp, getTotalXp, checkLevelUp, getXpBreakdown } from '../services/gamification/xpManager';
import { getUnlockedFeatures, getUpcomingUnlockables } from '../services/gamification/unlockables';

export function useLevel(userId: string) {
  const [userLevel, setUserLevel] = useState<UserLevel>(() =>
    createUserLevel(userId, getTotalXp(userId))
  );
  const [leveledUpEvent, setLeveledUpEvent] = useState<number | null>(null);

  const addXp = useCallback(
    (amount: number, source: XpTransaction['source'] = 'activity', description: string = '') => {
      const previousLevel = userLevel.level;
      awardXp(userId, amount, source, description);
      const totalXp = getTotalXp(userId);
      const newLevel = createUserLevel(userId, totalXp);
      setUserLevel(newLevel);

      const { leveledUp, newLevel: nl } = checkLevelUp(userId, previousLevel);
      if (leveledUp) {
        setLeveledUpEvent(nl);
      }
    },
    [userId, userLevel.level]
  );

  const dismissLevelUpEvent = useCallback(() => {
    setLeveledUpEvent(null);
  }, []);

  const title = getLevelTitle(userLevel.level);
  const unlocked = getUnlockedFeatures(userLevel.level);
  const upcoming = getUpcomingUnlockables(userLevel.level);
  const xpBreakdown = getXpBreakdown(userId);

  return {
    userLevel,
    title,
    unlockedFeatures: unlocked,
    upcomingUnlockables: upcoming,
    xpBreakdown,
    leveledUpEvent,
    addXp,
    dismissLevelUpEvent,
  };
}
