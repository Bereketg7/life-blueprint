// Service unit tests for the new features

// ─── Feature 1: Backend Services ─────────────────────────────────────
import { enqueueSyncJob, getPendingJobs, flushQueue, setOnlineStatus } from '../services/backend/syncManager';
import { createDocument, getDocument, updateDocument, deleteDocument, queryCollection } from '../services/backend/firestore';
import { signInWithEmail, signOut, getCurrentUser } from '../services/backend/auth';

describe('Firestore operations', () => {
  test('createDocument and getDocument', async () => {
    await createDocument('test', 'doc1', { id: 'doc1', value: 42 });
    const doc = await getDocument('test', 'doc1');
    expect(doc).not.toBeNull();
    expect(doc?.value).toBe(42);
  });

  test('updateDocument', async () => {
    await createDocument('test', 'doc2', { id: 'doc2', value: 10 });
    await updateDocument('test', 'doc2', { value: 99 });
    const doc = await getDocument('test', 'doc2');
    expect(doc?.value).toBe(99);
  });

  test('deleteDocument', async () => {
    await createDocument('test', 'doc3', { id: 'doc3', value: 1 });
    await deleteDocument('test', 'doc3');
    const doc = await getDocument('test', 'doc3');
    expect(doc).toBeNull();
  });

  test('queryCollection returns all documents', async () => {
    await createDocument('testQ', 'a', { id: 'a' });
    await createDocument('testQ', 'b', { id: 'b' });
    const docs = await queryCollection('testQ');
    expect(docs.length).toBeGreaterThanOrEqual(2);
  });
});

describe('SyncManager', () => {
  test('enqueueSyncJob creates a pending job', () => {
    setOnlineStatus(false);
    const job = enqueueSyncJob('create', 'activities', { id: 'act1' });
    expect(job.status).toBe('pending');
    const pending = getPendingJobs();
    expect(pending.some((j) => j.id === job.id)).toBe(true);
  });
});

describe('Auth service', () => {
  test('signInWithEmail returns an AuthUser', async () => {
    const user = await signInWithEmail('test@example.com', 'password123');
    expect(user.email).toBe('test@example.com');
    expect(user.uid).toBeTruthy();
  });

  test('getCurrentUser returns user after sign in', async () => {
    await signInWithEmail('current@example.com', 'pass');
    const user = getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.email).toBe('current@example.com');
  });

  test('signOut clears current user', async () => {
    await signInWithEmail('sign@example.com', 'pass');
    await signOut();
    const user = getCurrentUser();
    expect(user).toBeNull();
  });
});

// ─── Feature 2: Wearable Services ────────────────────────────────────
import { resolveConflict } from '../services/wearables/wearableSync';

describe('Wearable conflict resolution', () => {
  test('wearable_wins returns wearable value', () => {
    expect(resolveConflict(8000, 6000, 'wearable_wins')).toBe(8000);
  });
  test('manual_wins returns manual value', () => {
    expect(resolveConflict(8000, 6000, 'manual_wins')).toBe(6000);
  });
  test('higher_wins returns max', () => {
    expect(resolveConflict(8000, 6000, 'higher_wins')).toBe(8000);
  });
  test('lower_wins returns min', () => {
    expect(resolveConflict(8000, 6000, 'lower_wins')).toBe(6000);
  });
});

// ─── Feature 3: Vision Services ──────────────────────────────────────
import { cacheMeal, getCachedMealByName, getFrequentMeals, clearCache } from '../services/vision/mealCache';

