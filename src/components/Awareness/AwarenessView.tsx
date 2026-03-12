import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ConsistencyScore, HealthProjection } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';
import { momentumMessage } from '../../services/awarenessEngine';

interface Props {
  consistencyScore: ConsistencyScore;
  projection: HealthProjection;
  warnings: string[];
  goalType: string;
}

const CATEGORY_META: { key: keyof Pick<ConsistencyScore, 'activity' | 'sleep' | 'nutrition' | 'mental'>; label: string; emoji: string; color: string }[] = [
  { key: 'activity', label: 'Activity', emoji: '🏃', color: colors.category.activity },
  { key: 'sleep', label: 'Sleep', emoji: '😴', color: colors.category.sleep },
  { key: 'nutrition', label: 'Nutrition', emoji: '🥗', color: colors.category.nutrition },
  { key: 'mental', label: 'Mental Health', emoji: '🧠', color: colors.category.mental },
];

const TREND_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  improving: { icon: '↑', color: colors.success, label: 'Improving' },
  declining: { icon: '↓', color: colors.error, label: 'Declining' },
  stable: { icon: '→', color: colors.warning, label: 'Stable' },
};

// NOTE: This is a CSS-border approximation of a circular progress ring.
// It uses 4 discrete quadrants (top/right/bottom/left borders) which creates
// stepped transitions at 25%, 50%, 75% and 100% rather than a smooth arc.
// For pixel-perfect rings, replace with an SVG or react-native-svg based solution.
const CircularScore = ({ score, color }: { score: number; color: string }) => {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamp = Math.min(100, Math.max(0, score));
  const progress = (clamp / 100) * circumference;
  const gap = circumference - progress;

  const segments = Math.round((clamp / 100) * 36);

  return (
    <View style={[styles.circleContainer, { width: size, height: size }]}>
      {/* Background ring */}
      <View style={[styles.ringBg, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: colors.background,
      }]} />
      {/* Foreground ring — approximate using border arcs */}
      <View style={[styles.ringFg, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: 'transparent',
        borderTopColor: clamp > 75 ? color : 'transparent',
        borderRightColor: clamp > 50 ? color : 'transparent',
        borderBottomColor: clamp > 25 ? color : 'transparent',
        borderLeftColor: clamp > 0 ? color : 'transparent',
        transform: [{ rotate: '-90deg' }],
      }]} />
      <View style={styles.scoreCenter}>
        <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
        <Text style={styles.scorePercent}>/100</Text>
      </View>
    </View>
  );
};

const ProgressBar = ({ value, color, label, emoji }: { value: number; color: string; label: string; emoji: string }) => (
  <View style={styles.progressRow}>
    <Text style={styles.progressEmoji}>{emoji}</Text>
    <Text style={styles.progressLabel}>{label}</Text>
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: `${Math.min(100, value)}%` as any, backgroundColor: color }]} />
    </View>
    <Text style={[styles.progressValue, { color }]}>{value}</Text>
  </View>
);

const ProjectionCard = ({ label, score, months }: { label: string; score: number; months: number }) => {
  const scoreColor = score >= 70 ? colors.success : score >= 40 ? colors.warning : colors.error;
  return (
    <View style={styles.projectionCard}>
      <Text style={styles.projectionMonths}>{months}mo</Text>
      <Text style={[styles.projectionScore, { color: scoreColor }]}>{score}</Text>
      <Text style={styles.projectionLabel}>{label}</Text>
    </View>
  );
};

