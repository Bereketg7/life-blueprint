import { CoachMessage, VoiceCommand } from '../../types';
import { IS_OPENAI_CONFIGURED, OPENAI_API_KEY } from '../../config/env';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Rate limiter: 30 req/min
const rateLimiter = {
  requests: [] as number[],
  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < 60000);
    if (this.requests.length >= 30) return false;
    this.requests.push(now);
    return true;
  },
};

// ── GPT-4 system prompt ───────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a knowledgeable, encouraging, and empathetic AI health coach for the Life Blueprint wellness app.
Your role is to help users improve their health across four pillars: exercise, nutrition, sleep, and mental wellness.

Guidelines:
- Give practical, evidence-based advice tailored to the user's message
- Be encouraging and non-judgmental
- Keep responses concise (2-4 sentences unless more detail is requested)
- Reference specific numbers where helpful (e.g. 150 min/week exercise, 7-9 hrs sleep, 0.8g protein per kg)
- If asked to log something, acknowledge it clearly
- Do not provide medical diagnoses; recommend consulting a doctor for medical concerns`;

// ── Keyword-matched response library (fallback) ───────────────────────────

const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'start'],
    response: "Hello! I'm your AI health coach. How can I help you today? You can ask me about workouts, nutrition, sleep, or just chat about your health goals!",
  },
  {
    keywords: ['workout', 'exercise', 'training', 'gym'],
    response: 'Great question about exercise! Based on general fitness principles, aim for 150 minutes of moderate activity or 75 minutes of vigorous activity per week. Mix cardio and strength training for best results.',
  },
  {
    keywords: ['nutrition', 'diet', 'food', 'eat', 'calories'],
    response: 'Nutrition is key to your success! Focus on whole foods, adequate protein (0.8–1.2g per kg bodyweight), complex carbs, and healthy fats. Stay hydrated with 8+ glasses of water daily.',
  },
  {
    keywords: ['sleep', 'rest', 'tired', 'fatigue'],
    response: 'Sleep is your superpower! Aim for 7–9 hours of quality sleep. Maintain a consistent bedtime, keep your room cool and dark, and avoid screens 1 hour before bed.',
  },
  {
    keywords: ['stress', 'anxious', 'anxiety', 'mental'],
    response: 'Managing stress is crucial for overall health. Try 10 minutes of daily meditation, deep breathing exercises, or a short walk in nature. Your mental health matters as much as physical health.',
  },
  {
    keywords: ['weight', 'lose', 'gain', 'body'],
    response: 'Sustainable weight management comes from a calorie deficit (for loss) or surplus (for gain) combined with strength training. Focus on progress over perfection, and be patient with yourself!',
  },
  {
    keywords: ['motivation', 'motivated', 'give up', 'quit'],
    response: "You've got this! Remember why you started. Every small action compounds over time. Focus on building habits, not just achieving outcomes. Celebrate small wins along the way!",
  },
];

// Mock streaming word-by-word response
async function* streamResponse(text: string): AsyncGenerator<string> {
  const words = text.split(' ');
  for (const word of words) {
    yield word + ' ';
    await new Promise(r => setTimeout(r, 50)); // 50ms per word
  }
}

function findKeywordResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response;
    }
  }
  return "That's a great question! As your AI coach, I recommend focusing on consistency in your three pillars: exercise, nutrition, and sleep. Is there a specific area you'd like to dive deeper into?";
}

// ── Real GPT-4 integration ────────────────────────────────────────────────

async function sendWithOpenAI(
  userMessage: string,
  history: CoachMessage[],
  onToken?: (token: string) => void,
): Promise<CoachMessage> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { OpenAI } = require('openai');
  // NOTE: dangerouslyAllowBrowser is required for React Native (which is not
  // a browser environment but triggers the same guard). In production, prefer
  // routing OpenAI calls through your own backend endpoint so the API key is
  // never shipped in the app bundle. See .env.example for setup instructions.
  const client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...history.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  if (onToken) {
    // Streaming response
    const stream = await client.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true,
      max_tokens: 300,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const token: string = chunk.choices[0]?.delta?.content ?? '';
      if (token) {
        fullContent += token;
        onToken(token);
      }
    }

    return {
      id: generateId(),
      role: 'assistant',
      content: fullContent,
      timestamp: new Date().toISOString(),
      streaming: false,
    };
  }

  // Non-streaming response
  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages,
    max_tokens: 300,
  });

  return {
    id: generateId(),
    role: 'assistant',
    content: response.choices[0]?.message?.content ?? '',
    timestamp: new Date().toISOString(),
    streaming: false,
  };
}

// ── Main chat function ────────────────────────────────────────────────────

/**
 * Send a message to the AI health coach.
 *
 * - When OPENAI_API_KEY is set: calls GPT-4 with the full conversation history
 *   and the Life Blueprint system prompt.
 * - Otherwise: falls back to keyword-based responses so the app works without
 *   credentials and all tests continue to pass.
 */
export async function sendMessage(
  userMessage: string,
  history: CoachMessage[],
  onToken?: (token: string) => void,
): Promise<CoachMessage> {
  if (!rateLimiter.isAllowed()) {
    throw new Error('Rate limit exceeded. Please wait before sending another message.');
  }

  if (IS_OPENAI_CONFIGURED) {
    try {
      return await sendWithOpenAI(userMessage, history, onToken);
    } catch (err) {
      console.warn('[AICoach] OpenAI call failed, using keyword fallback:', err);
    }
  }

  // Keyword-matching fallback
  const responseText = findKeywordResponse(userMessage);

  if (onToken) {
    for await (const token of streamResponse(responseText)) {
      onToken(token);
    }
  }

  return {
    id: generateId(),
    role: 'assistant',
    content: responseText,
    timestamp: new Date().toISOString(),
    streaming: false,
  };
}

// ── NLP Voice Command Parser ──────────────────────────────────────────────

export function parseVoiceCommand(rawText: string): VoiceCommand {
  const text = rawText.toLowerCase().trim();

  // "Log X calories"
  const caloriesMatch = text.match(/log\s+(\d+)\s+calories?/);
  if (caloriesMatch) {
    return {
      action: 'log_calories',
      parameters: { calories: parseInt(caloriesMatch[1], 10) },
      confidence: 0.95,
      rawText,
    };
  }

  // "Log activity: X for Y minutes"
  const activityMatch = text.match(/log\s+(?:activity\s+)?(.+?)\s+for\s+(\d+)\s+min/);
  if (activityMatch) {
    return {
      action: 'log_activity',
      parameters: { activity: activityMatch[1], duration: parseInt(activityMatch[2], 10) },
      confidence: 0.9,
      rawText,
    };
  }

  // "Log X hours of sleep"
  const sleepMatch = text.match(/log\s+(\d+(?:\.\d+)?)\s+hours?\s+(?:of\s+)?sleep/);
  if (sleepMatch) {
    return {
      action: 'log_sleep',
      parameters: { hours: parseFloat(sleepMatch[1]) },
      confidence: 0.92,
      rawText,
    };
  }

  // "Check my progress"
  if (text.includes('progress') || text.includes('stats') || text.includes('how am i doing')) {
    return {
      action: 'check_progress',
      parameters: {},
      confidence: 0.85,
      rawText,
    };
  }

  // "Get recommendation"
  if (text.includes('recommend') || text.includes('suggest') || text.includes('what should')) {
    return {
      action: 'get_recommendation',
      parameters: {},
      confidence: 0.8,
      rawText,
    };
  }

  return {
    action: 'unknown',
    parameters: {},
    confidence: 0,
    rawText,
  };
}

// ── TTS / STT wrappers ────────────────────────────────────────────────────

// expo-speech for text-to-speech
export const tts = {
  speak: async (text: string): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Speech = require('expo-speech');
      await Speech.speak(text, { language: 'en-US', rate: 0.9 });
    } catch {
      // expo-speech not available (e.g. web / test environment)
      void text;
    }
  },
  isSpeaking: async (): Promise<boolean> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Speech = require('expo-speech');
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  },
  stop: async (): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Speech = require('expo-speech');
      await Speech.stop();
    } catch {
      // no-op
    }
  },
};

export const stt = {
  startListening: async (onResult: (text: string) => void): Promise<void> => {
    // Real STT would use expo-av + a cloud speech API or react-native-voice.
    // Mock: simulate after 2s so existing tests remain green.
    await new Promise(r => setTimeout(r, 2000));
    onResult('Log 500 calories');
  },
  stopListening: async (): Promise<void> => {},
  isAvailable: (): boolean => false,
};
