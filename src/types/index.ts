// === CORE TYPES ===

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LifeArea {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Goal {
  id: string;
  lifeAreaId: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  goalId: string;
  note: string;
  date: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface PlanGoal {
  planId: string;
  goalId: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  scheduledAt: string;
  goalId?: string;
}

export interface AwarenessEntry {
  id: string;
  lifeAreaId: string;
  score: number;
  note: string;
  date: string;
  createdAt: string;
}

// === WELLNESS TRACKING TYPES ===

export interface UserProfile {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extra-active';
  primaryGoal: 'weight-loss' | 'muscle-gain' | 'endurance' | 'flexibility' | 'general-wellness' | 'stress-reduction' | 'sleep-improvement';
  secondaryGoals: string[];
  healthConditions: string[];
  dietaryRestrictions: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  timeAvailablePerDay: number; // minutes
  sleepGoal: number; // hours
  waterGoal: number; // ml
  calorieGoal: number;
  proteinGoal: number; // grams
  carbGoal: number; // grams
  fatGoal: number; // grams
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  date: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'walking' | 'cycling' | 'swimming' | 'yoga' | 'other';
  name: string;
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  caloriesBurned: number;
  steps?: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  distance?: number; // km
  sets?: number;
  reps?: number;
  weight?: number; // kg
  notes?: string;
  createdAt: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // hours
  quality: 1 | 2 | 3 | 4 | 5;
  deepSleep?: number; // hours
  remSleep?: number; // hours
  lightSleep?: number; // hours
  interruptions?: number;
  notes?: string;
  createdAt: string;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams
  sugar?: number; // grams
  sodium?: number; // mg
  servingSize?: string;
  notes?: string;
  createdAt: string;
}

export interface MentalHealthLog {
  id: string;
  userId: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1=very bad, 5=excellent
  stressLevel: 1 | 2 | 3 | 4 | 5; // 1=very low, 5=very high
  anxietyLevel: 1 | 2 | 3 | 4 | 5;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  meditationMinutes?: number;
  journalEntry?: string;
  triggers?: string[];
  gratitude?: string;
  createdAt: string;
}

export interface VitalSigns {
  id: string;
  userId: string;
  date: string;
  heartRate?: number; // bpm
  bloodPressureSystolic?: number; // mmHg
  bloodPressureDiastolic?: number; // mmHg
  spO2?: number; // %
  temperature?: number; // celsius
  respiratoryRate?: number; // breaths/min
  weight?: number; // kg
  bodyFat?: number; // %
  muscleMass?: number; // %
  createdAt: string;
}

export interface MenstrualCycle {
  id: string;
  userId: string;
  date: string;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  flow?: 'none' | 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  mood?: number;
  painLevel?: number;
  notes?: string;
  createdAt: string;
}

export interface SymptomLog {
  id: string;
  userId: string;
  date: string;
  symptomType: 'pain' | 'fatigue' | 'headache' | 'nausea' | 'digestion' | 'skin' | 'other';
  severity: 1 | 2 | 3 | 4 | 5;
  location?: string;
  description?: string;
  possibleTrigger?: string;
  createdAt: string;
}

export interface HydrationLog {
  id: string;
  userId: string;
  date: string;
  amount: number; // ml
  beverageType: 'water' | 'tea' | 'coffee' | 'juice' | 'other';
  time: string;
  createdAt: string;
}

// === GAMIFICATION TYPES ===

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'activity' | 'nutrition' | 'sleep' | 'mental' | 'streak' | 'social' | 'milestone';
  requiredValue: number;
  points: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
  progress: number;
}

export interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string;
  totalDaysLogged: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'activity' | 'nutrition' | 'sleep' | 'mental' | 'overall';
  target: number;
  unit: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  participants?: number;
  reward: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  joinedAt: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
}

// === WELLNESS PLAN TYPES ===

export interface WellnessPlan {
  id: string;
  userId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  nutritionPlan: NutritionPlan;
  exercisePlan: ExercisePlan;
  recoveryProtocol: RecoveryProtocol;
  weeklyGoals: string[];
  notes: string;
  createdAt: string;
}

export interface NutritionPlan {
  dailyCalories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  mealsPerDay: number;
  mealTiming: string[];
  hydrationGoal: number;
  supplements: string[];
  foodsToAvoid: string[];
  recommendedFoods: string[];
}

export interface ExercisePlan {
  sessionsPerWeek: number;
  sessionDuration: number; // minutes
  exercises: PlannedExercise[];
  intensity: 'low' | 'moderate' | 'high';
  focus: string;
  restDays: number[];
}

export interface PlannedExercise {
  name: string;
  type: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
}

export interface RecoveryProtocol {
  sleepGoal: number; // hours
  stressManagement: string[];
  recoveryActivities: string[];
  supplementRecommendations: string[];
}

// === AWARENESS ENGINE TYPES ===

export interface HealthProjection {
  currentScore: number;
  projectedScore3Month: number;
  projectedScore6Month: number;
  projectedScore1Year: number;
  goalReachDate: string;
  keyInsights: string[];
  warnings: string[];
}

export interface ConsistencyScore {
  overall: number; // 0-100
  activity: number;
  nutrition: number;
  sleep: number;
  mental: number;
  trend: 'improving' | 'declining' | 'stable';
  weeklyBreakdown: number[];
}