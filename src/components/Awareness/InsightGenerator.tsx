import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAwareness } from '../../hooks/useAwareness';
import { useTracking } from '../../context/TrackingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

interface Insight {
  icon: string;
  text: string;
}

export default function InsightGenerator() {
  const { consistencyData } = useAwareness();
  const { sleepLogs, mentalHealthLogs, activityLogs } = useTracking();

  const insights = useMemo<Insight[]>(() => {
    const result: Insight[] = [];

    // Consistency insight
    if (consistencyData.score >= 80) {
      result.push({ icon: '🏆', text: 'Outstanding consistency! You\'re completing over 80% of your planned activities.' });
    } else if (consistencyData.score >= 60) {
      result.push({ icon: '📈', text: `You're at ${consistencyData.score}% consistency. Try to complete 2-3 more activities per week to reach your goal.` });
    } else if (consistencyData.score > 0) {
      result.push({ icon: '💪', text: `Your consistency is at ${consistencyData.score}%. Focus on completing at least one activity per day to build momentum.` });
    } else {
      result.push({ icon: '🌱', text: 'Start your wellness journey today! Log your first activity to begin building your consistency score.' });
    }

    // Sleep insight
    const recentSleep = sleepLogs.slice(-7);
    if (recentSleep.length >= 3) {
      const avgHours = recentSleep.reduce((sum, l) => sum + l.hoursSlept, 0) / recentSleep.length;
      const avgQuality = recentSleep.reduce((sum, l) => sum + l.quality, 0) / recentSleep.length;

      if (avgHours < 6) {
        result.push({ icon: '😴', text: `You're averaging ${avgHours.toFixed(1)}h of sleep. Aim for 7-9 hours to improve recovery and performance.` });
      } else if (avgHours >= 7 && avgQuality >= 3.5) {
        result.push({ icon: '✨', text: `Great sleep hygiene! Averaging ${avgHours.toFixed(1)}h with quality rating ${avgQuality.toFixed(1)}/5.` });
      } else {
        result.push({ icon: '🌙', text: `Your sleep quality averages ${avgQuality.toFixed(1)}/5. Try a consistent bedtime routine to improve sleep quality.` });
      }
    } else {
      result.push({ icon: '🌙', text: 'Start logging your sleep to get personalized rest insights and improve recovery.' });
    }

    // Mood insight
    const recentMood = mentalHealthLogs.slice(-7);
    if (recentMood.length >= 3) {
      const avgMood = recentMood.reduce((sum, l) => sum + l.mood, 0) / recentMood.length;
      const avgStress = recentMood.reduce((sum, l) => sum + l.stress, 0) / recentMood.length;

      if (avgMood >= 7) {
        result.push({ icon: '😊', text: `Your mood has been great lately (avg ${avgMood.toFixed(1)}/10). Keep doing what's working!` });
      } else if (avgStress >= 7) {
        result.push({ icon: '🧘', text: `Your stress levels are high (avg ${avgStress.toFixed(1)}/10). Consider adding mindfulness or breathing exercises to your routine.` });
      } else {
        result.push({ icon: '💭', text: `Your average mood this week is ${avgMood.toFixed(1)}/10. Small wins and movement can help boost your wellbeing.` });
      }
    }

    // Activity insight
    const weekActivity = activityLogs.slice(-14);
    if (weekActivity.length >= 5) {
      result.push({ icon: '🏃', text: `You've logged ${weekActivity.length} activities in the past 2 weeks. Your activity level is ${weekActivity.length >= 10 ? 'excellent' : 'good'}!` });
    } else if (weekActivity.length > 0) {
      result.push({ icon: '🏃', text: `You've logged ${weekActivity.length} activities recently. Aim for at least 5 sessions per week for optimal results.` });
    }

    return result.slice(0, 5);
  }, [consistencyData, sleepLogs, mentalHealthLogs, activityLogs]);

  return (
    <View style={styles.container}>
      {insights.map((insight, idx) => (
        <View key={idx} style={styles.insightCard}>
          <Text style={styles.insightIcon}>{insight.icon}</Text>
          <Text style={styles.insightText}>{insight.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  insightIcon: {
    fontSize: 24,
    lineHeight: 30,
  },
  insightText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
