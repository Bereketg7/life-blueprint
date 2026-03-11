import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../types';
import { toISODate, isThisWeek } from '../utils/dateHelpers';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

interface TrackingContextType {
  activityLogs: ActivityLog[];
  sleepLogs: SleepLog[];
  nutritionLogs: NutritionLog[];
  mentalHealthLogs: MentalHealthLog[];
  loading: boolean;
  logActivity: (log: Omit<ActivityLog, 'id' | 'createdAt'>) => void;
  logSleep: (log: Omit<SleepLog, 'id' | 'createdAt'>) => void;
  logNutrition: (log: Omit<NutritionLog, 'id' | 'createdAt'>) => void;
  logMood: (log: Omit<MentalHealthLog, 'id' | 'createdAt'>) => void;
  getTodayLogs: () => {
    activity: ActivityLog[];
    sleep: SleepLog[];
    nutrition: NutritionLog[];
    mental: MentalHealthLog[];
  };
  getWeekLogs: () => {
    activity: ActivityLog[];
    sleep: SleepLog[];
    nutrition: NutritionLog[];
    mental: MentalHealthLog[];
  };
  deleteActivityLog: (id: string) => void;
  deleteSleepLog: (id: string) => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [mentalHealthLogs, setMentalHealthLogs] = useState<MentalHealthLog[]>([]);
  const [loading] = useState<boolean>(false);

  const logActivity = useCallback((log: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    const entry: ActivityLog = { ...log, id: generateId(), createdAt: new Date().toISOString() };
    setActivityLogs((prev) => [...prev, entry]);
  }, []);

  const logSleep = useCallback((log: Omit<SleepLog, 'id' | 'createdAt'>) => {
    const entry: SleepLog = { ...log, id: generateId(), createdAt: new Date().toISOString() };
    setSleepLogs((prev) => [...prev, entry]);
  }, []);

  const logNutrition = useCallback((log: Omit<NutritionLog, 'id' | 'createdAt'>) => {
    const entry: NutritionLog = { ...log, id: generateId(), createdAt: new Date().toISOString() };
    setNutritionLogs((prev) => [...prev, entry]);
  }, []);

  const logMood = useCallback((log: Omit<MentalHealthLog, 'id' | 'createdAt'>) => {
    const entry: MentalHealthLog = { ...log, id: generateId(), createdAt: new Date().toISOString() };
    setMentalHealthLogs((prev) => [...prev, entry]);
  }, []);

  const getTodayLogs = useCallback(() => {
    const today = toISODate();
    return {
      activity: activityLogs.filter((l) => l.date === today),
      sleep: sleepLogs.filter((l) => l.date === today),
      nutrition: nutritionLogs.filter((l) => l.date === today),
      mental: mentalHealthLogs.filter((l) => l.date === today),
    };
  }, [activityLogs, sleepLogs, nutritionLogs, mentalHealthLogs]);

  const getWeekLogs = useCallback(() => {
    return {
      activity: activityLogs.filter((l) => isThisWeek(l.date)),
      sleep: sleepLogs.filter((l) => isThisWeek(l.date)),
      nutrition: nutritionLogs.filter((l) => isThisWeek(l.date)),
      mental: mentalHealthLogs.filter((l) => isThisWeek(l.date)),
    };
  }, [activityLogs, sleepLogs, nutritionLogs, mentalHealthLogs]);

  const deleteActivityLog = useCallback((id: string) => {
    setActivityLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const deleteSleepLog = useCallback((id: string) => {
    setSleepLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        activityLogs,
        sleepLogs,
        nutritionLogs,
        mentalHealthLogs,
        loading,
        logActivity,
        logSleep,
        logNutrition,
        logMood,
        getTodayLogs,
        getWeekLogs,
        deleteActivityLog,
        deleteSleepLog,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = (): TrackingContextType => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
