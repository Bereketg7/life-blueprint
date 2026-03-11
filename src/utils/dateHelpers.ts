// Date Helpers code...

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function daysBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr: string): boolean {
  return dateStr === toISODate();
}

export function isPast(dateStr: string): boolean {
  return dateStr < toISODate();
}

export function getWeekDates(startDate: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return toISODate(d);
  });
}

export function formatDayName(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

/** Returns the Monday of the week containing `date`. Week starts on Monday (ISO 8601). */
export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isThisWeek(dateStr: string): boolean {
  const monday = getStartOfWeek();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const target = new Date(dateStr);
  return target >= monday && target <= sunday;
}

export function formatRelativeDate(dateStr: string): string {
  const today = toISODate();
  if (dateStr === today) return 'Today';

  const yesterday = toISODate(new Date(Date.now() - 86400000));
  if (dateStr === yesterday) return 'Yesterday';

  const diffDays = daysBetween(dateStr, today);
  if (diffDays > 0 && diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return formatShortDate(dateStr);
}

export function getTodayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}
