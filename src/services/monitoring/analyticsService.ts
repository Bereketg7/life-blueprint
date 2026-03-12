// Analytics & Monitoring Service
// Integrates event tracking, Google Analytics 4, Sentry crash reporting

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, string | number | boolean>;
  timestamp: string;
  userId?: string;
}

export interface PerformanceMetric {
  name: 'app_startup' | 'screen_load' | 'api_call';
  duration: number; // ms
  screen?: string;
  timestamp: string;
}

// In-memory event buffer
const eventBuffer: AnalyticsEvent[] = [];
const performanceBuffer: PerformanceMetric[] = [];

// Configuration
let analyticsEnabled = true;
let crashReportingEnabled = true;

export function configureAnalytics(options: {
  enabled?: boolean;
  crashReporting?: boolean;
}): void {
  analyticsEnabled = options.enabled ?? true;
  crashReportingEnabled = options.crashReporting ?? true;
}

// --- Event Tracker ---
export function trackEvent(
  name: string,
  parameters?: Record<string, string | number | boolean>,
  userId?: string,
): void {
  if (!analyticsEnabled) return;

  const event: AnalyticsEvent = {
    name,
    parameters,
    timestamp: new Date().toISOString(),
    userId,
  };

  eventBuffer.push(event);

  // GA4 integration stub
  sendToGA4(event);
}

// Predefined events
export const Events = {
  APP_OPENED: 'app_opened',
  WORKOUT_LOGGED: 'workout_logged',
  MEAL_LOGGED: 'meal_logged',
  SLEEP_LOGGED: 'sleep_logged',
  QUEST_COMPLETED: 'quest_completed',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_EARNED: 'achievement_earned',
  FRIEND_ADDED: 'friend_added',
  CHALLENGE_JOINED: 'challenge_joined',
  REPORT_GENERATED: 'report_generated',
  WEARABLE_CONNECTED: 'wearable_connected',
  AI_COACH_MESSAGE: 'ai_coach_message',
  BATTLE_PASS_TIER_UP: 'battle_pass_tier_up',
} as const;

// --- Google Analytics 4 ---
function sendToGA4(event: AnalyticsEvent): void {
  // Real impl: import firebase/analytics and call logEvent()
  void event;
}

// --- Sentry Crash Reporter ---
export function reportError(error: Error, context?: Record<string, unknown>): void {
  if (!crashReportingEnabled) return;
  // Real impl: Sentry.captureException(error, { extra: context })
  void error;
  void context;
}

export function setUserContext(userId: string, properties?: Record<string, string>): void {
  // Real impl: Sentry.setUser({ id: userId, ...properties })
  void userId;
  void properties;
}

// --- Performance Monitoring ---
export function recordPerformance(
  name: PerformanceMetric['name'],
  duration: number,
  screen?: string,
): void {
  const metric: PerformanceMetric = {
    name,
    duration,
    screen,
    timestamp: new Date().toISOString(),
  };
  performanceBuffer.push(metric);
}

export function measureStartupTime(): () => void {
  const start = Date.now();
  return () => {
    const duration = Date.now() - start;
    recordPerformance('app_startup', duration);
  };
}

export function measureScreenLoad(screenName: string): () => void {
  const start = Date.now();
  return () => {
    const duration = Date.now() - start;
    recordPerformance('screen_load', duration, screenName);
  };
}

export function getAverageStartupTime(): number {
  const startups = performanceBuffer.filter(m => m.name === 'app_startup');
  if (!startups.length) return 0;
  return startups.reduce((s, m) => s + m.duration, 0) / startups.length;
}

export function getEventBuffer(): AnalyticsEvent[] {
  return [...eventBuffer];
}

export function clearEventBuffer(): void {
  eventBuffer.length = 0;
}
