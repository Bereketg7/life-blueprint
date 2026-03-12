import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useHealth } from '../context/HealthContext';
import { colors, typography, spacing, borderRadius, shadow } from '../styles/theme';
import { ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../types';

type Tab = 'activity' | 'sleep' | 'nutrition' | 'mood';

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'activity', label: 'Activity', emoji: '🏃' },
  { key: 'sleep', label: 'Sleep', emoji: '😴' },
  { key: 'nutrition', label: 'Nutrition', emoji: '🥗' },
  { key: 'mood', label: 'Mood', emoji: '🧠' },
];

const qualityStars = (q: number) => '⭐'.repeat(q) + '☆'.repeat(5 - q);

const moodEmoji = (m: number) => ['😞', '😕', '😐', '🙂', '🤩'][m - 1] ?? '😐';

const ActivityItem = ({ log }: { log: ActivityLog }) => (
  <View style={styles.logCard}>
    <View style={styles.logRow}>
      <Text style={styles.logTitle}>{log.name}</Text>
      <Text style={styles.logBadge}>{log.type}</Text>
    </View>
    <View style={styles.logRow}>
      <Text style={styles.logMeta}>⏱ {log.duration} min</Text>
      <Text style={styles.logMeta}>🔥 {log.caloriesBurned} cal</Text>
      <Text style={styles.logMeta}>📶 {log.intensity}</Text>
    </View>
    <Text style={styles.logDate}>{log.date}</Text>
  </View>
);

const SleepItem = ({ log }: { log: SleepLog }) => (
  <View style={styles.logCard}>
    <View style={styles.logRow}>
      <Text style={styles.logTitle}>Sleep</Text>
      <Text style={styles.logMeta}>{qualityStars(log.quality)}</Text>
    </View>
    <View style={styles.logRow}>
      <Text style={styles.logMeta}>🛌 {log.bedtime}</Text>
      <Text style={styles.logMeta}>⏰ {log.wakeTime}</Text>
      <Text style={styles.logMeta}>🕐 {log.duration.toFixed(1)}h</Text>
    </View>
    <Text style={styles.logDate}>{log.date}</Text>
  </View>
);

const NutritionItem = ({ log }: { log: NutritionLog }) => (
  <View style={styles.logCard}>
    <View style={styles.logRow}>
      <Text style={styles.logTitle}>{log.foodName}</Text>
      <Text style={styles.logBadge}>{log.mealType}</Text>
    </View>
    <View style={styles.logRow}>
      <Text style={styles.logMeta}>🔥 {log.calories} cal</Text>
      <Text style={styles.logMeta}>💪 P:{log.protein}g</Text>
      <Text style={styles.logMeta}>🍞 C:{log.carbs}g</Text>
      <Text style={styles.logMeta}>🫒 F:{log.fat}g</Text>
    </View>
    <Text style={styles.logDate}>{log.date}</Text>
  </View>
);

const MoodItem = ({ log }: { log: MentalHealthLog }) => (
  <View style={styles.logCard}>
    <View style={styles.logRow}>
      <Text style={styles.logTitle}>{moodEmoji(log.mood)} Mood</Text>
      <Text style={styles.logMeta}>Stress: {log.stressLevel}/5</Text>
    </View>
    <View style={styles.logRow}>
      <Text style={styles.logMeta}>⚡ Energy: {log.energyLevel}/5</Text>
      <Text style={styles.logMeta}>😰 Anxiety: {log.anxietyLevel}/5</Text>
    </View>
    {log.meditationMinutes ? (
      <Text style={styles.logMeta}>🧘 {log.meditationMinutes} min meditation</Text>
    ) : null}
    <Text style={styles.logDate}>{log.date}</Text>
  </View>
);

const TrackScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>('activity');
  const { todayActivity, todaySleep, todayNutrition, todayMood } = useHealth();

  const renderContent = () => {
    switch (activeTab) {
      case 'activity':
        return todayActivity.length === 0 ? (
          <Text style={styles.emptyText}>No activity logged yet today.</Text>
        ) : (
          todayActivity.map(log => <ActivityItem key={log.id} log={log} />)
        );
      case 'sleep':
        return todaySleep ? (
          <SleepItem log={todaySleep} />
        ) : (
          <Text style={styles.emptyText}>No sleep logged yet today.</Text>
        );
      case 'nutrition':
        return todayNutrition.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged yet today.</Text>
        ) : (
          todayNutrition.map(log => <NutritionItem key={log.id} log={log} />)
        );
      case 'mood':
        return todayMood ? (
          <MoodItem log={todayMood} />
        ) : (
          <Text style={styles.emptyText}>No mood logged yet today.</Text>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Track</Text>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  logCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  logTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  logBadge: {
    fontSize: typography.size.xs,
    color: colors.primary,
    backgroundColor: `${colors.primary}18`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    textTransform: 'capitalize',
  },
  logMeta: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  logDate: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text.light,
    fontSize: typography.size.md,
    marginTop: spacing.xxxl,
  },
});

export default TrackScreen;