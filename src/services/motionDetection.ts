/**
 * Motion detection service.
 *
 * Analyses a buffer of accelerometer samples and classifies the current
 * activity type.
 *
 * ⚠️  READY TO CONNECT TO EXPO-SENSORS:
 * When `expo-sensors` is added as a dependency, replace the mock
 * `collectMotionSamples()` in `useActivityDetection.ts` with a real
 * `Accelerometer.addListener()` subscription.  The analyseMotion()
 * function here works on real sensor data without modification.
 */

import { MotionSample, calculateBounce, calculateCadence, calculateIntensityScore } from '../utils/motionAnalysis';
import { ActivityLog } from '../types';

type ActivityType = ActivityLog['type'];

export interface ActivityDetection {
  type: ActivityType | 'unknown';
  confidence: number; // 0-1
  label: string;
  emoji: string;
}

const ACTIVITY_META: Record<ActivityType | 'unknown', { label: string; emoji: string }> = {
  walking: { label: 'Walking', emoji: '🚶' },
  cardio: { label: 'Running', emoji: '🏃' },
  cycling: { label: 'Cycling', emoji: '🚴' },
  swimming: { label: 'Swimming', emoji: '🏊' },
  strength: { label: 'Strength Training', emoji: '🏋️' },
  yoga: { label: 'Yoga / Stretching', emoji: '🧘' },
  sports: { label: 'Sports', emoji: '⚽' },
  flexibility: { label: 'Flexibility', emoji: '🤸' },
  other: { label: 'Activity', emoji: '✨' },
  unknown: { label: 'Detecting…', emoji: '🔍' },
};

/**
 * Analyse a buffer of accelerometer samples and return the most likely
 * activity type.
 *
 * Thresholds are derived from published walking/running cadence research:
 * - Walking cadence: ~100-140 steps/min
 * - Running cadence: >160 steps/min
 * - Cycling: smooth motion, low vertical bounce
 * - Strength: low cadence, moderate-high intensity
 * - Yoga / rest: low everything
 */
export function analyseMotion(buffer: MotionSample[]): ActivityDetection {
  if (buffer.length < 10) {
    return { type: 'unknown', confidence: 0, ...ACTIVITY_META.unknown };
  }

  const cadence = calculateCadence(buffer);
  const bounce = calculateBounce(buffer);
  const intensity = calculateIntensityScore(buffer);

  // Running: high cadence + high bounce
  if (cadence > 160 && bounce > 0.5) {
    return { type: 'cardio', confidence: 0.92, ...ACTIVITY_META.cardio };
  }

  // Walking: moderate cadence
  if (cadence >= 100 && cadence <= 160 && bounce > 0.1) {
    return { type: 'walking', confidence: 0.88, ...ACTIVITY_META.walking };
  }

  // Cycling: low bounce, moderate intensity (smooth circular motion)
  if (bounce < 0.15 && intensity > 0.2 && cadence < 100) {
    return { type: 'cycling', confidence: 0.82, ...ACTIVITY_META.cycling };
  }

  // Strength training: moderate intensity, very low cadence
  if (intensity > 0.3 && cadence < 60) {
    return { type: 'strength', confidence: 0.75, ...ACTIVITY_META.strength };
  }

  // Yoga / gentle stretching: very low everything
  if (bounce < 0.05 && intensity < 0.1 && cadence < 40) {
    return { type: 'yoga', confidence: 0.70, ...ACTIVITY_META.yoga };
  }

  // Unknown — not enough distinguishing signal
  return { type: 'unknown', confidence: 0.4, ...ACTIVITY_META.unknown };
}

/**
 * Generate a mock motion buffer for testing / simulation.
 *
 * Replace calls to this function with real Accelerometer data in production.
 */
export function generateMockMotionBuffer(
  simulatedType: ActivityType | 'resting',
  durationMs = 10000,
  sampleRateHz = 10,
): MotionSample[] {
  const count = Math.floor((durationMs / 1000) * sampleRateHz);
  const now = Date.now();
  const samples: MotionSample[] = [];

  const profiles: Record<string, { cadenceHz: number; bounceAmp: number; noiseAmp: number }> = {
    walking: { cadenceHz: 1.9, bounceAmp: 0.4, noiseAmp: 0.1 },
    cardio: { cadenceHz: 2.8, bounceAmp: 0.9, noiseAmp: 0.2 },
    cycling: { cadenceHz: 1.2, bounceAmp: 0.05, noiseAmp: 0.15 },
    strength: { cadenceHz: 0.5, bounceAmp: 0.2, noiseAmp: 0.3 },
    yoga: { cadenceHz: 0.2, bounceAmp: 0.02, noiseAmp: 0.05 },
    resting: { cadenceHz: 0, bounceAmp: 0, noiseAmp: 0.02 },
  };

  const profile = profiles[simulatedType] ?? profiles.resting;

  for (let i = 0; i < count; i++) {
    const t = i / sampleRateHz;
    const noise = () => (Math.random() - 0.5) * 2 * profile.noiseAmp;
    samples.push({
      x: noise(),
      y: Math.sin(2 * Math.PI * profile.cadenceHz * t) * 0.3 + noise(),
      z: Math.sin(2 * Math.PI * profile.cadenceHz * t) * profile.bounceAmp + noise(),
      timestamp: now - durationMs + i * (1000 / sampleRateHz),
    });
  }

  return samples;
}
