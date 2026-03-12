import { getTheme, applyColorBlindMode, getFontSize, applyAccessibility, THEMES, FONT_SIZES, DEFAULT_ACCESSIBILITY } from '../services/theming/themeService';
import { AccessibilitySettings } from '../types';

describe('getTheme', () => {
  it('returns light theme by default', () => {
    const theme = getTheme('light');
    expect(theme.name).toBe('light');
    expect(theme.colors.background).toBe('#FFFFFF');
  });

  it('returns dark theme', () => {
    const theme = getTheme('dark');
    expect(theme.name).toBe('dark');
    expect(theme.colors.background).toBe('#000000');
  });

  it('falls back to light theme for unknown id', () => {
    const theme = getTheme('unknown_theme');
    expect(theme.name).toBe('light');
  });

  it('includes all required color keys', () => {
    const theme = getTheme('light');
    const requiredKeys = ['primary', 'secondary', 'background', 'surface', 'text', 'textSecondary', 'border', 'success', 'warning', 'error', 'accent'];
    for (const key of requiredKeys) {
      expect(theme.colors).toHaveProperty(key);
    }
  });
});

describe('THEMES', () => {
  it('has all 5 theme definitions', () => {
    const expectedThemes = ['light', 'dark', 'high-contrast', 'dyslexia-friendly', 'system'];
    for (const id of expectedThemes) {
      expect(THEMES).toHaveProperty(id);
    }
  });
});

describe('applyColorBlindMode', () => {
  it('returns unchanged theme for none mode', () => {
    const theme = getTheme('light');
    const result = applyColorBlindMode(theme, 'none');
    expect(result.colors.primary).toBe(theme.colors.primary);
  });

  it('changes colors for protanopia', () => {
    const theme = getTheme('light');
    const result = applyColorBlindMode(theme, 'protanopia');
    expect(result.colors.primary).not.toBe(theme.colors.primary);
  });
});

describe('getFontSize', () => {
  it('returns base size for md', () => {
    expect(getFontSize(16, 'md')).toBe(16);
  });

  it('returns larger size for lg', () => {
    expect(getFontSize(16, 'lg')).toBeGreaterThan(16);
  });

  it('returns smaller size for sm', () => {
    expect(getFontSize(16, 'sm')).toBeLessThan(16);
  });

  it('xl is larger than lg', () => {
    expect(getFontSize(16, 'xl')).toBeGreaterThan(getFontSize(16, 'lg'));
  });
});

describe('DEFAULT_ACCESSIBILITY', () => {
  it('has expected default values', () => {
    expect(DEFAULT_ACCESSIBILITY.fontSize).toBe('md');
    expect(DEFAULT_ACCESSIBILITY.highContrast).toBe(false);
    expect(DEFAULT_ACCESSIBILITY.hapticFeedback).toBe(true);
    expect(DEFAULT_ACCESSIBILITY.colorBlindMode).toBe('none');
  });
});

describe('applyAccessibility', () => {
  it('applies high contrast theme when highContrast is true', () => {
    const theme = getTheme('light');
    const settings: AccessibilitySettings = { ...DEFAULT_ACCESSIBILITY, highContrast: true };
    const result = applyAccessibility(theme, settings);
    expect(result.name).toBe('high-contrast');
  });

  it('applies color blind palette', () => {
    const theme = getTheme('light');
    const settings: AccessibilitySettings = { ...DEFAULT_ACCESSIBILITY, colorBlindMode: 'deuteranopia' };
    const result = applyAccessibility(theme, settings);
    expect(result.colors.primary).not.toBe(theme.colors.primary);
  });
});
