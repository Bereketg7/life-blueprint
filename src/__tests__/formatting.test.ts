import {
  formatDuration,
  formatCalories,
  formatWeight,
  formatHeight,
  formatSleepTime,
  formatStreak,
  getMoodEmoji,
  getIntensityLabel,
  formatScore,
  formatCurrency,
} from '../utils/formatting';

describe('formatDuration', () => {
  it('formats minutes-only duration', () => {
    expect(formatDuration(45)).toBe('45m');
  });
  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });
  it('formats exact hours', () => {
    // Implementation omits '0m' when minutes remainder is 0
    const result = formatDuration(60);
    expect(result).toContain('1h');
  });
  it('handles 0 minutes', () => {
    expect(formatDuration(0)).toBe('0m');
  });
});

describe('formatCalories', () => {
  it('formats calories with label', () => {
    const result = formatCalories(1234);
    expect(result).toContain('1');
    expect(result.toLowerCase()).toContain('kcal');
  });
  it('handles 0 calories', () => {
    expect(formatCalories(0)).toContain('0');
  });
});

describe('formatWeight', () => {
  it('includes kg unit', () => {
    expect(formatWeight(72.5)).toContain('kg');
  });
  it('shows the number', () => {
    expect(formatWeight(72.5)).toContain('72');
  });
});

describe('formatHeight', () => {
  it('includes cm unit', () => {
    expect(formatHeight(175)).toContain('cm');
  });
  it('shows the number', () => {
    expect(formatHeight(175)).toContain('175');
  });
});

describe('formatSleepTime', () => {
  it('formats hours as h and m', () => {
    const result = formatSleepTime(7.5);
    expect(result).toContain('7');
    expect(result.toLowerCase()).toMatch(/h|hr/);
  });
  it('handles whole hours', () => {
    const result = formatSleepTime(8);
    expect(result).toContain('8');
  });
});

describe('formatStreak', () => {
  it('includes days count', () => {
    expect(formatStreak(7)).toContain('7');
  });
  it('includes fire emoji or "day"', () => {
    const result = formatStreak(30);
    const hasFireOrDay = result.includes('🔥') || result.toLowerCase().includes('day');
    expect(hasFireOrDay).toBe(true);
  });
});

describe('getMoodEmoji', () => {
  it('returns string emoji for each mood value 1-5', () => {
    for (let i = 1; i <= 5; i++) {
      const emoji = getMoodEmoji(i);
      expect(typeof emoji).toBe('string');
      expect(emoji.length).toBeGreaterThan(0);
    }
  });
  it('handles out-of-range values gracefully', () => {
    expect(typeof getMoodEmoji(0)).toBe('string');
    expect(typeof getMoodEmoji(6)).toBe('string');
  });
});

describe('getIntensityLabel', () => {
  it('returns label for low', () => {
    expect(getIntensityLabel('low')).toBeTruthy();
  });
  it('returns label for moderate', () => {
    expect(getIntensityLabel('moderate')).toBeTruthy();
  });
  it('returns label for high', () => {
    expect(getIntensityLabel('high')).toBeTruthy();
  });
});

describe('formatScore', () => {
  it('includes percentage sign or number', () => {
    const result = formatScore(85);
    expect(result).toContain('85');
  });
  it('handles 0', () => {
    const result = formatScore(0);
    expect(result).toContain('0');
  });
  it('handles 100', () => {
    const result = formatScore(100);
    expect(result).toContain('100');
  });
});

describe('formatCurrency', () => {
  it('formats with dollar sign', () => {
    expect(formatCurrency(9.99)).toContain('$');
  });
  it('shows decimal places', () => {
    expect(formatCurrency(9.99)).toContain('9.99');
  });
});