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