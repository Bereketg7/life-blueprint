import {
  SyncJob,
  AuthUser,
  WearableDevice,
  WearableSyncLog,
  MealRecognitionResult,
  CachedMeal,
  Recommendation,
  CoachMessage,
  VoiceCommand,
  HealthPrediction,
  RiskAssessment,
  Quest,
  UserLevel,
  XpTransaction,
  BattlePass,
  SeasonalReward,
  Friend,
  SocialChallenge,
  LeaderboardEntry,
  HealthProvider,
  LabResult,
  HealthReport,
  ReportEmail,
  Biomarker,
  BiomarkerTrend,
  AnalyticsEvent,
  CrashReport,
  Theme,
  AccessibilitySettings,
} from '../types';

// ─── Feature 1: Backend Types ────────────────────────────────────────
describe('SyncJob type', () => {
  test('has correct shape', () => {
    const job: SyncJob = {
      id: 'sync_1',
      action: 'create',
      collection: 'activities',
      data: { id: '1' },
      timestamp: Date.now(),
      status: 'pending',
    };
    expect(job.action).toBe('create');
    expect(['pending', 'synced', 'failed']).toContain(job.status);
  });
});

describe('AuthUser type', () => {
  test('has required fields', () => {
    const user: AuthUser = { uid: 'uid_1', email: 'test@test.com', displayName: 'Test', photoURL: '' };
    expect(user.uid).toBe('uid_1');
    expect(user.email).toBe('test@test.com');
  });
});

// ─── Feature 2: Wearable Types ───────────────────────────────────────
describe('WearableDevice type', () => {
  test('supports all device types', () => {
    const types: WearableDevice['type'][] = ['apple_health', 'fitbit', 'garmin'];
    types.forEach((type) => {
      const device: WearableDevice = { id: '1', type, name: 'Test', lastSync: '', status: 'connected', userId: 'u1' };
      expect(device.type).toBe(type);
    });
  });
});

describe('WearableSyncLog type', () => {
  test('dataImported has numeric fields', () => {
    const log: WearableSyncLog = {
      id: 'log_1',
      deviceId: 'dev_1',
      dataImported: { steps: 8000, heartRate: 72, sleepDuration: 7.5, caloriesBurned: 450 },
      timestamp: new Date().toISOString(),
    };
    expect(typeof log.dataImported.steps).toBe('number');
    expect(log.dataImported.heartRate).toBe(72);
  });
});

// ─── Feature 3: Meal Recognition Types ───────────────────────────────
describe('MealRecognitionResult type', () => {
  test('has confidence and macros', () => {
    const result: MealRecognitionResult = {
      mealName: 'Grilled Chicken',
      confidence: 92,
      suggestedMacros: { calories: 350, protein: 45, carbs: 0, fat: 15 },
      portions: ['1 serving'],
      source: 'vision_api',
    };
    expect(result.confidence).toBe(92);
    expect(result.suggestedMacros.protein).toBe(45);
  });
});

describe('CachedMeal type', () => {
  test('has frequency field', () => {
    const meal: CachedMeal = { id: 'm1', name: 'Oats', calories: 300, protein: 10, carbs: 55, fat: 6, frequency: 5 };
    expect(meal.frequency).toBe(5);
  });
});

// ─── Feature 4: Recommendations ──────────────────────────────────────
describe('Recommendation type', () => {
  test('supports all types', () => {
    const types: Recommendation['type'][] = ['workout', 'meal', 'rest', 'hydration', 'meditation'];
    types.forEach((type) => {
      const rec: Recommendation = {
        id: '1', userId: 'u1', type, title: 'T', description: 'D', reason: 'R',
        action: { type: 'activity', payload: {} },
        confidence: 80, userResponse: 'pending', createdAt: '',
      };
      expect(rec.type).toBe(type);
    });
  });
});

// ─── Feature 5: Coach Types ──────────────────────────────────────────
describe('CoachMessage type', () => {
  test('role is user or coach', () => {
    const msg: CoachMessage = { id: 'm1', userId: 'u1', role: 'coach', content: 'Hello!', timestamp: '' };
    expect(['user', 'coach']).toContain(msg.role);
  });
});

