/**
 * Mood suggestion service.
 *
 * Analyses the current time of day and today's calendar events to suggest a
 * likely mood before the user logs it, reducing decision time.
 */

import { CalendarEvent, isWithinHours } from '../utils/calendarHelpers';

export interface MoodSuggestion {
  /** Short contextual message shown to the user. */
  message: string;
  /** Suggested mood value on the 1-5 scale. */
  expectedMood: 1 | 2 | 3 | 4 | 5;
  /** Emoji hint shown alongside the message. */
  emoji: string;
}

/**
 * Build a mood suggestion from calendar events and current hour.
 *
 * Priority order:
 * 1. Stressful event coming up within 1 hour
 * 2. Workout event in next 2 hours
 * 3. Social event coming up
 * 4. Free evening (≥18h, no more events)
 * 5. Time-of-day defaults
 */
export function suggestMood(
  events: CalendarEvent[],
  hour: number,
): MoodSuggestion {
  // 1. Stressful event within 1 hour
  const stressfulSoon = events.find(
    e => e.isStressful && isWithinHours(e, hour, 1),
  );
  if (stressfulSoon) {
    return {
      message: `${stressfulSoon.title} coming up — feeling a bit tense?`,
      expectedMood: 2,
      emoji: '😰',
    };
  }

  // 2. Workout / energising event within 2 hours
  const workoutSoon = events.find(
    e => e.type === 'workout' && isWithinHours(e, hour, 2),
  );
  if (workoutSoon) {
    return {
      message: 'Ready to crush your workout? 💪',
      expectedMood: 4,
      emoji: '💪',
    };
  }

  // 3. Social event coming up
  const socialSoon = events.find(
    e => e.type === 'social' && isWithinHours(e, hour, 2),
  );
  if (socialSoon) {
    return {
      message: 'Social plans ahead — feeling excited?',
      expectedMood: 4,
      emoji: '🎉',
    };
  }

  // 4. Free evening
  if (hour >= 18 && events.filter(e => e.startHour >= hour).length === 0) {
    return {
      message: 'Relaxing evening ahead 🌙',
      expectedMood: 3,
      emoji: '🌙',
    };
  }

  // 5. Time-of-day defaults
  return getTimeOfDaySuggestion(hour);
}

function getTimeOfDaySuggestion(hour: number): MoodSuggestion {
  if (hour >= 5 && hour < 9) {
    return { message: 'Morning energy! ☀️', expectedMood: 3, emoji: '☀️' };
  }
  if (hour >= 9 && hour < 12) {
    return { message: 'In the zone? 🎯', expectedMood: 3, emoji: '🎯' };
  }
  if (hour >= 12 && hour < 14) {
    return { message: 'Post-lunch vibes 🍽️', expectedMood: 3, emoji: '🍽️' };
  }
  if (hour >= 14 && hour < 17) {
    return { message: 'Afternoon slump? 😴', expectedMood: 2, emoji: '😴' };
  }
  if (hour >= 17 && hour < 20) {
    return { message: 'Work day winding down 🌅', expectedMood: 3, emoji: '🌅' };
  }
  if (hour >= 20 && hour < 23) {
    return { message: 'Evening wind-down 🛋️', expectedMood: 3, emoji: '🛋️' };
  }
  // Night / early morning
  return { message: 'Up late? Rest is important 😴', expectedMood: 2, emoji: '🌙' };
}

/**
 * Analyse historical mood logs to detect day-of-week patterns.
 *
 * Returns the average mood for the current day-of-week if enough data exists
 * (≥3 samples), otherwise null.
 */
export function learnFromHistory(
  moods: Array<{ date: string; mood: number }>,
): number | null {
  const today = new Date().getDay(); // 0 = Sunday
  const sameDayMoods = moods
    .filter(m => new Date(m.date).getDay() === today)
    .map(m => m.mood);

  if (sameDayMoods.length < 3) return null;

  const avg = sameDayMoods.reduce((a, b) => a + b, 0) / sameDayMoods.length;
  return Math.round(avg) as 1 | 2 | 3 | 4 | 5;
}
