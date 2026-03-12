// Dyslexia-friendly font settings
export const DyslexiaFriendlyFont = {
  // OpenDyslexic is the most recognised accessible font for dyslexia.
  // In production, bundle the font with the app using expo-font.
  fontFamily: 'OpenDyslexic',
  fallbackFontFamily: 'System',
  letterSpacing: 0.12,
  lineHeight: 1.5,
  wordSpacing: 0.16,
};

export const ACCESSIBLE_FONT_SIZES = {
  small: { body: 12, heading: 18, label: 10 },
  normal: { body: 14, heading: 22, label: 12 },
  large: { body: 18, heading: 26, label: 14 },
  xlarge: { body: 22, heading: 32, label: 18 },
};
