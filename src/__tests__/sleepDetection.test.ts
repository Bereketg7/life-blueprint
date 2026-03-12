import { detectSleep, SleepEstimate } from '../services/sleepDetection';

describe('sleepDetection', () => {
  const RealDate = Date;

  afterEach(() => {
    global.Date = RealDate;
  });

  function mockHour(hour: number) {
    const fakeNow = new Date(2024, 0, 15, hour, 0, 0);
    jest.spyOn(global, 'Date').mockImplementation((...args: unknown[]) => {
      if (args.length === 0) return fakeNow;
      // @ts-ignore
      return new RealDate(...args);
    });
    (global.Date as unknown as typeof RealDate).now = RealDate.now;
  }

  test('returns a SleepEstimate with required fields', () => {
    const result = detectSleep();
    expect(result).toHaveProperty('hoursSlept');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('detectedAt');
  });

  test('hoursSlept is a positive number', () => {
    const result = detectSleep();
    expect(result.hoursSlept).toBeGreaterThan(0);
    expect(result.hoursSlept).toBeLessThanOrEqual(12);
  });

  test('confidence is one of the valid values', () => {
    const result = detectSleep();
    expect(['low', 'medium', 'high']).toContain(result.confidence);
  });

  test('returns high confidence in the morning', () => {
    mockHour(7);
    const result = detectSleep();
    expect(result.confidence).toBe('high');
  });

  test('returns low confidence in the afternoon', () => {
    mockHour(14);
    const result = detectSleep();
    expect(result.confidence).toBe('low');
  });
});