describe('VoiceCommand type', () => {
  test('has action and parameters', () => {
    const cmd: VoiceCommand = { command: 'log 500 calories', action: 'log_meal', parameters: { calories: 500 } };
    expect(cmd.action).toBe('log_meal');
    expect(cmd.parameters.calories).toBe(500);
  });
});

// ─── Feature 6: Analytics Types ──────────────────────────────────────
describe('HealthPrediction type', () => {
  test('has prediction object', () => {
    const pred: HealthPrediction = {
      id: 'p1', userId: 'u1', type: 'weight_loss', confidence: 75,
      prediction: { projectedValue: 2, timeframe: '8 weeks', date: '2024-03-01' },
      factors: ['caloric deficit'], createdAt: '',
    };
    expect(pred.confidence).toBe(75);
    expect(pred.prediction.projectedValue).toBe(2);
  });
});

describe('RiskAssessment type', () => {
  test('riskScore is a number', () => {
    const assessment: RiskAssessment = {
      type: 'injury', riskScore: 45,
      factors: [{ name: 'overtraining', impact: 45 }],
      recommendation: 'Rest tomorrow',
    };
    expect(typeof assessment.riskScore).toBe('number');
  });
});

// ─── Feature 7: Quest Types ──────────────────────────────────────────
describe('Quest type', () => {
  test('supports all statuses', () => {
    const statuses: Quest['status'][] = ['pending', 'completed', 'failed'];
    statuses.forEach((status) => {
      const quest: Quest = {
        id: 'q1', userId: 'u1', title: 'T', description: 'D', type: 'workout',
        difficulty: 'easy', target: 1, current: 0,
        reward: { xp: 100, coins: 50 }, deadline: '', status, createdAt: '',
      };
      expect(quest.status).toBe(status);
    });
  });
});

// ─── Feature 8: Level Types ──────────────────────────────────────────
describe('UserLevel type', () => {
  test('has xpToNextLevel', () => {
    const level: UserLevel = { userId: 'u1', level: 5, totalXp: 5000, xpToNextLevel: 1200, currentXp: 500, lastLevelUpDate: '' };
    expect(level.level).toBe(5);
    expect(typeof level.xpToNextLevel).toBe('number');
  });
});

describe('XpTransaction type', () => {
  test('source is a valid type', () => {
    const sources: XpTransaction['source'][] = ['quest', 'activity', 'achievement', 'streak', 'bonus'];
    sources.forEach((source) => {
      const tx: XpTransaction = { id: 't1', userId: 'u1', amount: 100, source, description: '', timestamp: '' };
      expect(tx.source).toBe(source);
    });
  });
});

// ─── Feature 9: Battle Pass Types ────────────────────────────────────
describe('BattlePass type', () => {
  test('track is free or premium', () => {
    const tracks: BattlePass['track'][] = ['free', 'premium'];
    tracks.forEach((track) => {
      const bp: BattlePass = {
        id: 'bp1', userId: 'u1', seasonNumber: 1, level: 0, xp: 0,
        track, rewardsClaimed: [], startDate: '', endDate: '',
      };
      expect(bp.track).toBe(track);
    });
  });
});

describe('SeasonalReward type', () => {
  test('trackRequired can be both', () => {
    const reward: SeasonalReward = { id: 'r1', seasonNumber: 1, level: 10, type: 'badge', reward: 'gold_badge', trackRequired: 'both' };
    expect(reward.trackRequired).toBe('both');
  });
});

// ─── Feature 10: Social Types ─────────────────────────────────────────
describe('Friend type', () => {
  test('has level and streak', () => {
    const friend: Friend = {
      userId: 'u1', friendId: 'u2', username: 'Alice', profilePhoto: '',
      level: 10, streak: 7, status: 'active', addedAt: '',
    };
    expect(friend.level).toBe(10);
    expect(friend.streak).toBe(7);
  });
});

