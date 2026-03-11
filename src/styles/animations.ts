import { Animated } from 'react-native';

export function fadeIn(duration = 300): { value: Animated.Value; start: () => void } {
  const value = new Animated.Value(0);
  const start = () => {
    Animated.timing(value, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };
  return { value, start };
}

export function fadeOut(duration = 300): { value: Animated.Value; start: () => void } {
  const value = new Animated.Value(1);
  const start = () => {
    Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  };
  return { value, start };
}

export function slideInUp(distance = 50, duration = 400): { value: Animated.Value; start: () => void } {
  const value = new Animated.Value(distance);
  const start = () => {
    Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  };
  return { value, start };
}

export function pulse(
  minValue = 0.95,
  maxValue = 1.05,
  duration = 800,
): { value: Animated.Value; start: () => void; stop: () => void } {
  const value = new Animated.Value(1);
  let animation: Animated.CompositeAnimation | null = null;

  const start = () => {
    animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: maxValue, duration, useNativeDriver: true }),
        Animated.timing(value, { toValue: minValue, duration, useNativeDriver: true }),
      ]),
    );
    animation.start();
  };

  const stop = () => {
    if (animation) {
      animation.stop();
    }
    value.setValue(1);
  };

  return { value, start, stop };
}

export function bounce(duration = 600): { value: Animated.Value; start: () => void } {
  const value = new Animated.Value(0);
  const start = () => {
    Animated.sequence([
      Animated.timing(value, { toValue: -20, duration: duration * 0.4, useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration: duration * 0.3, useNativeDriver: true }),
      Animated.timing(value, { toValue: -10, duration: duration * 0.2, useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration: duration * 0.1, useNativeDriver: true }),
    ]).start();
  };
  return { value, start };
}
