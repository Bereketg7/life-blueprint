import { AppTheme, AccessibilitySettings } from '../../types';

// Theme definitions
export const THEMES: Record<string, AppTheme> = {
  light: {
    id: 'light',
    name: 'light',
    colors: {
      primary: '#4F86F7',
      secondary: '#34C759',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#6C6C6C',
      border: '#C6C6C8',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      accent: '#FF2D55',
    },
  },
  dark: {
    id: 'dark',
    name: 'dark',
    colors: {
      primary: '#0A84FF',
      secondary: '#30D158',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#EBEBF5',
      border: '#38383A',
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
      accent: '#FF375F',
    },
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'high-contrast',
    colors: {
      primary: '#FFFF00',
      secondary: '#00FF00',
      background: '#000000',
      surface: '#111111',
      text: '#FFFFFF',
      textSecondary: '#FFFF00',
      border: '#FFFFFF',
      success: '#00FF00',
      warning: '#FFFF00',
      error: '#FF0000',
      accent: '#FF00FF',
    },
  },
  'dyslexia-friendly': {
    id: 'dyslexia-friendly',
    name: 'dyslexia-friendly',
    colors: {
      primary: '#4A90D9',
      secondary: '#5CB85C',
      background: '#F8F0E3', // warm cream background
      surface: '#F0E6D3',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
      border: '#C0A882',
      success: '#5CB85C',
      warning: '#F0AD4E',
      error: '#D9534F',
      accent: '#9B59B6',
    },
  },
  system: {
    id: 'system',
    name: 'system',
    colors: {
      primary: '#4F86F7',
      secondary: '#34C759',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#6C6C6C',
      border: '#C6C6C8',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      accent: '#FF2D55',
    },
  },
};

// Font size multipliers
export const FONT_SIZES = {
  sm: 0.85,
  md: 1.0,
  lg: 1.2,
  xl: 1.4,
} as const;

// Color-blind safe palettes
export const COLOR_BLIND_PALETTES = {
  none: {},
  protanopia: { primary: '#0077BB', secondary: '#EE7733', error: '#EE3377' },
  deuteranopia: { primary: '#0077BB', secondary: '#EE7733', error: '#CC3311' },
  tritanopia: { primary: '#009988', secondary: '#EE3377', error: '#AA3377' },
} as const;

export function getTheme(themeId: string): AppTheme {
  return THEMES[themeId] ?? THEMES.light;
}

export function applyColorBlindMode(
  theme: AppTheme,
  mode: AccessibilitySettings['colorBlindMode'],
): AppTheme {
  if (mode === 'none') return theme;
  const palette = COLOR_BLIND_PALETTES[mode];
  return {
    ...theme,
    colors: { ...theme.colors, ...palette },
  };
}

export function getFontSize(base: number, setting: AccessibilitySettings['fontSize']): number {
  return Math.round(base * FONT_SIZES[setting]);
}

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'md',
  highContrast: false,
  dyslexiaFont: false,
  screenReaderEnabled: false,
  hapticFeedback: true,
  colorBlindMode: 'none',
};

export function applyAccessibility(
  theme: AppTheme,
  settings: AccessibilitySettings,
): AppTheme {
  let result = theme;
  if (settings.highContrast) {
    result = THEMES['high-contrast'];
  }
  result = applyColorBlindMode(result, settings.colorBlindMode);
  return result;
}

// Haptic feedback wrapper
export const haptics = {
  light: (): void => {
    // Real impl: expo-haptics Haptics.impactAsync(ImpactFeedbackStyle.Light)
  },
  medium: (): void => {
    // Real impl: Haptics.impactAsync(ImpactFeedbackStyle.Medium)
  },
  heavy: (): void => {
    // Real impl: Haptics.impactAsync(ImpactFeedbackStyle.Heavy)
  },
  success: (): void => {
    // Real impl: Haptics.notificationAsync(NotificationFeedbackType.Success)
  },
};
