import { useCallback } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { AccessibilitySettings } from '../types';

export function useAccessibility() {
  const { accessibility, updateAccessibility } = useThemeContext();

  const setFontSize = useCallback(
    (size: AccessibilitySettings['fontSize']) => updateAccessibility({ fontSize: size }),
    [updateAccessibility]
  );

  const toggleHighContrast = useCallback(
    () => updateAccessibility({ highContrast: !accessibility.highContrast }),
    [accessibility.highContrast, updateAccessibility]
  );

  const toggleDyslexiaFont = useCallback(
    () => updateAccessibility({ dyslexiaFont: !accessibility.dyslexiaFont }),
    [accessibility.dyslexiaFont, updateAccessibility]
  );

  const toggleHapticFeedback = useCallback(
    () => updateAccessibility({ hapticFeedback: !accessibility.hapticFeedback }),
    [accessibility.hapticFeedback, updateAccessibility]
  );

  return {
    ...accessibility,
    setFontSize,
    toggleHighContrast,
    toggleDyslexiaFont,
    toggleHapticFeedback,
    update: updateAccessibility,
  };
}
