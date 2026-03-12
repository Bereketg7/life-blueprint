import { parseVoiceCommand, sendMessage } from '../services/ai/aiCoach';
import { CoachMessage } from '../types';

describe('parseVoiceCommand', () => {
  it('parses log calories command', () => {
    const result = parseVoiceCommand('Log 500 calories');
    expect(result.action).toBe('log_calories');
    expect(result.parameters.calories).toBe(500);
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('parses log activity command', () => {
    const result = parseVoiceCommand('Log running for 30 minutes');
    expect(result.action).toBe('log_activity');
    expect(result.parameters.duration).toBe(30);
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('parses log sleep command', () => {
    const result = parseVoiceCommand('Log 7.5 hours of sleep');
    expect(result.action).toBe('log_sleep');
    expect(result.parameters.hours).toBe(7.5);
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('parses check progress command', () => {
    const result = parseVoiceCommand('Check my progress');
    expect(result.action).toBe('check_progress');
  });

  it('parses get recommendation command', () => {
    const result = parseVoiceCommand('What should I do today?');
    expect(result.action).toBe('get_recommendation');
  });

  it('returns unknown for unrecognized commands', () => {
    const result = parseVoiceCommand('blah blah unrelated text xyz');
    expect(result.action).toBe('unknown');
    expect(result.confidence).toBe(0);
  });

  it('preserves rawText', () => {
    const raw = 'Log 300 calories';
    const result = parseVoiceCommand(raw);
    expect(result.rawText).toBe(raw);
  });
});

describe('sendMessage', () => {
  it('returns a CoachMessage with assistant role', async () => {
    const result = await sendMessage('Hello', []);
    expect(result.role).toBe('assistant');
    expect(typeof result.content).toBe('string');
    expect(result.content.length).toBeGreaterThan(0);
    expect(typeof result.id).toBe('string');
    expect(typeof result.timestamp).toBe('string');
  });

  it('responds to workout questions', async () => {
    const result = await sendMessage('Tell me about workouts', []);
    expect(result.content.toLowerCase()).toMatch(/exercise|cardio|strength|workout/);
  });

  it('responds to nutrition questions', async () => {
    const result = await sendMessage('What should I eat?', []);
    expect(result.content.toLowerCase()).toMatch(/nutrition|protein|food|calori/);
  });

  it('calls onToken callback during streaming', async () => {
    const tokens: string[] = [];
    await sendMessage('Hello', [], (token) => tokens.push(token));
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('throws when rate limit exceeded', async () => {
    // Send 31 requests to exceed 30/min limit
    const promises = Array.from({ length: 31 }, (_, i) =>
      sendMessage(`Message ${i}`, []).catch(e => e)
    );
    const results = await Promise.all(promises);
    const errors = results.filter(r => r instanceof Error);
    expect(errors.length).toBeGreaterThan(0);
  });
});
