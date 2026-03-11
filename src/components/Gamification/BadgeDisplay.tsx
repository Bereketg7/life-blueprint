import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';
import { Badge } from '../../types';

interface Props {
  badges: Badge[];
}

function BadgeCard({ badge }: { badge: Badge }) {
  const isLocked = badge.unlockedAt === null;

  return (
    <View style={[styles.card, isLocked && styles.cardLocked]}>
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, isLocked && styles.iconLocked]}>
          {isLocked ? '🔒' : badge.icon}
        </Text>
      </View>
      <Text style={[styles.badgeName, isLocked && styles.textLocked]} numberOfLines={1}>
        {badge.name}
      </Text>
      <Text style={[styles.requirement, isLocked && styles.textLocked]} numberOfLines={2}>
        {badge.requirement}
      </Text>
    </View>
  );
}

export default function BadgeDisplay({ badges }: Props) {
  if (badges.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No badges yet. Keep going! 💪</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={badges}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => <BadgeCard badge={item} />}
      contentContainerStyle={styles.listContent}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: Spacing.sm,
  },
  card: {
    flex: 1,
    margin: Spacing.xs,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
  },
  cardLocked: {
    opacity: 0.5,
  },
  iconContainer: {
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 32,
  },
  iconLocked: {
    opacity: 0.6,
  },
  badgeName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  },
  requirement: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 14,
  },
  textLocked: {
    color: Colors.text.muted,
  },
  emptyContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
  },
});