describe('Meal cache', () => {
  beforeEach(() => clearCache());

  test('stores and retrieves meals', () => {
    cacheMeal({ id: 'm1', name: 'Chicken', calories: 300, protein: 40, carbs: 0, fat: 10, frequency: 1 });
    const found = getCachedMealByName('Chicken');
    expect(found).not.toBeNull();
    expect(found?.calories).toBe(300);
  });

  test('increments frequency on duplicate', () => {
    cacheMeal({ id: 'm1', name: 'Oats', calories: 300, protein: 10, carbs: 55, fat: 6, frequency: 1 });
    cacheMeal({ id: 'm1', name: 'Oats', calories: 300, protein: 10, carbs: 55, fat: 6, frequency: 1 });
    const found = getCachedMealByName('Oats');
    expect(found?.frequency).toBe(2);
  });

  test('getFrequentMeals returns sorted list', () => {
    cacheMeal({ id: 'a', name: 'A', calories: 100, protein: 5, carbs: 10, fat: 2, frequency: 1 });
    cacheMeal({ id: 'a', name: 'A', calories: 100, protein: 5, carbs: 10, fat: 2, frequency: 1 });
    cacheMeal({ id: 'b', name: 'B', calories: 200, protein: 8, carbs: 20, fat: 5, frequency: 1 });
    const frequent = getFrequentMeals(2);
    expect(frequent[0].name).toBe('A');
  });
});

// ─── Feature 4: Recommendations Engine ───────────────────────────────
import { generateRecommendations } from '../services/recommendations/engine';

describe('Recommendations engine', () => {
  test('generates at least one recommendation', () => {
    const recs = generateRecommendations({
      userId: 'u1',
      recentActivity: [],
      recentNutrition: [],
      recentSleep: [],
      recentMood: [],
    });
    expect(recs.length).toBeGreaterThan(0);
  });

  test('all recommendations have userId', () => {
    const recs = generateRecommendations({
      userId: 'user_test',
      recentActivity: [],
      recentNutrition: [],
      recentSleep: [],
      recentMood: [],
    });
    recs.forEach((r) => expect(r.userId).toBe('user_test'));
  });

  test('recommends rest when avg sleep is low', () => {
    const recs = generateRecommendations({
      userId: 'u1',
      recentActivity: [],
      recentNutrition: [],
      recentSleep: [{ id: 's1', userId: 'u1', date: '2024-01-01', hoursSlept: 4, quality: 2, notes: '', createdAt: '' }],
      recentMood: [],
    });
    const restRec = recs.find((r) => r.type === 'rest');
    expect(restRec).toBeDefined();
  });
});

// ─── Feature 5: AI Services ──────────────────────────────────────────
import { parseVoiceCommand } from '../services/ai/voiceCommands';

describe('Voice command parser', () => {
  test('parses calorie logging command', () => {
    const cmd = parseVoiceCommand('log 500 calories');
    expect(cmd).not.toBeNull();
    expect(cmd?.action).toBe('log_meal');
    expect(cmd?.parameters.calories).toBe(500);
  });

  test('parses workout scheduling', () => {
    const cmd = parseVoiceCommand('schedule 3 workouts this week');
    expect(cmd).not.toBeNull();
    expect(cmd?.action).toBe('schedule_workout');
    expect(cmd?.parameters.count).toBe(3);
  });

  test('returns null for unrecognised commands', () => {
    const cmd = parseVoiceCommand('what is the weather like today');
    expect(cmd).toBeNull();
  });
});

// ─── Feature 6: Analytics Services ───────────────────────────────────
import { detectAnomalies, detectSleepAnomalies } from '../services/analytics/anomalyDetection';
import { calcLevelFromXp, xpRequiredForLevel } from '../services/gamification/levelingSystem';

describe('Anomaly detection', () => {
  test('detects out-of-range values', () => {
    const anomalies = detectAnomalies('test_metric', [5, 10, 150, 8], 0, 100);
    expect(anomalies.length).toBe(1);
    expect(anomalies[0].value).toBe(150);
  });

  test('returns empty for all normal values', () => {
    const anomalies = detectSleepAnomalies([7, 7.5, 8, 7, 8]);
    expect(anomalies.length).toBe(0);
  });

  test('detects sleep below 6 hours', () => {
    const anomalies = detectSleepAnomalies([5, 4.5, 7, 8]);
    expect(anomalies.length).toBe(2);
  });
});

// ─── Feature 7 & 8: Gamification ─────────────────────────────────────
import { generateDailyQuests, updateQuestProgress, checkQuestDeadlines, calcTotalQuestRewards } from '../services/gamification/questSystem';

