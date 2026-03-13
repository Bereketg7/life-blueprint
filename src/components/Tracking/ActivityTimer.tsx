import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';
import { formatElapsedTime, calcCaloriesFromTimer } from '../../utils/timerUtils';

interface Props {
  activityType: string;
  intensity: string;
  weightKg: number;
  /** Called with elapsed seconds when the user confirms stop */
  onStop: (elapsedSeconds: number, caloriesBurned: number) => void;
}

type TimerState = 'idle' | 'running' | 'paused';

const ActivityTimer = ({ activityType, intensity, weightKg, onStop }: Props) => {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second while running
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState]);

  const liveCalories = calcCaloriesFromTimer(activityType, intensity, elapsedSeconds, weightKg);

  const handleStart = () => setTimerState('running');
  const handlePause = () => setTimerState('paused');
  const handleResume = () => setTimerState('running');
  const handleStop = () => {
    setTimerState('idle');
    onStop(elapsedSeconds, liveCalories);
    setElapsedSeconds(0);
  };

  const isIdle = timerState === 'idle';
  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';

  return (
    <View style={styles.container}>
      {/* Timer display */}
      <View style={[styles.timerDisplay, !isIdle && styles.timerDisplayActive]}>
        <Text style={styles.timerText}>{formatElapsedTime(elapsedSeconds)}</Text>
        {!isIdle && (
          <Text style={styles.caloriesLive}>🔥 {liveCalories} kcal</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {isIdle && (
          <TouchableOpacity style={[styles.btn, styles.btnStart]} onPress={handleStart}>
            <Text style={styles.btnText}>▶  START</Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <>
            <TouchableOpacity style={[styles.btn, styles.btnPause]} onPress={handlePause}>
              <Text style={styles.btnText}>⏸  PAUSE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnStop]} onPress={handleStop}>
              <Text style={styles.btnText}>⏹  STOP</Text>
            </TouchableOpacity>
          </>
        )}

        {isPaused && (
          <>
            <TouchableOpacity style={[styles.btn, styles.btnStart]} onPress={handleResume}>
              <Text style={styles.btnText}>▶  RESUME</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnStop]} onPress={handleStop}>
              <Text style={styles.btnText}>⏹  STOP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {isIdle && (
        <Text style={styles.hint}>Tap START when you begin exercising</Text>
      )}
      {isRunning && (
        <Text style={styles.hint}>Timer running — tap STOP when done</Text>
      )}
      {isPaused && (
        <Text style={styles.hint}>Paused — tap RESUME to continue or STOP to finish</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  timerDisplay: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadow.md,
  },
  timerDisplayActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  timerText: {
    fontSize: 42,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  caloriesLive: {
    fontSize: typography.size.sm,
    color: colors.warning,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  btn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 120,
    ...shadow.sm,
  },
  btnStart: { backgroundColor: colors.success },
  btnPause: { backgroundColor: colors.warning },
  btnStop:  { backgroundColor: colors.error },
  btnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface,
  },
  hint: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default ActivityTimer;
