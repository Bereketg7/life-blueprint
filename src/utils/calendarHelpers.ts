/**
 * Calendar helpers for mood suggestion analysis.
 *
 * Currently uses a mock data model.  Replace `getTodayEvents()` with a real
 * expo-calendar (or Google Calendar API) call when the integration is ready.
 */

export type CalendarEventType =
  | 'meeting'
  | 'workout'
  | 'social'
  | 'appointment'
  | 'deadline'
  | 'break'
  | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  /** 24-hour hour of day when the event starts (0-23) */
  startHour: number;
  /** Duration in minutes */
  durationMinutes: number;
  /** Whether this event is typically stressful */
  isStressful: boolean;
}

/** Return the hour (0-23) at which the event ends. */
export function getEventEndHour(event: CalendarEvent): number {
  return event.startHour + Math.floor(event.durationMinutes / 60);
}

/**
 * Whether the event starts within the next `withinHours` hours from `currentHour`.
 */
export function isWithinHours(
  event: CalendarEvent,
  currentHour: number,
  withinHours: number,
): boolean {
  const diff = event.startHour - currentHour;
  return diff >= 0 && diff <= withinHours;
}

/** Classify a raw event title into a CalendarEventType. */
export function classifyEventType(title: string): CalendarEventType {
  const lower = title.toLowerCase();
  if (/gym|workout|run|yoga|swim|cycle|exercise|training/.test(lower)) return 'workout';
  if (/meeting|standup|call|interview|review|sync/.test(lower)) return 'meeting';
  if (/lunch|dinner|party|hangout|friend|date|social/.test(lower)) return 'social';
  if (/doctor|dentist|appointment|checkup|therapy/.test(lower)) return 'appointment';
  if (/deadline|submit|present|presentation|demo|launch/.test(lower)) return 'deadline';
  if (/break|rest|nap|relax|vacation/.test(lower)) return 'break';
  return 'other';
}

/**
 * Returns today's calendar events.
 *
 * ⚠️  MOCK IMPLEMENTATION — replace the body of this function with a real
 * expo-calendar (or Google Calendar API) call when you are ready to use
 * actual calendar data.  The return type and shape are stable; no other
 * code needs to change.
 */
export async function getTodayEvents(): Promise<CalendarEvent[]> {
  // Mock: returns an empty list so the time-of-day logic is always active.
  // Swap this with real calendar data when available.
  return [];
}
