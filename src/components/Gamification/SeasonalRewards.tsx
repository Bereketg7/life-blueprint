import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SeasonalReward } from '../../types';

const TYPE_ICONS: Record<SeasonalReward['type'], string> = {
  xp_boost: '⚡',
  badge: '🏅',
  title: '👑',
  theme: '🎨',
  avatar_frame: '🖼️',
  coin_bundle: '🪙',
};

const TYPE_COLORS: Record<SeasonalReward['type'], string> = {
  xp_boost: '#6C63FF',
  badge: '#FFC107',
  title: '#FFD700',
  theme: '#4CAF50',
  avatar_frame: '#B9F2FF',
  coin_bundle: '#FF6B35',
};

interface SeasonalRewardsProps {
  rewards: SeasonalReward[];
  currentTier: number;
  isPremium: boolean;
  onClaim?: (reward: SeasonalReward) => void;
}

export const SeasonalRewards: React.FC<SeasonalRewardsProps> = ({
  rewards,
  currentTier,
  isPremium,
  onClaim,
}) => {
  const [filter, setFilter] = useState<'all' | 'free' | 'premium' | 'claimed'>('all');

  const filtered = rewards.filter(r => {
    if (filter === 'free') return r.track === 'free';
    if (filter === 'premium') return r.track === 'premium';
    if (filter === 'claimed') return r.isClaimed;
    return true;
  });

  const renderItem = ({ item }: { item: SeasonalReward }) => {
    const isReached = currentTier >= item.tier;
    const isAccessible = item.track === 'free' || isPremium;
    const canClaim = isReached && !item.isClaimed && isAccessible;

    return (
      <View style={[styles.rewardCard, item.isClaimed && styles.rewardCardClaimed, !isReached && styles.rewardCardLocked]}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: TYPE_COLORS[item.type] + '22' }]}>
          <Text style={styles.rewardIcon}>
            {item.isClaimed ? '✅' : !isReached ? '🔒' : TYPE_ICONS[item.type]}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.rewardInfo}>
          <Text style={[styles.rewardName, !isReached && styles.textMuted]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.rewardDesc, !isReached && styles.textMuted]} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.rewardMeta}>
            <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] + '22' }]}>
              <Text style={[styles.typeText, { color: TYPE_COLORS[item.type] }]}>
                {item.type.replace('_', ' ')}
              </Text>
            </View>
            {item.track === 'premium' && (
              <View style={styles.premiumChip}>
                <Text style={styles.premiumChipText}>⭐ Premium</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tier badge */}
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>T{item.tier}</Text>
        </View>

        {/* Claim button */}
        {canClaim && onClaim && (
          <TouchableOpacity style={styles.claimBtn} onPress={() => onClaim(item)}>
            <Text style={styles.claimText}>Claim</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter row */}
      <View style={styles.filterRow}>
        {(['all', 'free', 'premium', 'claimed'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#6C63FF',
  },
  filterText: {
    fontSize: 11,
    color: '#B0B0CC',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  rewardCardClaimed: {
    borderColor: '#4CAF5033',
    opacity: 0.8,
  },
  rewardCardLocked: {
    opacity: 0.5,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIcon: {
    fontSize: 22,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  rewardDesc: {
    fontSize: 11,
    color: '#B0B0CC',
    marginBottom: 6,
  },
  textMuted: {
    color: '#666680',
  },
  rewardMeta: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  premiumChip: {
    backgroundColor: '#FFC10722',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumChipText: {
    fontSize: 10,
    color: '#FFC107',
    fontWeight: '600',
  },
  tierBadge: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B0B0CC',
  },
  claimBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  claimText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SeasonalRewards;
