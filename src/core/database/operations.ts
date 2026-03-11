import { runQuery } from '../../services/database/db';
import {
  UserProfile,
  ActivityLog,
  SleepLog,
  NutritionLog,
  MentalHealthLog,
  VitalSigns,
  DailyPlanItem,
  WeeklyPlan,
  Achievement,
  Streak,
} from '../../types';

// ── User Profiles ─────────────────────────────────────────────────────────────

export const userProfileOperations = {
  create: (profile: UserProfile): Promise<any> =>
    runQuery(
      `INSERT INTO user_profiles
         (id, name, age, gender, height, weight, goalType, activityLevel,
          dietaryPreferences, healthConditions, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id,
        profile.name,
        profile.age,
        profile.gender,
        profile.height,
        profile.weight,
        profile.goalType,
        profile.activityLevel,
        JSON.stringify(profile.dietaryPreferences),
        JSON.stringify(profile.healthConditions),
        profile.createdAt,
        profile.updatedAt,
      ]
    ),

  getByUserId: (id: string): Promise<UserProfile | null> =>
    runQuery('SELECT * FROM user_profiles WHERE id = ?', [id]).then((result) => {
      const row = result.rows._array[0] ?? null;
      if (!row) return null;
      return {
        ...row,
        dietaryPreferences: JSON.parse(row.dietaryPreferences ?? '[]'),
        healthConditions: JSON.parse(row.healthConditions ?? '[]'),
      } as UserProfile;
    }),

  update: (id: string, fields: Partial<UserProfile>): Promise<any> => {
    const serialized: Record<string, any> = { ...fields };
    if (serialized.dietaryPreferences !== undefined) {
      serialized.dietaryPreferences = JSON.stringify(serialized.dietaryPreferences);
    }
    if (serialized.healthConditions !== undefined) {
      serialized.healthConditions = JSON.stringify(serialized.healthConditions);
    }
    const keys = Object.keys(serialized);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => serialized[k]);
    return runQuery(`UPDATE user_profiles SET ${setClause} WHERE id = ?`, [...values, id]);
  },

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM user_profiles WHERE id = ?', [id]),
};

// ── Activity Logs ─────────────────────────────────────────────────────────────

export const activityLogOperations = {
  create: (log: ActivityLog): Promise<any> =>
    runQuery(
      `INSERT INTO activity_logs
         (id, userId, date, type, duration, intensity, caloriesBurned, notes, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id,
        log.userId,
        log.date,
        log.type,
        log.duration,
        log.intensity,
        log.caloriesBurned,
        log.notes,
        log.status,
        log.createdAt,
      ]
    ),

  getByUserId: (userId: string): Promise<ActivityLog[]> =>
    runQuery(
      'SELECT * FROM activity_logs WHERE userId = ? ORDER BY date DESC',
      [userId]
    ).then((result) => result.rows._array),

  getByDate: (date: string): Promise<ActivityLog[]> =>
    runQuery(
      'SELECT * FROM activity_logs WHERE date = ? ORDER BY createdAt DESC',
      [date]
    ).then((result) => result.rows._array),

  getByUserAndDate: (userId: string, date: string): Promise<ActivityLog[]> =>
    runQuery(
      'SELECT * FROM activity_logs WHERE userId = ? AND date = ? ORDER BY createdAt DESC',
      [userId, date]
    ).then((result) => result.rows._array),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM activity_logs WHERE id = ?', [id]),
};

// ── Sleep Logs ────────────────────────────────────────────────────────────────