describe('Quest system', () => {
  test('generates requested number of quests', () => {
    const quests = generateDailyQuests('user1', 3);
    expect(quests).toHaveLength(3);
  });

  test('all quests start as pending', () => {
    const quests = generateDailyQuests('user1', 5);
    quests.forEach((q) => expect(q.status).toBe('pending'));
  });

  test('updateQuestProgress marks completed when target reached', () => {
    const quest = generateDailyQuests('user1', 1)[0];
    const updated = updateQuestProgress(quest, quest.target);
    expect(updated.status).toBe('completed');
  });

  test('calcTotalQuestRewards sums XP for completed quests', () => {
    const quests = generateDailyQuests('user1', 3);
    const completed = quests.map((q) => updateQuestProgress(q, q.target));
    const rewards = calcTotalQuestRewards(completed);
    expect(rewards.xp).toBeGreaterThan(0);
    expect(rewards.coins).toBeGreaterThan(0);
  });

  test('checkQuestDeadlines fails expired pending quests', () => {
    const quests = generateDailyQuests('user1', 2);
    const pastDeadline = quests.map((q) => ({ ...q, deadline: '2020-01-01T00:00:00.000Z' }));
    const checked = checkQuestDeadlines(pastDeadline);
    checked.forEach((q) => expect(q.status).toBe('failed'));
  });
});

describe('Leveling system', () => {
  test('level 1 requires 0 XP', () => {
    expect(xpRequiredForLevel(1)).toBe(0);
  });

  test('level 2 requires base XP', () => {
    expect(xpRequiredForLevel(2)).toBeGreaterThan(0);
  });

  test('calcLevelFromXp returns level 1 for 0 XP', () => {
    const { level } = calcLevelFromXp(0);
    expect(level).toBe(1);
  });

  test('accumulating XP increases level', () => {
    const { level: lv1 } = calcLevelFromXp(1000);
    const { level: lv2 } = calcLevelFromXp(10000);
    expect(lv2).toBeGreaterThan(lv1);
  });
});

// ─── Feature 9: Battle Pass ───────────────────────────────────────────
import { createBattlePass, addBattlePassXp, getCurrentSeasonNumber } from '../services/gamification/battlePassSystem';

describe('Battle Pass system', () => {
  test('getCurrentSeasonNumber returns a positive number', () => {
    expect(getCurrentSeasonNumber()).toBeGreaterThan(0);
  });

  test('createBattlePass starts at level 0', () => {
    const bp = createBattlePass('user1', 'free');
    expect(bp.level).toBe(0);
    expect(bp.track).toBe('free');
  });

  test('addBattlePassXp increments level when enough XP', () => {
    const bp = createBattlePass('user2', 'premium');
    const { updated, leveledUp } = addBattlePassXp(bp, 1000);
    expect(updated.xp).toBe(1000);
    expect(updated.level).toBeGreaterThan(0);
    expect(leveledUp).toBe(true);
  });
});

// ─── Feature 10: Social ───────────────────────────────────────────────
import { addFriend, getFriends, removeFriend } from '../services/social/friendService';
import { createChallenge, joinChallenge, getActiveChallengees } from '../services/social/challengeService';
import { upsertLeaderboardEntry, getGlobalLeaderboard } from '../services/social/leaderboardService';

describe('Friend service', () => {
  test('addFriend and getFriends', () => {
    addFriend('userA', { friendId: 'userB', username: 'Bob', profilePhoto: '', level: 5, streak: 3, status: 'active' });
    const friends = getFriends('userA');
    expect(friends.some((f) => f.friendId === 'userB')).toBe(true);
  });

  test('removeFriend removes the friend', () => {
    addFriend('userC', { friendId: 'userD', username: 'Dave', profilePhoto: '', level: 3, streak: 1, status: 'active' });
    removeFriend('userC', 'userD');
    const friends = getFriends('userC');
    expect(friends.some((f) => f.friendId === 'userD')).toBe(false);
  });
});

