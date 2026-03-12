import { Season } from '../../types';
import { battlePassSystem } from './battlePassSystem';

// In-memory store
const userSeasonData: Map<string, { seasonId: string; resetAt: string }> = new Map();

export function getCurrentSeason(): Season {
  return battlePassSystem.getCurrentSeason();
}

export function getSeasonDaysRemaining(): number {
  const season = getCurrentSeason();
  const endDate = new Date(season.endDate);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function getSeasonHistory(): Season[] {
  // Returns all seasons except the current active one as history
  const current = getCurrentSeason();
  return [
    {
      id: 'season_1',
      name: 'Season 1: The Beginning',
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-03-11T00:00:00.000Z',
      weekDuration: 10,
      totalTiers: 50,
      xpPerTier: 1000,
      theme: 'dawn',
      isActive: false,
    },
    {
      id: 'season_2',
      name: 'Season 2: Ignite',
      startDate: '2024-03-11T00:00:00.000Z',
      endDate: '2024-05-20T00:00:00.000Z',
      weekDuration: 10,
      totalTiers: 50,
      xpPerTier: 1000,
      theme: 'fire',
      isActive: false,
    },
  ].filter(s => s.id !== current.id);
}

export async function resetForNewSeason(userId: string): Promise<void> {
  const current = getCurrentSeason();
  userSeasonData.set(userId, {
    seasonId: current.id,
    resetAt: new Date().toISOString(),
  });
  // In a real app this would archive old data and create a fresh BattlePass
}

export function getSeasonWeekNumber(): number {
  const season = getCurrentSeason();
  const start = new Date(season.startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.min(
    season.weekDuration,
    Math.max(1, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000))),
  );
}
