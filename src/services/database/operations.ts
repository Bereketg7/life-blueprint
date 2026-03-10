import { runQuery } from './db';
import { User, Goal, LogEntry, Plan, AwarenessEntry, LifeArea } from '../../types';

export const userOperations = {
  create: (user: User): Promise<any> =>
    runQuery(
      'INSERT INTO users (id, name, email, createdAt) VALUES (?, ?, ?, ?)',
      [user.id, user.name, user.email, user.createdAt]
    ),

  getById: (id: string): Promise<User | null> =>
    runQuery('SELECT * FROM users WHERE id = ?', [id]).then(
      (result) => result.rows._array[0] ?? null
    ),

  update: (id: string, fields: Partial<User>): Promise<any> => {
    const keys = Object.keys(fields) as (keyof User)[];
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    return runQuery(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
  },
};

export const goalOperations = {
  create: (goal: Goal): Promise<any> =>
    runQuery(
      'INSERT INTO goals (id, lifeAreaId, title, description, targetDate, completed, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [goal.id, goal.lifeAreaId, goal.title, goal.description, goal.targetDate, goal.completed ? 1 : 0, goal.createdAt]
    ),

  getAll: (): Promise<Goal[]> =>
    runQuery('SELECT * FROM goals ORDER BY createdAt DESC').then(
      (result) => result.rows._array
    ),

  getByLifeArea: (lifeAreaId: string): Promise<Goal[]> =>
    runQuery('SELECT * FROM goals WHERE lifeAreaId = ? ORDER BY createdAt DESC', [lifeAreaId]).then(
      (result) => result.rows._array
    ),

  markComplete: (id: string): Promise<any> =>
    runQuery('UPDATE goals SET completed = 1 WHERE id = ?', [id]),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM goals WHERE id = ?', [id]),
};

export const logEntryOperations = {
  create: (entry: LogEntry): Promise<any> =>
    runQuery(
      'INSERT INTO log_entries (id, goalId, note, date, createdAt) VALUES (?, ?, ?, ?, ?)',
      [entry.id, entry.goalId, entry.note, entry.date, entry.createdAt]
    ),

  getByGoal: (goalId: string): Promise<LogEntry[]> =>
    runQuery('SELECT * FROM log_entries WHERE goalId = ? ORDER BY date DESC', [goalId]).then(
      (result) => result.rows._array
    ),

  getByDate: (date: string): Promise<LogEntry[]> =>
    runQuery('SELECT * FROM log_entries WHERE date = ? ORDER BY createdAt DESC', [date]).then(
      (result) => result.rows._array
    ),
};

export const planOperations = {
  create: (plan: Plan): Promise<any> =>
    runQuery(
      'INSERT INTO plans (id, title, description, startDate, endDate, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [plan.id, plan.title, plan.description, plan.startDate, plan.endDate, plan.createdAt]
    ),

  getAll: (): Promise<Plan[]> =>
    runQuery('SELECT * FROM plans ORDER BY startDate DESC').then(
      (result) => result.rows._array
    ),

  getById: (id: string): Promise<Plan | null> =>
    runQuery('SELECT * FROM plans WHERE id = ?', [id]).then(
      (result) => result.rows._array[0] ?? null
    ),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM plans WHERE id = ?', [id]),
};

export const awarenessOperations = {
  create: (entry: AwarenessEntry): Promise<any> =>
    runQuery(
      'INSERT INTO awareness_entries (id, lifeAreaId, score, note, date, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [entry.id, entry.lifeAreaId, entry.score, entry.note, entry.date, entry.createdAt]
    ),

  getByLifeArea: (lifeAreaId: string): Promise<AwarenessEntry[]> =>
    runQuery('SELECT * FROM awareness_entries WHERE lifeAreaId = ? ORDER BY date DESC', [lifeAreaId]).then(
      (result) => result.rows._array
    ),

  getLatestScores: (): Promise<{ lifeAreaId: string; score: number }[]> =>
    runQuery(
      `SELECT lifeAreaId, score FROM awareness_entries
       WHERE date = (
         SELECT MAX(date) FROM awareness_entries ae2 WHERE ae2.lifeAreaId = awareness_entries.lifeAreaId
       )
       GROUP BY lifeAreaId`
    ).then((result) => result.rows._array),
};

export const lifeAreaOperations = {
  create: (area: LifeArea): Promise<any> =>
    runQuery(
      'INSERT INTO life_areas (id, name, description, color) VALUES (?, ?, ?, ?)',
      [area.id, area.name, area.description, area.color]
    ),

  getAll: (): Promise<LifeArea[]> =>
    runQuery('SELECT * FROM life_areas').then((result) => result.rows._array),

  getById: (id: string): Promise<LifeArea | null> =>
    runQuery('SELECT * FROM life_areas WHERE id = ?', [id]).then(
      (result) => result.rows._array[0] ?? null
    ),
};