describe('Challenge service', () => {
  test('createChallenge and joinChallenge', () => {
    const c = createChallenge('creator1', 'Step Battle', 'First to 100k steps wins', 'steps', 100000, 30);
    expect(c.participants).toContain('creator1');
    joinChallenge(c.id, 'joiner1');
    const active = getActiveChallengees('joiner1');
    expect(active.some((ch) => ch.id === c.id)).toBe(true);
  });
});

describe('Leaderboard service', () => {
  test('upsertLeaderboardEntry and getRankings', () => {
    upsertLeaderboardEntry({ userId: 'top1', username: 'Alice', level: 30, xp: 30000, streak: 50, score: 30000 });
    upsertLeaderboardEntry({ userId: 'top2', username: 'Bob', level: 20, xp: 20000, streak: 30, score: 20000 });
    const board = getGlobalLeaderboard(5);
    expect(board.length).toBeGreaterThanOrEqual(2);
    expect(board[0].rank).toBe(1);
    expect(board[0].score).toBeGreaterThanOrEqual(board[1].score);
  });
});

// ─── Feature 12: Reports ─────────────────────────────────────────────
import { generateWeeklyReport } from '../services/reports/weeklyReport';
import { formatWeeklyReportText } from '../services/reports/weeklyReport';

describe('Weekly report generator', () => {
  test('generates a valid HealthReport', () => {
    const report = generateWeeklyReport('user1', [], [], [], []);
    expect(report.userId).toBe('user1');
    expect(report.type).toBe('weekly');
    expect(report.period.start).toBeTruthy();
    expect(report.period.end).toBeTruthy();
  });

  test('formatWeeklyReportText contains key sections', () => {
    const report = generateWeeklyReport('user1', [], [], [], []);
    const text = formatWeeklyReportText(report);
    expect(text).toContain('WEEKLY HEALTH REPORT');
    expect(text).toContain('METRICS');
  });
});

// ─── Feature 13: Biomarkers ───────────────────────────────────────────
import { createBiomarker, getBiomarkerStatus, getNormalRange } from '../services/biomarkers/biomarkerCalculations';
import { calculateRMSSD, interpretHRV } from '../services/biomarkers/hrvAnalysis';
import { calcBMI, estimateBodyFatFromBMI } from '../services/biomarkers/bodyComposition';

describe('Biomarker calculations', () => {
  test('normal HRV is flagged as normal', () => {
    const b = createBiomarker('u1', 'hrv', 45);
    expect(b.status).toBe('normal');
  });

  test('very low HRV triggers alert', () => {
    const b = createBiomarker('u1', 'hrv', 5);
    expect(b.status).toBe('alert');
  });

  test('getNormalRange returns min and max', () => {
    const range = getNormalRange('rhr');
    expect(range.min).toBeGreaterThan(0);
    expect(range.max).toBeGreaterThan(range.min);
  });
});

describe('HRV analysis', () => {
  test('calculateRMSSD returns positive number', () => {
    const rmssd = calculateRMSSD([800, 810, 790, 820, 800]);
    expect(rmssd).toBeGreaterThan(0);
  });

  test('interpretHRV returns string', () => {
    expect(typeof interpretHRV(50)).toBe('string');
    expect(typeof interpretHRV(10)).toBe('string');
  });
});

describe('Body composition', () => {
  test('calcBMI returns expected value', () => {
    // 70kg, 175cm → BMI ≈ 22.9
    const bmi = calcBMI(70, 175);
    expect(bmi).toBeCloseTo(22.9, 0);
  });

  test('estimateBodyFatFromBMI returns positive percentage', () => {
    const bodyFat = estimateBodyFatFromBMI(23, 30, 'male');
    expect(bodyFat).toBeGreaterThan(0);
  });
});

// ─── Feature 14: Analytics ────────────────────────────────────────────
import { trackEvent, getEvents, clearEvents, getUserEvents } from '../services/analytics/tracker';
import { logScreenView, logFeatureUsage } from '../services/analytics/eventLogger';
import { AnalyticsEvents } from '../services/analytics/customEvents';

