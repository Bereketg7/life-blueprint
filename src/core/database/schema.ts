// ── Existing tables (preserved from services/database/schema.ts) ─────────────

export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_LIFE_AREAS_TABLE = `
  CREATE TABLE IF NOT EXISTS life_areas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL
  );
`;

export const CREATE_GOALS_TABLE = `
  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    lifeAreaId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    targetDate TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (lifeAreaId) REFERENCES life_areas(id)
  );
`;

export const CREATE_LOG_ENTRIES_TABLE = `
  CREATE TABLE IF NOT EXISTS log_entries (
    id TEXT PRIMARY KEY,
    goalId TEXT NOT NULL,
    note TEXT NOT NULL,
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (goalId) REFERENCES goals(id)
  );
`;

export const CREATE_PLANS_TABLE = `
  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_PLAN_GOALS_TABLE = `
  CREATE TABLE IF NOT EXISTS plan_goals (
    planId TEXT NOT NULL,
    goalId TEXT NOT NULL,
    PRIMARY KEY (planId, goalId),
    FOREIGN KEY (planId) REFERENCES plans(id),
    FOREIGN KEY (goalId) REFERENCES goals(id)
  );
`;

export const CREATE_AWARENESS_ENTRIES_TABLE = `
  CREATE TABLE IF NOT EXISTS awareness_entries (
    id TEXT PRIMARY KEY,
    lifeAreaId TEXT NOT NULL,
    score INTEGER NOT NULL,
    note TEXT,
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (lifeAreaId) REFERENCES life_areas(id)
  );
`;

// ── New wellness tables ───────────────────────────────────────────────────────

export const CREATE_USER_PROFILES_TABLE = `
  CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
    goalType TEXT NOT NULL,
    activityLevel TEXT NOT NULL,
    dietaryPreferences TEXT NOT NULL DEFAULT '[]',
    healthConditions TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`;

export const CREATE_ACTIVITY_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    intensity TEXT NOT NULL,
    caloriesBurned INTEGER NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const CREATE_SLEEP_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS sleep_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    hoursSlept REAL NOT NULL,
    quality INTEGER NOT NULL,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const CREATE_NUTRITION_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS nutrition_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    mealType TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein REAL NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'logged',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const CREATE_MENTAL_HEALTH_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS mental_health_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    mood INTEGER NOT NULL,
    stress INTEGER NOT NULL,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const CREATE_VITAL_SIGNS_TABLE = `
  CREATE TABLE IF NOT EXISTS vital_signs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    heartRate INTEGER NOT NULL,
    bloodPressureSystolic INTEGER NOT NULL,
    bloodPressureDiastolic INTEGER NOT NULL,
    weight REAL NOT NULL,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const CREATE_DAILY_PLAN_ITEMS_TABLE = `
  CREATE TABLE IF NOT EXISTS daily_plan_items (
    id TEXT PRIMARY KEY,
    planId TEXT NOT NULL,
    day INTEGER NOT NULL,
    timeOfDay TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (planId) REFERENCES weekly_plans(id)
  );
`;

export const CREATE_WEEKLY_PLANS_TABLE = `
  CREATE TABLE IF NOT EXISTS weekly_plans (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    weekStartDate TEXT NOT NULL,
    weekEndDate TEXT NOT NULL,
    items TEXT NOT NULL DEFAULT '[]',
    goalType TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const CREATE_ACHIEVEMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    badgeId TEXT NOT NULL,
    unlockedAt TEXT NOT NULL,
    streakCount INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const CREATE_STREAKS_TABLE = `
  CREATE TABLE IF NOT EXISTS streaks (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL UNIQUE,
    currentStreak INTEGER NOT NULL DEFAULT 0,
    longestStreak INTEGER NOT NULL DEFAULT 0,
    lastLogDate TEXT NOT NULL,
    totalDaysLogged INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES user_profiles(id)
  );
`;

export const ALL_SCHEMAS = [
  CREATE_USERS_TABLE,
  CREATE_LIFE_AREAS_TABLE,
  CREATE_GOALS_TABLE,
  CREATE_LOG_ENTRIES_TABLE,
  CREATE_PLANS_TABLE,
  CREATE_PLAN_GOALS_TABLE,
  CREATE_AWARENESS_ENTRIES_TABLE,
  CREATE_USER_PROFILES_TABLE,
  CREATE_ACTIVITY_LOGS_TABLE,
  CREATE_SLEEP_LOGS_TABLE,
  CREATE_NUTRITION_LOGS_TABLE,
  CREATE_MENTAL_HEALTH_LOGS_TABLE,
  CREATE_VITAL_SIGNS_TABLE,
  // weekly_plans must be created before daily_plan_items (FK dependency)
  CREATE_WEEKLY_PLANS_TABLE,
  CREATE_DAILY_PLAN_ITEMS_TABLE,
  CREATE_ACHIEVEMENTS_TABLE,
  CREATE_STREAKS_TABLE,
];
