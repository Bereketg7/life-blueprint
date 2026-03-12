import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { RiskAssessment } from '../../types';
import { theme } from '../../styles/theme';

type Props = {
  assessment: RiskAssessment;
  style?: ViewStyle;
};

const TYPE_ICONS: Record<RiskAssessment['type'], string> = {
  injury: '🦴',
  burnout: '🔥',
  nutritional_deficiency: '🥗',
  sleep_deprivation: '😴',
};

const TYPE_LABELS: Record<RiskAssessment['type'], string> = {
  injury: 'Injury Risk',
  burnout: 'Burnout Risk',
  nutritional_deficiency: 'Nutrition Risk',
  sleep_deprivation: 'Sleep Deprivation Risk',
};

function getRiskColor(level: RiskAssessment['level']): string {
  switch (level) {
    case 'low':
      return theme.colors.success;
    case 'moderate':
      return theme.colors.warning;
    case 'high':
      return '#FF7043';
    case 'critical':
      return theme.colors.error;
  }
}

function RiskBar({ score }: { score: number }) {
  const filledSegments = Math.round((score / 100) * 10);
  return (
    <View style={barStyles.container}>
      {Array.from({ length: 10 }, (_, i) => {
        const fraction = (i + 1) * 10;
        const color =
          fraction <= 30
            ? theme.colors.success
            : fraction <= 60
            ? theme.colors.warning
            : fraction <= 80
            ? '#FF7043'
            : theme.colors.error;
        return (
          <View
            key={i}
            style={[
              barStyles.segment,
              {
                backgroundColor: i < filledSegments ? color : theme.colors.surface,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 3,
    marginVertical: theme.spacing.sm,
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
});

export function RiskWarning({ assessment, style }: Props) {
  const color = getRiskColor(assessment.level);
  const icon = TYPE_ICONS[assessment.type];
  const label = TYPE_LABELS[assessment.type];

  return (
    <View
      style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }, style]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.label}>{label}</Text>
          <View style={[styles.levelBadge, { backgroundColor: color + '22' }]}>
            <Text style={[styles.levelText, { color }]}>
              {assessment.level.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.score, { color }]}>{assessment.score}</Text>
      </View>

      {/* Risk bar */}
      <RiskBar score={assessment.score} />

      {/* Risk factors */}
      {assessment.factors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Factors</Text>
          {assessment.factors.map((f, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={[styles.bullet, { color }]}>⚠</Text>
              <Text style={styles.listText}>{f}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recommendations */}
      {assessment.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {assessment.recommendations.map((r, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={[styles.bullet, { color: theme.colors.success }]}>✓</Text>
              <Text style={styles.listText}>{r}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
  },
  levelBadge: {
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  score: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: '700',
  },
  section: {
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 12,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
  },
});

export default RiskWarning;
