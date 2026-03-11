import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { Achievement, UserAchievement } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';

interface Props {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  totalPoints: number;
}

const CATEGORY_COLORS: Record<Achievement['category'], string> = {
  activity: colors.category.activity,
  nutrition: colors.category.nutrition,
  sleep: colors.category.sleep,
  mental: colors.category.mental,
  streak: colors.warning,
  social: colors.accent,
  milestone: colors.secondary,
};

const CATEGORY_LABELS: Record<Achievement['category'], string> = {
  activity: '🏃 Activity',
  nutrition: '🥗 Nutrition',
  sleep: '😴 Sleep',
  mental: '🧠 Mental',
  streak: '🔥 Streak',
  social: '👥 Social',
  milestone: '🏆 Milestone',
};

const BadgeDisplay = ({ achievements, userAchievements, totalPoints }: Props) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [activeCategory, setActiveCategory] = useState<Achievement['category'] | 'all'>('all');

  const earnedMap = new Map(userAchievements.map(ua => [ua.achievementId, ua]));
  const categories = ['all', ...Array.from(new Set(achievements.map(a => a.category)))] as const;

  const filtered = achievements.filter(
    a => activeCategory === 'all' || a.category === activeCategory,
  );
  const earned = achievements.filter(a => earnedMap.has(a.id));
  const selectedUA = selectedAchievement ? earnedMap.get(selectedAchievement.id) : null;

  return (
    <View style={styles.container}>
      {/* Points header */}
      <View style={styles.pointsCard}>
        <Text style={styles.pointsEmoji}>⭐</Text>
        <View>
          <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>Total Points Earned</Text>
        </View>
        <View style={styles.earnedBadge}>
          <Text style={styles.earnedNum}>{earned.length}</Text>
          <Text style={styles.earnedLabel}>/{achievements.length} badges</Text>
        </View>
      </View>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              activeCategory === cat && { backgroundColor: cat === 'all' ? colors.primary : CATEGORY_COLORS[cat as Achievement['category']], borderColor: 'transparent' },
            ]}
            onPress={() => setActiveCategory(cat as typeof activeCategory)}
          >
            <Text style={[styles.filterChipText, activeCategory === cat && styles.filterChipTextActive]}>
              {cat === 'all' ? '🎯 All' : CATEGORY_LABELS[cat as Achievement['category']]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Badge grid */}
      <View style={styles.grid}>
        {filtered.map(achievement => {
          const ua = earnedMap.get(achievement.id);
          const isEarned = !!ua;
          const progress = ua?.progress ?? 0;
          const progressPct = Math.min(100, Math.round((progress / achievement.requiredValue) * 100));
          const catColor = CATEGORY_COLORS[achievement.category];

          return (
            <TouchableOpacity
              key={achievement.id}
              style={[styles.badgeCard, !isEarned && styles.badgeCardLocked]}
              onPress={() => setSelectedAchievement(achievement)}
              activeOpacity={0.8}
            >
              <View style={[styles.badgeIconContainer, isEarned ? { backgroundColor: `${catColor}20` } : styles.lockedIconBg]}>
                <Text style={[styles.badgeIcon, !isEarned && styles.badgeIconLocked]}>
                  {achievement.icon}
                </Text>
              </View>
              <Text style={[styles.badgeName, !isEarned && styles.lockedText]} numberOfLines={2}>
                {achievement.name}
              </Text>
              <Text style={[styles.badgePoints, { color: isEarned ? catColor : colors.text.light }]}>
                {achievement.points} pts
              </Text>
              {!isEarned && progressPct > 0 && (
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${progressPct}%` as any, backgroundColor: catColor }]} />
                </View>
              )}
              {!isEarned && progressPct > 0 && (
                <Text style={styles.progressText}>{progressPct}%</Text>
              )}
              {isEarned && (
                <View style={[styles.earnedCheckBadge, { backgroundColor: catColor }]}>
                  <Text style={styles.earnedCheck}>✓</Text>
                </View>
              )}
              {!isEarned && progressPct === 0 && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Detail modal */}
      <Modal visible={!!selectedAchievement} transparent animationType="slide" onRequestClose={() => setSelectedAchievement(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedAchievement && (() => {
              const isEarned = earnedMap.has(selectedAchievement.id);
              const catColor = CATEGORY_COLORS[selectedAchievement.category];
              const progress = selectedUA?.progress ?? 0;
              const progressPct = Math.min(100, Math.round((progress / selectedAchievement.requiredValue) * 100));

              return (
                <>
                  <View style={[styles.modalIconBg, { backgroundColor: `${catColor}20` }]}>
                    <Text style={[styles.modalIcon, !isEarned && styles.badgeIconLocked]}>
                      {selectedAchievement.icon}
                    </Text>
                  </View>
                  <Text style={styles.modalName}>{selectedAchievement.name}</Text>
                  <View style={[styles.modalCatTag, { backgroundColor: `${catColor}20` }]}>
                    <Text style={[styles.modalCatText, { color: catColor }]}>
                      {CATEGORY_LABELS[selectedAchievement.category]}
                    </Text>
                  </View>
                  <Text style={styles.modalDesc}>{selectedAchievement.description}</Text>
                  <View style={styles.modalStatsRow}>
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatValue}>{selectedAchievement.points}</Text>
                      <Text style={styles.modalStatLabel}>Points</Text>
                    </View>
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatValue}>{selectedAchievement.requiredValue}</Text>
                      <Text style={styles.modalStatLabel}>Required</Text>
                    </View>
                    <View style={styles.modalStat}>
                      <Text style={[styles.modalStatValue, { color: isEarned ? colors.success : colors.text.secondary }]}>
                        {isEarned ? '✓ Earned' : `${progressPct}%`}
                      </Text>
                      <Text style={styles.modalStatLabel}>Status</Text>
                    </View>
                  </View>
                  {!isEarned && (
                    <>
                      <View style={styles.modalProgressBg}>
                        <View style={[styles.modalProgressFill, { width: `${progressPct}%` as any, backgroundColor: catColor }]} />
                      </View>
                      <Text style={styles.modalProgressLabel}>
                        {progress} / {selectedAchievement.requiredValue} ({progressPct}%)
                      </Text>
                    </>
                  )}
                  {isEarned && selectedUA?.earnedAt && (
                    <Text style={styles.earnedDate}>
                      🎉 Earned on {new Date(selectedUA.earnedAt).toLocaleDateString()}
                    </Text>
                  )}
                  <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedAchievement(null)}>
                    <Text style={styles.modalCloseBtnText}>Close</Text>
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.sm,
  },
  pointsEmoji: { fontSize: 36 },
  pointsValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.extrabold,
    color: colors.warning,
  },
  pointsLabel: { fontSize: typography.size.xs, color: colors.text.secondary },
  earnedBadge: { marginLeft: 'auto', alignItems: 'flex-end' },
  earnedNum: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  earnedLabel: { fontSize: typography.size.xs, color: colors.text.light },
  filterScroll: { marginHorizontal: -spacing.xl, paddingLeft: spacing.xl },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  filterChipText: { fontSize: typography.size.sm, color: colors.text.secondary, fontWeight: typography.weight.medium },
  filterChipTextActive: { color: colors.surface, fontWeight: typography.weight.bold },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
    position: 'relative',
  },
  badgeCardLocked: { opacity: 0.7 },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  lockedIconBg: { backgroundColor: colors.background },
  badgeIcon: { fontSize: 28 },
  badgeIconLocked: { opacity: 0.4 },
  badgeName: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  lockedText: { color: colors.text.light },
  badgePoints: { fontSize: typography.size.xs, fontWeight: typography.weight.medium },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: borderRadius.full },
  progressText: { fontSize: typography.size.xs, color: colors.text.light, marginTop: 2 },
  earnedCheckBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 18,
    height: 18,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnedCheck: { fontSize: 10, color: colors.surface, fontWeight: typography.weight.bold },
  lockBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  lockIcon: { fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  modalIconBg: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalIcon: { fontSize: 44 },
  modalName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalCatTag: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  modalCatText: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  modalDesc: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  modalStatsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: spacing.lg,
  },
  modalStat: { flex: 1, alignItems: 'center' },
  modalStatValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  modalStatLabel: { fontSize: typography.size.xs, color: colors.text.light },
  modalProgressBg: {
    width: '100%',
    height: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  modalProgressFill: { height: '100%', borderRadius: borderRadius.full },
  modalProgressLabel: { fontSize: typography.size.sm, color: colors.text.secondary, marginBottom: spacing.lg },
  earnedDate: {
    fontSize: typography.size.sm,
    color: colors.success,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.lg,
  },
  modalCloseBtn: {
    width: '100%',
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  modalCloseBtnText: { fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.surface },
});

export default BadgeDisplay;
