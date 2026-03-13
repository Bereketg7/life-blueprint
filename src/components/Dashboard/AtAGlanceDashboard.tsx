import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  UserProfile,
  ActivityLog,
  SleepLog,
  NutritionLog,
  MentalHealthLog,
  StreakData,
  ConsistencyScore,
} from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';
import { getPersonalizedGreeting, getFirstName } from '../../utils/greetings';

interface Props {
  userName?: string;
  userProfile?: UserProfile;
  todayActivity?: ActivityLog[];
  todaySleep?: SleepLog;
  todayNutrition?: NutritionLog[];
  todayMood?: MentalHealthLog;
  streakData?: StreakData;
  consistencyScore?: ConsistencyScore;
  onLogActivity: () => void;
  onLogMeal: () => void;
  onLogSleep: () => void;
  onLogMood: () => void;
}

const MOOD_EMOJI: Record<number, string> = { 1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' };
const TREND_ICON: Record<string, string> = { improving: '↑', declining: '↓', stable: '→' };
const TREND_COLOR: Record<string, string> = {
  improving: colors.success,
  declining: colors.error,
  stable: colors.warning,
};

const formatDate = (): string =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

const AtAGlanceDashboard = ({
  userName,
  userProfile,
  todayActivity,
  todaySleep,
  todayNutrition,
  todayMood,
  streakData,
  consistencyScore,
  onLogActivity,
  onLogMeal,
  onLogSleep,
  onLogMood,
}: Props) => {
  const firstName = userName ? getFirstName(userName) : 'User';

  const totalSteps = todayActivity?.reduce((s, a) => s + (a.steps ?? 0), 0) ?? 0;
  const totalCaloriesBurned = todayActivity?.reduce((s, a) => s + a.caloriesBurned, 0) ?? 0;
  const totalCaloriesConsumed = todayNutrition?.reduce((s, n) => s + n.calories, 0) ?? 0;
  const sleepHours = todaySleep?.duration ?? 0;
  const moodVal = todayMood?.mood;

  const scoreColor =
    (consistencyScore?.overall ?? 0) >= 70
      ? colors.success
      : (consistencyScore?.overall ?? 0) >= 40
      ? colors.warning
      : colors.error;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getPersonalizedGreeting(firstName)}! 👋</Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          {streakData && streakData.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakFire}>🔥</Text>
              <Text style={styles.streakNum}>{streakData.currentStreak}</Text>
            </View>
          )}
        </View>

        {/* Awareness Score */}
        {consistencyScore && (
          <View style={styles.scoreCard}>
            <View style={styles.scoreLeft}>
              <Text style={styles.scoreLabel}>Wellness Score</Text>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>
                {consistencyScore.overall}
              </Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            <View style={styles.scoreRight}>
              <Text style={[styles.trendBadge, { color: TREND_COLOR[consistencyScore.trend] }]}>
                {TREND_ICON[consistencyScore.trend]} {consistencyScore.trend}
              </Text>
              <View style={styles.miniBarGroup}>
                <MiniBar label="Activity" value={consistencyScore.activity} color={colors.category.activity} />
                <MiniBar label="Sleep" value={consistencyScore.sleep} color={colors.category.sleep} />
                <MiniBar label="Nutrition" value={consistencyScore.nutrition} color={colors.category.nutrition} />
                <MiniBar label="Mental" value={consistencyScore.mental} color={colors.category.mental} />
              </View>
            </View>
          </View>
        )}

        {/* Health Summary Cards */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
          <SummaryCard
            emoji="👟"
            label="Steps"
            value={totalSteps > 0 ? totalSteps.toLocaleString() : '—'}
            subtext="goal: 10,000"
            color={colors.category.activity}
          />
          <SummaryCard
            emoji="😴"
            label="Sleep"
            value={sleepHours > 0 ? `${sleepHours.toFixed(1)}h` : '—'}
            subtext={`goal: ${userProfile?.sleepGoal ?? 8}h`}
            color={colors.category.sleep}
          />
          <SummaryCard
            emoji="🍎"
            label="Calories"
            value={totalCaloriesConsumed > 0 ? `${totalCaloriesConsumed}` : '—'}
            subtext={`goal: ${userProfile?.calorieGoal ?? 2000} kcal`}
            color={colors.category.nutrition}
          />
          <SummaryCard
            emoji="💧"
            label="Water"
            value="—"
            subtext={`goal: ${((userProfile?.waterGoal ?? 2500) / 1000).toFixed(1)}L`}
            color={colors.primary}
          />
          <SummaryCard
            emoji={moodVal ? MOOD_EMOJI[moodVal] : '😐'}
            label="Mood"
            value={moodVal ? MOOD_EMOJI[moodVal] : '—'}
            subtext="today's mood"
            color={colors.secondary}
          />
          <SummaryCard
            emoji="🔥"
            label="Burned"
            value={totalCaloriesBurned > 0 ? `${totalCaloriesBurned}` : '—'}
            subtext="kcal burned"
            color={colors.warning}
          />
        </ScrollView>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction emoji="🏃" label="Activity" color={colors.category.activity} onPress={onLogActivity} />
          <QuickAction emoji="🍎" label="Meal" color={colors.category.nutrition} onPress={onLogMeal} />
          <QuickAction emoji="😴" label="Sleep" color={colors.category.sleep} onPress={onLogSleep} />
          <QuickAction emoji="🧠" label="Mood" color={colors.category.mental} onPress={onLogMood} />
        </View>

        {/* Streak & Achievements */}
        {streakData && (
          <View style={[styles.card, styles.streakCard]}>
            <View style={styles.streakHeader}>
              <Text style={styles.streakTitle}>🔥 Current Streak</Text>
              <Text style={styles.streakDays}>{streakData.currentStreak} days</Text>
            </View>
            <View style={styles.streakCalendar}>
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dateStr = d.toISOString().split('T')[0];
                const lastLog = streakData.lastLogDate;
                const filled = lastLog >= dateStr && i >= 7 - streakData.currentStreak;
                return (
                  <View key={i} style={[styles.calDot, filled && styles.calDotFilled]} />
                );
              })}
            </View>
            <Text style={styles.bestStreakText}>
              🏆 Best: {streakData.longestStreak} days · Total logged: {streakData.totalDaysLogged} days
            </Text>
          </View>
        )}

        {/* Today's Wellness Plan Preview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Today's Plan</Text>
          <PlanItem emoji="🏋️" text="30 min moderate exercise" done={totalCaloriesBurned > 0} />
          <PlanItem emoji="🥗" text="Log all 3 meals" done={(todayNutrition?.length ?? 0) >= 3} />
          <PlanItem emoji="💧" text={`Drink ${((userProfile?.waterGoal ?? 2500) / 1000).toFixed(1)}L water`} done={false} />
          <PlanItem emoji="😴" text={`Get ${userProfile?.sleepGoal ?? 8}h of sleep`} done={sleepHours >= (userProfile?.sleepGoal ?? 8)} />
          <PlanItem emoji="🧘" text="5 min mindfulness" done={(todayMood?.meditationMinutes ?? 0) > 0} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SummaryCard = ({
  emoji, label, value, subtext, color,
}: {
  emoji: string; label: string; value: string; subtext: string; color: string;
}) => (
  <View style={[styles.summaryCard, { borderTopColor: color }]}>
    <Text style={styles.summaryEmoji}>{emoji}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summarySubtext}>{subtext}</Text>
  </View>
);

const QuickAction = ({
  emoji, label, color, onPress,
}: {
  emoji: string; label: string; color: string; onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.quickAction, { borderColor: color }]} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.quickActionEmoji}>{emoji}</Text>
    <Text style={[styles.quickActionLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const MiniBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <View style={styles.miniBarRow}>
    <Text style={styles.miniBarLabel}>{label}</Text>
    <View style={styles.miniBarBg}>
      <View style={[styles.miniBarFill, { width: `${Math.min(value, 100)}%` as any, backgroundColor: color }]} />
    </View>
    <Text style={styles.miniBarVal}>{value}</Text>
  </View>
);

const PlanItem = ({ emoji, text, done }: { emoji: string; text: string; done: boolean }) => (
  <View style={styles.planItem}>
    <Text style={styles.planEmoji}>{emoji}</Text>
    <Text style={[styles.planText, done && styles.planDone]}>{text}</Text>
    {done && <Text style={styles.planCheck}>✓</Text>}
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  date: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  streakBadge: {
    backgroundColor: `${colors.warning}20`,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  streakFire: { fontSize: 20 },
  streakNum: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.warning,
  },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow.md,
  },
  scoreLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xl,
    minWidth: 60,
  },
  scoreLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  scoreNum: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.extrabold,
  },
  scoreMax: {
    fontSize: typography.size.sm,
    color: colors.text.light,
  },
  scoreRight: { flex: 1 },
  trendBadge: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
  },
  miniBarGroup: { gap: spacing.xs },
  miniBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  miniBarLabel: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    width: 50,
  },
  miniBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  miniBarVal: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    width: 26,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  cardScroll: { paddingLeft: spacing.xl, marginBottom: spacing.xl },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    width: 110,
    alignItems: 'center',
    borderTopWidth: 3,
    ...shadow.sm,
  },
  summaryEmoji: { fontSize: 24, marginBottom: spacing.sm },
  summaryValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs,
  },
  summarySubtext: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickAction: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    ...shadow.sm,
  },
  quickActionEmoji: { fontSize: 28, marginBottom: spacing.sm },
  quickActionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow.sm,
  },
  cardTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  streakCard: {},
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  streakTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  streakDays: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.extrabold,
    color: colors.warning,
  },
  streakCalendar: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  calDot: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.disabled,
  },
  calDotFilled: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  bestStreakText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  planEmoji: { fontSize: 18, marginRight: spacing.md, width: 28 },
  planText: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },
  planDone: {
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
  planCheck: {
    fontSize: typography.size.md,
    color: colors.success,
    fontWeight: typography.weight.bold,
  },
});

export default AtAGlanceDashboard;
