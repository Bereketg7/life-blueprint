// === CORE TYPES ===

/** Emoji-based mood mapping for Quick Mood Selector */
export const MOOD_EMOJIS = [
  { emoji: '😢', value: 1 as const, label: 'Very Bad' },
  { emoji: '😐', value: 2 as const, label: 'Neutral' },
  { emoji: '😊', value: 3 as const, label: 'Good' },
  { emoji: '🤩', value: 4 as const, label: 'Excellent' },
] as const;

export type MoodEmojiValue = 1 | 2 | 3 | 4;

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
  primaryGoals: string[];
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

// === WEARABLE TYPES ===
export interface WearableDevice {
  id: string;
  type: 'apple_health' | 'fitbit' | 'garmin' | 'google_fit';
  name: string;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  userId: string;
}

export interface WearableSyncLog {
  id: string;
  deviceId: string;
  dataImported: number;
  timestamp: string;
  success: boolean;
}

export interface WearableData {
  steps: number;
  heartRate: number;
  sleepDuration: number;
  caloriesBurned: number;
  date: string;
}

// === RECOMMENDATION TYPES ===
export interface Recommendation {
  id: string;
  type: 'workout' | 'nutrition' | 'sleep' | 'mental' | 'training_week';
  title: string;
  description: string;
  confidence: number; // 0-1
  priority: number; // 1-10
  reward?: { xp: number; coins: number };
  createdAt: string;
}

export interface RecommendationResponse {
  recommendationId: string;
  accepted: boolean;
  feedback?: string;
  timestamp: string;
}

// === AI COACH TYPES ===
export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  streaming?: boolean;
}

export interface VoiceCommand {
  action: 'log_calories' | 'log_activity' | 'log_sleep' | 'check_progress' | 'get_recommendation' | 'unknown';
  parameters: Record<string, string | number>;
  confidence: number;
  rawText: string;
}

// === QUEST TYPES ===
export interface Quest {
  id: string;
  userId: string;
  type: 'activity' | 'nutrition' | 'meditation' | 'social' | 'challenge';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  target: number;
  current: number;
  reward: QuestReward;
  status: 'active' | 'completed' | 'expired';
  expiresAt: string;
  createdAt: string;
}

export interface QuestReward {
  xp: number;
  coins: number;
  badge?: string;
}

// === LEVEL TYPES ===
export interface UserLevel {
  userId: string;
  level: number; // 1-100
  xp: number;
  xpToNext: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum' | 'legendary';
  unlockedFeatures: string[];
  coins: number;
}

export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  source: 'quest' | 'achievement' | 'streak' | 'challenge' | 'manual';
  description: string;
  timestamp: string;
}

// === BATTLE PASS TYPES ===
export interface BattlePass {
  id: string;
  userId: string;
  season: number;
  tier: number; // 1-50
  progress: number; // XP towards next tier
  isPremium: boolean;
  rewards: SeasonalReward[];
  createdAt: string;
}

export interface SeasonalReward {
  id: string;
  name: string;
  type: 'xp_boost' | 'badge' | 'title' | 'avatar_frame' | 'coin_bundle';
  icon: string;
  tier: number;
  isPremium: boolean;
  unlockedAt?: string;
}

export interface SeasonalChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: QuestReward;
  daysRemaining: number;
  season: number;
}

// === SOCIAL TYPES ===
export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
}

export interface SocialChallenge {
  id: string;
  type: 'steps' | 'calories' | 'workouts' | 'sleep' | 'nutrition';
  title: string;
  duration: number; // days
  participants: { userId: string; name: string; score: number }[];
  leaderboard: { rank: number; userId: string; name: string; score: number }[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  type: 'workout' | 'achievement' | 'quest' | 'level_up' | 'challenge';
  title: string;
  description: string;
  timestamp: string;
}

// === HEALTHCARE TYPES ===
export interface DoctorShare {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  permissions: ('activity' | 'nutrition' | 'sleep' | 'vitals' | 'mental' | 'biomarkers')[];
  createdAt: string;
  expiresAt?: string;
}

export interface LabResult {
  id: string;
  userId: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange?: string;
  date: string;
  provider: string;
  isAbnormal: boolean;
  createdAt: string;
}

export interface Prescription {
  id: string;
  userId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  reminderEnabled: boolean;
  reminderTimes?: string[];
  notes?: string;
  createdAt: string;
}

// === BIOMARKER TYPES ===
export interface BiomarkerReading {
  id: string;
  userId: string;
  type: 'hrv' | 'vo2max' | 'resting_hr' | 'weight' | 'body_fat' | 'blood_pressure_sys' | 'blood_pressure_dia' | 'spo2';
  value: number;
  unit: string;
  timestamp: string;
  source: 'manual' | 'wearable' | 'lab';
  notes?: string;
}

export interface BiomarkerTrend {
  type: BiomarkerReading['type'];
  readings: BiomarkerReading[];
  baseline: number;
  current: number;
  trend: 'improving' | 'declining' | 'stable';
  alerts: string[];
}

// === REPORTING TYPES ===
export interface HealthReport {
  id: string;
  userId: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  startDate: string;
  endDate: string;
  generatedAt: string;
  pdfUrl?: string;
  emailSent: boolean;
  summaryData: {
    avgSleep: number;
    totalWorkouts: number;
    avgCalories: number;
    avgMood: number;
    topAchievements: string[];
  };
}

// === THEME & ACCESSIBILITY TYPES ===
export interface AccessibilitySettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  highContrast: boolean;
  dyslexiaFont: boolean;
  screenReaderEnabled: boolean;
  hapticFeedback: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface AppTheme {
  id: string;
  name: 'light' | 'dark' | 'high-contrast' | 'dyslexia-friendly' | 'system';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    accent: string;
  };
}