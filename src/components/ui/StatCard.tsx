import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadow, typography } from '../../styles/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
}

const trendArrow: Record<string, string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

const trendColor: Record<string, string> = {
  up: colors.success,
  down: colors.error,
  stable: colors.text.secondary,
};

export default function StatCard({ label, value, unit, icon, color = colors.primary, trend }: StatCardProps) {
  return (
    <View style={styles.card}>
      {icon ? (
        <View style={[styles.iconContainer, { backgroundColor: `${color}18` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      ) : null}
      <View style={styles.content}>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
          {trend ? (
            <Text style={[styles.trend, { color: trendColor[trend] }]}>
              {trendArrow[trend]}
            </Text>
          ) : null}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  value: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  unit: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: 3,
    fontWeight: typography.weight.medium,
  },
  trend: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginBottom: 2,
  },
  label: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
});