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

// ─── Auth & Sync ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  provider: 'email' | 'google' | 'apple';
  createdAt: string;
}

export interface SyncJob {
  id: string;
  collection: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  createdAt: string;
  lastAttemptAt?: string;
  error?: string;
}

export interface SyncQueue {
  jobs: SyncJob[];
  isProcessing: boolean;
  lastProcessedAt: string | null;
}

export interface SyncError {
  jobId: string;
  message: string;
  code: string;
  timestamp: string;
}

// ─── Wearables ─────────────────────────────────────────────────────────────────

export interface WearableDevice {
  id: string;
  type: 'apple_health' | 'fitbit' | 'garmin' | 'whoop' | 'oura';
  name: string;
  isConnected: boolean;
  lastSyncAt: string | null;
  batteryLevel?: number;
  authToken?: string;
}

export interface WearableData {
  deviceId: string;
  date: string;
  steps: number;
  heartRate: number;
  caloriesBurned: number;
  activeMinutes: number;
  sleepHours?: number;
  hrvScore?: number;
}

export interface WearableSyncLog {
  id: string;
  deviceId: string;
  syncedAt: string;
  recordsImported: number;
  status: 'success' | 'partial' | 'failed';
  error?: string;
}

export interface WearableActivity {
  id: string;
  deviceId: string;
  type: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  caloriesBurned: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  steps?: number;
  distance?: number;
}

export interface SleepData {
  date: string;
  totalHours: number;
  deepSleepHours: number;
  remSleepHours: number;
  lightSleepHours: number;
  awakeMinutes: number;
  efficiency: number;
}

export interface WearableWorkout {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  caloriesBurned: number;
  heartRateAvg?: number;
  source: string;
}

// ─── Meal Recognition ──────────────────────────────────────────────────────────

export interface MealRecognitionResult {
  id: string;
  foodItems: Array<{
    name: string;
    confidence: number;
    portionSize: 'small' | 'medium' | 'large' | 'extra_large';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  overallConfidence: number;
  photoUri: string;
  analyzedAt: string;
}

export interface CachedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUri?: string;
  frequency: number;
  lastUsedAt: string;
  source: 'photo' | 'barcode' | 'manual' | 'preset';
}

export interface MealPhoto {
  uri: string;
  base64?: string;
  width: number;
  height: number;
  capturedAt: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
  servingUnit?: string;
}

export interface NutritionixFood {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: number;
  servingUnit: string;
  imageUrl?: string;
  barcode?: string;
}

export interface FoodDetectionResult {
  name: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface VisionAnalysisResult {
  labels: Array<{ description: string; score: number }>;
  objects: Array<{ name: string; score: number }>;
  safeSearch: Record<string, string>;
  raw: unknown;
}

export interface PortionEstimate {
  foodItem: string;
  portionSize: 'small' | 'medium' | 'large' | 'extra_large';
  estimatedGrams: number;
  confidence: number;
}

export interface BarcodeResult {
  barcode: string;
  format: string;
  rawValue: string;
}