import { NutritionLog, UserProfile, Recommendation } from '../../types';

function makeId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function expiresIn(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export async function generateNutritionRecommendation(
  nutritionLogs: NutritionLog[],
  userProfile: UserProfile,
): Promise<Recommendation> {
  const now = new Date().toISOString();
  const recent = nutritionLogs.slice(-7);

  if (recent.length === 0) {
    return {
      id: makeId(),
      category: 'nutrition',
      title: 'Start Logging Your Meals',
      description:
        "We don't have enough nutrition data yet. Log your meals to get personalised recommendations.",
      priority: 'medium',
      confidence: 1.0,
      actionType: 'log_meal',
      createdAt: now,
      expiresAt: expiresIn(24),
      status: 'active',
    };
  }

  const avgCalories =
    recent.reduce((a, l) => a + l.calories, 0) / recent.length;
  const targetCalories = 2000;
  const avgDeficit = targetCalories - avgCalories;

  const avgProtein =
    recent.reduce((a, l) => a + (l.protein ?? 0), 0) / recent.length;
  const targetProtein = (userProfile.weight ?? 70) * 1.6; // 1.6 g/kg guideline

  // Large calorie deficit
  if (avgDeficit > 500) {
    return {
      id: makeId(),
      category: 'nutrition',
      title: 'Increase Your Calorie Intake',
      description: `Your average daily deficit is ${Math.round(avgDeficit)} kcal — too large for sustainable progress. Add a nutritious snack or larger meals to reach your target of ${targetCalories} kcal.`,
      priority: 'high',
      confidence: 0.9,
      actionType: 'log_meal',
      actionData: {
        suggestedCalories: Math.round(avgDeficit),
        mealType: 'snack',
      },
      createdAt: now,
      expiresAt: expiresIn(12),
      status: 'active',
    };
  }

  // Low protein
  if (avgProtein < targetProtein * 0.8) {
    const shortfall = Math.round(targetProtein - avgProtein);
    return {
      id: makeId(),
      category: 'nutrition',
      title: 'Boost Your Protein Intake',
      description: `Your average protein intake is ${Math.round(avgProtein)} g — about ${shortfall} g below the recommended ${Math.round(targetProtein)} g for your weight. Try adding chicken, eggs, legumes or a protein shake.`,
      priority: 'medium',
      confidence: 0.85,
      actionType: 'log_meal',
      actionData: {
        nutrientFocus: 'protein',
        suggestedSources: ['chicken breast', 'Greek yogurt', 'lentils', 'eggs'],
        targetIncrease: shortfall,
      },
      createdAt: now,
      expiresAt: expiresIn(12),
      status: 'active',
    };
  }

  // Calorie surplus
  if (avgDeficit < -300) {
    return {
      id: makeId(),
      category: 'nutrition',
      title: 'Moderate Your Calorie Surplus',
      description: `You're averaging ${Math.round(-avgDeficit)} kcal above your target. If fat loss is your goal, consider reducing portion sizes or swapping high-calorie snacks.`,
      priority: 'medium',
      confidence: 0.78,
      actionType: 'log_meal',
      actionData: { suggestion: 'reduce_portions' },
      createdAt: now,
      expiresAt: expiresIn(24),
      status: 'active',
    };
  }

  return {
    id: makeId(),
    category: 'nutrition',
    title: 'Great Nutrition Balance!',
    description:
      "You're hitting your calorie and protein targets well. Keep logging to maintain this streak.",
    priority: 'low',
    confidence: 0.75,
    actionType: 'log_meal',
    createdAt: now,
    expiresAt: expiresIn(24),
    status: 'active',
  };
}
