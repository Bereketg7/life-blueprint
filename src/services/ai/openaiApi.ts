import { CoachMessage } from '../../types';
import { getPersonality } from './coachPersonality';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

/** System prompt builder based on personality config. */
function buildSystemPrompt(userId: string): string {
  const personality = getPersonality(userId);
  return `You are ${personality.name}, an AI wellness coach with a ${personality.style} coaching style. Your tone is ${personality.tone}.
You specialise in: ${personality.focusAreas.join(', ')}.
You help users with fitness, nutrition, sleep, mental wellbeing, and goal setting.
Keep responses concise (2-4 sentences). Be warm, specific, and actionable.
When users share logs or stats, give data-driven feedback. Always end with an encouraging word or a next-step suggestion.`;
}

/** Realistic mock responses keyed by keyword detection. */
const MOCK_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['calorie', 'calories', 'eat', 'ate', 'food', 'meal', 'nutrition'],
    response:
      "Great that you're tracking your nutrition! Aim to hit your protein target first — it keeps you full and supports muscle repair. Would you like a quick meal suggestion to hit your macros?",
  },
  {
    keywords: ['workout', 'exercise', 'run', 'training', 'gym', 'lift'],
    response:
      "Consistency is the key to progress — well done for showing up! Make sure you're balancing hard sessions with adequate recovery. How are your energy levels feeling after recent workouts?",
  },
  {
    keywords: ['sleep', 'tired', 'rest', 'nap', 'fatigue', 'sleepy'],
    response:
      "Sleep is your secret weapon for performance and recovery. Even small improvements — like a consistent bedtime — can make a big difference. Try cutting screen time 30 minutes before bed tonight.",
  },
  {
    keywords: ['stress', 'anxious', 'anxiety', 'overwhelmed', 'mental', 'mood'],
    response:
      "I hear you — stress can derail even the best wellness plan. A 5-minute breathing exercise right now can activate your parasympathetic nervous system and calm your mind. Want me to guide you through one?",
  },
  {
    keywords: ['goal', 'target', 'weight', 'progress', 'plan'],
    response:
      "Setting clear goals is the first step to achieving them! Based on your recent data, you're moving in the right direction. Let's break your goal into weekly milestones to make it feel more achievable.",
  },
  {
    keywords: ['motivat', 'discourag', 'give up', 'hard', 'struggling'],
    response:
      "Every expert was once a beginner — keep going! Progress isn't always linear, but every healthy choice compounds over time. What's one small win from today you can celebrate?",
  },
];

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const entry of MOCK_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  return "That's a great question! As your wellness coach I'm here to support every aspect of your health journey. Could you tell me a bit more so I can give you the most relevant advice?";
}

// Simple in-memory rate limiter: max 30 messages per minute
const requestTimestamps: number[] = [];
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(): boolean {
  const now = Date.now();
  while (
    requestTimestamps.length > 0 &&
    now - requestTimestamps[0] > RATE_WINDOW_MS
  ) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= RATE_LIMIT) return false;
  requestTimestamps.push(now);
  return true;
}

/** Send a list of messages and receive a single coach response. */
export async function sendMessage(
  messages: ChatMessage[],
  userId = 'default',
): Promise<string> {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
  }

  // Simulate network latency (300–900 ms)
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 600));

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'user');
  return getMockResponse(lastUserMessage?.content ?? '');
}

/** Stream a response chunk by chunk (mock implementation). */
export async function streamMessage(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  userId = 'default',
): Promise<void> {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded.');
  }

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'user');
  const fullResponse = getMockResponse(lastUserMessage?.content ?? '');

  // Stream word by word
  const words = fullResponse.split(' ');
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 60));
    onChunk(word + ' ');
  }
}
