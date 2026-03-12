export const Colors = {
  primary: '#6C63FF',
  secondary: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  background: '#0D0D1A',
  surface: '#1A1A2E',
  card: '#16213E',
  border: '#2A2A4A',
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0CC',
    muted: '#6B6B8A',
  },
  gradients: {
    primary: ['#6C63FF', '#9C88FF'],
    secondary: ['#FF6B6B', '#FF8E8E'],
    success: ['#4CAF50', '#66BB6A'],
    dark: ['#0D0D1A', '#1A1A2E'],
  },
};

export const Typography = {
  sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const BorderRadius = { sm: 8, md: 12, lg: 16, xl: 24, round: 50 };

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

/** Convenience theme object for components that import `{ theme }`. */
export const theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
} as const;
