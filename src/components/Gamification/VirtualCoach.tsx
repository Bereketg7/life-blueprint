import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAwareness } from '../../hooks/useAwareness';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

const TIPS = [
  '💧 Drink at least 8 glasses of water today for optimal performance.',
  '🧘 Take 5 minutes to breathe deeply and reset your focus.',
  '🚶 A 10-minute walk can boost mood and reduce stress significantly.',
  '🥦 Add one extra serving of vegetables to your next meal.',
  '😴 Aim for 7-9 hours of sleep tonight for muscle recovery.',
  '📵 Try a 30-minute screen-free period before bed.',
  '🏋️ Consistency beats intensity — show up even on low-energy days.',
];

function getCoachMessage(score: number): string {
  if (score >= 80) return "You're crushing it! Your consistency is incredible. Keep this momentum going!";
  if (score >= 60) return "Great work! You're building solid habits. A little more focus and you'll be unstoppable.";
  if (score >= 40) return "You're on your way! Let's tighten up your routine and watch the results roll in.";
  if (score >= 20) return "Every journey starts somewhere. Let's rebuild your streak and get back on track!";
  return "Let's get started! Small steps every day lead to big transformations. I believe in you!";
}

export default function VirtualCoach() {
  const { consistencyData } = useAwareness();
  const [planMessageVisible, setPlanMessageVisible] = useState(false);

  const dayOfWeek = new Date().getDay();
  const tip = TIPS[dayOfWeek % TIPS.length];
  const coachMessage = getCoachMessage(consistencyData.score);

  const handleViewPlan = () => {
    setPlanMessageVisible(true);
    Alert.alert(
      'Your Plan',
      'Your personalized plan is ready. Head to the Plan tab to see today\'s activities and goals.',
      [{ text: 'Got it!', onPress: () => setPlanMessageVisible(false) }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </View>
        <View style={styles.coachInfo}>
          <Text style={styles.coachName}>Coach Blueprint</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{coachMessage}</Text>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Tip of the Day</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>Your Consistency</Text>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreBarFill, { width: `${consistencyData.score}%` }]} />
        </View>
        <Text style={styles.scoreValue}>{consistencyData.score}%</Text>
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, planMessageVisible && styles.actionBtnDisabled]}
        onPress={handleViewPlan}
        disabled={planMessageVisible}
      >
        <Text style={styles.actionBtnText}>View My Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  coachInfo: {
    marginLeft: Spacing.md,
  },
  coachName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: Spacing.xs,
  },
  onlineText: {
    fontSize: Typography.sizes.xs,
    color: Colors.success,
    fontWeight: Typography.weights.medium,
  },
  messageBubble: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  messageText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  tipTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  tipText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  scoreLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    width: 110,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
  },
  scoreValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    width: 36,
    textAlign: 'right',
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionBtnText: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
});
