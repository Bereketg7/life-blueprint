import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Trajectory } from '../../types';
import { theme } from '../../styles/theme';

type Props = {
  trajectory: Trajectory;
  style?: ViewStyle;
  width?: number;
  height?: number;
};

const CHART_PADDING = { top: 16, right: 16, bottom: 32, left: 48 };

export function TrajectoryChart({
  trajectory,
  style,
  width = 320,
  height = 200,
}: Props) {
  const chartWidth = width - CHART_PADDING.left - CHART_PADDING.right;
  const chartHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;

  const { normalised, yMin, yMax, yTicks } = useMemo(() => {
    const vals = trajectory.projectedValues.map((p) => p.value);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const range = maxVal - minVal || 1;
    const yMin = parseFloat((minVal - range * 0.1).toFixed(1));
    const yMax = parseFloat((maxVal + range * 0.1).toFixed(1));
    const yRange = yMax - yMin;

    const normalised = trajectory.projectedValues.map((p, i) => ({
      ...p,
      x: (i / Math.max(trajectory.projectedValues.length - 1, 1)) * chartWidth,
      y: chartHeight - ((p.value - yMin) / yRange) * chartHeight,
    }));

    // 4 y-axis tick marks
    const yTicks = Array.from({ length: 4 }, (_, i) =>
      parseFloat((yMin + (yRange / 3) * i).toFixed(1)),
    );

    return { normalised, yMin, yMax, yTicks };
  }, [trajectory, chartWidth, chartHeight]);

  const trendColor =
    trajectory.trend === 'improving'
      ? theme.colors.success
      : trajectory.trend === 'declining'
      ? theme.colors.error
      : theme.colors.warning;

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{trajectory.metric.replace(/_/g, ' ')}</Text>
      <Text style={styles.subtitle}>
        Current: <Text style={{ color: trendColor }}>{trajectory.currentValue}</Text>
        {'  '}
        {trajectory.changePerWeek > 0 ? '+' : ''}
        {trajectory.changePerWeek}/wk
      </Text>

      {/* Chart area */}
      <View
        style={[
          styles.chartArea,
          {
            width,
            height,
            paddingLeft: CHART_PADDING.left,
            paddingTop: CHART_PADDING.top,
            paddingRight: CHART_PADDING.right,
            paddingBottom: CHART_PADDING.bottom,
          },
        ]}
      >
        {/* Y-axis labels */}
        {yTicks.map((tick, i) => {
          const yPct =
            1 - (tick - yMin) / Math.max(yMax - yMin, 1);
          return (
            <Text
              key={i}
              style={[
                styles.yLabel,
                {
                  position: 'absolute',
                  left: 0,
                  top:
                    CHART_PADDING.top +
                    yPct * chartHeight -
                    7,
                  width: CHART_PADDING.left - 4,
                },
              ]}
            >
              {tick}
            </Text>
          );
        })}

        {/* Data points rendered as absolute positioned squares */}
        {normalised.map((point, i) => {
          const isProjected = point.isProjected;
          const bgColor = isProjected
            ? trendColor + '55'
            : trendColor;
          if (i === 0) return null;
          const prev = normalised[i - 1];
          // Draw a thin connector line via a rotated rectangle
          const dx = point.x - prev.x;
          const dy = point.y - prev.y;
          const lineLen = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: CHART_PADDING.left + prev.x,
                top: CHART_PADDING.top + prev.y - 1,
                width: lineLen,
                height: 2,
                backgroundColor: bgColor,
                transform: [{ rotate: `${angle}deg` }],
              }}
            />
          );
        })}

        {/* Dots at each data point */}
        {normalised.map((point, i) => (
          <View
            key={`dot_${i}`}
            style={{
              position: 'absolute',
              left: CHART_PADDING.left + point.x - 3,
              top: CHART_PADDING.top + point.y - 3,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: point.isProjected
                ? trendColor + '88'
                : trendColor,
            }}
          />
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: trendColor }]} />
          <Text style={styles.legendText}>Historical</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: trendColor + '88' },
            ]}
          />
          <Text style={styles.legendText}>Projected</Text>
        </View>
      </View>
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
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
    marginBottom: theme.spacing.sm,
  },
  chartArea: {
    position: 'relative',
    overflow: 'hidden',
  },
  yLabel: {
    color: theme.colors.text.secondary,
    fontSize: 9,
    textAlign: 'right',
  },
  legend: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
  },
});

export default TrajectoryChart;