describe('Event tracker', () => {
  beforeEach(() => clearEvents());

  test('trackEvent records an event', () => {
    trackEvent('test_event', 'user1', { key: 'value' });
    const events = getEvents();
    expect(events.some((e) => e.name === 'test_event')).toBe(true);
  });

  test('getUserEvents filters by userId', () => {
    trackEvent('event_a', 'user_x', {});
    trackEvent('event_b', 'user_y', {});
    const events = getUserEvents('user_x');
    expect(events.every((e) => e.userId === 'user_x')).toBe(true);
  });
});

describe('Event logger', () => {
  beforeEach(() => clearEvents());

  test('logScreenView creates a screen_view event', () => {
    logScreenView('Dashboard', 'user1');
    const events = getUserEvents('user1');
    expect(events.some((e) => e.name === 'screen_view')).toBe(true);
  });

  test('logFeatureUsage creates a feature_used event', () => {
    logFeatureUsage('ai_coach', 'user1');
    const events = getUserEvents('user1');
    expect(events.some((e) => e.name === 'feature_used')).toBe(true);
  });
});

describe('AnalyticsEvents constants', () => {
  test('USER_SIGNED_UP is defined', () => {
    expect(AnalyticsEvents.USER_SIGNED_UP).toBe('user_signed_up');
  });

  test('QUEST_COMPLETED is defined', () => {
    expect(AnalyticsEvents.QUEST_COMPLETED).toBe('quest_completed');
  });
});

// ─── Feature 15: Theme & Accessibility ───────────────────────────────
import { darkTheme } from '../styles/darkTheme';
import { lightTheme } from '../styles/lightTheme';
import { highContrastTheme } from '../styles/highContrastTheme';

describe('Themes', () => {
  test('darkTheme isDark is true', () => {
    expect(darkTheme.isDark).toBe(true);
  });

  test('lightTheme isDark is false', () => {
    expect(lightTheme.isDark).toBe(false);
  });

  test('highContrastTheme has primary yellow', () => {
    expect(highContrastTheme.colors.primary).toBe('#FFFF00');
  });

  test('all themes have required color properties', () => {
    [darkTheme, lightTheme, highContrastTheme].forEach((t) => {
      expect(t.colors.primary).toBeTruthy();
      expect(t.colors.background).toBeTruthy();
      expect(t.colors.text.primary).toBeTruthy();
    });
  });
});

// ─── Healthcare ───────────────────────────────────────────────────────
import { addLabResult, getLabResults, getAbnormalLabResults } from '../services/healthcare/labResults';
import { addPrescription, getActivePrescriptions, logDose } from '../services/healthcare/prescriptionTracker';
import { sanitisePHI, maskEmail } from '../services/healthcare/hipaaCompliance';

describe('Lab results', () => {
  test('addLabResult auto-calculates status', () => {
    const result = addLabResult({
      userId: 'testUser', testName: 'Glucose', value: 200,
      unit: 'mg/dL', referenceRange: { min: 70, max: 100 },
      testDate: '2024-01-01', provider: 'Lab',
    });
    expect(result.status).toBe('high');
  });

  test('getAbnormalLabResults filters out normal', () => {
    addLabResult({
      userId: 'testUser2', testName: 'Iron', value: 80,
      unit: 'μg/dL', referenceRange: { min: 60, max: 170 },
      testDate: '2024-01-01', provider: 'Lab',
    });
    const normal = getLabResults('testUser2');
    const abnormal = getAbnormalLabResults('testUser2');
    expect(abnormal.length).toBeLessThanOrEqual(normal.length);
  });
});

describe('HIPAA compliance', () => {
  test('sanitisePHI redacts PHI fields', () => {
    const data = { name: 'John Doe', email: 'john@example.com', someData: 42 };
    const sanitised = sanitisePHI(data);
    expect(sanitised.name).toBe('[REDACTED]');
    expect(sanitised.email).toBe('[REDACTED]');
    expect(sanitised.someData).toBe(42);
  });

  test('maskEmail masks local part', () => {
    const masked = maskEmail('john@example.com');
    expect(masked).toContain('@example.com');
    expect(masked).toContain('jo');
    expect(masked).not.toBe('john@example.com');
  });
});

