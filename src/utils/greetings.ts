/**
 * Determines greeting based on current time of day
 * @returns "morning" | "afternoon" | "evening" | "night"
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Generates personalized greeting
 * @param firstName - User's first name (e.g., "Alice")
 * @returns "Good morning, Alice" or similar
 */
export function getPersonalizedGreeting(firstName: string): string {
  const timeOfDay = getTimeOfDay();
  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good night',
  };
  return `${greetings[timeOfDay]}, ${firstName}`;
}

/**
 * Extract first name from full name
 * @param fullName - "Alice Smith" or "Alice"
 * @returns "Alice"
 */
export function getFirstName(fullName: string): string {
  return fullName.split(' ')[0].trim();
}
