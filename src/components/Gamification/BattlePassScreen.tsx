import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BattlePass, Season, SeasonalReward, SeasonalChallenge } from '../../types';
import { BattlePassProgress } from './BattlePassProgress';
import { SeasonalRewards } from './SeasonalRewards';
import { SeasonalChallengeCard } from './SeasonalChallenge';
import { generateSeasonRewards } from '../../services/gamification/battlePassRewards';
import { getSeasonDaysRemaining, getSeasonWeekNumber } from '../../services/gamification/seasonManager';

type TabType = 'rewards' | 'challenges';

interface BattlePassScreenProps {
  battlePass: BattlePass;
  currentSeason: Season;
  challenges: SeasonalChallenge[];
  onClaimReward: (tier: number) => void;
  loading?: boolean;
}

export const BattlePassScreen: React.FC<BattlePassScreenProps> = ({
  battlePass,
  currentSeason,
  challenges,
  onClaimReward,
  loading = false,
}) => {
  const [tab, setTab] = useState<TabType>('rewards');
  const [track, setTrack] = useState<'free' | 'premium'>('free');
  const daysRemaining = getSeasonDaysRemaining();

  const rewards = generateSeasonRewards(currentSeason.id).map(r => ({
    ...r,
    isClaimed: battlePass.claimedRewards.includes(r.id),
  }));
  const { currentTier, progressPercent, xpToNextTier } =
    getTierProgressLocal(battlePass.totalSeasonXp, currentSeason);

  const seasonXpPercent =
    currentSeason.totalTiers > 0
      ? Math.min(100, (battlePass.totalSeasonXp / (currentSeason.totalTiers * currentSeason.xpPerTier)) * 100)
      : 0;

  return (
    <View style={styles.container}>
      {/* Season header */}
      <View style={styles.seasonHeader}>
        <View>
          <Text style={styles.seasonName}>{currentSeason.name}</Text>
          <Text style={styles.seasonSub}>
            Week {getSeasonWeekNumber()} · {daysRemaining} days remaining
          </Text>
        </View>
        {battlePass.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>⭐ PREMIUM</Text>
          </View>
        )}
      </View>

      {/* Season XP progress bar */}
      <View style={styles.seasonXpSection}>
        <View style={styles.seasonXpRow}>
          <Text style={styles.seasonXpLabel}>Season XP</Text>
          <Text style={styles.seasonXpValue}>{battlePass.totalSeasonXp.toLocaleString()}</Text>
        </View>
        <View style={styles.seasonXpBarBg}>
          <View style={[styles.seasonXpBarFill, { width: `${seasonXpPercent}%` }]} />
        </View>
        <Text style={styles.tierInfo}>
          Tier {currentTier} · {xpToNextTier} XP to Tier {currentTier + 1}
        </Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(['rewards', 'challenges'] as TabType[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'rewards' ? (
        <>
          {/* Free / Premium track toggle */}
          <View style={styles.trackToggle}>
            <TouchableOpacity
              style={[styles.trackBtn, track === 'free' && styles.trackBtnActive]}
              onPress={() => setTrack('free')}
            >
              <Text style={[styles.trackText, track === 'free' && styles.trackTextActive]}>
                Free Track
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.trackBtn, track === 'premium' && styles.trackBtnActive]}
              onPress={() => setTrack('premium')}
            >
              <Text style={[styles.trackText, track === 'premium' && styles.trackTextActive]}>
                ⭐ Premium
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tier grid */}
          <BattlePassProgress
            currentTier={currentTier}
            rewards={rewards}
            track={track}
            battlePass={battlePass}
            onClaimReward={onClaimReward}
          />
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.challengeList}>
          {challenges.length === 0 ? (
            <Text style={styles.emptyText}>No challenges this week.</Text>
          ) : (
            challenges.map(c => (
              <SeasonalChallengeCard key={c.id} challenge={c} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

function getTierProgressLocal(totalSeasonXp: number, season: Season) {
  const currentTier = Math.min(season.totalTiers, Math.floor(totalSeasonXp / season.xpPerTier));
  const xpIntoTier = totalSeasonXp % season.xpPerTier;
  const xpToNextTier = currentTier >= season.totalTiers ? 0 : season.xpPerTier - xpIntoTier;
  const progressPercent = currentTier >= season.totalTiers ? 100 : (xpIntoTier / season.xpPerTier) * 100;
  return { currentTier, xpToNextTier, progressPercent };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  seasonName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seasonSub: {
    fontSize: 13,
    color: '#B0B0CC',
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: '#FFC10722',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFC107',
  },
  seasonXpSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  seasonXpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  seasonXpLabel: {
    fontSize: 13,
    color: '#B0B0CC',
  },
  seasonXpValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C63FF',
  },
  seasonXpBarBg: {
    height: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  seasonXpBarFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 4,
  },
  tierInfo: {
    fontSize: 11,
    color: '#B0B0CC',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6C63FF',
  },
  tabText: {
    fontSize: 14,
    color: '#B0B0CC',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  trackToggle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  trackBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  trackBtnActive: {
    borderColor: '#FFC107',
    backgroundColor: '#FFC10711',
  },
  trackText: {
    fontSize: 13,
    color: '#B0B0CC',
    fontWeight: '600',
  },
  trackTextActive: {
    color: '#FFC107',
  },
  challengeList: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    color: '#B0B0CC',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default BattlePassScreen;
