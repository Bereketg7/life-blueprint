import React, { useMemo, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';
import { useTracking } from '../../context/TrackingContext';
import { usePlan } from '../../hooks/usePlan';
import { useUser } from '../../context/UserContext';
import { useRewards } from '../../hooks/useRewards';
import { useAwareness } from '../../hooks/useAwareness';
import HealthSummary from './HealthSummary';
import QuickActions from './QuickActions';
import TodaysFocus from './TodaysFocus';
import MiniCharts from './MiniCharts';
import ActivityTracker from '../Tracking/ActivityTracker';

type ModalType = 'activity' | 'meal' | 'sleep' | 'mood' | null;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const toISODate = (d = new Date()) => d.toISOString().split('T')[0];

const Dashboard: React.FC = () => {
  const { profile } = useUser();
  const { getTodayLogs, getWeekLogs, logNutrition, logSleep, logMood } = useTracking();
  const { updateItemStatus, todayItems } = usePlan();
  const { streak } = useRewards();
  useAwareness(); // for side-effects / warnings

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [mealCalories, setMealCalories] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [moodValue, setMoodValue] = useState('');

  const todayLogs = getTodayLogs();
  const weekLogs = getWeekLogs();

  const activityMinutes = useMemo(
    () => todayLogs.activity.reduce((sum, l) => sum + l.duration, 0),
    [todayLogs.activity]
  );
  const caloriesConsumed = useMemo(
    () => todayLogs.nutrition.reduce((sum, l) => sum + l.calories, 0),
    [todayLogs.nutrition]
  );
  const lastSleep = todayLogs.sleep[todayLogs.sleep.length - 1]?.hoursSlept ?? null;
  const lastMood = todayLogs.mental[todayLogs.mental.length - 1]?.mood ?? null;

  // Build weekly arrays (7 days, Mon-Sun)
  const weeklyActivity = useMemo(() => {
    const arr = Array(7).fill(0);
    weekLogs.activity.forEach((l) => {
      const day = new Date(l.date).getDay();
      const idx = day === 0 ? 6 : day - 1;
      arr[idx] += l.duration;
    });
    return arr;
  }, [weekLogs.activity]);

  const weeklyCalories = useMemo(() => {
    const arr = Array(7).fill(0);
    weekLogs.nutrition.forEach((l) => {
      const day = new Date(l.date).getDay();
      const idx = day === 0 ? 6 : day - 1;
      arr[idx] += l.calories;
    });
    return arr;
  }, [weekLogs.nutrition]);

  const weeklyMood = useMemo(() => {
    const arr = Array(7).fill(0);
    weekLogs.mental.forEach((l) => {
      const day = new Date(l.date).getDay();
      const idx = day === 0 ? 6 : day - 1;
      arr[idx] = l.mood; // last mood of the day
    });
    return arr;
  }, [weekLogs.mental]);

  // Today's plan items come pre-filtered with correct day mapping from usePlan hook

  const handleLogMeal = () => {
    if (!mealCalories) return;
    logNutrition({
      userId: profile?.id ?? 'user',
      date: toISODate(),
      mealType: 'snack',
      calories: parseInt(mealCalories, 10) || 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      notes: '',
      status: 'logged',
    });
    setMealCalories('');
    setActiveModal(null);
  };

  const handleLogSleep = () => {
    if (!sleepHours) return;
    logSleep({
      userId: profile?.id ?? 'user',
      date: toISODate(),
      hoursSlept: parseFloat(sleepHours) || 0,
      quality: 3,
      notes: '',
    });
    setSleepHours('');
    setActiveModal(null);
  };

  const handleLogMood = () => {
    if (!moodValue) return;
    logMood({
      userId: profile?.id ?? 'user',
      date: toISODate(),
      mood: parseInt(moodValue, 10) || 5,
      stress: 5,
      notes: '',
    });
    setMoodValue('');
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>
              {getGreeting()}{profile?.name ? `, ${profile.name}` : ''}! 👋
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          {/* Streak badge */}
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakNum}>{streak.currentStreak}</Text>
          </View>
        </View>

        <HealthSummary
          activityMinutes={activityMinutes}
          caloriesConsumed={caloriesConsumed}
          sleepHours={lastSleep}
          moodScore={lastMood}
        />

        <QuickActions
          onLogActivity={() => setActiveModal('activity')}
          onLogMeal={() => setActiveModal('meal')}
          onLogSleep={() => setActiveModal('sleep')}
          onLogMood={() => setActiveModal('mood')}
        />

        <TodaysFocus items={todayItems} onUpdateStatus={updateItemStatus} />

        <MiniCharts
          weeklyActivity={weeklyActivity}
          weeklyCalories={weeklyCalories}
          weeklyMood={weeklyMood}
        />
      </ScrollView>

      {/* Activity Modal */}
      <Modal
        visible={activeModal === 'activity'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalSheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📊 Log Activity</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <ActivityTracker onClose={() => setActiveModal(null)} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Meal Modal */}
      <Modal
        visible={activeModal === 'meal'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalSheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🍽️ Log Meal</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Calories</Text>
              <TextInput
                style={styles.input}
                value={mealCalories}
                onChangeText={setMealCalories}
                placeholder="e.g. 450"
                placeholderTextColor={Colors.text.muted}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.logBtn, !mealCalories && styles.logBtnDisabled]}
                onPress={handleLogMeal}
                disabled={!mealCalories}
                activeOpacity={0.8}
              >
                <Text style={styles.logBtnText}>Log Meal</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Sleep Modal */}
      <Modal
        visible={activeModal === 'sleep'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalSheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>😴 Log Sleep</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Hours Slept</Text>
              <TextInput
                style={styles.input}
                value={sleepHours}
                onChangeText={setSleepHours}
                placeholder="e.g. 7.5"
                placeholderTextColor={Colors.text.muted}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={[styles.logBtn, !sleepHours && styles.logBtnDisabled]}
                onPress={handleLogSleep}
                disabled={!sleepHours}
                activeOpacity={0.8}
              >
                <Text style={styles.logBtnText}>Log Sleep</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Mood Modal */}
      <Modal
        visible={activeModal === 'mood'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalSheet} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>😊 Log Mood</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Mood Score (1-10)</Text>
              <View style={styles.moodRow}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.moodBtn,
                      moodValue === String(n) && styles.moodBtnActive,
                    ]}
                    onPress={() => setMoodValue(String(n))}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.moodBtnText,
                        moodValue === String(n) && styles.moodBtnTextActive,
                      ]}
                    >
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.logBtn, !moodValue && styles.logBtnDisabled]}
                onPress={handleLogMood}
                disabled={!moodValue}
                activeOpacity={0.8}
              >
                <Text style={styles.logBtnText}>Log Mood</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  greetingWrap: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  date: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}22`,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: `${Colors.warning}44`,
    gap: Spacing.xs,
  },
  streakEmoji: { fontSize: 16 },
  streakNum: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.warning,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalSheet: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  closeIcon: {
    fontSize: Typography.sizes.md,
    color: Colors.text.muted,
    fontWeight: Typography.weights.bold,
    padding: Spacing.xs,
  },
  modalBody: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    minHeight: 44,
  },
  logBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  logBtnDisabled: { opacity: 0.45 },
  logBtnText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  moodBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}22`,
  },
  moodBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  moodBtnTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});

export default Dashboard;
