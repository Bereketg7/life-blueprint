import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAwareness } from '../../hooks/useAwareness';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';
import HealthProjectionComponent from './HealthProjection';
import InsightGenerator from './InsightGenerator';

export default function AwarenessView() {
  const { consistencyData, projections, warnings, motivationMessage } = useAwareness();
  const score = consistencyData.score;

  const getScoreColor = () => {
    if (score >= 75) return Colors.success;
    if (score >= 50) return Colors.warning;
    return Colors.error;
  };

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference * (1 - score / 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Your Awareness</Text>

      <Text style={styles.motivationMessage}>{motivationMessage}</Text>

      <View style={styles.scoreSection}>
        <View style={styles.scoreCircleContainer}>
          <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
            <Text style={[styles.scoreNumber, { color: getScoreColor() }]}>{score}</Text>
            <Text style={styles.scorePercent}>%</Text>
            <Text style={styles.scoreLabel}>Consistency</Text>
          </View>
        </View>

        <View style={styles.trendBadge}>
          <Text style={styles.trendIcon}>
            {consistencyData.trend === 'improving' ? '📈' : consistencyData.trend === 'declining' ? '📉' : '➡️'}
          </Text>
          <Text style={styles.trendText}>
            {consistencyData.trend.charAt(0).toUpperCase() + consistencyData.trend.slice(1)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{consistencyData.completedItems}</Text>
            <Text style={styles.statLbl}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{consistencyData.totalItems}</Text>
            <Text style={styles.statLbl}>Total Items</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: Colors.error }]}>{consistencyData.skippedItems}</Text>
            <Text style={styles.statLbl}>Skipped</Text>
          </View>
        </View>
      </View>

      {warnings.length > 0 && (
        <View style={styles.warningsSection}>
          <Text style={styles.sectionTitle}>⚠️ Warnings</Text>
          {warnings.map((warning, idx) => (
            <View key={idx} style={styles.warningCard}>
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Health Projections</Text>
      <HealthProjectionComponent projections={projections} />

      <Text style={styles.sectionTitle}>Personalized Insights</Text>
      <InsightGenerator />

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  motivationMessage: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  scoreSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreCircleContainer: {
    marginBottom: Spacing.md,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  scoreNumber: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    lineHeight: 38,
  },
  scorePercent: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginTop: -4,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  trendIcon: {
    fontSize: 18,
  },
  trendText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  statNum: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  statLbl: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  warningsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  warningCard: {
    backgroundColor: Colors.error + '22',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  warningText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  bottomPad: {
    height: Spacing.xl,
  },
});
