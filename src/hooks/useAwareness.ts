import { useMemo } from 'react';
import { useTracking } from '../context/TrackingContext';
import { useUser } from '../context/UserContext';
import { usePlan } from '../context/PlanContext';
import {
  calculateConsistencyScore,
  generateHealthProjection,
  predictiveWarnings,
  momentumMessage,
} from '../services/awareness';
import { ConsistencyData, HealthProjection } from '../types';

export function useAwareness() {
  const { activityLogs } = useTracking();
  const { profile } = useUser();
  const { currentPlan } = usePlan();

  const consistencyData: ConsistencyData = useMemo(() => {
    if (!currentPlan || currentPlan.items.length === 0) {
      return { totalItems: 0, completedItems: 0, skippedItems: 0, score: 0, trend: 'stable' };
    }

    // Group plan items by day to produce per-day consistency logs
    const dayMap = new Map<number, { completedItems: number; totalItems: number }>();
    for (const item of currentPlan.items) {
      const entry = dayMap.get(item.day) ?? { completedItems: 0, totalItems: 0 };
      entry.totalItems += 1;
      if (item.status === 'completed') entry.completedItems += 1;
      dayMap.set(item.day, entry);
    }

    return calculateConsistencyScore(Array.from(dayMap.values()));
  }, [currentPlan]);

  const projections: HealthProjection[] = useMemo(() => {
    if (!profile) return [];
    return generateHealthProjection(profile, consistencyData);
  }, [profile, consistencyData]);

  const warnings: string[] = useMemo(() => {
    if (!profile) return [];
    return predictiveWarnings(consistencyData, profile);
  }, [consistencyData, profile]);

  const motivationMessage: string = useMemo(
    () => momentumMessage(consistencyData),
    [consistencyData]
  );

  return {
    activityLogs,
    consistencyData,
    projections,
    warnings,
    motivationMessage,
  };
}
