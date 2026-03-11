import { useMemo } from 'react';
import { usePlan as usePlanContext } from '../context/PlanContext';
import { useUser } from '../context/UserContext';
import { DailyPlanItem } from '../types';

/** Maps JS getDay() (0=Sun…6=Sat) to plan day (0=Mon…6=Sun). */
function jsDayToPlanDay(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function usePlan() {
  const planContext = usePlanContext();
  const { profile } = useUser();

  const todayItems: DailyPlanItem[] = useMemo(() => {
    if (!planContext.currentPlan) return [];
    const planDay = jsDayToPlanDay(new Date().getDay());
    return planContext.currentPlan.items.filter((item) => item.day === planDay);
  }, [planContext.currentPlan]);

  const completionRate: number = useMemo(() => {
    if (!planContext.currentPlan || planContext.currentPlan.items.length === 0) return 0;
    const completed = planContext.currentPlan.items.filter(
      (item) => item.status === 'completed'
    ).length;
    return Math.round((completed / planContext.currentPlan.items.length) * 100);
  }, [planContext.currentPlan]);

  const hasActivePlan: boolean = planContext.currentPlan !== null;

  return {
    ...planContext,
    profile,
    todayItems,
    completionRate,
    hasActivePlan,
  };
}