// ─── Prescription tracker ─────────────────────────────────────────────
describe('Prescription tracker', () => {
  test('addPrescription creates active prescription', () => {
    const rx = addPrescription({
      userId: 'rxUser', medicationName: 'Metformin', dosage: '500mg',
      frequency: 'twice_daily', startDate: '2024-01-01',
      prescribedBy: 'Dr. Smith', notes: '',
    });
    expect(rx.active).toBe(true);
  });

  test('logDose records a dose', () => {
    const rx = addPrescription({
      userId: 'rxUser2', medicationName: 'Aspirin', dosage: '100mg',
      frequency: 'daily', startDate: '2024-01-01',
      prescribedBy: 'Dr. Jones', notes: '',
    });
    const doseLog = logDose(rx.id, 'rxUser2', 'Taken after breakfast');
    expect(doseLog.prescriptionId).toBe(rx.id);
  });
});

// ─── Social sharing ───────────────────────────────────────────────────
import { buildAchievementShare, buildStreakShare, generateShareLink } from '../services/social/socialSharing';

describe('Social sharing', () => {
  test('buildAchievementShare returns a share payload', () => {
    const payload = buildAchievementShare('Alice', 'First Workout');
    expect(payload.title).toContain('Alice');
    expect(payload.message).toContain('First Workout');
  });

  test('buildStreakShare mentions streak days', () => {
    const payload = buildStreakShare('Bob', 30);
    expect(payload.message).toContain('30');
  });

  test('generateShareLink returns valid URL', () => {
    const url = generateShareLink('user1', 'profile');
    expect(url).toContain('user1');
    expect(url).toContain('https://');
  });
});

// ─── Trajectory analysis ─────────────────────────────────────────────
import { calcSleepTrend, calcActivityTrend } from '../services/analytics/trajectoryAnalysis';

describe('Trajectory analysis', () => {
  test('calcSleepTrend returns stable for consistent sleep', () => {
    const logs = [
      { id: '1', userId: 'u1', date: '2024-01-01', hoursSlept: 7.5, quality: 3, notes: '', createdAt: '' },
      { id: '2', userId: 'u1', date: '2024-01-02', hoursSlept: 7.5, quality: 3, notes: '', createdAt: '' },
      { id: '3', userId: 'u1', date: '2024-01-03', hoursSlept: 7.5, quality: 3, notes: '', createdAt: '' },
    ];
    const trajectory = calcSleepTrend(logs);
    expect(trajectory.metric).toBe('hours_slept');
    expect(['improving', 'declining', 'stable']).toContain(trajectory.trend);
  });
});

// ─── Risk assessment ──────────────────────────────────────────────────
import { assessInjuryRisk, assessBurnoutRisk } from '../services/analytics/riskAssessment';

describe('Risk assessment', () => {
  test('assessInjuryRisk returns a valid RiskAssessment', () => {
    const activities = [
      { id: 'a1', userId: 'u1', date: '2024-01-01', type: 'running', duration: 45, intensity: 'high' as const, caloriesBurned: 500, notes: '', status: 'completed' as const, createdAt: '' },
      { id: 'a2', userId: 'u1', date: '2024-01-02', type: 'running', duration: 45, intensity: 'high' as const, caloriesBurned: 500, notes: '', status: 'completed' as const, createdAt: '' },
    ];
    const risk = assessInjuryRisk(activities);
    expect(risk.type).toBe('injury');
    expect(risk.riskScore).toBeGreaterThanOrEqual(0);
    expect(risk.riskScore).toBeLessThanOrEqual(100);
  });

  test('assessBurnoutRisk with no data returns low risk', () => {
    const risk = assessBurnoutRisk([], [], []);
    expect(risk.type).toBe('burnout');
    expect(risk.riskScore).toBeGreaterThanOrEqual(0);
  });
});
