// Formatting code...

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatCalories(calories: number): string {
  return `${calories.toLocaleString()} kcal`;
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

export function formatHeight(cm: number): string {
  return `${cm} cm`;
}

export function formatMacros(protein: number, carbs: number, fat: number): string {
  return `P: ${protein}g  C: ${carbs}g  F: ${fat}g`;
}

export function formatSleepTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatStreak(days: number): string {
  return `🔥 ${days} day${days !== 1 ? 's' : ''}`;
}

export function getMoodEmoji(mood: number): string {
  const emojis: Record<number, string> = {
    1: '😞',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '😄',
  };
  return emojis[Math.round(mood)] ?? '😐';
}

export function getIntensityLabel(intensity: string): string {
  const labels: Record<string, string> = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
  };
  return labels[intensity] ?? intensity;
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}
