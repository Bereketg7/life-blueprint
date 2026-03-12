import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { HealthPrediction } from '../../types';
import { theme } from '../../styles/theme';

type Props = {
  prediction: HealthPrediction;
  style?: ViewStyle;
};

const TYPE_ICONS: Record<HealthPrediction['type'], string> = {
  weight_trajectory: '⚖️',
  goal_achievement: '🎯',
  performance: '📈',
  recovery: '🔄',
};

export function PredictionCard({ prediction, style }: Props) {
  const icon = TYPE_ICONS[prediction.type];
  const confidencePct = Math.round(prediction.confidence * 100);
  const isImproving =
    typeof prediction.prediction === 'number' &&
    (prediction.type === 'performance' ||
      prediction.type === 'goal_achievement');

  const trendColor =
    confidencePct >= 70 ? theme.colors.success : theme.colors.warning;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{prediction.title}</Text>
          <Text style={styles.timeframe}>{prediction.timeframe}</Text>
        </View>
        <Text style={[styles.trendArrow, { color: trendColor }]}>
          {isImproving ? '↑' : '↓'}
        </Text>
      </View>

      {/* Prediction value */}
      <View style={styles.predictionRow}>
        <Text style={styles.predictionValue}>
          {typeof prediction.prediction === 'number'
            ? prediction.prediction.toLocaleString()
            : prediction.prediction}
        </Text>
        <View style={[styles.confidenceBadge, { borderColor: trendColor }]}>
          <Text style={[styles.confidenceText, { color: trendColor }]}>
            {confidencePct}% confident
          </Text>
        </View>
      </View>

      {/* Factors */}
      {prediction.factors.length > 0 && (
        <View style={styles.factors}>
          {prediction.factors.slice(0, 3).map((f, i) => (
            <View key={i} style={styles.factorChip}>
              <Text style={styles.factorText}>• {f}</Text>
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
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 28,
    marginRight: theme.spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
  },
  timeframe: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
    marginTop: 2,
  },
  trendArrow: {
    fontSize: 24,
    fontWeight: '700',
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  predictionValue: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xxl,
    fontWeight: '700',
  },
  confidenceBadge: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
  },
  factors: {
    gap: 4,
    marginTop: 2,
  },
  factorChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
    lineHeight: 18,
  },
});

export default PredictionCard;
