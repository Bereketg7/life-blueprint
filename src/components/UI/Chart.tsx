import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line';
  height?: number;
  color?: string;
  title?: string;
  style?: ViewStyle;
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

interface AnimatedBarProps {
  heightPercent: number;
  chartHeight: number;
  color: string;
  barWidth: number;
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({
  heightPercent,
  chartHeight,
  color,
  barWidth,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: heightPercent,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [heightPercent, anim]);

  const animatedHeight = anim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, chartHeight],
  });

  return (
    <Animated.View
      style={{
        width: barWidth,
        height: animatedHeight,
        backgroundColor: color,
        borderRadius: BorderRadius.sm,
        alignSelf: 'flex-end',
      }}
    />
  );
};

// ─── Line Chart ───────────────────────────────────────────────────────────────

interface LineChartProps {
  data: ChartDataPoint[];
  height: number;
  color: string;
  maxValue: number;
  dotSize: number;
  segmentWidth: number;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  height,
  color,
  maxValue,
  dotSize,
  segmentWidth,
}) => {
  const anims = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach((anim) => anim.setValue(0));
    Animated.stagger(
      80,
      anims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: maxValue > 0 ? (data[i].value / maxValue) * 100 : 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [data, maxValue, anims]);

  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end' }}>
      {data.map((point, index) => {
        const pct = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
        const dotBottom = (pct / 100) * (height - dotSize);

        // Draw a connector line from this dot to the next
        const nextPct =
          index < data.length - 1
            ? maxValue > 0
              ? (data[index + 1].value / maxValue) * 100
              : 0
            : null;

        const nextDotBottom =
          nextPct !== null ? (nextPct / 100) * (height - dotSize) : null;

        const lineDeltaY =
          nextDotBottom !== null ? nextDotBottom - dotBottom : 0;
        const lineLength = nextDotBottom !== null ? segmentWidth : 0;
        const angleRad = Math.atan2(lineDeltaY, lineLength);
        const angleDeg = (angleRad * 180) / Math.PI;
        const hypotenuse =
          nextDotBottom !== null
            ? Math.sqrt(lineLength * lineLength + lineDeltaY * lineDeltaY)
            : 0;

        return (
          <View
            key={index}
            style={{ width: segmentWidth, height, position: 'relative' }}
          >
            {/* Connector line to next point */}
            {nextDotBottom !== null && (
              <View
                style={[
                  styles.lineSegment,
                  {
                    width: hypotenuse,
                    bottom: dotBottom + dotSize / 2,
                    left: dotSize / 2,
                    backgroundColor: color,
                    transform: [{ rotate: `${angleDeg}deg` }],
                    transformOrigin: 'left center',
                  } as ViewStyle,
                ]}
              />
            )}
            {/* Dot */}
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: color,
                  borderColor: Colors.surface,
                  bottom: dotBottom,
                  left: segmentWidth / 2 - dotSize / 2,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
};

// ─── Main Chart Component ─────────────────────────────────────────────────────

export const Chart: React.FC<ChartProps> = ({
  data,
  type = 'bar',
  height = 200,
  color = Colors.primary,
  title,
  style,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, style]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={[styles.emptyContainer, { height }]}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const screenWidth = Dimensions.get('window').width;
  const chartAreaWidth = screenWidth - Spacing.lg * 4;
  const barWidth = Math.min(40, (chartAreaWidth / data.length) * 0.6);
  const barGap = Math.max(8, (chartAreaWidth / data.length) * 0.4);
  const segmentWidth = barWidth + barGap;

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}

      {/* Y-axis guide lines */}
      <View style={[styles.chartWrapper, { height }]}>
        {[0, 25, 50, 75, 100].map((pct) => (
          <View
            key={pct}
            style={[styles.guideLine, { bottom: (pct / 100) * height }]}
          />
        ))}

        {/* Chart content */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {type === 'bar' ? (
            data.map((point, index) => {
              const heightPercent =
                maxValue > 0 ? (point.value / maxValue) * 100 : 0;
              return (
                <View
                  key={index}
                  style={[styles.barColumn, { width: barWidth, marginHorizontal: barGap / 2 }]}
                >
                  <Text style={styles.valueLabel}>
                    {point.value % 1 === 0
                      ? point.value
                      : point.value.toFixed(1)}
                  </Text>
                  <View style={{ height, justifyContent: 'flex-end' }}>
                    <AnimatedBar
                      heightPercent={heightPercent}
                      chartHeight={height}
                      color={color}
                      barWidth={barWidth}
                    />
                  </View>
                  <Text style={styles.axisLabel} numberOfLines={1}>
                    {point.label}
                  </Text>
                </View>
              );
            })
          ) : (
            <View>
              <LineChart
                data={data}
                height={height}
                color={color}
                maxValue={maxValue}
                dotSize={10}
                segmentWidth={segmentWidth}
              />
              {/* Labels row */}
              <View style={styles.lineLabelsRow}>
                {data.map((point, index) => (
                  <View key={index} style={{ width: segmentWidth, alignItems: 'center' }}>
                    <Text style={styles.axisLabel} numberOfLines={1}>
                      {point.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  chartWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  guideLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.4,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.xl,
  },
  barColumn: {
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginBottom: 2,
  },
  axisLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    maxWidth: 48,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
  },
  dot: {
    position: 'absolute',
    borderWidth: 2,
  },
  lineLabelsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
});

export default Chart;
