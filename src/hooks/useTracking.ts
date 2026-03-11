import { useMemo } from 'react';
import { useTracking as useTrackingContext } from '../context/TrackingContext';
import { toISODate } from '../utils/dateHelpers';

export function useTracking() {
  const trackingContext = useTrackingContext();
  const { activityLogs, sleepLogs, nutritionLogs, mentalHealthLogs } = trackingContext;

  const today = toISODate();

  const todayCalories: number = useMemo(
    () =>
      nutritionLogs
        .filter((l) => l.date === today)
        .reduce((sum, l) => sum + l.calories, 0),
    [nutritionLogs, today]
  );

  const todayActivity: number = useMemo(
    () =>
      activityLogs
        .filter((l) => l.date === today)
        .reduce((sum, l) => sum + l.duration, 0),
    [activityLogs, today]
  );

  const lastMood: number | null = useMemo(() => {
    if (mentalHealthLogs.length === 0) return null;
    const sorted = [...mentalHealthLogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted[0].mood;
  }, [mentalHealthLogs]);

  const lastSleep: number | null = useMemo(() => {
    if (sleepLogs.length === 0) return null;
    const sorted = [...sleepLogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted[0].hoursSlept;
  }, [sleepLogs]);

  return {
    ...trackingContext,
    todayCalories,
    todayActivity,
    lastMood,
    lastSleep,
  };
}
