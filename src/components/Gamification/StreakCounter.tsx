import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';
import { Streak } from '../../types';

interface Props {
  streak: Streak;
}

export default function StreakCounter({ streak }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flameContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.flameEmoji}>🔥</Text>
        <Text style={styles.streakNumber}>{streak.currentStreak}</Text>
      </Animated.View>

      <Text style={styles.streakLabel}>day streak</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Longest</Text>
          <Text style={styles.statValue}>{streak.longestStreak}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Days</Text>
          <Text style={styles.statValue}>{streak.totalDaysLogged}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flameContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  flameEmoji: {
    fontSize: 52,
  },
  streakNumber: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: -Spacing.sm,
  },
  streakLabel: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    fontWeight: Typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
});
