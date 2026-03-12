// AI workout recommender
import { Recommendation, ActivityLog } from '../../types';

function generateId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const WORKOUT_TEMPLATES = [
  { type: 'strength', title: 'Upper Body Strength', duration: 45 },
  { type: 'cardio', title: '30-Minute Cardio Blast', duration: 30 },
  { type: 'flexibility', title: 'Yoga & Stretching', duration: 30 },
  { type: 'hiit', title: 'HIIT Circuit Training', duration: 25 },
  { type: 'strength', title: 'Lower Body Power', duration: 45 },
];

export function recommendWorkout(
  userId: string,
  recentLogs: ActivityLog[]
): Recommendation {
  const recentTypes = recentLogs.map((l) => l.type);
  const template =
    WORKOUT_TEMPLATES.find((t) => !recentTypes.includes(t.type)) ?? WORKOUT_TEMPLATES[0];

  return {
    id: generateId(),
    userId,
    type: 'workout',
    title: template.title,
    description: `A ${template.duration}-minute ${template.type} session to keep you on track.`,
    reason: `You haven't done ${template.type} recently – variety improves results.`,
    action: { type: 'activity', payload: { ...template } },
    confidence: 82,
    userResponse: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function buildWeeklyWorkoutPlan(userId: string): Recommendation[] {
  return WORKOUT_TEMPLATES.map((template) => ({
    id: generateId(),
    userId,
    type: 'workout' as const,
    title: template.title,
    description: `Scheduled ${template.type} session.`,
    reason: 'Part of your personalised weekly plan.',
    action: { type: 'activity' as const, payload: { ...template } },
    confidence: 88,
    userResponse: 'pending' as const,
    createdAt: new Date().toISOString(),
  }));
}
