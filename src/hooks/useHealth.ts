import { useMemo } from 'react';
import { useTracking } from '../context/TrackingContext';
import { useUser } from '../context/UserContext';
import { calculateBMI, calculateTDEE } from '../utils/calculations';
import { isThisWeek } from '../utils/dateHelpers';

export function useHealth() {
  const { activityLogs, sleepLogs, nutritionLogs, mentalHealthLogs } = useTracking();
  const { profile } = useUser();

  const bmi: number | null = useMemo(() => {
    if (!profile) return null;
    return calculateBMI(profile.weight, profile.height);
  }, [profile]);

  const tdee: number | null = useMemo(() => {
    if (!profile) return null;
    return calculateTDEE(
      profile.weight,
      profile.height,
      profile.age,
      profile.gender,
      profile.activityLevel
    );
  }, [profile]);

  const weeklyActivityMinutes: number = useMemo(
    () =>
      activityLogs
        .filter((l) => isThisWeek(l.date))
        .reduce((sum, l) => sum + l.duration, 0),
    [activityLogs]
  );

  const weeklyCaloriesConsumed: number = useMemo(
    () =>
      nutritionLogs
        .filter((l) => isThisWeek(l.date))
        .reduce((sum, l) => sum + l.calories, 0),
    [nutritionLogs]
  );

  const avgSleepHours: number = useMemo(() => {
    const weekSleep = sleepLogs.filter((l) => isThisWeek(l.date));
    if (weekSleep.length === 0) return 0;
    const total = weekSleep.reduce((sum, l) => sum + l.hoursSlept, 0);
    return parseFloat((total / weekSleep.length).toFixed(1));
  }, [sleepLogs]);

  const avgMoodScore: number = useMemo(() => {
    const weekMood = mentalHealthLogs.filter((l) => isThisWeek(l.date));
    if (weekMood.length === 0) return 0;
    const total = weekMood.reduce((sum, l) => sum + l.mood, 0);
    return parseFloat((total / weekMood.length).toFixed(1));
  }, [mentalHealthLogs]);

  return {
    bmi,
    tdee,
    weeklyActivityMinutes,
    weeklyCaloriesConsumed,
    avgSleepHours,
    avgMoodScore,
  };
}
