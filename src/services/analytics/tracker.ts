// Analytics event tracker – Google Analytics / custom
import { AnalyticsEvent } from '../../types';

const _events: AnalyticsEvent[] = [];
let _enabled = true;

export function enableTracking(): void {
  _enabled = true;
}

export function disableTracking(): void {
  _enabled = false;
}

export function trackEvent(
  name: string,
  userId: string,
  properties: Record<string, any> = {}
): void {
  if (!_enabled) return;

  const event: AnalyticsEvent = {
    name,
    userId,
    properties,
    timestamp: new Date().toISOString(),
  };

  _events.push(event);
  console.log('[Analytics]', event.name, event.properties);
}

export function getEvents(): AnalyticsEvent[] {
  return [..._events];
}

export function clearEvents(): void {
  _events.length = 0;
}

export function getEventsByName(name: string): AnalyticsEvent[] {
  return _events.filter((e) => e.name === name);
}

export function getUserEvents(userId: string): AnalyticsEvent[] {
  return _events.filter((e) => e.userId === userId);
}
