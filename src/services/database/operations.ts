import { runQuery } from './db';
import {
  User, Goal, LogEntry, Plan, AwarenessEntry, LifeArea,
  UserProfile, ActivityLog, SleepLog, NutritionLog, MentalHealthLog,
  VitalSigns, MenstrualCycle, SymptomLog, HydrationLog, WellnessPlan,
  Achievement, UserAchievement, StreakData, Challenge, UserChallenge,
} from '../../types';

// === CORE OPERATIONS ===

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

// === WELLNESS TRACKING OPERATIONS ===

export const userProfileOperations = {
  create: (profile: UserProfile): Promise<any> =>
    runQuery(
      `INSERT INTO users_profile (
        id, userId, age, gender, height, weight, activityLevel, primaryGoal,
        secondaryGoals, healthConditions, dietaryRestrictions, fitnessLevel,
        timeAvailablePerDay, sleepGoal, waterGoal, calorieGoal, proteinGoal,
        carbGoal, fatGoal, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id, profile.userId, profile.age, profile.gender, profile.height,
        profile.weight, profile.activityLevel, profile.primaryGoal,
        JSON.stringify(profile.secondaryGoals), JSON.stringify(profile.healthConditions),
        JSON.stringify(profile.dietaryRestrictions), profile.fitnessLevel,
        profile.timeAvailablePerDay, profile.sleepGoal, profile.waterGoal,
        profile.calorieGoal, profile.proteinGoal, profile.carbGoal, profile.fatGoal,
        profile.createdAt, profile.updatedAt,
      ]
    ),

  getByUserId: (userId: string): Promise<UserProfile | null> =>
    runQuery('SELECT * FROM users_profile WHERE userId = ?', [userId]).then((result) => {
      const row = result.rows._array[0];
      if (!row) return null;
      return {
        ...row,
        secondaryGoals: JSON.parse(row.secondaryGoals),
        healthConditions: JSON.parse(row.healthConditions),
        dietaryRestrictions: JSON.parse(row.dietaryRestrictions),
      };
    }),

  update: (userId: string, fields: Partial<UserProfile>): Promise<any> => {
    const serialized: Record<string, any> = { ...fields };
    if (fields.secondaryGoals) serialized.secondaryGoals = JSON.stringify(fields.secondaryGoals);
    if (fields.healthConditions) serialized.healthConditions = JSON.stringify(fields.healthConditions);
    if (fields.dietaryRestrictions) serialized.dietaryRestrictions = JSON.stringify(fields.dietaryRestrictions);
    const keys = Object.keys(serialized).filter((k) => k !== 'userId' && k !== 'id');
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => serialized[k]);
    return runQuery(`UPDATE users_profile SET ${setClause} WHERE userId = ?`, [...values, userId]);
  },
};

export const activityLogOperations = {
  create: (log: ActivityLog): Promise<any> =>
    runQuery(
      `INSERT INTO activity_logs (
        id, userId, date, type, name, duration, intensity, caloriesBurned,
        steps, heartRateAvg, heartRateMax, distance, sets, reps, weight, notes, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id, log.userId, log.date, log.type, log.name, log.duration,
        log.intensity, log.caloriesBurned, log.steps ?? null, log.heartRateAvg ?? null,
        log.heartRateMax ?? null, log.distance ?? null, log.sets ?? null,
        log.reps ?? null, log.weight ?? null, log.notes ?? null, log.createdAt,
      ]
    ),

  getByDate: (userId: string, date: string): Promise<ActivityLog[]> =>
    runQuery('SELECT * FROM activity_logs WHERE userId = ? AND date = ? ORDER BY createdAt DESC', [userId, date]).then(
      (result) => result.rows._array
    ),

  getByDateRange: (userId: string, startDate: string, endDate: string): Promise<ActivityLog[]> =>
    runQuery(
      'SELECT * FROM activity_logs WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC',
      [userId, startDate, endDate]
    ).then((result) => result.rows._array),

  getAll: (userId: string): Promise<ActivityLog[]> =>
    runQuery('SELECT * FROM activity_logs WHERE userId = ? ORDER BY date DESC', [userId]).then(
      (result) => result.rows._array
    ),
};

