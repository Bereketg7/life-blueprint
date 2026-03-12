import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SeasonalReward, BattlePass } from '../../types';

interface BattlePassProgressProps {
  currentTier: number;
  rewards: SeasonalReward[];
  track: 'free' | 'premium';
  battlePass: BattlePass;
  onClaimReward: (tier: number) => void;
}

const TYPE_ICONS: Record<SeasonalReward['type'], string> = {
  xp_boost: '⚡',
  badge: '🏅',
  title: '👑',
  theme: '🎨',
  avatar_frame: '🖼️',
  coin_bundle: '🪙',
};

export const BattlePassProgress: React.FC<BattlePassProgressProps> = ({
  currentTier,
  rewards,
  track,
  battlePass,
  onClaimReward,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const trackRewards = rewards.filter(r => r.track === track);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {trackRewards.map(reward => {
        const isReached = currentTier >= reward.tier;
        const isClaimed = battlePass.claimedRewards.includes(reward.id);
        const isCurrent = reward.tier === currentTier;
        const canClaim = isReached && !isClaimed && (track === 'free' || battlePass.isPremium);

        return (
          <View
            key={reward.id}
            style={[
              styles.tierItem,
              isCurrent && styles.tierItemCurrent,
              isClaimed && styles.tierItemClaimed,
              !isReached && styles.tierItemLocked,
            ]}
          >
            {/* Tier number */}
            <Text style={[styles.tierNumber, isCurrent && styles.tierNumberCurrent]}>
              T{reward.tier}
            </Text>

            {/* Reward icon */}
            <View style={[styles.rewardIconWrapper, isClaimed && styles.rewardIconWrapperClaimed]}>
              <Text style={styles.rewardIcon}>
                {isClaimed ? '✅' : !isReached ? '🔒' : TYPE_ICONS[reward.type] ?? '🎁'}
              </Text>
            </View>

            {/* Reward name */}
            <Text style={styles.rewardName} numberOfLines={2}>
              {reward.name}
            </Text>

            {/* Premium indicator */}
            {reward.track === 'premium' && (
              <View style={styles.premiumDot}>
                <Text style={styles.premiumDotText}>⭐</Text>
              </View>
            )}

            {/* Claim button */}
            {canClaim && (
              <TouchableOpacity
                style={styles.claimBtn}
                onPress={() => onClaimReward(reward.tier)}
              >
                <Text style={styles.claimBtnText}>Claim</Text>
              </TouchableOpacity>
            )}

            {/* Current tier highlight line */}
            {isCurrent && <View style={styles.currentLine} />}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tierItem: {
    width: 80,
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    position: 'relative',
  },
  tierItemCurrent: {
    borderColor: '#6C63FF',
    backgroundColor: '#6C63FF11',
  },
  tierItemClaimed: {
    borderColor: '#4CAF5044',
    backgroundColor: '#4CAF5011',
  },
  tierItemLocked: {
    opacity: 0.45,
  },
  tierNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B0B0CC',
    marginBottom: 6,
  },
  tierNumberCurrent: {
    color: '#6C63FF',
  },
  rewardIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  rewardIconWrapperClaimed: {
    backgroundColor: '#4CAF5022',
  },
  rewardIcon: {
    fontSize: 22,
  },
  rewardName: {
    fontSize: 9,
    color: '#B0B0CC',
    textAlign: 'center',
    lineHeight: 12,
  },
  premiumDot: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  premiumDotText: {
    fontSize: 10,
  },
  claimBtn: {
    marginTop: 6,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  claimBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  currentLine: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#6C63FF',
    borderRadius: 2,
  },
});

export default BattlePassProgress;