export const sleepLogOperations = {
  create: (log: SleepLog): Promise<any> =>
    runQuery(
      `INSERT INTO sleep_logs (id, userId, date, hoursSlept, quality, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [log.id, log.userId, log.date, log.hoursSlept, log.quality, log.notes, log.createdAt]
    ),

  getByUserId: (userId: string): Promise<SleepLog[]> =>
    runQuery(
      'SELECT * FROM sleep_logs WHERE userId = ? ORDER BY date DESC',
      [userId]
    ).then((result) => result.rows._array),

  getByDate: (date: string): Promise<SleepLog[]> =>
    runQuery(
      'SELECT * FROM sleep_logs WHERE date = ? ORDER BY createdAt DESC',
      [date]
    ).then((result) => result.rows._array),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM sleep_logs WHERE id = ?', [id]),
};

// ── Nutrition Logs ────────────────────────────────────────────────────────────

export const nutritionLogOperations = {
  create: (log: NutritionLog): Promise<any> =>
    runQuery(
      `INSERT INTO nutrition_logs
         (id, userId, date, mealType, calories, protein, carbs, fat, notes, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id,
        log.userId,
        log.date,
        log.mealType,
        log.calories,
        log.protein,
        log.carbs,
        log.fat,
        log.notes,
        log.status,
        log.createdAt,
      ]
    ),

  getByUserId: (userId: string): Promise<NutritionLog[]> =>
    runQuery(
      'SELECT * FROM nutrition_logs WHERE userId = ? ORDER BY date DESC',
      [userId]
    ).then((result) => result.rows._array),

  getByDate: (date: string): Promise<NutritionLog[]> =>
    runQuery(
      'SELECT * FROM nutrition_logs WHERE date = ? ORDER BY createdAt DESC',
      [date]
    ).then((result) => result.rows._array),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM nutrition_logs WHERE id = ?', [id]),
};

// ── Mental Health Logs ────────────────────────────────────────────────────────

export const mentalHealthLogOperations = {
  create: (log: MentalHealthLog): Promise<any> =>
    runQuery(
      `INSERT INTO mental_health_logs (id, userId, date, mood, stress, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [log.id, log.userId, log.date, log.mood, log.stress, log.notes, log.createdAt]
    ),

  getByUserId: (userId: string): Promise<MentalHealthLog[]> =>
    runQuery(
      'SELECT * FROM mental_health_logs WHERE userId = ? ORDER BY date DESC',
      [userId]
    ).then((result) => result.rows._array),

  getByDate: (date: string): Promise<MentalHealthLog[]> =>
    runQuery(
      'SELECT * FROM mental_health_logs WHERE date = ? ORDER BY createdAt DESC',
      [date]
    ).then((result) => result.rows._array),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM mental_health_logs WHERE id = ?', [id]),
};

// ── Vital Signs ───────────────────────────────────────────────────────────────

export const vitalSignsOperations = {
  create: (vitals: VitalSigns): Promise<any> =>
    runQuery(
      `INSERT INTO vital_signs
         (id, userId, date, heartRate, bloodPressureSystolic, bloodPressureDiastolic,
          weight, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vitals.id,
        vitals.userId,
        vitals.date,
        vitals.heartRate,
        vitals.bloodPressureSystolic,
        vitals.bloodPressureDiastolic,
        vitals.weight,
        vitals.notes,
        vitals.createdAt,
      ]
    ),

  getByUserId: (userId: string): Promise<VitalSigns[]> =>
    runQuery(
      'SELECT * FROM vital_signs WHERE userId = ? ORDER BY date DESC',
      [userId]
    ).then((result) => result.rows._array),

  getLatest: (userId: string): Promise<VitalSigns | null> =>
    runQuery(
      'SELECT * FROM vital_signs WHERE userId = ? ORDER BY date DESC LIMIT 1',
      [userId]
    ).then((result) => result.rows._array[0] ?? null),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM vital_signs WHERE id = ?', [id]),
};

// ── Daily Plan Items ──────────────────────────────────────────────────────────