export const sleepLogOperations = {
  create: (log: SleepLog): Promise<any> =>
    runQuery(
      `INSERT INTO sleep_logs (
        id, userId, date, bedtime, wakeTime, duration, quality,
        deepSleep, remSleep, lightSleep, interruptions, notes, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id, log.userId, log.date, log.bedtime, log.wakeTime, log.duration,
        log.quality, log.deepSleep ?? null, log.remSleep ?? null,
        log.lightSleep ?? null, log.interruptions ?? null, log.notes ?? null, log.createdAt,
      ]
    ),

  getByDate: (userId: string, date: string): Promise<SleepLog | null> =>
    runQuery('SELECT * FROM sleep_logs WHERE userId = ? AND date = ?', [userId, date]).then(
      (result) => result.rows._array[0] ?? null
    ),

  getByDateRange: (userId: string, startDate: string, endDate: string): Promise<SleepLog[]> =>
    runQuery(
      'SELECT * FROM sleep_logs WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC',
      [userId, startDate, endDate]
    ).then((result) => result.rows._array),

  getAll: (userId: string): Promise<SleepLog[]> =>
    runQuery('SELECT * FROM sleep_logs WHERE userId = ? ORDER BY date DESC', [userId]).then(
      (result) => result.rows._array
    ),
};

export const nutritionLogOperations = {
  create: (log: NutritionLog): Promise<any> =>
    runQuery(
      `INSERT INTO nutrition_logs (
        id, userId, date, mealType, foodName, calories, protein, carbs, fat,
        fiber, sugar, sodium, servingSize, notes, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id, log.userId, log.date, log.mealType, log.foodName, log.calories,
        log.protein, log.carbs, log.fat, log.fiber ?? null, log.sugar ?? null,
        log.sodium ?? null, log.servingSize ?? null, log.notes ?? null, log.createdAt,
      ]
    ),

  getByDate: (userId: string, date: string): Promise<NutritionLog[]> =>
    runQuery(
      'SELECT * FROM nutrition_logs WHERE userId = ? AND date = ? ORDER BY createdAt ASC',
      [userId, date]
    ).then((result) => result.rows._array),

  getByDateRange: (userId: string, startDate: string, endDate: string): Promise<NutritionLog[]> =>
    runQuery(
      'SELECT * FROM nutrition_logs WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC, createdAt ASC',
      [userId, startDate, endDate]
    ).then((result) => result.rows._array),

  getDailyTotals: (userId: string, date: string): Promise<{ calories: number; protein: number; carbs: number; fat: number }> =>
    runQuery(
      `SELECT
        SUM(calories) AS calories,
        SUM(protein) AS protein,
        SUM(carbs) AS carbs,
        SUM(fat) AS fat
       FROM nutrition_logs WHERE userId = ? AND date = ?`,
      [userId, date]
    ).then((result) => result.rows._array[0] ?? { calories: 0, protein: 0, carbs: 0, fat: 0 }),
};

