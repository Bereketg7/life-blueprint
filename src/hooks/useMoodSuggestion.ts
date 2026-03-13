/**
 * useMoodSuggestion — Custom hook that returns a contextual mood suggestion
 * based on the current time of day and today's calendar events.
 *
 * Usage:
 *   const { suggestion, loading } = useMoodSuggestion();
 */

import { useState, useEffect } from 'react';
import { getTodayEvents } from '../utils/calendarHelpers';
import { MoodSuggestion, suggestMood } from '../services/moodSuggestions';

interface UseMoodSuggestionResult {
  suggestion: MoodSuggestion | null;
  loading: boolean;
}

export function useMoodSuggestion(): UseMoodSuggestionResult {
  const [suggestion, setSuggestion] = useState<MoodSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const events = await getTodayEvents();
        const hour = new Date().getHours();
        const result = suggestMood(events, hour);
        if (!cancelled) setSuggestion(result);
      } catch {
        // If calendar fetch fails, still provide a time-based suggestion
        const hour = new Date().getHours();
        const fallback = suggestMood([], hour);
        if (!cancelled) setSuggestion(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { suggestion, loading };
}
