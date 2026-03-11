import { UserProfile, WeeklyPlan, DailyPlanItem } from '../types';
import { calculateTDEE, calculateMacros } from '../utils/calculations';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Returns the Monday of the current week. */
function getMondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type Category = 'nutrition' | 'exercise' | 'supplement' | 'recovery' | 'mindfulness';

interface ItemTemplate {
  timeOfDay: TimeOfDay;
  category: Category;
  title: string;
  description: string;
  duration: number;
}

function makePlanItem(
  planId: string,
  day: number,
  template: ItemTemplate
): DailyPlanItem {
  return {
    id: generateId(),
    planId,
    day,
    timeOfDay: template.timeOfDay,
    category: template.category,
    title: template.title,
    description: template.description,
    duration: template.duration,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

const TEMPLATES: Record<UserProfile['goalType'], ItemTemplate[]> = {
  weight_loss: [
    { timeOfDay: 'morning', category: 'exercise', title: 'Morning Cardio', description: 'High-intensity cardio or HIIT session to maximize calorie burn.', duration: 30 },
    { timeOfDay: 'afternoon', category: 'exercise', title: 'Strength Training', description: 'Compound lifts to preserve lean muscle during a calorie deficit.', duration: 45 },
    { timeOfDay: 'evening', category: 'exercise', title: 'Evening Stretch', description: 'Light stretching to aid recovery and improve flexibility.', duration: 15 },
    { timeOfDay: 'morning', category: 'nutrition', title: 'Low-Calorie Breakfast', description: 'High-protein, low-calorie breakfast to kickstart metabolism.', duration: 10 },
    { timeOfDay: 'evening', category: 'nutrition', title: 'Dinner Reminder', description: 'Eat a balanced, calorie-controlled dinner at least 2 hours before bed.', duration: 5 },
  ],
  muscle_gain: [
    { timeOfDay: 'morning', category: 'nutrition', title: 'Protein Breakfast', description: 'High-protein breakfast with complex carbs for energy and muscle synthesis.', duration: 10 },
    { timeOfDay: 'afternoon', category: 'exercise', title: 'Strength Training', description: 'Heavy compound movements to stimulate hypertrophy.', duration: 60 },
    { timeOfDay: 'evening', category: 'recovery', title: 'Recovery Protocol', description: 'Foam rolling, static stretching, and adequate protein before sleep.', duration: 20 },
    { timeOfDay: 'morning', category: 'supplement', title: 'Morning Supplements', description: 'Creatine, protein shake, and micronutrients.', duration: 5 },
  ],
  maintenance: [
    { timeOfDay: 'morning', category: 'exercise', title: 'Moderate Cardio', description: 'Steady-state cardio to maintain cardiovascular health.', duration: 30 },
    { timeOfDay: 'afternoon', category: 'exercise', title: 'Strength Circuit', description: 'Full-body strength circuit to maintain muscle mass.', duration: 40 },
    { timeOfDay: 'evening', category: 'mindfulness', title: 'Evening Mindfulness', description: 'Meditation or breathing exercises for stress management.', duration: 15 },
    { timeOfDay: 'morning', category: 'nutrition', title: 'Balanced Breakfast', description: 'Well-rounded meal with protein, carbs, and healthy fats.', duration: 10 },
  ],
  endurance: [
    { timeOfDay: 'morning', category: 'exercise', title: 'Endurance Run / Cycle', description: 'Long, steady-state aerobic session to build base endurance.', duration: 60 },
    { timeOfDay: 'afternoon', category: 'exercise', title: 'Cross-Training', description: 'Swimming, rowing, or another low-impact aerobic activity.', duration: 45 },
    { timeOfDay: 'evening', category: 'recovery', title: 'Recovery Stretch', description: 'Deep stretching and foam rolling to prepare for the next session.', duration: 20 },
    { timeOfDay: 'morning', category: 'nutrition', title: 'Carb Loading', description: 'High-carbohydrate breakfast for sustained energy.', duration: 10 },
  ],
  flexibility: [
    { timeOfDay: 'morning', category: 'exercise', title: 'Morning Yoga', description: 'Dynamic yoga flow to warm up joints and improve range of motion.', duration: 30 },
    { timeOfDay: 'afternoon', category: 'exercise', title: 'Stretching Session', description: 'Targeted static and PNF stretching for major muscle groups.', duration: 30 },
    { timeOfDay: 'evening', category: 'exercise', title: 'Mobility Work', description: 'Joint mobility drills and relaxation stretches.', duration: 20 },
    { timeOfDay: 'morning', category: 'mindfulness', title: 'Breathwork', description: 'Diaphragmatic breathing to calm the nervous system.', duration: 10 },
  ],
};

export function generateWeeklyPlan(profile: UserProfile): WeeklyPlan {
  const planId = generateId();
  const monday = getMondayOfCurrentWeek();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const templates = TEMPLATES[profile.goalType] ?? TEMPLATES.maintenance;
  const items: DailyPlanItem[] = [];

  for (let day = 0; day < 7; day++) {
    for (const template of templates) {
      items.push(makePlanItem(planId, day, template));
    }
  }

  return {
    id: planId,
    userId: profile.id,
    weekStartDate: toISODate(monday),
    weekEndDate: toISODate(sunday),
    items,
    goalType: profile.goalType,
    createdAt: new Date().toISOString(),
  };
}

export function recommendMacros(
  profile: UserProfile
): { calories: number; protein: number; carbs: number; fat: number } {
  const tdee = calculateTDEE(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender,
    profile.activityLevel
  );

  const adjusted =
    profile.goalType === 'weight_loss'
      ? tdee - 500
      : profile.goalType === 'muscle_gain'
      ? tdee + 300
      : tdee;

  const macros = calculateMacros(adjusted, profile.goalType);
  return macros;
}

export function prescribeExercise(
  profile: UserProfile
): { type: string; duration: number; intensity: string; daysPerWeek: number } {
  const activityDefaults: Record<
    UserProfile['activityLevel'],
    { daysPerWeek: number; intensity: string }
  > = {
    sedentary: { daysPerWeek: 3, intensity: 'low' },
    lightly_active: { daysPerWeek: 4, intensity: 'low' },
    moderately_active: { daysPerWeek: 4, intensity: 'medium' },
    very_active: { daysPerWeek: 5, intensity: 'medium' },
    extra_active: { daysPerWeek: 6, intensity: 'high' },
  };

  const { daysPerWeek, intensity } = activityDefaults[profile.activityLevel];

  const goalDefaults: Record<
    UserProfile['goalType'],
    { type: string; duration: number }
  > = {
    weight_loss: { type: 'HIIT + Strength', duration: 45 },
    muscle_gain: { type: 'Strength Training', duration: 60 },
    maintenance: { type: 'Mixed Cardio & Strength', duration: 40 },
    endurance: { type: 'Running / Cycling', duration: 60 },
    flexibility: { type: 'Yoga / Stretching', duration: 30 },
  };

  const { type, duration } = goalDefaults[profile.goalType];

  return { type, duration, intensity, daysPerWeek };
}

export function suggestRecovery(profile: UserProfile): string[] {
  const suggestions: string[] = [
    'Ensure 7–9 hours of quality sleep each night.',
    'Stay hydrated — aim for at least 2–3 litres of water per day.',
    'Include at least one full rest day per week.',
  ];

  if (
    profile.activityLevel === 'very_active' ||
    profile.activityLevel === 'extra_active'
  ) {
    suggestions.push(
      'Consider contrast therapy (hot/cold showers) to speed muscle recovery.',
      'Schedule a sports massage every 2–4 weeks.'
    );
  }

  if (profile.healthConditions.includes('back_pain')) {
    suggestions.push('Incorporate low-impact stretching and avoid heavy spinal loading.');
  }

  if (profile.healthConditions.includes('joint_pain')) {
    suggestions.push('Prioritise swimming or cycling to reduce joint stress.');
  }

  if (profile.goalType === 'endurance') {
    suggestions.push(
      'Use compression garments post-workout to reduce muscle soreness.',
      'Practice active recovery (light walks or yoga) on non-running days.'
    );
  }

  if (profile.goalType === 'muscle_gain') {
    suggestions.push(
      'Consume 20–40 g of protein within 30 minutes post-workout.',
      'Avoid training the same muscle group on consecutive days.'
    );
  }

  return suggestions;
}
