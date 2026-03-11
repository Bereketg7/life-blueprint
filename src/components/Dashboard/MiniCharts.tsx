import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface MiniChartsProps {
  weeklyActivity: number[];
  weeklyCalories: number[];
  weeklyMood: number[];
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface BarChartProps {
  data: number[];
  color: string;
  label: string;
  unit: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, color, label, unit }) => {
  const max = Math.max(...data, 1);
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.header}>
        <Text style={chartStyles.label}>{label}</Text>
        <Text style={[chartStyles.unit, { color }]}>{unit}</Text>
      </View>
      <View style={chartStyles.barsRow}>
        {data.map((val, i) => {
          const heightPct = max > 0 ? (val / max) * 100 : 0;
          const isToday = i === todayIndex;
          return (
            <View key={i} style={chartStyles.barCol}>
              <View style={chartStyles.barTrack}>
                <View
                  style={[
                    chartStyles.bar,
                    {
                      height: `${Math.max(heightPct, 4)}%`,
                      backgroundColor: isToday ? color : `${color}55`,
                    },
                  ]}
                />
              </View>
              <Text style={[chartStyles.dayLabel, isToday && { color: Colors.text.primary }]}>
                {DAY_LABELS[i]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const chartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  unit: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 64,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barTrack: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 3,
    minHeight: 3,
  },
  dayLabel: {
    fontSize: 9,
    color: Colors.text.muted,
    marginTop: 3,
  },
});

const MiniCharts: React.FC<MiniChartsProps> = ({
  weeklyActivity,
  weeklyCalories,
  weeklyMood,
}) => {
  const normalizedActivity = weeklyActivity.length === 7 ? weeklyActivity : Array(7).fill(0);
  const normalizedCalories = weeklyCalories.length === 7 ? weeklyCalories : Array(7).fill(0);
  const normalizedMood = weeklyMood.length === 7 ? weeklyMood : Array(7).fill(0);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Week Progress</Text>
      <View style={styles.row}>
        <BarChart
          data={normalizedActivity}
          color={Colors.primary}
          label="Activity"
          unit="min"
        />
        <View style={styles.gap} />
        <BarChart
          data={normalizedCalories}
          color="#FF6B6B"
          label="Calories"
          unit="kcal"
        />
      </View>
      <View style={[styles.row, { marginTop: Spacing.sm }]}>
        <BarChart
          data={normalizedMood}
          color="#FFC107"
          label="Mood"
          unit="/10"
        />
        <View style={styles.gap} />
        <View style={styles.emptyChart} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
  },
  gap: {
    width: Spacing.sm,
  },
  emptyChart: {
    flex: 1,
  },
});

export default MiniCharts;