export const mentalHealthLogOperations = {
  create: (log: MentalHealthLog): Promise<any> =>
    runQuery(
      `INSERT INTO mental_health_logs (
        id, userId, date, mood, stressLevel, anxietyLevel, energyLevel,
        meditationMinutes, journalEntry, triggers, gratitude, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id, log.userId, log.date, log.mood, log.stressLevel, log.anxietyLevel,
        log.energyLevel, log.meditationMinutes ?? null, log.journalEntry ?? null,
        log.triggers ? JSON.stringify(log.triggers) : null, log.gratitude ?? null, log.createdAt,
      ]
    ),

  getByDate: (userId: string, date: string): Promise<MentalHealthLog | null> =>
    runQuery('SELECT * FROM mental_health_logs WHERE userId = ? AND date = ?', [userId, date]).then((result) => {
      const row = result.rows._array[0];
      if (!row) return null;
      return { ...row, triggers: row.triggers && row.triggers.length > 0 ? JSON.parse(row.triggers) : undefined };
    }),

  getByDateRange: (userId: string, startDate: string, endDate: string): Promise<MentalHealthLog[]> =>
    runQuery(
      'SELECT * FROM mental_health_logs WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC',
      [userId, startDate, endDate]
    ).then((result) =>
      result.rows._array.map((row: any) => ({
        ...row,
        triggers: row.triggers && row.triggers.length > 0 ? JSON.parse(row.triggers) : undefined,
      }))
    ),
};

export const vitalSignsOperations = {
  create: (vitals: VitalSigns): Promise<any> =>
    runQuery(
      `INSERT INTO vital_signs (
        id, userId, date, heartRate, bloodPressureSystolic, bloodPressureDiastolic,
        spO2, temperature, respiratoryRate, weight, bodyFat, muscleMass, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vitals.id, vitals.userId, vitals.date, vitals.heartRate ?? null,
        vitals.bloodPressureSystolic ?? null, vitals.bloodPressureDiastolic ?? null,
        vitals.spO2 ?? null, vitals.temperature ?? null, vitals.respiratoryRate ?? null,
        vitals.weight ?? null, vitals.bodyFat ?? null, vitals.muscleMass ?? null, vitals.createdAt,
      ]
    ),

  getLatest: (userId: string): Promise<VitalSigns | null> =>
    runQuery('SELECT * FROM vital_signs WHERE userId = ? ORDER BY date DESC LIMIT 1', [userId]).then(
      (result) => result.rows._array[0] ?? null
    ),

  getByDateRange: (userId: string, startDate: string, endDate: string): Promise<VitalSigns[]> =>
    runQuery(
      'SELECT * FROM vital_signs WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC',
      [userId, startDate, endDate]
    ).then((result) => result.rows._array),
};

export const menstrualCycleOperations = {
  create: (entry: MenstrualCycle): Promise<any> =>
    runQuery(
      `INSERT INTO menstrual_cycle (
        id, userId, date, phase, flow, symptoms, mood, painLevel, notes, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.id, entry.userId, entry.date, entry.phase, entry.flow ?? null,
        entry.symptoms ? JSON.stringify(entry.symptoms) : null,
        entry.mood ?? null, entry.painLevel ?? null, entry.notes ?? null, entry.createdAt,
      ]
    ),

  getByDate: (userId: string, date: string): Promise<MenstrualCycle | null> =>
    runQuery('SELECT * FROM menstrual_cycle WHERE userId = ? AND date = ?', [userId, date]).then((result) => {
      const row = result.rows._array[0];
      if (!row) return null;
      return { ...row, symptoms: row.symptoms && row.symptoms.length > 0 ? JSON.parse(row.symptoms) : undefined };
    }),

  getByDateRange: (userId: string, startDate: string, endDate: string): Promise<MenstrualCycle[]> =>
    runQuery(
      'SELECT * FROM menstrual_cycle WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC',
      [userId, startDate, endDate]
    ).then((result) =>
      result.rows._array.map((row: any) => ({
        ...row,
        symptoms: row.symptoms && row.symptoms.length > 0 ? JSON.parse(row.symptoms) : undefined,
      }))
    ),
};

export const symptomLogOperations = {
  create: (log: SymptomLog): Promise<any> =>
    runQuery(
      `INSERT INTO symptoms (
        id, userId, date, symptomType, severity, location, description, possibleTrigger, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id, log.userId, log.date, log.symptomType, log.severity,
        log.location ?? null, log.description ?? null, log.possibleTrigger ?? null, log.createdAt,
      ]
    ),

  getByDate: (userId: string, date: string): Promise<SymptomLog[]> =>
    runQuery(
      'SELECT * FROM symptoms WHERE userId = ? AND date = ? ORDER BY createdAt DESC',
      [userId, date]
    ).then((result) => result.rows._array),

  getByDateRange: (userId: string, startDate: string, endDate: string): Promise<SymptomLog[]> =>
    runQuery(
      'SELECT * FROM symptoms WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC',
      [userId, startDate, endDate]
    ).then((result) => result.rows._array),
};

