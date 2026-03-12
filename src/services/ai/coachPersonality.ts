// Coach personality – system prompt and personalization
import { UserProfile } from '../../types';

const BASE_SYSTEM_PROMPT = `You are Life Blueprint Coach, a personal wellness AI assistant.
You are encouraging, data-driven, and personalized.
You help users with workouts, nutrition, sleep, and mental health.
Keep responses concise (under 150 words) and actionable.
Always reference the user's actual data when available.`;

export function buildSystemPrompt(profile: UserProfile | null): string {
  if (!profile) return BASE_SYSTEM_PROMPT;

  const goalMap: Record<string, string> = {
    weight_loss: 'lose weight',
    muscle_gain: 'build muscle',
    maintenance: 'maintain fitness',
    endurance: 'improve endurance',
    flexibility: 'improve flexibility',
  };

  const userContext = `
The user's name is ${profile.name}.
Their primary goal is to ${goalMap[profile.goalType] ?? profile.goalType}.
Activity level: ${profile.activityLevel}.
Dietary preferences: ${profile.dietaryPreferences.join(', ') || 'none specified'}.
Health conditions: ${profile.healthConditions.join(', ') || 'none'}.`;

  return `${BASE_SYSTEM_PROMPT}\n\nUser profile:${userContext}`;
}

export function getMotivationalOpener(): string {
  const openers = [
    "Great to see you! Let's crush today's goals. 💪",
    "You're making progress every day. How can I help? 🌟",
    "Ready to take your wellness to the next level? Let's go! 🚀",
    "Consistency is your superpower. What's on your mind? 🧠",
    "Every step forward counts. How are you feeling today? ✨",
  ];
  return openers[Math.floor(Math.random() * openers.length)];
}
