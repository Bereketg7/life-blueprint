import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../styles/theme';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  height?: number;
}

  // React Native's ViewStyle width accepts DimensionValue (number | string | undefined).
  // A string percentage like "50%" is valid at runtime but TypeScript's bundled RN
  // types narrow it to `number | "auto" | ...`; the cast keeps the intent clear.
  type DimensionPercent = `${number}%`;

  value,
  max = 100,
  color = colors.primary,
  label,
  showPercentage = false,
  height = 8,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <View style={styles.container}>
      {(label || showPercentage) ? (
        <View style={styles.header}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          {showPercentage ? (
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
          ) : null}
        </View>
      ) : null}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%` as DimensionPercent, backgroundColor: color, height },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  percentage: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
  },
  track: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: borderRadius.full,
  },
});