export const hydrationLogOperations = {
  create: (log: HydrationLog): Promise<any> =>
    runQuery(
      'INSERT INTO hydration_logs (id, userId, date, amount, beverageType, time, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [log.id, log.userId, log.date, log.amount, log.beverageType, log.time, log.createdAt]
    ),

  getByDate: (userId: string, date: string): Promise<HydrationLog[]> =>
    runQuery(
      'SELECT * FROM hydration_logs WHERE userId = ? AND date = ? ORDER BY time ASC',
      [userId, date]
    ).then((result) => result.rows._array),

  getDailyTotal: (userId: string, date: string): Promise<number> =>
    runQuery(
      'SELECT SUM(amount) AS total FROM hydration_logs WHERE userId = ? AND date = ?',
      [userId, date]
    ).then((result) => result.rows._array[0]?.total ?? 0),
};

export const wellnessPlanOperations = {
  create: (plan: WellnessPlan): Promise<any> =>
    runQuery(
      `INSERT INTO wellness_plans (
        id, userId, weekNumber, startDate, endDate, nutritionPlan, exercisePlan,
        recoveryProtocol, weeklyGoals, notes, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        plan.id, plan.userId, plan.weekNumber, plan.startDate, plan.endDate,
        JSON.stringify(plan.nutritionPlan), JSON.stringify(plan.exercisePlan),
        JSON.stringify(plan.recoveryProtocol), JSON.stringify(plan.weeklyGoals),
        plan.notes, plan.createdAt,
      ]
    ),

  getAll: (userId: string): Promise<WellnessPlan[]> =>
    runQuery('SELECT * FROM wellness_plans WHERE userId = ? ORDER BY weekNumber DESC', [userId]).then((result) =>
      result.rows._array.map((row: any) => ({
        ...row,
        nutritionPlan: JSON.parse(row.nutritionPlan),
        exercisePlan: JSON.parse(row.exercisePlan),
        recoveryProtocol: JSON.parse(row.recoveryProtocol),
        weeklyGoals: JSON.parse(row.weeklyGoals),
      }))
    ),

  getByWeek: (userId: string, weekNumber: number): Promise<WellnessPlan | null> =>
    runQuery('SELECT * FROM wellness_plans WHERE userId = ? AND weekNumber = ?', [userId, weekNumber]).then((result) => {
      const row = result.rows._array[0];
      if (!row) return null;
      return {
        ...row,
        nutritionPlan: JSON.parse(row.nutritionPlan),
        exercisePlan: JSON.parse(row.exercisePlan),
        recoveryProtocol: JSON.parse(row.recoveryProtocol),
        weeklyGoals: JSON.parse(row.weeklyGoals),
      };
    }),

  getCurrent: (userId: string): Promise<WellnessPlan | null> => {
    const today = new Date().toISOString().split('T')[0];
    return runQuery(
      'SELECT * FROM wellness_plans WHERE userId = ? AND startDate <= ? AND endDate >= ? LIMIT 1',
      [userId, today, today]
    ).then((result) => {
      const row = result.rows._array[0];
      if (!row) return null;
      return {
        ...row,
        nutritionPlan: JSON.parse(row.nutritionPlan),
        exercisePlan: JSON.parse(row.exercisePlan),
        recoveryProtocol: JSON.parse(row.recoveryProtocol),
        weeklyGoals: JSON.parse(row.weeklyGoals),
      };
    });
  },
};

// === GAMIFICATION OPERATIONS ===

export const achievementOperations = {
  getAll: (): Promise<Achievement[]> =>
    runQuery('SELECT * FROM achievements ORDER BY category ASC, points ASC').then(
      (result) => result.rows._array
    ),

  getById: (id: string): Promise<Achievement | null> =>
    runQuery('SELECT * FROM achievements WHERE id = ?', [id]).then(
      (result) => result.rows._array[0] ?? null
    ),
};

export const userAchievementOperations = {
  create: (ua: UserAchievement): Promise<any> =>
    runQuery(
      'INSERT INTO user_achievements (id, userId, achievementId, earnedAt, progress) VALUES (?, ?, ?, ?, ?)',
      [ua.id, ua.userId, ua.achievementId, ua.earnedAt, ua.progress]
    ),

  getByUserId: (userId: string): Promise<UserAchievement[]> =>
    runQuery('SELECT * FROM user_achievements WHERE userId = ? ORDER BY earnedAt DESC', [userId]).then(
      (result) => result.rows._array
    ),

  checkEarned: (userId: string, achievementId: string): Promise<boolean> =>
    runQuery(
      'SELECT id FROM user_achievements WHERE userId = ? AND achievementId = ? LIMIT 1',
      [userId, achievementId]
    ).then((result) => result.rows._array.length > 0),
};

export const streakOperations = {
  get: (userId: string): Promise<StreakData | null> =>
    runQuery('SELECT * FROM streaks WHERE userId = ?', [userId]).then(
      (result) => result.rows._array[0] ?? null
    ),

  update: (data: StreakData): Promise<any> =>
    runQuery(
      `INSERT INTO streaks (userId, currentStreak, longestStreak, lastLogDate, totalDaysLogged)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(userId) DO UPDATE SET
         currentStreak = excluded.currentStreak,
         longestStreak = excluded.longestStreak,
         lastLogDate = excluded.lastLogDate,
         totalDaysLogged = excluded.totalDaysLogged`,
      [data.userId, data.currentStreak, data.longestStreak, data.lastLogDate, data.totalDaysLogged]
    ),
};

export const challengeOperations = {
  getAll: (): Promise<Challenge[]> =>
    runQuery('SELECT * FROM challenges ORDER BY startDate DESC').then(
      (result) => result.rows._array
    ),

  getActive: (): Promise<Challenge[]> => {
    const today = new Date().toISOString().split('T')[0];
    return runQuery(
      'SELECT * FROM challenges WHERE startDate <= ? AND endDate >= ? ORDER BY endDate ASC',
      [today, today]
    ).then((result) => result.rows._array);
  },

  getById: (id: string): Promise<Challenge | null> =>
    runQuery('SELECT * FROM challenges WHERE id = ?', [id]).then(
      (result) => result.rows._array[0] ?? null
    ),
};

export const userChallengeOperations = {
  join: (uc: UserChallenge): Promise<any> =>
    runQuery(
      'INSERT INTO user_challenges (id, userId, challengeId, joinedAt, progress, completed) VALUES (?, ?, ?, ?, ?, ?)',
      [uc.id, uc.userId, uc.challengeId, uc.joinedAt, uc.progress, uc.completed ? 1 : 0]
    ),

  getByUserId: (userId: string): Promise<UserChallenge[]> =>
    runQuery('SELECT * FROM user_challenges WHERE userId = ? ORDER BY joinedAt DESC', [userId]).then(
      (result) =>
        result.rows._array.map((row: any) => ({ ...row, completed: row.completed === 1 }))
    ),

  updateProgress: (id: string, progress: number): Promise<any> =>
    runQuery('UPDATE user_challenges SET progress = ? WHERE id = ?', [progress, id]),

  complete: (id: string, completedAt: string): Promise<any> =>
    runQuery(
      'UPDATE user_challenges SET completed = 1, completedAt = ? WHERE id = ?',
      [completedAt, id]
    ),
};