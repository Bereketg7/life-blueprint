import { useState, useCallback } from 'react';
import { AppTheme, AccessibilitySettings } from '../types';
import { getTheme, applyAccessibility, DEFAULT_ACCESSIBILITY, FONT_SIZES, getFontSize } from '../services/theming';

export function useTheme() {
  const [themeId, setThemeId] = useState<string>('light');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  const theme: AppTheme = applyAccessibility(getTheme(themeId), accessibility);
  const fontScale = FONT_SIZES[accessibility.fontSize];

  const switchTheme = useCallback((id: string) => setThemeId(id), []);
  const updateAccessibility = useCallback((updates: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...updates }));
  }, []);

  const scaledFont = useCallback((base: number) => getFontSize(base, accessibility.fontSize), [accessibility.fontSize]);

  return { theme, themeId, accessibility, fontScale, switchTheme, updateAccessibility, scaledFont };
}
