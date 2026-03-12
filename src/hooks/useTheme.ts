import { useCallback } from 'react';
import { useThemeContext } from '../context/ThemeContext';

export function useTheme() {
  const { theme, setThemeById } = useThemeContext();
  return { theme, setThemeById, isDark: theme.isDark };
}
