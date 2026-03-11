import { useMemo } from 'react';
import {
  ACHIEVEMENTS,
  calculateStreak,
  checkAchievements,
  calculatePoints,
} from '../services/rewardsLogic';
import { useHealth } from '../context/HealthContext';
import { Achievement, StreakData, UserAchievement } from '../types';

interface RewardsResult {
  streakData: StreakData | null;
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  totalPoints: number;
  newlyEarned: Achievement[];
}

const EMPTY_STREAK: StreakData = {
  userId: '',
  currentStreak: 0,
  longestStreak: 0,
  lastLogDate: '',
  totalDaysLogged: 0,
};

const useRewards = (): RewardsResult => {
  const {
    todayActivity,
    todaySleep,
    todayNutrition,
    userAchievements,
    streakData,
    userProfile,
  } = useHealth();

  const allLogs = useMemo(
    () => [
      ...todayActivity,
      ...(todaySleep ? [todaySleep] : []),
      ...todayNutrition,
    ],
    [todayActivity, todaySleep, todayNutrition],
  );

  const computedStreak = useMemo(() => {
    const base: StreakData = streakData ?? {
      ...EMPTY_STREAK,
      userId: userProfile?.userId ?? '',
    };
    return calculateStreak(allLogs, base);
  }, [allLogs, streakData, userProfile]);

  const newlyEarned = useMemo(() => {
    const earnedIds = new Set(userAchievements.map(ua => ua.achievementId));
    const logs = {
      activity: todayActivity,
      sleep: todaySleep ? [todaySleep] : [],
      nutrition: todayNutrition,
      streakData: computedStreak,
    };
    const checked = checkAchievements(userProfile?.userId ?? '', logs);
    return checked.filter(a => !earnedIds.has(a.id));
  }, [todayActivity, todaySleep, todayNutrition, computedStreak, userAchievements, userProfile]);

  const totalPoints = useMemo(
    () => calculatePoints(userAchievements),
    [userAchievements],
  );

  return {
    streakData: computedStreak,
    achievements: ACHIEVEMENTS,
    userAchievements,
    totalPoints,
    newlyEarned,
  };
};

export default useRewards;
