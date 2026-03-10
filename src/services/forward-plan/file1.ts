import { planOperations, goalOperations } from '../database/operations';
import { runQuery } from '../database/db';
import { Plan, Goal } from '../../types';

export function createPlan(
  title: string,
  description: string,
  startDate: string,
  endDate: string
): Plan {
  return {
    id: `plan_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    title,
    description,
    startDate,
    endDate,
    createdAt: new Date().toISOString(),
  };
}

export async function savePlan(plan: Plan): Promise<Plan> {
  await planOperations.create(plan);
  return plan;
}

export async function getAllPlans(): Promise<Plan[]> {
  return planOperations.getAll();
}

export async function getGoalsForPlan(planId: string): Promise<Goal[]> {
  const result = await runQuery(
    `SELECT g.* FROM goals g
     INNER JOIN plan_goals pg ON pg.goalId = g.id
     WHERE pg.planId = ?`,
    [planId]
  );
  return result.rows._array as Goal[];
}

export async function addGoalToPlan(planId: string, goalId: string): Promise<void> {
  await runQuery(
    'INSERT OR IGNORE INTO plan_goals (planId, goalId) VALUES (?, ?)',
    [planId, goalId]
  );
}