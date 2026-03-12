import { VoiceCommand } from '../../types';

type PatternEntry = {
  pattern: RegExp;
  type: VoiceCommand['type'];
  extract: (match: RegExpMatchArray) => Record<string, unknown>;
  confidence: number;
};

const PATTERNS: PatternEntry[] = [
  {
    // "log 500 calories" / "I ate 500 calories"
    pattern: /(?:log|ate|had|consumed|eaten)\s+(\d+(?:\.\d+)?)\s*(?:kcal|cal(?:ories?)?)/i,
    type: 'log_nutrition',
    extract: (m) => ({ calories: parseFloat(m[1]) }),
    confidence: 0.92,
  },
  {
    // "add breakfast / lunch / dinner / snack"
    pattern: /add\s+(breakfast|lunch|dinner|snack)/i,
    type: 'log_nutrition',
    extract: (m) => ({ mealType: m[1].toLowerCase() }),
    confidence: 0.88,
  },
  {
    // "start a 30 minute run" / "start 45 min workout"
    pattern: /start\s+(?:a\s+)?(\d+)\s*(?:minute|min)\s+(\w+)/i,
    type: 'start_workout',
    extract: (m) => ({ duration: parseInt(m[1], 10), activityType: m[2].toLowerCase() }),
    confidence: 0.9,
  },
  {
    // "log 5 km run" / "I ran 5 kilometers"
    pattern: /(?:log|ran|run|walked|cycled|swam)\s+(\d+(?:\.\d+)?)\s*(?:km|kilometers?|miles?)/i,
    type: 'log_activity',
    extract: (m) => ({ distance: parseFloat(m[1]) }),
    confidence: 0.88,
  },
  {
    // "how many calories today" / "what are my calories"
    pattern: /(?:how\s+(?:many|much)|what(?:'s|\s+are)\s+my)\s+calories?(?:\s+today)?/i,
    type: 'query_stats',
    extract: () => ({ metric: 'calories', period: 'today' }),
    confidence: 0.85,
  },
  {
    // "how many steps today"
    pattern: /(?:how\s+many|what(?:'s|\s+are)\s+my)\s+steps?(?:\s+today)?/i,
    type: 'query_stats',
    extract: () => ({ metric: 'steps', period: 'today' }),
    confidence: 0.85,
  },
  {
    // "set goal to lose 5 kg"
    pattern: /set\s+(?:a\s+)?goal\s+(?:to\s+)?(\w+)\s+(\d+(?:\.\d+)?)\s*(kg|lbs?|pounds?|calories?)?/i,
    type: 'set_goal',
    extract: (m) => ({
      action: m[1].toLowerCase(),
      amount: parseFloat(m[2]),
      unit: m[3]?.toLowerCase() ?? '',
    }),
    confidence: 0.82,
  },
];

/**
 * Parses a free-text voice command into a structured VoiceCommand.
 * Returns null if no pattern matches.
 */
export function parseVoiceCommand(text: string): VoiceCommand | null {
  for (const entry of PATTERNS) {
    const match = text.match(entry.pattern);
    if (match) {
      return {
        type: entry.type,
        parameters: entry.extract(match),
        originalText: text,
        confidence: entry.confidence,
      };
    }
  }
  return null;
}
