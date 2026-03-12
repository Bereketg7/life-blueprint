// Season manager – tracks current and past seasons
import { getCurrentSeasonNumber, getSeasonDates, SEASON_DURATION_WEEKS } from './battlePassSystem';

export interface Season {
  number: number;
  theme: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const SEASON_THEMES: Record<number, string> = {
  1: 'New Year, New You',
  2: 'Spring Surge',
  3: 'Summer Shred',
  4: 'Autumn Endurance',
  5: 'Winter Warrior',
};

function getSeasonTheme(seasonNumber: number): string {
  return SEASON_THEMES[((seasonNumber - 1) % 5) + 1] ?? `Season ${seasonNumber}`;
}

export function getCurrentSeason(): Season {
  const number = getCurrentSeasonNumber();
  const { start, end } = getSeasonDates(number);
  return {
    number,
    theme: getSeasonTheme(number),
    startDate: start,
    endDate: end,
    isActive: true,
  };
}

export function getPastSeasons(count: number = 3): Season[] {
  const current = getCurrentSeasonNumber();
  return Array.from({ length: count }, (_, i) => {
    const number = current - (i + 1);
    if (number < 1) return null;
    const { start, end } = getSeasonDates(number);
    return {
      number,
      theme: getSeasonTheme(number),
      startDate: start,
      endDate: end,
      isActive: false,
    };
  }).filter(Boolean) as Season[];
}

export function getDaysRemaining(): number {
  const current = getCurrentSeason();
  const endDate = new Date(current.endDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((endDate - now) / (24 * 60 * 60 * 1000)));
}

export function getSeasonProgress(): number {
  const season = getCurrentSeason();
  const startMs = new Date(season.startDate).getTime();
  const endMs = new Date(season.endDate).getTime();
  const now = Date.now();
  const total = endMs - startMs;
  const elapsed = now - startMs;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}
