import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/** Width percentage */
export function wp(percentage: number): number {
  return (SCREEN_WIDTH * percentage) / 100;
}

/** Height percentage */
export function hp(percentage: number): number {
  return (SCREEN_HEIGHT * percentage) / 100;
}

export const isSmallScreen = SCREEN_WIDTH < 375;

export const isTablet = SCREEN_WIDTH >= 768;

/** Linear scale based on screen width */
export function scale(size: number): number {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
}

/** Moderate scale — less aggressive than linear scale */
export function moderateScale(size: number, factor = 0.5): number {
  return size + (scale(size) - size) * factor;
}

/** Normalize font size for pixel density */
export function normalizeFontSize(size: number): number {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export { SCREEN_WIDTH, SCREEN_HEIGHT, BASE_WIDTH, BASE_HEIGHT };
