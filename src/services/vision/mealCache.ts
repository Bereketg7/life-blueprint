// Local meal cache for frequently logged meals
import { CachedMeal } from '../../types';

const _cache: Map<string, CachedMeal> = new Map();

export function cacheMeal(meal: CachedMeal): void {
  const existing = _cache.get(meal.id);
  if (existing) {
    existing.frequency += 1;
  } else {
    _cache.set(meal.id, { ...meal });
  }
}

export function getCachedMealByName(name: string): CachedMeal | null {
  for (const meal of _cache.values()) {
    if (meal.name.toLowerCase() === name.toLowerCase()) {
      return meal;
    }
  }
  return null;
}

export function getFrequentMeals(limit: number = 10): CachedMeal[] {
  return Array.from(_cache.values())
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
}

export function getAllCachedMeals(): CachedMeal[] {
  return Array.from(_cache.values());
}

export function clearCache(): void {
  _cache.clear();
}

export function removeCachedMeal(id: string): void {
  _cache.delete(id);
}