export const dailyPlanItemOperations = {
  create: (item: DailyPlanItem): Promise<any> =>
    runQuery(
      `INSERT INTO daily_plan_items
         (id, planId, day, timeOfDay, category, title, description, duration, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.planId,
        item.day,
        item.timeOfDay,
        item.category,
        item.title,
        item.description,
        item.duration,
        item.status,
        item.createdAt,
      ]
    ),

  getByPlanId: (planId: string): Promise<DailyPlanItem[]> =>
    runQuery(
      'SELECT * FROM daily_plan_items WHERE planId = ? ORDER BY day, timeOfDay',
      [planId]
    ).then((result) => result.rows._array),

  updateStatus: (
    id: string,
    status: 'pending' | 'completed' | 'skipped'
  ): Promise<any> =>
    runQuery('UPDATE daily_plan_items SET status = ? WHERE id = ?', [status, id]),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM daily_plan_items WHERE id = ?', [id]),
};

// ── Weekly Plans ──────────────────────────────────────────────────────────────

export const weeklyPlanOperations = {
  create: (plan: WeeklyPlan): Promise<any> =>
    runQuery(
      `INSERT INTO weekly_plans
         (id, userId, weekStartDate, weekEndDate, items, goalType, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        plan.id,
        plan.userId,
        plan.weekStartDate,
        plan.weekEndDate,
        JSON.stringify(plan.items),
        plan.goalType,
        plan.createdAt,
      ]
    ),

  getByUserId: (userId: string): Promise<WeeklyPlan[]> =>
    runQuery(
      'SELECT * FROM weekly_plans WHERE userId = ? ORDER BY weekStartDate DESC',
      [userId]
    ).then((result) =>
      result.rows._array.map((row: any) => ({
        ...row,
        items: JSON.parse(row.items ?? '[]'),
      }))
    ),

  getCurrent: (userId: string, today: string): Promise<WeeklyPlan | null> =>
    runQuery(
      `SELECT * FROM weekly_plans
       WHERE userId = ? AND weekStartDate <= ? AND weekEndDate >= ?
       ORDER BY weekStartDate DESC LIMIT 1`,
      [userId, today, today]
    ).then((result) => {
      const row = result.rows._array[0] ?? null;
      if (!row) return null;
      return { ...row, items: JSON.parse(row.items ?? '[]') } as WeeklyPlan;
    }),

  update: (id: string, fields: Partial<WeeklyPlan>): Promise<any> => {
    const serialized: Record<string, any> = { ...fields };
    if (serialized.items !== undefined) {
      serialized.items = JSON.stringify(serialized.items);
    }
    const keys = Object.keys(serialized);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => serialized[k]);
    return runQuery(`UPDATE weekly_plans SET ${setClause} WHERE id = ?`, [...values, id]);
  },

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM weekly_plans WHERE id = ?', [id]),
};

// ── Achievements ──────────────────────────────────────────────────────────────

export const achievementOperations = {
  create: (achievement: Achievement): Promise<any> =>
    runQuery(
      `INSERT INTO achievements (id, userId, badgeId, unlockedAt, streakCount)
       VALUES (?, ?, ?, ?, ?)`,
      [
        achievement.id,
        achievement.userId,
        achievement.badgeId,
        achievement.unlockedAt,
        achievement.streakCount,
      ]
    ),

  getByUserId: (userId: string): Promise<Achievement[]> =>
    runQuery(
      'SELECT * FROM achievements WHERE userId = ? ORDER BY unlockedAt DESC',
      [userId]
    ).then((result) => result.rows._array),

  delete: (id: string): Promise<any> =>
    runQuery('DELETE FROM achievements WHERE id = ?', [id]),
};

// ── Streaks ───────────────────────────────────────────────────────────────────

export const streakOperations = {
  create: (streak: Streak & { id: string; userId: string }): Promise<any> =>
    runQuery(
      `INSERT INTO streaks (id, userId, currentStreak, longestStreak, lastLogDate, totalDaysLogged)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        streak.id,
        streak.userId,
        streak.currentStreak,
        streak.longestStreak,
        streak.lastLogDate,
        streak.totalDaysLogged,
      ]
    ),

  getByUserId: (userId: string): Promise<(Streak & { id: string; userId: string }) | null> =>
    runQuery('SELECT * FROM streaks WHERE userId = ?', [userId]).then(
      (result) => result.rows._array[0] ?? null
    ),

  update: (userId: string, fields: Partial<Streak>): Promise<any> => {
    const keys = Object.keys(fields) as (keyof Streak)[];
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    return runQuery(`UPDATE streaks SET ${setClause} WHERE userId = ?`, [...values, userId]);
  },
};
