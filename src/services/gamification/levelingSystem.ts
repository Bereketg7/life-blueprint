import { UserLevel, XpTransaction } from '../../types';

// XP thresholds for each level (exponential scaling)
// Level 2 = 1000 XP, Level 3 = 2500 XP, scaling exponentially
function computeXpThresholds(): number[] {
  const thresholds: number[] = [0, 0]; // index 0 unused, index 1 = level 1 starts at 0
  for (let level = 2; level <= 100; level++) {
    // Exponential formula: base * (growth ^ (level - 2))
    const base = 1000;
    const growth = 1.18;
    const xp = Math.round(base * Math.pow(growth, level - 2));
    thresholds.push(xp);
  }
  return thresholds;
}

const XP_THRESHOLDS = computeXpThresholds();

// Cumulative XP required to reach a given level
function cumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let l = 2; l <= level; l++) {
    total += XP_THRESHOLDS[l] ?? 0;
  }
  return total;
}

export function calculateLevel(totalXp: number): number {
  let level = 1;
  let cumulative = 0;
  for (let l = 2; l <= 100; l++) {
    cumulative += XP_THRESHOLDS[l] ?? 0;
    if (totalXp >= cumulative) {
      level = l;
    } else {
      break;
    }
  }
  return level;
}

export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > 100) return 0;
  return XP_THRESHOLDS[level] ?? 0;
}

export function getLevelProgress(totalXp: number): {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  progressPercent: number;
} {
  const level = calculateLevel(totalXp);
  if (level >= 100) {
    return { level: 100, currentXp: totalXp, xpToNextLevel: 0, progressPercent: 100 };
  }
  const xpAtCurrentLevel = cumulativeXpForLevel(level);
  const xpAtNextLevel = cumulativeXpForLevel(level + 1);
  const currentXp = totalXp - xpAtCurrentLevel;
  const xpToNextLevel = xpAtNextLevel - xpAtCurrentLevel;
  const progressPercent = xpToNextLevel > 0 ? Math.min(100, (currentXp / xpToNextLevel) * 100) : 100;
  return { level, currentXp, xpToNextLevel, progressPercent };
}

export type LevelTier = UserLevel['tier'];

export function getTier(level: number): LevelTier {
  if (level >= 100) return 'legendary';
  if (level >= 75) return 'diamond';
  if (level >= 50) return 'platinum';
  if (level >= 25) return 'gold';
  if (level >= 10) return 'silver';
  return 'bronze';
}

export const TIER_COLORS: Record<LevelTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
  legendary: '#6C63FF',
};

export const LEVEL_MILESTONES = [10, 25, 50, 75, 100];

export function isMilestoneLevel(level: number): boolean {
  return LEVEL_MILESTONES.includes(level);
}

export function buildUserLevel(userId: string, totalXp: number): UserLevel {
  const { level, currentXp, xpToNextLevel, progressPercent } = getLevelProgress(totalXp);
  return {
    userId,
    level,
    totalXp,
    xpToNextLevel,
    progressPercent,
    tier: getTier(level),
    updatedAt: new Date().toISOString(),
  };
}
