import { UserLevel, XpTransaction } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Exponential XP thresholds: Level 2 = 1000 XP, ×1.18/level
const XP_BASE = 1000;
const XP_MULTIPLIER = 1.18;
const MAX_LEVEL = 100;

export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(XP_BASE * Math.pow(XP_MULTIPLIER, level - 2));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let l = 2; l <= level; l++) {
    total += xpRequiredForLevel(l);
  }
  return total;
}

export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (level < MAX_LEVEL) {
    const needed = xpRequiredForLevel(level + 1);
    if (accumulated + needed > totalXp) break;
    accumulated += needed;
    level++;
  }
  return level;
}

// 6 Visual tiers
const TIER_THRESHOLDS = [
  { min: 1, max: 20, tier: 'bronze' as const },
  { min: 21, max: 40, tier: 'silver' as const },
  { min: 41, max: 60, tier: 'gold' as const },
  { min: 61, max: 75, tier: 'diamond' as const },
  { min: 76, max: 90, tier: 'platinum' as const },
  { min: 91, max: 100, tier: 'legendary' as const },
];

export function getTierForLevel(level: number): UserLevel['tier'] {
  const found = TIER_THRESHOLDS.find(t => level >= t.min && level <= t.max);
  return found?.tier ?? 'bronze';
}

// 13 feature unlocks
const FEATURE_UNLOCKS: { level: number; feature: string }[] = [
  { level: 5, feature: 'custom_goals' },
  { level: 10, feature: 'ai_coach' },
  { level: 15, feature: 'battle_pass' },
  { level: 20, feature: 'social_challenges' },
  { level: 25, feature: 'advanced_analytics' },
  { level: 30, feature: 'healthcare_sharing' },
  { level: 35, feature: 'voice_commands' },
  { level: 40, feature: 'wearable_sync' },
  { level: 50, feature: 'health_reports' },
  { level: 60, feature: 'predictive_analytics' },
  { level: 75, feature: 'personal_coach_session' },
  { level: 90, feature: 'exclusive_challenges' },
  { level: 100, feature: 'legendary_status' },
];

export function getUnlockedFeatures(level: number): string[] {
  return FEATURE_UNLOCKS.filter(f => f.level <= level).map(f => f.feature);
}

export function createUserLevel(userId: string): UserLevel {
  return {
    userId,
    level: 1,
    xp: 0,
    xpToNext: xpRequiredForLevel(2),
    tier: 'bronze',
    unlockedFeatures: [],
    coins: 0,
  };
}

export function addXp(
  userLevel: UserLevel,
  amount: number,
  source: XpTransaction['source'],
  description: string,
): { updatedLevel: UserLevel; transaction: XpTransaction; leveledUp: boolean; newFeatures: string[] } {
  const newTotalXp = userLevel.xp + amount;
  const newLevel = Math.min(MAX_LEVEL, getLevelFromXp(newTotalXp));
  const leveledUp = newLevel > userLevel.level;
  const tier = getTierForLevel(newLevel);
  const unlockedFeatures = getUnlockedFeatures(newLevel);
  const newFeatures = unlockedFeatures.filter(f => !userLevel.unlockedFeatures.includes(f));

  const xpToNext = newLevel < MAX_LEVEL
    ? xpRequiredForLevel(newLevel + 1)
    : 0;

  const updatedLevel: UserLevel = {
    ...userLevel,
    level: newLevel,
    xp: newTotalXp,
    xpToNext,
    tier,
    unlockedFeatures,
  };

  const transaction: XpTransaction = {
    id: generateId(),
    userId: userLevel.userId,
    amount,
    source,
    description,
    timestamp: new Date().toISOString(),
  };

  return { updatedLevel, transaction, leveledUp, newFeatures };
}

export function addCoins(userLevel: UserLevel, coins: number): UserLevel {
  return { ...userLevel, coins: userLevel.coins + coins };
}

export function getLevelProgress(userLevel: UserLevel): number {
  if (userLevel.level >= MAX_LEVEL) return 100;
  const xpForCurrent = totalXpForLevel(userLevel.level);
  const xpInCurrentLevel = userLevel.xp - xpForCurrent;
  const xpNeeded = xpRequiredForLevel(userLevel.level + 1);
  return Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));
}
