import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Quest, QuestProgress as QuestProgressType } from '../../types';
import { QuestCard } from './QuestCard';
import { QuestProgress } from './QuestProgress';

type FilterType = 'all' | 'active' | 'completed';

interface DailyQuestsProps {
  quests: Quest[];
  questProgress: QuestProgressType | null;
  loading?: boolean;
  onCompleteQuest: (id: string) => void;
  onUpdateProgress: (id: string, value: number) => void;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const DailyQuests: React.FC<DailyQuestsProps> = ({
  quests,
  questProgress,
  loading = false,
  onCompleteQuest,
  onUpdateProgress,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [countdown, setCountdown] = useState(getSecondsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const filtered = quests.filter(q => {
    if (filter === 'active') return q.status === 'active';
    if (filter === 'completed') return q.status === 'completed';
    return true;
  });

  const totalDayXp = quests
    .filter(q => q.status === 'completed')
    .reduce((sum, q) => sum + q.xpReward, 0);

  const maxDayXp = quests.reduce((sum, q) => sum + q.xpReward, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Quests</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>Refreshes in</Text>
          <Text style={styles.countdown}>{formatCountdown(countdown)}</Text>
        </View>
      </View>

      {/* XP progress bar */}
      <View style={styles.xpSection}>
        <Text style={styles.xpText}>
          Daily XP: {totalDayXp} / {maxDayXp}
        </Text>
        <View style={styles.xpBarBg}>
          <View
            style={[
              styles.xpBarFill,
              { width: maxDayXp > 0 ? `${(totalDayXp / maxDayXp) * 100}%` : '0%' },
            ]}
          />
        </View>
      </View>

      {/* Quest progress summary */}
      {questProgress && (
        <QuestProgress progress={questProgress} />
      )}

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quest list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {loading ? (
          <Text style={styles.emptyText}>Loading quests...</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>
            {filter === 'completed' ? 'No completed quests yet today.' : 'No quests available.'}
          </Text>
        ) : (
          filtered.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={onCompleteQuest}
              onUpdateProgress={onUpdateProgress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 13,
    color: '#B0B0CC',
    marginTop: 2,
  },
  countdownContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 8,
  },
  countdownLabel: {
    fontSize: 10,
    color: '#B0B0CC',
  },
  countdown: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C63FF',
    fontVariant: ['tabular-nums'],
  },
  xpSection: {
    marginBottom: 14,
  },
  xpText: {
    fontSize: 13,
    color: '#B0B0CC',
    marginBottom: 4,
  },
  xpBarBg: {
    height: 6,
    backgroundColor: '#1A1A2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#6C63FF',
  },
  filterText: {
    fontSize: 13,
    color: '#B0B0CC',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingBottom: 24,
    gap: 12,
  },
  emptyText: {
    color: '#B0B0CC',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 15,
  },
});

export default DailyQuests;
