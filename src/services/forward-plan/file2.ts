import { Plan, Goal } from '../../types';

export function isPlanActive(plan: Plan): boolean {
  const now = new Date().toISOString().split('T')[0];
  return plan.startDate <= now && plan.endDate >= now;
}

export function isPlanOverdue(plan: Plan): boolean {
  const now = new Date().toISOString().split('T')[0];
  return plan.endDate < now;
}

export function getPlanProgress(goals: Goal[]): number {
  if (goals.length === 0) return 0;
  const completed = goals.filter((g) => g.completed).length;
  return Math.round((completed / goals.length) * 100);
}

export function sortPlansByDate(plans: Plan[]): Plan[] {
  return [...plans].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}