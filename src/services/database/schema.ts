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

export const ALL_SCHEMAS = [
  CREATE_USERS_TABLE,
  CREATE_LIFE_AREAS_TABLE,
  CREATE_GOALS_TABLE,
  CREATE_LOG_ENTRIES_TABLE,
  CREATE_PLANS_TABLE,
  CREATE_PLAN_GOALS_TABLE,
  CREATE_AWARENESS_ENTRIES_TABLE,
];