/**
 * useActivityDetection — Custom hook that runs motion analysis on a simulated
 * (or real) accelerometer feed and periodically returns a detected activity
 * type.
 *
 * ⚠️  CONNECT TO REAL SENSOR:
 * Replace the `simulateMotionBuffer()` call with a real
 * `Accelerometer.addListener()` subscription once `expo-sensors` is added
 * as a project dependency.  Everything else stays the same.
 *
 * Usage:
 *   const { detection, detecting, startDetection, stopDetection, reset } =
 *     useActivityDetection();
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { ActivityDetection, analyseMotion, generateMockMotionBuffer } from '../services/motionDetection';
import { MotionSample } from '../utils/motionAnalysis';
import { ActivityLog } from '../types';

type ActivityType = ActivityLog['type'];

interface UseActivityDetectionResult {
  detection: ActivityDetection | null;
  /** True while the initial sampling window is still running. */
  detecting: boolean;
  startDetection: (simulatedActivity?: ActivityType | 'resting') => void;
  stopDetection: () => void;
  reset: () => void;
}

const SAMPLE_INTERVAL_MS = 100;   // ~10 Hz
const ANALYSE_AFTER_MS  = 5000;   // analyse after 5 s of data

export function useActivityDetection(): UseActivityDetectionResult {
  const [detection, setDetection] = useState<ActivityDetection | null>(null);
  const [detecting, setDetecting] = useState(false);

  const bufferRef  = useRef<MotionSample[]>([]);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => () => { clearTimers(); }, []);

  const clearTimers = () => {
    if (timerRef.current)   clearInterval(timerRef.current);
    if (analyseRef.current) clearTimeout(analyseRef.current);
    timerRef.current   = null;
    analyseRef.current = null;
  };

  const startDetection = useCallback((
    simulatedActivity: ActivityType | 'resting' = 'walking',
  ) => {
    clearTimers();
    bufferRef.current = [];
    setDetection(null);
    setDetecting(true);

    // ─── Swap this block for real Accelerometer subscription ───────────────
    // Real implementation example:
    //   import { Accelerometer } from 'expo-sensors';
    //   Accelerometer.setUpdateInterval(SAMPLE_INTERVAL_MS);
    //   const sub = Accelerometer.addListener(({ x, y, z }) => {
    //     bufferRef.current.push({ x, y, z, timestamp: Date.now() });
    //   });
    //   // store sub in a ref and call sub.remove() in stopDetection()
    // ─── Mock sampling (generates plausible accelerometer data) ─────────────
    timerRef.current = setInterval(() => {
      const sample = generateMockMotionBuffer(simulatedActivity, SAMPLE_INTERVAL_MS, 1)[0];
      if (sample) bufferRef.current.push(sample);
    }, SAMPLE_INTERVAL_MS);

    // Run analysis after sampling window
    analyseRef.current = setTimeout(() => {
      const result = analyseMotion(bufferRef.current);
      setDetection(result);
      setDetecting(false);
      clearTimers();
    }, ANALYSE_AFTER_MS);
  }, []);

  const stopDetection = useCallback(() => {
    clearTimers();
    if (bufferRef.current.length >= 10) {
      const result = analyseMotion(bufferRef.current);
      setDetection(result);
    }
    setDetecting(false);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    bufferRef.current = [];
    setDetection(null);
    setDetecting(false);
  }, []);

  return { detection, detecting, startDetection, stopDetection, reset };
}
