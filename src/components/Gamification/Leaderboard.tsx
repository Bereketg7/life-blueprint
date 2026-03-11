import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  streak: number;
}

const MOCK_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex K.', score: 9850, streak: 45 },
  { rank: 2, name: 'Sarah M.', score: 8920, streak: 38 },
  { rank: 3, name: 'Mike R.', score: 8450, streak: 31 },
  { rank: 4, name: 'Emily L.', score: 7830, streak: 27 },
  { rank: 5, name: 'You', score: 7200, streak: 22 },
  { rank: 6, name: 'James W.', score: 6940, streak: 19 },
  { rank: 7, name: 'Lisa T.', score: 6510, streak: 17 },
  { rank: 8, name: 'Chris P.', score: 5980, streak: 14 },
  { rank: 9, name: 'Anna B.', score: 5440, streak: 11 },
  { rank: 10, name: 'Tom H.', score: 4900, streak: 8 },
];

const RANK_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
  return (
    <View style={[styles.row, isCurrentUser && styles.currentUserRow]}>
      <View style={styles.rankContainer}>
        {entry.rank <= 3 ? (
          <Text style={styles.medal}>{RANK_MEDALS[entry.rank]}</Text>
        ) : (
          <Text style={[styles.rankText, isCurrentUser && styles.currentUserText]}>
            #{entry.rank}
          </Text>
        )}
      </View>

      <View style={styles.nameContainer}>
        <Text style={[styles.name, isCurrentUser && styles.currentUserText]} numberOfLines={1}>
          {entry.name}
          {isCurrentUser ? ' (You)' : ''}
        </Text>
        <Text style={styles.streakText}>🔥 {entry.streak} day streak</Text>
      </View>

      <Text style={[styles.score, isCurrentUser && styles.currentUserText]}>
        {entry.score.toLocaleString()}
      </Text>
    </View>
  );
}

export default function Leaderboard() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.subtitle}>Top performers this month</Text>

      <View style={styles.header}>
        <Text style={styles.headerRank}>Rank</Text>
        <Text style={styles.headerName}>Player</Text>
        <Text style={styles.headerScore}>Score</Text>
      </View>

      {MOCK_DATA.map((entry) => (
        <LeaderboardRow
          key={entry.rank}
          entry={entry}
          isCurrentUser={entry.name === 'You'}
        />
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
  header: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  headerRank: {
    width: 60,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text.muted,
    textTransform: 'uppercase',
  },
  headerName: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text.muted,
    textTransform: 'uppercase',
  },
  headerScore: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text.muted,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentUserRow: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  rankContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  medal: {
    fontSize: 22,
  },
  rankText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.secondary,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  streakText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  score: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  currentUserText: {
    color: Colors.primary,
  },
});
