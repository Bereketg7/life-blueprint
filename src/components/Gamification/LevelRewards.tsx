import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LevelUnlock } from '../../types';
import { LevelBadge } from './LevelBadge';

interface LevelRewardsProps {
  unlocks: LevelUnlock[];
  userLevel: number;
}

export const LevelRewards: React.FC<LevelRewardsProps> = ({
  unlocks,
  userLevel,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Level Rewards</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {unlocks.map(unlock => {
          const isUnlocked = userLevel >= unlock.level;
          return (
            <View
              key={`${unlock.level}-${unlock.feature}`}
              style={[styles.item, !isUnlocked && styles.itemLocked]}
            >
              {/* Level badge */}
              <LevelBadge level={unlock.level} size="small" dimmed={!isUnlocked} />

              {/* Icon */}
              <Text style={[styles.icon, !isUnlocked && styles.iconLocked]}>
                {isUnlocked ? unlock.icon : '🔒'}
              </Text>

              {/* Info */}
              <View style={styles.info}>
                <View style={styles.infoRow}>
                  <Text style={[styles.feature, !isUnlocked && styles.featureLocked]}>
                    {unlock.feature}
                  </Text>
                  <View
                    style={[
                      styles.levelBadge,
                      isUnlocked ? styles.levelBadgeUnlocked : styles.levelBadgeLocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelBadgeText,
                        isUnlocked ? styles.levelBadgeTextUnlocked : styles.levelBadgeTextLocked,
                      ]}
                    >
                      Lv.{unlock.level}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.description, !isUnlocked && styles.descriptionLocked]}>
                  {unlock.description}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  itemLocked: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 26,
  },
  iconLocked: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  feature: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  featureLocked: {
    color: '#B0B0CC',
  },
  description: {
    fontSize: 12,
    color: '#B0B0CC',
    lineHeight: 16,
  },
  descriptionLocked: {
    color: '#666680',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelBadgeUnlocked: {
    backgroundColor: '#4CAF5022',
  },
  levelBadgeLocked: {
    backgroundColor: '#1A1A2E',
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  levelBadgeTextUnlocked: {
    color: '#4CAF50',
  },
  levelBadgeTextLocked: {
    color: '#666680',
  },
});

export default LevelRewards;
