import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

interface Friend {
  name: string;
  initials: string;
  streak: number;
  isOnline: boolean;
  avatarColor: string;
}

const FRIENDS: Friend[] = [
  { name: 'Alex K.', initials: 'AK', streak: 45, isOnline: true, avatarColor: '#6C63FF' },
  { name: 'Sarah M.', initials: 'SM', streak: 38, isOnline: true, avatarColor: '#FF6B6B' },
  { name: 'Mike R.', initials: 'MR', streak: 22, isOnline: false, avatarColor: '#4CAF50' },
  { name: 'Emily L.', initials: 'EL', streak: 17, isOnline: true, avatarColor: '#FFC107' },
  { name: 'James W.', initials: 'JW', streak: 14, isOnline: false, avatarColor: '#00BCD4' },
  { name: 'Lisa T.', initials: 'LT', streak: 31, isOnline: true, avatarColor: '#E91E63' },
];

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: friend.avatarColor }]}>
          <Text style={styles.initials}>{friend.initials}</Text>
        </View>
        <View style={[styles.onlineIndicator, friend.isOnline ? styles.online : styles.offline]} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.streakText}>🔥 {friend.streak} day streak</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, friend.isOnline ? styles.onlineText : styles.offlineText]}>
          {friend.isOnline ? 'Active' : 'Offline'}
        </Text>
      </View>
    </View>
  );
}

export default function FriendsList() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Friends</Text>
      <Text style={styles.subtitle}>{FRIENDS.filter((f) => f.isOnline).length} friends active now</Text>

      {FRIENDS.map((friend) => (
        <FriendCard key={friend.name} friend={friend} />
      ))}
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
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  online: {
    backgroundColor: Colors.success,
  },
  offline: {
    backgroundColor: Colors.text.muted,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  streakText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  onlineText: {
    color: Colors.success,
  },
  offlineText: {
    color: Colors.text.muted,
  },
});
