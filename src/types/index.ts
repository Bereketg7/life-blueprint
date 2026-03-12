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
  type: string;
  relatedId?: string;
}

export interface AwarenessEntry {
  id: string;
  lifeAreaId: string;
  score: number;
  note: string;
  date: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  goalType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance' | 'flexibility';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  dietaryPreferences: string[];
  healthConditions: string[];
  workoutNotificationsEnabled: boolean;
  mealNotificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  date: string;
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  notes: string;
  status: 'completed' | 'skipped' | 'pending';
  createdAt: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  date: string;
  hoursSlept: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes: string;
  createdAt: string;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  photoUri?: string;
  status: 'logged' | 'estimated';
  createdAt: string;
}

export interface MentalHealthLog {
  id: string;
  userId: string;
  date: string;
  mood: number;
  stress: number;
  notes: string;
  createdAt: string;
}

export interface VitalSigns {
  id: string;
  userId: string;
  date: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  weight: number;
  notes: string;
  createdAt: string;
}

export interface DailyPlanItem {
  id: string;
  planId: string;
  day: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  category: 'nutrition' | 'exercise' | 'supplement' | 'recovery' | 'mindfulness';
  title: string;
  description: string;
  duration: number;
  status: 'pending' | 'completed' | 'skipped';
  createdAt: string;
}

export interface WeeklyPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  items: DailyPlanItem[];
  goalType: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: string;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: string;
  streakCount: number;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string;
  totalDaysLogged: number;
}

export interface HealthProjection {
  timeframe: '1_month' | '3_months' | '6_months' | '12_months';
  projectedWeight: number;
  goalAchievementDate: string;
  consistencyScore: number;
  insights: string[];
}

export interface ConsistencyData {
  totalItems: number;
  completedItems: number;
  skippedItems: number;
  score: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  comments: number;
  category: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  participants: number;
  category: string;
  startDate: string;
  endDate: string;
}
// ─── Feature 1: Firebase Backend & Cloud Sync ───────────────────────────────
export interface SyncJob {
  id: string;
  action: 'create' | 'update' | 'delete';
  collection: string;
  data: any;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

// ─── Feature 2: Wearable Integration ────────────────────────────────────────
export interface WearableDevice {
  id: string;
  type: 'apple_health' | 'fitbit' | 'garmin';
  name: string;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error';
  userId: string;
}

export interface WearableSyncLog {
  id: string;
  deviceId: string;
  dataImported: {
    steps: number;
    heartRate: number;
    sleepDuration: number;
    caloriesBurned: number;
  };
  timestamp: string;
}

// ─── Feature 3: Meal Recognition ────────────────────────────────────────────
export interface MealRecognitionResult {
  mealName: string;
  confidence: number;
  suggestedMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  portions: string[];
  source: 'vision_api' | 'barcode' | 'manual';
}

export interface CachedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  frequency: number;
}

// ─── Feature 4: Recommendations Engine ──────────────────────────────────────
export interface Recommendation {
  id: string;
  userId: string;
  type: 'workout' | 'meal' | 'rest' | 'hydration' | 'meditation';
  title: string;
  description: string;
  reason: string;
  action: {
    type: 'activity' | 'nutrition' | 'sleep';
    payload: any;
  };
  confidence: number;
  userResponse: 'accepted' | 'rejected' | 'pending';
  createdAt: string;
}

// ─── Feature 5: AI Coach ─────────────────────────────────────────────────────
export interface CoachMessage {
  id: string;
  userId: string;
  role: 'user' | 'coach';
  content: string;
  audioUrl?: string;
  timestamp: string;
  action?: {
    type: string;
    payload: any;
  };
}

export interface VoiceCommand {
  command: string;
  action: 'log_activity' | 'log_meal' | 'schedule_workout' | 'query_data';
  parameters: Record<string, any>;
}

// ─── Feature 6: Predictive Health Analytics ─────────────────────────────────
export interface HealthPrediction {
  id: string;
  userId: string;
  type: 'weight_loss' | 'goal_achievement' | 'injury_risk' | 'burnout_risk';
  confidence: number;
  prediction: {
    projectedValue: number;
    timeframe: string;
    date: string;
  };
  factors: string[];
  createdAt: string;
}