describe('LeaderboardEntry type', () => {
  test('rank is a number', () => {
    const entry: LeaderboardEntry = { rank: 1, userId: 'u1', username: 'Alice', level: 20, xp: 20000, streak: 30, score: 50000 };
    expect(entry.rank).toBe(1);
  });
});

// ─── Feature 11: Healthcare Types ────────────────────────────────────
describe('HealthProvider type', () => {
  test('sharePermissions has all fields', () => {
    const provider: HealthProvider = {
      id: 'hp1', userId: 'u1', providerName: 'Dr. Smith', specialty: 'GP', email: 'dr@clinic.com',
      fhirEndpoint: 'https://fhir.clinic.com',
      sharePermissions: { activityLogs: true, nutritionLogs: true, sleepLogs: true, weight: true, bloodPressure: false },
      connectedAt: '',
    };
    expect(provider.sharePermissions.activityLogs).toBe(true);
    expect(provider.sharePermissions.bloodPressure).toBe(false);
  });
});

describe('LabResult type', () => {
  test('status reflects value relative to range', () => {
    const result: LabResult = {
      id: 'lr1', userId: 'u1', testName: 'HbA1c', value: 12,
      unit: '%', referenceRange: { min: 4, max: 5.6 }, status: 'high',
      testDate: '', provider: 'Lab Corp',
    };
    expect(result.status).toBe('high');
    expect(result.value > result.referenceRange.max).toBe(true);
  });
});

// ─── Feature 12: Reports Types ───────────────────────────────────────
describe('HealthReport type', () => {
  test('metrics has all required fields', () => {
    const report: HealthReport = {
      id: 'r1', userId: 'u1', type: 'weekly',
      period: { start: '2024-01-01', end: '2024-01-07' },
      metrics: { totalActivity: 3, avgCalories: 2000, avgSleep: 7.5, avgMood: 7, streakDays: 7, goalsCompleted: 2 },
      insights: [], recommendations: [], generatedAt: '',
    };
    expect(report.metrics.avgSleep).toBe(7.5);
  });
});

// ─── Feature 13: Biomarker Types ─────────────────────────────────────
describe('Biomarker type', () => {
  test('status is normal warning or alert', () => {
    const statuses: Biomarker['status'][] = ['normal', 'warning', 'alert'];
    statuses.forEach((status) => {
      const b: Biomarker = { id: 'b1', userId: 'u1', type: 'hrv', value: 50, unit: 'ms', timestamp: '', status };
      expect(b.status).toBe(status);
    });
  });
});

// ─── Feature 14: Analytics Types ─────────────────────────────────────
describe('AnalyticsEvent type', () => {
  test('has name userId and properties', () => {
    const event: AnalyticsEvent = { name: 'workout_logged', userId: 'u1', properties: { duration: 30 }, timestamp: '' };
    expect(event.name).toBe('workout_logged');
    expect(event.properties.duration).toBe(30);
  });
});

// ─── Feature 15: Theme & Accessibility Types ──────────────────────────
describe('Theme type', () => {
  test('has colors with text sub-object', () => {
    const theme: Theme = {
      id: 'dark', name: 'Dark', isDark: true,
      colors: {
        primary: '#6C63FF', secondary: '#FF6B6B', background: '#000', card: '#111',
        text: { primary: '#fff', secondary: '#aaa', muted: '#666' },
      },
    };
    expect(theme.isDark).toBe(true);
    expect(theme.colors.text.primary).toBe('#fff');
  });
});

describe('AccessibilitySettings type', () => {
  test('fontSize accepts all valid values', () => {
    const sizes: AccessibilitySettings['fontSize'][] = ['small', 'normal', 'large', 'xlarge'];
    sizes.forEach((fontSize) => {
      const settings: AccessibilitySettings = { fontSize, highContrast: false, dyslexiaFont: false, screenReaderEnabled: false, hapticFeedback: true };
      expect(settings.fontSize).toBe(fontSize);
    });
  });
});
