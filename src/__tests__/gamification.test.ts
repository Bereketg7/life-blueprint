import { generateDailyQuests, updateQuestProgress, expireOldQuests, getCompletedQuestRewards } from '../services/gamification/quests';
import { xpRequiredForLevel, getLevelFromXp, getTierForLevel, createUserLevel, addXp, getLevelProgress } from '../services/gamification/leveling';
import { createBattlePass, addBattlePassXp, generateSeasonalChallenges, getCurrentSeason } from '../services/gamification/battlePass';
import { UserLevel } from '../types';

function makeUserLevel(level = 1): UserLevel {
  return {
    userId: 'u1',
    level,
    xp: 0,
    xpToNext: 1000,
    tier: 'bronze',
    unlockedFeatures: [],
    coins: 0,
  };
}

// ======================== QUESTS ========================
describe('generateDailyQuests', () => {
  it('generates 3–5 quests', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    expect(quests.length).toBeGreaterThanOrEqual(3);
    expect(quests.length).toBeLessThanOrEqual(5);
  });

  it('generates more quests for higher difficulty levels', () => {
    const lowLevelQuests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const highLevelQuests = generateDailyQuests('u1', makeUserLevel(90), 0);
    expect(highLevelQuests.length).toBeGreaterThanOrEqual(lowLevelQuests.length);
  });

  it('each quest has required fields', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(5), 0);
    for (const q of quests) {
      expect(typeof q.id).toBe('string');
      expect(typeof q.title).toBe('string');
      expect(q.status).toBe('active');
      expect(q.current).toBe(0);
      expect(q.target).toBeGreaterThan(0);
      expect(q.reward.xp).toBeGreaterThan(0);
      expect(q.reward.coins).toBeGreaterThan(0);
    }
  });

  it('quest expiry is in the future', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    for (const q of quests) {
      expect(new Date(q.expiresAt).getTime()).toBeGreaterThan(Date.now());
    }
  });
});

describe('updateQuestProgress', () => {
  it('increments current value', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const quest = quests[0];
    const updated = updateQuestProgress(quest, 1);
    expect(updated.current).toBe(1);
  });

  it('marks quest as completed when target reached', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const quest = quests[0];
    const updated = updateQuestProgress(quest, quest.target);
    expect(updated.status).toBe('completed');
  });

  it('does not exceed target', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const quest = quests[0];
    const updated = updateQuestProgress(quest, quest.target + 100);
    expect(updated.current).toBe(quest.target);
  });
});

describe('expireOldQuests', () => {
  it('marks past-expiry quests as expired', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const expired = quests.map(q => ({ ...q, expiresAt: pastDate }));
    const result = expireOldQuests(expired);
    expect(result.every(q => q.status === 'expired')).toBe(true);
  });

  it('keeps future quests as active', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const result = expireOldQuests(quests);
    expect(result.every(q => q.status === 'active')).toBe(true);
  });
});

describe('getCompletedQuestRewards', () => {
  it('sums rewards of completed quests', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const completed = quests.map(q => ({ ...q, status: 'completed' as const }));
    const rewards = getCompletedQuestRewards(completed);
    expect(rewards.xp).toBeGreaterThan(0);
    expect(rewards.coins).toBeGreaterThan(0);
  });

  it('returns zero for no completed quests', () => {
    const quests = generateDailyQuests('u1', makeUserLevel(1), 0);
    const rewards = getCompletedQuestRewards(quests);
    expect(rewards.xp).toBe(0);
    expect(rewards.coins).toBe(0);
  });
});

// ======================== LEVELING ========================
describe('xpRequiredForLevel', () => {
  it('returns 0 for level 1', () => {
    expect(xpRequiredForLevel(1)).toBe(0);
  });

  it('returns 1000 for level 2', () => {
    expect(xpRequiredForLevel(2)).toBe(1000);
  });

  it('increases exponentially', () => {
    const l2 = xpRequiredForLevel(2);
    const l3 = xpRequiredForLevel(3);
    const l4 = xpRequiredForLevel(4);
    expect(l3).toBeGreaterThan(l2);
    expect(l4).toBeGreaterThan(l3);
  });
});

describe('getLevelFromXp', () => {
  it('returns level 1 for 0 XP', () => {
    expect(getLevelFromXp(0)).toBe(1);
  });

  it('returns level 2 for exactly 1000 XP', () => {
    expect(getLevelFromXp(1000)).toBe(2);
  });

  it('returns correct level for moderate XP', () => {
    const totalFor5 = [2, 3, 4, 5].reduce((s, l) => s + xpRequiredForLevel(l), 0);
    expect(getLevelFromXp(totalFor5)).toBe(5);
  });
});

