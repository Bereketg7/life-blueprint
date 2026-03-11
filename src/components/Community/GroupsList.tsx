import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

interface Group {
  name: string;
  icon: string;
  members: number;
  activity: string;
  color: string;
}

const GROUPS: Group[] = [
  { name: 'Weight Loss Warriors', icon: '⚖️', members: 247, activity: 'Very Active', color: '#FF6B6B' },
  { name: 'Muscle Builders', icon: '💪', members: 183, activity: 'Active', color: '#6C63FF' },
  { name: 'Mindfulness Circle', icon: '🧘', members: 312, activity: 'Very Active', color: '#4CAF50' },
  { name: 'Running Club', icon: '🏃', members: 156, activity: 'Active', color: '#FFC107' },
];

const ACTIVITY_COLORS: Record<string, string> = {
  'Very Active': Colors.success,
  Active: Colors.warning,
  Quiet: Colors.text.muted,
};

function GroupCard({ group }: { group: Group }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={[styles.iconCircle, { backgroundColor: group.color + '33' }]}>
        <Text style={styles.icon}>{group.icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.membersText}>👥 {group.members.toLocaleString()} members</Text>
      </View>

      <View style={styles.activityBadge}>
        <View style={[styles.activityDot, { backgroundColor: ACTIVITY_COLORS[group.activity] ?? Colors.text.muted }]} />
        <Text style={[styles.activityText, { color: ACTIVITY_COLORS[group.activity] ?? Colors.text.muted }]}>
          {group.activity}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function GroupsList() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Wellness Groups</Text>
      <Text style={styles.subtitle}>Join communities to stay motivated</Text>

      {GROUPS.map((group) => (
        <GroupCard key={group.name} group={group} />
      ))}

      <View style={styles.createGroupCard}>
        <Text style={styles.createGroupIcon}>➕</Text>
        <Text style={styles.createGroupText}>Create a new group</Text>
        <Text style={styles.createGroupSub}>Invite friends and build your own wellness community</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 26,
  },
  info: {
    flex: 1,
  },
  groupName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  membersText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  createGroupCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  createGroupIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  createGroupText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginBottom: 4,
  },
  createGroupSub: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});
