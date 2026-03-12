import { useState } from 'react';
import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../types';
import { useHealth } from '../context/HealthContext';
import {
  activityLogOperations,
  sleepLogOperations,
  nutritionLogOperations,
  mentalHealthLogOperations,
} from '../services/database/operations';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);


// Tracker components already include userId and date in their onSave payload
const useTracking = (_userId: string) => {
  const { addActivity, setSleep, addNutrition, setMood } = useHealth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logActivity = async (
    data: Omit<ActivityLog, 'id' | 'createdAt'>,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const log: ActivityLog = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    try {
      await activityLogOperations.create(log);
    } catch {
      // DB may not be available in all environments
    }
    addActivity(log);
    setIsLoading(false);
  };

  const logSleep = async (
    data: Omit<SleepLog, 'id' | 'createdAt'>,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const log: SleepLog = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    try {
      await sleepLogOperations.create(log);
    } catch {
      // DB may not be available in all environments
    }
    setSleep(log);
    setIsLoading(false);
  };

  const logNutrition = async (
    data: Omit<NutritionLog, 'id' | 'createdAt'>,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const log: NutritionLog = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    try {
      await nutritionLogOperations.create(log);
    } catch {
      // DB may not be available in all environments
    }
    addNutrition(log);
    setIsLoading(false);
  };

  const logMood = async (
    data: Omit<MentalHealthLog, 'id' | 'createdAt'>,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const log: MentalHealthLog = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    try {
      await mentalHealthLogOperations.create(log);
    } catch {
      // DB may not be available in all environments
    }
    setMood(log);
    setIsLoading(false);
  };

  return { logActivity, logSleep, logNutrition, logMood, isLoading, error };
};

export default useTracking;