import { CachedMeal } from '../../types';

// ─── In-memory cache (mirrors AsyncStorage in production) ──────────────────────

const _store: Record<string, string> = {};
const AsyncStorage = {
  getItem: async (key: string): Promise<string | null> => _store[key] ?? null,
  setItem: async (key: string, value: string): Promise<void> => { _store[key] = value; },
  removeItem: async (key: string): Promise<void> => { delete _store[key]; },
};

const CACHE_KEY = 'meal_cache';

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function readCache(): Promise<CachedMeal[]> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CachedMeal[];
  } catch {
    return [];
  }
}

async function writeCache(meals: CachedMeal[]): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(meals));
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function cacheMeal(meal: CachedMeal): Promise<void> {
  const meals = await readCache();
  const existingIdx = meals.findIndex((m) => m.id === meal.id);
  if (existingIdx >= 0) {
    meals[existingIdx] = meal;
  } else {
    meals.push(meal);
  }
  await writeCache(meals);
}

export async function getCachedMeal(id: string): Promise<CachedMeal | null> {
  const meals = await readCache();
  return meals.find((m) => m.id === id) ?? null;
}

export async function searchCachedMeals(query: string): Promise<CachedMeal[]> {
  if (!query.trim()) return [];
  const meals = await readCache();
  const lower = query.toLowerCase();
  return meals.filter((m) => m.name.toLowerCase().includes(lower));
}

export async function getMostFrequentMeals(limit: number = 10): Promise<CachedMeal[]> {
  const meals = await readCache();
  return [...meals]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
}

export async function incrementMealFrequency(id: string): Promise<void> {
  const meals = await readCache();
  const idx = meals.findIndex((m) => m.id === id);
  if (idx >= 0) {
    meals[idx] = {
      ...meals[idx],
      frequency: meals[idx].frequency + 1,
      lastUsedAt: new Date().toISOString(),
    };
    await writeCache(meals);
  }
}

export async function deleteCachedMeal(id: string): Promise<void> {
  const meals = await readCache();
  await writeCache(meals.filter((m) => m.id !== id));
}
