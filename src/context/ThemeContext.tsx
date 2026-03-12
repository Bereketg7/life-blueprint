import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Theme, AccessibilitySettings } from '../types';
import { darkTheme } from '../styles/darkTheme';
import { lightTheme } from '../styles/lightTheme';
import { highContrastTheme } from '../styles/highContrastTheme';

export const ALL_THEMES: Theme[] = [darkTheme, lightTheme, highContrastTheme];

interface ThemeContextType {
  theme: Theme;
  accessibility: AccessibilitySettings;
  setThemeById: (id: string) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultAccessibility: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  dyslexiaFont: false,
  screenReaderEnabled: false,
  hapticFeedback: true,
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(darkTheme);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(defaultAccessibility);

  const setThemeById = useCallback((id: string) => {
    const found = ALL_THEMES.find((t) => t.id === id);
    if (found) setTheme(found);
  }, []);

  const updateAccessibility = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, accessibility, setThemeById, updateAccessibility }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within a ThemeProvider');
  return context;
};
