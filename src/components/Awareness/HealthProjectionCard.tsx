import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HealthProjection } from '../../types';
import { colors, spacing, borderRadius, shadow, typography } from '../../styles/theme';
import { formatScore } from '../../utils/formatting';

interface HealthProjectionCardProps {
  projection: HealthProjection;
  goalType: string;
}

export default function HealthProjectionCard({ projection, goalType }: HealthProjectionCardProps) {
  const {
    currentScore,
    projectedScore3Month,
    projectedScore6Month,
    projectedScore1Year,
    goalReachDate,
    keyInsights,
    warnings,
  } = projection;

  const goalReachFormatted = goalReachDate
    ? new Date(goalReachDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const scoreColor = (score: number): string => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Projection</Text>
        <View style={[styles.goalTypeBadge, { backgroundColor: `${colors.primary}18` }]}>
          <Text style={[styles.goalTypeText, { color: colors.primary }]}>{goalType}</Text>
        </View>
      </View>

      {/* Current Score */}
      <View style={styles.currentScoreContainer}>
        <Text style={styles.currentScoreLabel}>Current Score</Text>
        <Text style={[styles.currentScoreValue, { color: scoreColor(currentScore) }]}>
          {formatScore(currentScore)}
        </Text>
      </View>

      {/* Projected Scores Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Score Projections</Text>
        <View style={styles.timelineRow}>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>3 months</Text>
            <Text style={[styles.timelineValue, { color: scoreColor(projectedScore3Month) }]}>
              {formatScore(projectedScore3Month)}
            </Text>
            {projectedScore3Month > currentScore ? (
              <Text style={styles.trendUp}>▲ +{Math.round(projectedScore3Month - currentScore)}</Text>
            ) : projectedScore3Month < currentScore ? (
              <Text style={styles.trendDown}>▼ {Math.round(projectedScore3Month - currentScore)}</Text>
            ) : (
              <Text style={styles.trendStable}>— same</Text>
            )}
          </View>
          <View style={styles.timelineDivider} />
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>6 months</Text>
            <Text style={[styles.timelineValue, { color: scoreColor(projectedScore6Month) }]}>
              {formatScore(projectedScore6Month)}
            </Text>
            {projectedScore6Month > currentScore ? (
              <Text style={styles.trendUp}>▲ +{Math.round(projectedScore6Month - currentScore)}</Text>
            ) : projectedScore6Month < currentScore ? (
              <Text style={styles.trendDown}>▼ {Math.round(projectedScore6Month - currentScore)}</Text>
            ) : (
              <Text style={styles.trendStable}>— same</Text>
            )}
          </View>
          <View style={styles.timelineDivider} />
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>12 months</Text>
            <Text style={[styles.timelineValue, { color: scoreColor(projectedScore1Year) }]}>
              {formatScore(projectedScore1Year)}
            </Text>
            {projectedScore1Year > currentScore ? (
              <Text style={styles.trendUp}>▲ +{Math.round(projectedScore1Year - currentScore)}</Text>
            ) : projectedScore1Year < currentScore ? (
              <Text style={styles.trendDown}>▼ {Math.round(projectedScore1Year - currentScore)}</Text>
            ) : (
              <Text style={styles.trendStable}>— same</Text>
            )}
          </View>
        </View>
      </View>

      {/* Goal Reach Date */}
      {goalReachFormatted ? (
        <View style={[styles.section, styles.goalDateContainer]}>
          <Text style={styles.goalDateIcon}>🏁</Text>
          <View>
            <Text style={styles.goalDateLabel}>Estimated Goal Reach</Text>
            <Text style={styles.goalDateValue}>{goalReachFormatted}</Text>
          </View>
        </View>
      ) : null}

      {/* Key Insights */}
      {keyInsights.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Key Insights</Text>
          {keyInsights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <View style={[styles.insightDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Warnings */}
      {warnings.length > 0 ? (
        <View style={[styles.section, styles.warningsSection]}>
          <Text style={styles.sectionTitle}>⚠️ Warnings</Text>
          {warnings.map((warning, index) => (
            <View key={index} style={styles.warningItem}>
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  goalTypeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  goalTypeText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: 'capitalize',
  },
  currentScoreContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  currentScoreLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  currentScoreValue: {
    fontSize: typography.size.xxxl + 8,
    fontWeight: typography.weight.extrabold,
    lineHeight: 56,
  },
  section: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  timelineValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  timelineDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  trendUp: {
    fontSize: typography.size.xs,
    color: colors.success,
    fontWeight: typography.weight.medium,
    marginTop: 2,
  },
  trendDown: {
    fontSize: typography.size.xs,
    color: colors.error,
    fontWeight: typography.weight.medium,
    marginTop: 2,
  },
  trendStable: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  goalDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  goalDateIcon: {
    fontSize: 28,
  },
  goalDateLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  goalDateValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginTop: 2,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginTop: 6,
  },
  insightText: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  warningsSection: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  warningItem: {
    backgroundColor: `${colors.error}12`,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: typography.size.sm,
    color: colors.error,
    lineHeight: 20,
  },
});