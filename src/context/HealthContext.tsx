import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  UserProfile,
  ActivityLog,
  SleepLog,
  NutritionLog,
  MentalHealthLog,
  StreakData,
  ConsistencyScore,
  UserAchievement,
  WellnessPlan,
} from '../types';

interface HealthContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  todayActivity: ActivityLog[];
  addActivity: (log: ActivityLog) => void;
  todaySleep: SleepLog | null;
  setSleep: (log: SleepLog) => void;
  todayNutrition: NutritionLog[];
  addNutrition: (log: NutritionLog) => void;
  todayMood: MentalHealthLog | null;
  setMood: (log: MentalHealthLog) => void;
  streakData: StreakData | null;
  setStreakData: (data: StreakData) => void;
  consistencyScore: ConsistencyScore | null;
  setConsistencyScore: (score: ConsistencyScore) => void;
  userAchievements: UserAchievement[];
  addAchievement: (achievement: UserAchievement) => void;
  currentPlan: WellnessPlan | null;
  setCurrentPlan: (plan: WellnessPlan | null) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [todayActivity, setTodayActivity] = useState<ActivityLog[]>([]);
  const [todaySleep, setSleepState] = useState<SleepLog | null>(null);
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog[]>([]);
  const [todayMood, setMoodState] = useState<MentalHealthLog | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [consistencyScore, setConsistencyScore] = useState<ConsistencyScore | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [currentPlan, setCurrentPlan] = useState<WellnessPlan | null>(null);

  const addActivity = (log: ActivityLog) =>
    setTodayActivity(prev => [...prev, log]);

  const setSleep = (log: SleepLog) => setSleepState(log);

  const addNutrition = (log: NutritionLog) =>
    setTodayNutrition(prev => [...prev, log]);

  const setMood = (log: MentalHealthLog) => setMoodState(log);

  const addAchievement = (achievement: UserAchievement) =>
    setUserAchievements(prev => {
      const alreadyExists = prev.some(a => a.achievementId === achievement.achievementId);
      return alreadyExists ? prev : [...prev, achievement];
    });

  return (
    <HealthContext.Provider
      value={{
        userProfile,
        setUserProfile,
        todayActivity,
        addActivity,
        todaySleep,
        setSleep,
        todayNutrition,
        addNutrition,
        todayMood,
        setMood,
        streakData,
        setStreakData,
        consistencyScore,
        setConsistencyScore,
        userAchievements,
        addAchievement,
        currentPlan,
        setCurrentPlan,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = (): HealthContextType => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
