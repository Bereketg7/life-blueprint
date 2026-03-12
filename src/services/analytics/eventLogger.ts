// Event logger – structured event logging
import { AnalyticsEvent } from '../../types';
import { trackEvent } from './tracker';

export function logScreenView(screenName: string, userId: string): void {
  trackEvent('screen_view', userId, { screen: screenName });
}

export function logFeatureUsage(feature: string, userId: string, meta?: Record<string, any>): void {
  trackEvent('feature_used', userId, { feature, ...meta });
}

export function logUserAction(action: string, userId: string, meta?: Record<string, any>): void {
  trackEvent('user_action', userId, { action, ...meta });
}

export function logError(error: string, userId: string, context?: Record<string, any>): void {
  trackEvent('error', userId, { error, ...context });
}

export function logConversion(
  conversionType: string,
  userId: string,
  value?: number
): void {
  trackEvent('conversion', userId, { conversion_type: conversionType, value });
}

export function logEngagementTime(
  screenName: string,
  userId: string,
  durationMs: number
): void {
  trackEvent('engagement_time', userId, { screen: screenName, duration_ms: durationMs });
}