export interface RiskAssessment {
  type: 'injury' | 'burnout' | 'plateau';
  riskScore: number;
  factors: {
    name: string;
    impact: number;
  }[];
  recommendation: string;
}

// ─── Feature 7: Daily Quest System ──────────────────────────────────────────
export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'workout' | 'nutrition' | 'water' | 'sleep' | 'meditation';
  difficulty: 'easy' | 'medium' | 'hard';
  target: number;
  current: number;
  reward: {
    xp: number;
    coins: number;
    badge?: string;
  };
  deadline: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

// ─── Feature 8: Level Progression ───────────────────────────────────────────
export interface UserLevel {
  userId: string;
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  currentXp: number;
  lastLevelUpDate: string;
}

export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  source: 'quest' | 'activity' | 'achievement' | 'streak' | 'bonus';
  description: string;
  timestamp: string;
}

// ─── Feature 9: Battle Pass ──────────────────────────────────────────────────
export interface BattlePass {
  id: string;
  userId: string;
  seasonNumber: number;
  level: number;
  xp: number;
  track: 'free' | 'premium';
  rewardsClaimed: string[];
  startDate: string;
  endDate: string;
}

export interface SeasonalReward {
  id: string;
  seasonNumber: number;
  level: number;
  type: 'badge' | 'cosmetic' | 'title' | 'coins';
  reward: string;
  trackRequired: 'free' | 'premium' | 'both';
}

// ─── Feature 10: Social Features ────────────────────────────────────────────
export interface Friend {
  userId: string;
  friendId: string;
  username: string;
  profilePhoto: string;
  level: number;
  streak: number;
  status: 'active' | 'inactive';
  addedAt: string;
}

export interface SocialChallenge {
  id: string;
  createdBy: string;
  participants: string[];
  title: string;
  description: string;
  type: 'steps' | 'workouts' | 'consistency' | 'weight_loss';
  goal: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  level: number;
  xp: number;
  streak: number;
  score: number;
}

// ─── Feature 11: Health Providers (FHIR) ────────────────────────────────────
export interface HealthProvider {
  id: string;
  userId: string;
  providerName: string;
  specialty: string;
  email: string;
  fhirEndpoint: string;
  sharePermissions: {
    activityLogs: boolean;
    nutritionLogs: boolean;
    sleepLogs: boolean;
    weight: boolean;
    bloodPressure: boolean;
  };
  connectedAt: string;
}

export interface LabResult {
  id: string;
  userId: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: 'normal' | 'low' | 'high';
  testDate: string;
  provider: string;
}

// ─── Feature 12: Health Reports ──────────────────────────────────────────────
export interface HealthReport {
  id: string;
  userId: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalActivity: number;
    avgCalories: number;
    avgSleep: number;
    avgMood: number;
    streakDays: number;
    goalsCompleted: number;
  };
  insights: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface ReportEmail {
  recipientEmail: string;
  reportId: string;
  pdfUrl: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
}

// ─── Feature 13: Biomarker Tracking ─────────────────────────────────────────
export interface Biomarker {
  id: string;
  userId: string;
  type: 'hrv' | 'vo2_max' | 'rhr' | 'body_fat' | 'muscle_mass' | 'blood_pressure';
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'alert';
}

export interface BiomarkerTrend {
  type: string;
  week1Avg: number;
  week2Avg: number;
  trend: 'improving' | 'declining' | 'stable';
  changePercent: number;
}

// ─── Feature 14: Analytics & Monitoring ──────────────────────────────────────
export interface AnalyticsEvent {
  name: string;
  userId: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface CrashReport {
  id: string;
  userId: string;
  error: string;
  stackTrace: string;
  timestamp: string;
  appVersion: string;
  deviceInfo: any;
}

// ─── Feature 15: Theme & Accessibility ───────────────────────────────────────
export interface Theme {
  name: string;
  id: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  isDark: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  dyslexiaFont: boolean;
  screenReaderEnabled: boolean;
  hapticFeedback: boolean;
}
