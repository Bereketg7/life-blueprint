// AI training-week planner
import { Recommendation } from '../../types';

function generateId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export interface WeeklyTrainingPlan {
  weekStart: string;
  days: Array<{
    dayOfWeek: number; // 0 = Sunday
    focus: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
  }>;
}

export function buildWeeklyPlan(
  userId: string,
  goalType: string,
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
): WeeklyTrainingPlan {
  const baseDay = new Date();
  baseDay.setDate(baseDay.getDate() - baseDay.getDay()); // Start of week (Sunday)

  const plans: Record<string, WeeklyTrainingPlan['days']> = {
    weight_loss: [
      { dayOfWeek: 1, focus: 'Cardio', duration: 40, intensity: 'medium' },
      { dayOfWeek: 2, focus: 'Strength', duration: 45, intensity: 'medium' },
      { dayOfWeek: 3, focus: 'Rest / Active Recovery', duration: 20, intensity: 'low' },
      { dayOfWeek: 4, focus: 'HIIT', duration: 30, intensity: 'high' },
      { dayOfWeek: 5, focus: 'Strength', duration: 45, intensity: 'medium' },
      { dayOfWeek: 6, focus: 'Cardio', duration: 50, intensity: 'medium' },
    ],
    muscle_gain: [
      { dayOfWeek: 1, focus: 'Push (Chest, Shoulders, Triceps)', duration: 60, intensity: 'high' },
      { dayOfWeek: 2, focus: 'Pull (Back, Biceps)', duration: 60, intensity: 'high' },
      { dayOfWeek: 3, focus: 'Rest', duration: 0, intensity: 'low' },
      { dayOfWeek: 4, focus: 'Legs & Core', duration: 60, intensity: 'high' },
      { dayOfWeek: 5, focus: 'Upper Body', duration: 55, intensity: 'high' },
      { dayOfWeek: 6, focus: 'Full Body', duration: 50, intensity: 'medium' },
    ],
    maintenance: [
      { dayOfWeek: 1, focus: 'Cardio', duration: 30, intensity: 'medium' },
      { dayOfWeek: 3, focus: 'Strength', duration: 40, intensity: 'medium' },
      { dayOfWeek: 5, focus: 'Flexibility & Yoga', duration: 30, intensity: 'low' },
      { dayOfWeek: 6, focus: 'Mixed Activity', duration: 45, intensity: 'medium' },
    ],
  };

  return {
    weekStart: baseDay.toISOString().split('T')[0],
    days: plans[goalType] ?? plans.maintenance,
  };
}

export function weeklyPlanToRecommendations(
  userId: string,
  plan: WeeklyTrainingPlan
): Recommendation[] {
  return plan.days.map((day) => ({
    id: generateId(),
    userId,
    type: 'workout' as const,
    title: day.focus,
    description: `${day.duration}-minute ${day.intensity} intensity session.`,
    reason: 'Part of your AI-generated weekly training plan.',
    action: {
      type: 'activity' as const,
      payload: { dayOfWeek: day.dayOfWeek, duration: day.duration, intensity: day.intensity },
    },
    confidence: 90,
    userResponse: 'pending' as const,
    createdAt: new Date().toISOString(),
  }));
}
