import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Recommendation } from '../../types';
import { RecommendationCard } from './RecommendationCard';
import { theme } from '../../styles/theme';

type Category = 'all' | Recommendation['category'];

type Props = {
  recommendations: Recommendation[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onAction?: (rec: Recommendation) => void;
  onDismiss?: (id: string) => void;
};

const CATEGORIES: Array<{ key: Category; label: string; icon: string }> = [
  { key: 'all', label: 'All', icon: '✨' },
  { key: 'workout', label: 'Workout', icon: '🏋️' },
  { key: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { key: 'sleep', label: 'Sleep', icon: '😴' },
  { key: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
  { key: 'recovery', label: 'Recovery', icon: '💪' },
];

export function RecommendationFeed({
  recommendations,
  loading = false,
  error = null,
  onRefresh,
  onAction,
  onDismiss,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered =
    activeCategory === 'all'
      ? recommendations.filter((r) => r.status === 'active')
      : recommendations.filter(
          (r) => r.category === activeCategory && r.status === 'active',
        );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Recommendations</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.refreshText}>↻ Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.chip,
              activeCategory === cat.key && styles.chipActive,
            ]}
            onPress={() => setActiveCategory(cat.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.chipLabel,
                activeCategory === cat.key && styles.chipLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Error state */}
      {error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : loading && filtered.length === 0 ? (
        /* Loading skeleton */
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Analysing your data…</Text>
        </View>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={styles.emptyTitle}>You're all caught up!</Text>
          <Text style={styles.emptySubtitle}>
            No recommendations right now.{'\n'}Keep logging to get personalised insights.
          </Text>
        </View>
      ) : (
        /* Feed */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feed}
        >
          {filtered.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onAction={onAction}
              onDismiss={onDismiss}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  heading: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
  },
  refreshButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  refreshText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },
  chipRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '22',
  },
  chipIcon: {
    fontSize: 14,
  },
  chipLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
  },
  chipLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  feed: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: theme.typography.sizes.sm,
  },
});

export default RecommendationFeed;
