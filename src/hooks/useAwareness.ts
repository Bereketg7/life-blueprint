import { useMemo } from 'react';
import {
  calculateConsistencyScore,
  generateHealthProjection,
  predictiveWarnings,
  momentumMessage,
} from '../services/awarenessEngine';
import { useHealth } from '../context/HealthContext';
import { ConsistencyScore, HealthProjection } from '../types';

const DAYS_BACK = 30;

interface AwarenessResult {
  consistencyScore: ConsistencyScore | null;
  projection: HealthProjection | null;
  warnings: string[];
  momentumMsg: string;
}

const useAwareness = (): AwarenessResult => {
  const { todayActivity, todaySleep, todayNutrition, todayMood, userProfile } = useHealth();

  const logs = useMemo(
    () => ({
      activity: todayActivity,
      sleep: todaySleep ? [todaySleep] : [],
      nutrition: todayNutrition,
      mental: todayMood ? [todayMood] : [],
    }),
    [todayActivity, todaySleep, todayNutrition, todayMood],
  );

  const consistencyScore = useMemo(
    () => calculateConsistencyScore(logs, DAYS_BACK),
    [logs],
  );

  const projection = useMemo(
    () =>
      generateHealthProjection(
        consistencyScore,
        userProfile?.primaryGoal ?? 'general-wellness',
        userProfile?.weight,
      ),
    [consistencyScore, userProfile],
  );

  const warnings = useMemo(() => predictiveWarnings(logs), [logs]);

  const momentumMsg = useMemo(
    () =>
      momentumMessage(
        consistencyScore.overall,
        userProfile?.primaryGoal ?? 'general-wellness',
        projection?.goalReachDate,
      ),
    [consistencyScore, userProfile, projection],
  );

  return { consistencyScore, projection, warnings, momentumMsg };
};

export default useAwareness;
