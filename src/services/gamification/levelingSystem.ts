// Leveling system – XP thresholds and level calculation
import { UserLevel } from '../../types';

const BASE_XP = 1000;
const GROWTH_FACTOR = 1.2;

export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(BASE_XP * Math.pow(GROWTH_FACTOR, level - 2));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let l = 2; l <= level; l++) {
    total += xpRequiredForLevel(l);
  }
  return total;
}

export function calcLevelFromXp(totalXp: number): {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
} {
  let level = 1;
  let remaining = totalXp;

  while (true) {
    const needed = xpRequiredForLevel(level + 1);
    if (remaining < needed) break;
    remaining -= needed;
    level++;
    if (level >= 100) break;
  }

  const xpToNextLevel = level < 100 ? xpRequiredForLevel(level + 1) - remaining : 0;

  return { level, currentXp: remaining, xpToNextLevel };
}

export function createUserLevel(userId: string, totalXp: number): UserLevel {
  const { level, currentXp, xpToNextLevel } = calcLevelFromXp(totalXp);
  return {
    userId,
    level,
    totalXp,
    currentXp,
    xpToNextLevel,
    lastLevelUpDate: new Date().toISOString(),
  };
}

export function getLevelTitle(level: number): string {
  if (level >= 100) return 'Wellness Legend';
  if (level >= 75) return 'Elite Athlete';
  if (level >= 50) return 'Fitness Expert';
  if (level >= 25) return 'Wellness Warrior';
  if (level >= 10) return 'Active Achiever';
  return 'Health Starter';
}
