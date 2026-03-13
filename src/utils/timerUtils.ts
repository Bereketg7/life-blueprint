/** Format elapsed seconds as MM:SS */
export function formatElapsedTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Convert elapsed seconds to whole minutes (rounded) */
export function secondsToMinutes(totalSeconds: number): number {
  return Math.round(totalSeconds / 60);
}

/** MET (Metabolic Equivalent) values per activity type and intensity */
const MET_VALUES: Record<string, Record<string, number>> = {
  walking:    { low: 2.5, moderate: 3.5, high: 4.5 },
  cardio:     { low: 6,   moderate: 8,   high: 10  },
  cycling:    { low: 4,   moderate: 6,   high: 8   },
  swimming:   { low: 5,   moderate: 7,   high: 9   },
  strength:   { low: 3,   moderate: 5,   high: 6   },
  yoga:       { low: 2,   moderate: 3,   high: 4   },
  sports:     { low: 4,   moderate: 6,   high: 8   },
  flexibility:{ low: 2,   moderate: 2.5, high: 3   },
  other:      { low: 3,   moderate: 5,   high: 7   },
};

/**
 * Estimate calories burned from a timer session.
 * Uses: MET × weight(kg) × durationMinutes / 60
 */
export function calcCaloriesFromTimer(
  activityType: string,
  intensity: string,
  elapsedSeconds: number,
  weightKg: number,
): number {
  const met = MET_VALUES[activityType]?.[intensity] ?? 5;
  const minutes = elapsedSeconds / 60;
  return Math.round(met * weightKg * minutes / 60);
}
