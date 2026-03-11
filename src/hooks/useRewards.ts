import { useMemo } from 'react';
import { useTracking } from '../context/TrackingContext';
import { calculateStreak, checkBadgeEligibility, getMilestoneMessage } from '../services/rewards';
import { Streak, Badge } from '../types';

export function useRewards() {
  const { activityLogs } = useTracking();

  const streak: Streak = useMemo(
    () => calculateStreak(activityLogs),
    [activityLogs]
  );

  const badges: Badge[] = useMemo(
    () => checkBadgeEligibility(streak, activityLogs),
    [streak, activityLogs]
  );

  const milestoneMessage: string = useMemo(
    () => getMilestoneMessage(streak),
    [streak]
  );

  const totalBadgesEarned: number = badges.length;

  return {
    streak,
    badges,
    milestoneMessage,
    totalBadgesEarned,
  };
}
