// === CORE TABLES ===

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

// === WELLNESS TRACKING TABLES ===

export const CREATE_USER_PROFILE_TABLE = `
  CREATE TABLE IF NOT EXISTS users_profile (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
    activityLevel TEXT NOT NULL,
    primaryGoal TEXT NOT NULL,
    secondaryGoals TEXT NOT NULL DEFAULT '[]',
    healthConditions TEXT NOT NULL DEFAULT '[]',
    dietaryRestrictions TEXT NOT NULL DEFAULT '[]',
    fitnessLevel TEXT NOT NULL,
    timeAvailablePerDay INTEGER NOT NULL,
    sleepGoal REAL NOT NULL,
    waterGoal INTEGER NOT NULL,
    calorieGoal INTEGER NOT NULL,
    proteinGoal INTEGER NOT NULL,
    carbGoal INTEGER NOT NULL,
    fatGoal INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_ACTIVITY_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    intensity TEXT NOT NULL,
    caloriesBurned INTEGER NOT NULL,
    steps INTEGER,
    heartRateAvg INTEGER,
    heartRateMax INTEGER,
    distance REAL,
    sets INTEGER,
    reps INTEGER,
    weight REAL,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_SLEEP_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS sleep_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    bedtime TEXT NOT NULL,
    wakeTime TEXT NOT NULL,
    duration REAL NOT NULL,
    quality INTEGER NOT NULL,
    deepSleep REAL,
    remSleep REAL,
    lightSleep REAL,
    interruptions INTEGER,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_NUTRITION_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS nutrition_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    mealType TEXT NOT NULL,
    foodName TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein REAL NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL,
    fiber REAL,
    sugar REAL,
    sodium REAL,
    servingSize TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_MENTAL_HEALTH_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS mental_health_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    mood INTEGER NOT NULL,
    stressLevel INTEGER NOT NULL,
    anxietyLevel INTEGER NOT NULL,
    energyLevel INTEGER NOT NULL,
    meditationMinutes INTEGER,
    journalEntry TEXT,
    triggers TEXT,
    gratitude TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_VITAL_SIGNS_TABLE = `
  CREATE TABLE IF NOT EXISTS vital_signs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    heartRate INTEGER,
    bloodPressureSystolic INTEGER,
    bloodPressureDiastolic INTEGER,
    spO2 REAL,
    temperature REAL,
    respiratoryRate INTEGER,
    weight REAL,
    bodyFat REAL,
    muscleMass REAL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_MENSTRUAL_CYCLE_TABLE = `
  CREATE TABLE IF NOT EXISTS menstrual_cycle (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    phase TEXT NOT NULL,
    flow TEXT,
    symptoms TEXT,
    mood INTEGER,
    painLevel INTEGER,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_SYMPTOMS_TABLE = `
  CREATE TABLE IF NOT EXISTS symptoms (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    symptomType TEXT NOT NULL,
    severity INTEGER NOT NULL,
    location TEXT,
    description TEXT,
    possibleTrigger TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_HYDRATION_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS hydration_logs (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    amount INTEGER NOT NULL,
    beverageType TEXT NOT NULL,
    time TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_WELLNESS_PLANS_TABLE = `
  CREATE TABLE IF NOT EXISTS wellness_plans (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    weekNumber INTEGER NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    nutritionPlan TEXT NOT NULL DEFAULT '{}',
    exercisePlan TEXT NOT NULL DEFAULT '{}',
    recoveryProtocol TEXT NOT NULL DEFAULT '{}',
    weeklyGoals TEXT NOT NULL DEFAULT '[]',
    notes TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

// === GAMIFICATION TABLES ===

export const CREATE_ACHIEVEMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    requiredValue INTEGER NOT NULL,
    points INTEGER NOT NULL
  );
`;

export const CREATE_USER_ACHIEVEMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    achievementId TEXT NOT NULL,
    earnedAt TEXT NOT NULL,
    progress REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (achievementId) REFERENCES achievements(id)
  );
`;

export const CREATE_STREAKS_TABLE = `
  CREATE TABLE IF NOT EXISTS streaks (
    userId TEXT PRIMARY KEY,
    currentStreak INTEGER NOT NULL DEFAULT 0,
    longestStreak INTEGER NOT NULL DEFAULT 0,
    lastLogDate TEXT NOT NULL,
    totalDaysLogged INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_CHALLENGES_TABLE = `
  CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    target INTEGER NOT NULL,
    unit TEXT NOT NULL,
    durationDays INTEGER NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    participants INTEGER,
    reward TEXT NOT NULL
  );
`;

export const CREATE_USER_CHALLENGES_TABLE = `
  CREATE TABLE IF NOT EXISTS user_challenges (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    challengeId TEXT NOT NULL,
    joinedAt TEXT NOT NULL,
    progress REAL NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    completedAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (challengeId) REFERENCES challenges(id)
  );
`;

// === WEARABLES TABLE ===

export const CREATE_WEARABLE_CONNECTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS wearable_connections (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    provider TEXT NOT NULL,
    accessToken TEXT NOT NULL,
    refreshToken TEXT,
    tokenExpiry TEXT,
    deviceId TEXT,
    deviceName TEXT,
    lastSyncAt TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_WEARABLE_DATA_TABLE = `
  CREATE TABLE IF NOT EXISTS wearable_data (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    provider TEXT NOT NULL,
    dataType TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

// === QUESTS TABLE ===

export const CREATE_QUESTS_TABLE = `
  CREATE TABLE IF NOT EXISTS quests (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    target INTEGER NOT NULL,
    current INTEGER NOT NULL DEFAULT 0,
    rewardXp INTEGER NOT NULL,
    rewardCoins INTEGER NOT NULL,
    rewardBadge TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

// === LEVELING TABLES ===

export const CREATE_USER_LEVELS_TABLE = `
  CREATE TABLE IF NOT EXISTS user_levels (
    userId TEXT PRIMARY KEY,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    xpToNext INTEGER NOT NULL DEFAULT 1000,
    tier TEXT NOT NULL DEFAULT 'bronze',
    unlockedFeatures TEXT NOT NULL DEFAULT '[]',
    coins INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_XP_TRANSACTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS xp_transactions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

// === BATTLE PASS TABLE ===

export const CREATE_BATTLE_PASS_TABLE = `
  CREATE TABLE IF NOT EXISTS battle_pass (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    season INTEGER NOT NULL,
    tier INTEGER NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 0,
    isPremium INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const CREATE_SEASONAL_REWARDS_TABLE = `
  CREATE TABLE IF NOT EXISTS seasonal_rewards (
    id TEXT PRIMARY KEY,
    battlePassId TEXT NOT NULL,
    season INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    icon TEXT NOT NULL,
    tier INTEGER NOT NULL,
    isPremium INTEGER NOT NULL DEFAULT 0,
    unlockedAt TEXT,
    FOREIGN KEY (battlePassId) REFERENCES battle_pass(id)
  );
`;

export const CREATE_SEASONAL_CHALLENGES_TABLE = `
  CREATE TABLE IF NOT EXISTS seasonal_challenges (
    id TEXT PRIMARY KEY,
    season INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target INTEGER NOT NULL,
    current INTEGER NOT NULL DEFAULT 0,
    rewardXp INTEGER NOT NULL,
    rewardCoins INTEGER NOT NULL,
    rewardBadge TEXT,
    daysRemaining INTEGER NOT NULL,
    createdAt TEXT NOT NULL
  );
`;

// === FRIENDS / SOCIAL TABLES ===

export const CREATE_FRIENDS_TABLE = `
  CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    friendId TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (friendId) REFERENCES users(id),
    UNIQUE(userId, friendId)
  );
`;

export const CREATE_SOCIAL_POSTS_TABLE = `
  CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    mediaUrl TEXT,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    visibility TEXT NOT NULL DEFAULT 'friends',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

// === HEALTH REPORTS TABLE ===

export const CREATE_HEALTH_REPORTS_TABLE = `
  CREATE TABLE IF NOT EXISTS health_reports (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    period TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    data TEXT NOT NULL DEFAULT '{}',
    insights TEXT NOT NULL DEFAULT '[]',
    generatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

// === BIOMARKERS TABLE ===

export const CREATE_BIOMARKER_READINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS biomarker_readings (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    source TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

export const ALL_SCHEMAS = [
  // Core tables
  CREATE_USERS_TABLE,
  CREATE_LIFE_AREAS_TABLE,
  CREATE_GOALS_TABLE,
  CREATE_LOG_ENTRIES_TABLE,
  CREATE_PLANS_TABLE,
  CREATE_PLAN_GOALS_TABLE,
  CREATE_AWARENESS_ENTRIES_TABLE,
  // Wellness tracking tables
  CREATE_USER_PROFILE_TABLE,
  CREATE_ACTIVITY_LOGS_TABLE,
  CREATE_SLEEP_LOGS_TABLE,
  CREATE_NUTRITION_LOGS_TABLE,
  CREATE_MENTAL_HEALTH_LOGS_TABLE,
  CREATE_VITAL_SIGNS_TABLE,
  CREATE_MENSTRUAL_CYCLE_TABLE,
  CREATE_SYMPTOMS_TABLE,
  CREATE_HYDRATION_LOGS_TABLE,
  CREATE_WELLNESS_PLANS_TABLE,
  // Gamification tables
  CREATE_ACHIEVEMENTS_TABLE,
  CREATE_USER_ACHIEVEMENTS_TABLE,
  CREATE_STREAKS_TABLE,
  CREATE_CHALLENGES_TABLE,
  CREATE_USER_CHALLENGES_TABLE,
  // Wearables
  CREATE_WEARABLE_CONNECTIONS_TABLE,
  CREATE_WEARABLE_DATA_TABLE,
  // Quests & leveling
  CREATE_QUESTS_TABLE,
  CREATE_USER_LEVELS_TABLE,
  CREATE_XP_TRANSACTIONS_TABLE,
  // Battle pass
  CREATE_BATTLE_PASS_TABLE,
  CREATE_SEASONAL_REWARDS_TABLE,
  CREATE_SEASONAL_CHALLENGES_TABLE,
  // Social
  CREATE_FRIENDS_TABLE,
  CREATE_SOCIAL_POSTS_TABLE,
  // Reports & biomarkers
  CREATE_HEALTH_REPORTS_TABLE,
  CREATE_BIOMARKER_READINGS_TABLE,
];