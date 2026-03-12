export const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  accent: '#43D9B0',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gradientStart: '#6C63FF',
  gradientEnd: '#FF6584',
  category: {
    activity: '#6C63FF',
    sleep: '#43D9B0',
    nutrition: '#F59E0B',
    mental: '#FF6584',
  },
  border: '#E5E7EB',
  disabled: '#D1D5DB',
  overlay: 'rgba(0,0,0,0.5)',
};

export const typography = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};