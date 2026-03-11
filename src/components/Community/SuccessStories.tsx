import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

interface Story {
  name: string;
  initials: string;
  avatarColor: string;
  achievement: string;
  consistencyScore: number;
  quote: string;
  duration: string;
}

const STORIES: Story[] = [
  {
    name: 'Jordan K.',
    initials: 'JK',
    avatarColor: '#6C63FF',
    achievement: 'Lost 12 kg in 4 months',
    consistencyScore: 87,
    quote: '"Life Blueprint helped me stay consistent when I wanted to quit. The daily tracking made all the difference!"',
    duration: '4 months',
  },
  {
    name: 'Priya R.',
    initials: 'PR',
    avatarColor: '#E91E63',
    achievement: 'Gained 6 kg muscle in 5 months',
    consistencyScore: 92,
    quote: '"I never thought I could stick to a plan this long. The streak system kept me coming back every single day."',
    duration: '5 months',
  },
  {
    name: 'Marcus T.',
    initials: 'MT',
    avatarColor: '#4CAF50',
    achievement: 'Lost 8 kg in 3 months',
    consistencyScore: 78,
    quote: '"The awareness insights showed me patterns I never noticed. Small changes compounded into amazing results."',
    duration: '3 months',
  },
];

function StoryCard({ story }: { story: Story }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: story.avatarColor }]}>
          <Text style={styles.initials}>{story.initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{story.name}</Text>
          <Text style={styles.achievement}>{story.achievement}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNum}>{story.consistencyScore}%</Text>
          <Text style={styles.scoreLabel}>Consistency</Text>
        </View>
      </View>

      <View style={styles.quoteBubble}>
        <Text style={styles.quote}>{story.quote}</Text>
      </View>

      <View style={styles.durationRow}>
        <Text style={styles.durationIcon}>📅</Text>
        <Text style={styles.durationText}>Achieved in {story.duration}</Text>
      </View>
    </View>
  );
}

export default function SuccessStories() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Success Stories</Text>
      <Text style={styles.subtitle}>Real people, real results</Text>

      {STORIES.map((story) => (
        <StoryCard key={story.name} story={story} />
      ))}

      <View style={styles.shareCard}>
        <Text style={styles.shareIcon}>🌟</Text>
        <Text style={styles.shareTitle}>Share Your Story</Text>
        <Text style={styles.shareText}>
          Inspire others by sharing your transformation journey
        </Text>
      </View>
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
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  initials: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  achievement: {
    fontSize: Typography.sizes.sm,
    color: Colors.success,
    fontWeight: Typography.weights.medium,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: Colors.primary + '22',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  scoreNum: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  quoteBubble: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  quote: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  durationIcon: {
    fontSize: 14,
  },
  durationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  shareCard: {
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  shareIcon: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  shareTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  shareText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
