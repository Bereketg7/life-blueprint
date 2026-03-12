import { Theme } from '../types';

export const highContrastTheme: Theme = {
  id: 'high_contrast',
  name: 'High Contrast',
  isDark: true,
  colors: {
    primary: '#FFFF00',
    secondary: '#00FFFF',
    background: '#000000',
    card: '#111111',
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFF00',
      muted: '#CCCCCC',
    },
  },
};
