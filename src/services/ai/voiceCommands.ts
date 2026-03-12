// Parse voice commands into structured actions
import { VoiceCommand } from '../../types';

const COMMAND_PATTERNS: Array<{
  pattern: RegExp;
  action: VoiceCommand['action'];
  extract: (match: RegExpMatchArray) => Record<string, any>;
}> = [
  {
    pattern: /log\s+(\d+)\s+calories?/i,
    action: 'log_meal',
    extract: (m) => ({ calories: Number(m[1]) }),
  },
  {
    pattern: /log\s+(\w+)\s+workout/i,
    action: 'log_activity',
    extract: (m) => ({ type: m[1] }),
  },
  {
    pattern: /schedule\s+(\d+)\s+workouts?\s+this\s+week/i,
    action: 'schedule_workout',
    extract: (m) => ({ count: Number(m[1]) }),
  },
  {
    pattern: /how\s+(many|much|is|are|was|were)\s+(.+)/i,
    action: 'query_data',
    extract: (m) => ({ query: m[2] }),
  },
];

export function parseVoiceCommand(transcript: string): VoiceCommand | null {
  for (const { pattern, action, extract } of COMMAND_PATTERNS) {
    const match = transcript.match(pattern);
    if (match) {
      return {
        command: transcript,
        action,
        parameters: extract(match),
      };
    }
  }
  return null;
}

export function describeCommand(cmd: VoiceCommand): string {
  switch (cmd.action) {
    case 'log_meal':
      return `Logging ${cmd.parameters.calories} calories`;
    case 'log_activity':
      return `Logging ${cmd.parameters.type} workout`;
    case 'schedule_workout':
      return `Scheduling ${cmd.parameters.count} workouts this week`;
    case 'query_data':
      return `Querying: ${cmd.parameters.query}`;
    default:
      return 'Processing command...';
  }
}