const AwarenessView = ({ consistencyScore, projection, warnings, goalType }: Props) => {
  const trend = TREND_CONFIG[consistencyScore.trend] ?? TREND_CONFIG.stable;
  const message = momentumMessage(consistencyScore.overall, goalType, projection.goalReachDate);
  const overallColor =
    consistencyScore.overall >= 70 ? colors.success :
    consistencyScore.overall >= 40 ? colors.warning : colors.error;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Health Awareness</Text>
          <Text style={styles.headerSubtitle}>Your wellness intelligence report</Text>
          <View style={[styles.trendBadge, { backgroundColor: `${trend.color}20` }]}>
            <Text style={[styles.trendIcon, { color: trend.color }]}>{trend.icon}</Text>
            <Text style={[styles.trendLabel, { color: trend.color }]}>{trend.label}</Text>
          </View>
        </View>
        <CircularScore score={consistencyScore.overall} color={overallColor} />
      </View>

      {/* Category Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Score Breakdown</Text>
        {CATEGORY_META.map(cat => (
          <ProgressBar
            key={cat.key}
            value={consistencyScore[cat.key]}
            color={cat.color}
            label={cat.label}
            emoji={cat.emoji}
          />
        ))}
      </View>

      {/* Weekly trend bars */}
      {consistencyScore.weeklyBreakdown && consistencyScore.weeklyBreakdown.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Trend</Text>
          <View style={styles.weeklyRow}>
            {consistencyScore.weeklyBreakdown.map((score, i) => {
              const barHeight = Math.max(4, Math.round((score / 100) * 80));
              const barColor = score >= 70 ? colors.success : score >= 40 ? colors.warning : colors.error;
              return (
                <View key={i} style={styles.weeklyBar}>
                  <Text style={styles.weeklyScore}>{score}</Text>
                  <View style={[styles.weeklyBarFill, { height: barHeight, backgroundColor: barColor }]} />
                  <Text style={styles.weeklyLabel}>W{i + 1}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Momentum message */}
      <View style={[styles.card, styles.momentumCard]}>
        <Text style={styles.momentumEmoji}>💡</Text>
        <Text style={styles.momentumText}>{message}</Text>
      </View>

      {/* Projections */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Trajectory</Text>
        <Text style={styles.projectionSubtitle}>Predicted wellness scores based on current trends</Text>
        <View style={styles.projectionsRow}>
          <ProjectionCard label="Now" score={projection.currentScore} months={0} />
          <View style={styles.projectionArrow}><Text style={styles.projectionArrowText}>→</Text></View>
          <ProjectionCard label="3 Month" score={projection.projectedScore3Month} months={3} />
          <View style={styles.projectionArrow}><Text style={styles.projectionArrowText}>→</Text></View>
          <ProjectionCard label="6 Month" score={projection.projectedScore6Month} months={6} />
        </View>
        {projection.goalReachDate && (
          <Text style={styles.goalReachText}>
            🎯 Estimated goal date: {new Date(projection.goalReachDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* Key Insights */}
      {projection.keyInsights && projection.keyInsights.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Key Insights</Text>
          {projection.keyInsights.map((insight, i) => (
            <View key={i} style={styles.insightItem}>
              <Text style={styles.insightBullet}>💚</Text>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <View style={[styles.card, styles.warningsCard]}>
          <Text style={[styles.cardTitle, { color: colors.warning }]}>⚠️ Attention Areas</Text>
          {warnings.map((warning, i) => (
            <View key={i} style={styles.warningItem}>
              <Text style={styles.warningBullet}>⚠️</Text>
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.md,
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  trendIcon: { fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  trendLabel: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  ringBg: {
    position: 'absolute',
  },
  ringFg: {
    position: 'absolute',
  },
  scoreCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.extrabold,
  },
  scorePercent: {
    fontSize: typography.size.xs,
    color: colors.text.light,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  cardTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  progressEmoji: { fontSize: 18, width: 24 },
  progressLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    width: 90,
    fontWeight: typography.weight.medium,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    width: 30,
    textAlign: 'right',
  },
  weeklyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 110,
  },
  weeklyBar: { alignItems: 'center', gap: spacing.xs, justifyContent: 'flex-end' },
  weeklyScore: { fontSize: typography.size.xs, color: colors.text.secondary },
  weeklyBarFill: { width: 28, borderRadius: borderRadius.sm },
  weeklyLabel: { fontSize: typography.size.xs, color: colors.text.light },
  momentumCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: `${colors.primary}10`,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  momentumEmoji: { fontSize: 28 },
  momentumText: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  projectionSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    marginBottom: spacing.lg,
  },
  projectionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
  },
  projectionMonths: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  projectionScore: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.extrabold,
  },
  projectionLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  projectionArrow: { paddingHorizontal: spacing.xs },
  projectionArrowText: { fontSize: typography.size.xl, color: colors.text.light },
  goalReachText: {
    marginTop: spacing.lg,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  insightItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  insightBullet: { fontSize: 16, marginTop: 2 },
  insightText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  warningsCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    backgroundColor: `${colors.warning}08`,
  },
  warningItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  warningBullet: { fontSize: 16 },
  warningText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default AwarenessView;