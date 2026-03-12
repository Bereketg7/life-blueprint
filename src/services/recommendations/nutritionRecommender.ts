// AI nutrition recommender
import { Recommendation, NutritionLog } from '../../types';

function generateId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export interface MacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calculateMacroGap(
  logs: NutritionLog[],
  target: MacroTarget
): MacroTarget {
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.date === today);
  const consumed = todayLogs.reduce(
    (acc, l) => ({
      calories: acc.calories + l.calories,
      protein: acc.protein + l.protein,
      carbs: acc.carbs + l.carbs,
      fat: acc.fat + l.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  return {
    calories: Math.max(0, target.calories - consumed.calories),
    protein: Math.max(0, target.protein - consumed.protein),
    carbs: Math.max(0, target.carbs - consumed.carbs),
    fat: Math.max(0, target.fat - consumed.fat),
  };
}

export function recommendMeal(
  userId: string,
  gap: MacroTarget
): Recommendation {
  let title = 'Balanced Meal';
  let description = 'Enjoy a balanced meal with protein, carbs, and healthy fats.';

  if (gap.protein > 30) {
    title = 'High-Protein Meal';
    description = `You still need ${gap.protein}g of protein today. Try chicken breast, eggs, or Greek yogurt.`;
  } else if (gap.calories > 500) {
    title = 'Calorie-Dense Snack';
    description = `You need ${gap.calories} more calories. Consider nuts, avocado, or a protein shake.`;
  }

  return {
    id: generateId(),
    userId,
    type: 'meal',
    title,
    description,
    reason: `Protein gap: ${gap.protein}g, Calorie gap: ${gap.calories} kcal.`,
    action: {
      type: 'nutrition',
      payload: { targetCalories: gap.calories, targetProtein: gap.protein },
    },
    confidence: 80,
    userResponse: 'pending',
    createdAt: new Date().toISOString(),
  };
}
