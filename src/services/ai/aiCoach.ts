import { CoachMessage, VoiceCommand } from '../../types';

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

// Keyword-matched response library
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

// Main chat function
export async function sendMessage(
  userMessage: string,
  history: CoachMessage[],
  onToken?: (token: string) => void,
): Promise<CoachMessage> {
  if (!rateLimiter.isAllowed()) {
    throw new Error('Rate limit exceeded. Please wait before sending another message.');
  }

  void history; // Would use history for GPT-4 context in real implementation

  const responseText = findKeywordResponse(userMessage);

  // Simulate streaming
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

// NLP Voice Command Parser
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

// TTS/STT wrappers (expo-speech graceful fallback)
export const tts = {
  speak: async (text: string): Promise<void> => {
    // Real impl would use expo-speech
    void text;
  },
  isSpeaking: async (): Promise<boolean> => false,
  stop: async (): Promise<void> => {},
};

export const stt = {
  startListening: async (onResult: (text: string) => void): Promise<void> => {
    // Real impl would use expo-av or react-native-voice
    // Mock: simulate after 2s
    await new Promise(r => setTimeout(r, 2000));
    onResult('Log 500 calories');
  },
  stopListening: async (): Promise<void> => {},
  isAvailable: (): boolean => false,
};
