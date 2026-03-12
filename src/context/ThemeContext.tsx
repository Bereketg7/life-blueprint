import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { AppTheme, AccessibilitySettings } from '../types';

interface ThemeContextValue {
  theme: AppTheme;
  themeId: string;
  accessibility: AccessibilitySettings;
  fontScale: number;
  switchTheme: (id: string) => void;
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => void;
  scaledFont: (base: number) => number;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
