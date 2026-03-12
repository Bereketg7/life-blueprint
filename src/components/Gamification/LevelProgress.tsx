import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LevelBadge } from './LevelBadge';

interface LevelProgressProps {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  progressPercent: number;
  animated?: boolean;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  currentXp,
  xpToNextLevel,
  progressPercent,
  animated = true,
}) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const nextLevel = level + 1;

  useEffect(() => {
    if (animated) {
      Animated.timing(fillAnim, {
        toValue: progressPercent / 100,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      fillAnim.setValue(progressPercent / 100);
    }
  }, [progressPercent]);

  const barWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Current level badge */}
      <LevelBadge level={level} size="small" />

      {/* Progress bar section */}
      <View style={styles.progressSection}>
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>Level {level}</Text>
          <Text style={styles.xpNumbers}>
            {currentXp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </Text>
        </View>
        <View style={styles.barBg}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
          <View
            style={[
              styles.barFillGlow,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
        <Text style={styles.toNext}>
          {xpToNextLevel - currentXp > 0
            ? `${(xpToNextLevel - currentXp).toLocaleString()} XP to Level ${nextLevel}`
            : 'Max Level Reached!'}
        </Text>
      </View>

      {/* Next level badge */}
      {level < 100 && <LevelBadge level={nextLevel} size="small" dimmed />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  progressSection: {
    flex: 1,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  xpNumbers: {
    fontSize: 12,
    color: '#B0B0CC',
  },
  barBg: {
    height: 10,
    backgroundColor: '#0D0D1A',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 5,
  },
  barFillGlow: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#9D97FF',
    borderRadius: 5,
    opacity: 0.4,
  },
  toNext: {
    fontSize: 11,
    color: '#B0B0CC',
  },
});

export default LevelProgress;