describe('getTierForLevel', () => {
  it('returns bronze for level 1', () => {
    expect(getTierForLevel(1)).toBe('bronze');
  });

  it('returns silver for level 25', () => {
    expect(getTierForLevel(25)).toBe('silver');
  });

  it('returns legendary for level 100', () => {
    expect(getTierForLevel(100)).toBe('legendary');
  });
});

describe('addXp', () => {
  it('increases total XP', () => {
    const level = createUserLevel('u1');
    const { updatedLevel } = addXp(level, 100, 'quest', 'Quest completed');
    expect(updatedLevel.xp).toBe(100);
  });

  it('levels up when enough XP accumulated', () => {
    const level = createUserLevel('u1');
    const { leveledUp, updatedLevel } = addXp(level, 1000, 'quest', 'Big quest');
    expect(leveledUp).toBe(true);
    expect(updatedLevel.level).toBe(2);
  });

  it('creates XP transaction record', () => {
    const level = createUserLevel('u1');
    const { transaction } = addXp(level, 50, 'achievement', 'Achievement earned');
    expect(transaction.amount).toBe(50);
    expect(transaction.source).toBe('achievement');
    expect(typeof transaction.id).toBe('string');
  });

  it('unlocks features at correct levels', () => {
    const level = createUserLevel('u1');
    // Add enough XP to reach level 10
    const xpFor10 = [2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((s, l) => s + xpRequiredForLevel(l), 0);
    const { updatedLevel } = addXp(level, xpFor10, 'manual', 'Test');
    expect(updatedLevel.unlockedFeatures).toContain('ai_coach');
  });
});

describe('getLevelProgress', () => {
  it('returns 0 for new user', () => {
    const level = createUserLevel('u1');
    expect(getLevelProgress(level)).toBe(0);
  });

  it('returns > 0 when some XP accumulated', () => {
    const level = createUserLevel('u1');
    const { updatedLevel } = addXp(level, 500, 'quest', 'test');
    expect(getLevelProgress(updatedLevel)).toBeGreaterThan(0);
  });

  it('returns 100 for max level', () => {
    const level: UserLevel = { ...createUserLevel('u1'), level: 100, xp: 999999 };
    expect(getLevelProgress(level)).toBe(100);
  });
});

// ======================== BATTLE PASS ========================
describe('createBattlePass', () => {
  it('creates a battle pass with correct structure', () => {
    const bp = createBattlePass('u1');
    expect(bp.tier).toBe(0);
    expect(bp.progress).toBe(0);
    expect(bp.isPremium).toBe(false);
    expect(bp.rewards.length).toBe(100); // 50 tiers × 2 tracks
  });

  it('uses current season', () => {
    const bp = createBattlePass('u1');
    expect(bp.season).toBe(getCurrentSeason());
  });
});

describe('addBattlePassXp', () => {
  it('increases progress', () => {
    const bp = createBattlePass('u1');
    const { updatedPass } = addBattlePassXp(bp, 200);
    expect(updatedPass.progress).toBe(200);
  });

  it('advances tier when 500 XP accumulated', () => {
    const bp = createBattlePass('u1');
    const { updatedPass, newTiersUnlocked } = addBattlePassXp(bp, 500);
    expect(updatedPass.tier).toBe(1);
    expect(newTiersUnlocked).toBe(1);
  });

  it('does not exceed max tier', () => {
    const bp = createBattlePass('u1');
    const { updatedPass } = addBattlePassXp(bp, 999999);
    expect(updatedPass.tier).toBeLessThanOrEqual(50);
  });

  it('unlocks free rewards for non-premium users', () => {
    const bp = createBattlePass('u1');
    const { unlockedRewards } = addBattlePassXp(bp, 500);
    const freeRewards = unlockedRewards.filter(r => !r.isPremium);
    expect(freeRewards.length).toBeGreaterThan(0);
  });
});

describe('generateSeasonalChallenges', () => {
  it('generates challenges for the given season', () => {
    const challenges = generateSeasonalChallenges(1);
    expect(challenges.length).toBeGreaterThan(0);
  });

  it('each challenge has required fields', () => {
    const challenges = generateSeasonalChallenges(1);
    for (const c of challenges) {
      expect(typeof c.id).toBe('string');
      expect(typeof c.title).toBe('string');
      expect(c.target).toBeGreaterThan(0);
      expect(c.reward.xp).toBeGreaterThan(0);
    }
  });
});
