import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AwarenessView from '../components/Awareness/AwarenessView';
import BadgeDisplay from '../components/Rewards/BadgeDisplay';
import StreakCounter from '../components/Rewards/StreakCounter';
import useAwareness from '../hooks/useAwareness';
import useRewards from '../hooks/useRewards';
import { useHealth } from '../context/HealthContext';
import { colors, typography, spacing } from '../styles/theme';

const AwarenessScreen = () => {
  const { userProfile, todayActivity, todaySleep, todayNutrition } = useHealth();
  const { consistencyScore, projection, warnings } = useAwareness();
  const { streakData, achievements, userAchievements, totalPoints } = useRewards();

  const recentLogs = [
    ...todayActivity,
    ...(todaySleep ? [todaySleep] : []),
    ...todayNutrition,
  ];

  if (!consistencyScore || !projection) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.screenTitle}>Awareness</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🧠</Text>
          <Text style={styles.emptyTitle}>Start Logging</Text>
          <Text style={styles.emptySubtitle}>
            Log your activity, sleep, nutrition and mood to see your wellness insights.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Awareness</Text>

        <AwarenessView
          consistencyScore={consistencyScore}
          projection={projection}
          warnings={warnings}
          goalType={userProfile?.primaryGoal ?? 'general-wellness'}
        />

        {streakData && (
          <View style={styles.section}>
            <StreakCounter streakData={streakData} recentLogs={recentLogs} />
          </View>
        )}

        <View style={styles.section}>
          <BadgeDisplay
            achievements={achievements}
            userAchievements={userAchievements}
            totalPoints={totalPoints}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  screenTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  section: {
    marginTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default AwarenessScreen;