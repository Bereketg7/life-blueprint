import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { useHealth } from '../context/HealthContext';
import { colors, typography, spacing, borderRadius, shadow } from '../styles/theme';
import { UserProfile, WearableDevice } from '../types';
import { useWearableSync } from '../hooks/useWearableSync';

const StatBox = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const { userProfile, setUserProfile, todayActivity, todaySleep, streakData } = useHealth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const userId = userProfile?.userId ?? 'guest';
  const weightKg = userProfile?.weight ?? 70;
  const { devices, syncLogs, syncing, connectDevice, syncNow, disconnectDevice } = useWearableSync(userId, weightKg);

  // Editable profile state mirrors the saved profile
  const [editHeight, setEditHeight] = useState(userProfile?.height.toString() ?? '');
  const [editWeight, setEditWeight] = useState(userProfile?.weight.toString() ?? '');
  const [editSleepGoal, setEditSleepGoal] = useState(userProfile?.sleepGoal.toString() ?? '');
  const [editCalorieGoal, setEditCalorieGoal] = useState(userProfile?.calorieGoal.toString() ?? '');

  const openEdit = () => {
    setEditHeight(userProfile?.height.toString() ?? '');
    setEditWeight(userProfile?.weight.toString() ?? '');
    setEditSleepGoal(userProfile?.sleepGoal.toString() ?? '');
    setEditCalorieGoal(userProfile?.calorieGoal.toString() ?? '');
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      height: parseFloat(editHeight) || userProfile.height,
      weight: parseFloat(editWeight) || userProfile.weight,
      sleepGoal: parseFloat(editSleepGoal) || userProfile.sleepGoal,
      calorieGoal: parseInt(editCalorieGoal, 10) || userProfile.calorieGoal,
      updatedAt: new Date().toISOString(),
    };
    setUserProfile(updated);
    setEditModalVisible(false);
  };

  const totalSleepHours = todaySleep ? todaySleep.duration : 0;
  const currentStreak = streakData?.currentStreak ?? 0;

  const displayName = userProfile ? `User ${userProfile.userId.slice(0, 6)}` : 'Guest';

  const getGoalsLabel = (profile: UserProfile): string => {
    const goals = profile.primaryGoals?.length ? profile.primaryGoals : [profile.primaryGoal];
    return goals.map(g => g.replace(/-/g, ' ')).join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Profile</Text>

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          {userProfile && (
            <Text style={styles.subName}>
              {userProfile.fitnessLevel} · {getGoalsLabel(userProfile)}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <StatBox label="Workouts Today" value={todayActivity.length} />
          <View style={styles.statDivider} />
          <StatBox label="Sleep (h)" value={totalSleepHours.toFixed(1)} />
          <View style={styles.statDivider} />
          <StatBox label="Streak" value={`${currentStreak}🔥`} />
        </View>

        {/* Body metrics */}
        {userProfile && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Body Metrics</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Age</Text>
              <Text style={styles.metricValue}>{userProfile.age} yrs</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Height</Text>
              <Text style={styles.metricValue}>{userProfile.height} cm</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Weight</Text>
              <Text style={styles.metricValue}>{userProfile.weight} kg</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Activity Level</Text>
              <Text style={styles.metricValue}>{userProfile.activityLevel.replace(/-/g, ' ')}</Text>
            </View>
          </View>
        )}

        {/* Goals */}
        {userProfile && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Calories</Text>
              <Text style={styles.metricValue}>{userProfile.calorieGoal} kcal</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Sleep</Text>
              <Text style={styles.metricValue}>{userProfile.sleepGoal}h</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Water</Text>
              <Text style={styles.metricValue}>{userProfile.waterGoal} ml</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Protein</Text>
              <Text style={styles.metricValue}>{userProfile.proteinGoal}g</Text>
            </View>
          </View>
        )}

        {/* Edit profile button */}
        <TouchableOpacity style={styles.editButton} onPress={openEdit}>
          <Text style={styles.editButtonText}>✏️  Edit Profile</Text>
        </TouchableOpacity>

        {/* Wearables */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔗 Connected Devices</Text>
          <Text style={styles.wearableSubtitle}>
            Auto-sync steps, sleep & workouts — no manual entry needed
          </Text>

          {/* Connect buttons */}
          <View style={styles.wearableBtnRow}>
            {Platform.OS === 'ios' && !devices.some(d => d.type === 'apple_health') && (
              <TouchableOpacity
                style={styles.wearableConnectBtn}
                onPress={() => connectDevice('apple_health', 'Apple Health')}
              >
                <Text style={styles.wearableConnectBtnText}>+ Connect Apple Health</Text>
              </TouchableOpacity>
            )}
            {Platform.OS === 'android' && !devices.some(d => d.type === 'google_fit') && (
              <TouchableOpacity
                style={styles.wearableConnectBtn}
                onPress={() => connectDevice('google_fit', 'Google Fit')}
              >
                <Text style={styles.wearableConnectBtnText}>+ Connect Google Fit</Text>
              </TouchableOpacity>
            )}
            {!devices.some(d => d.type === 'fitbit') && (
              <TouchableOpacity
                style={styles.wearableConnectBtn}
                onPress={() => connectDevice('fitbit', 'Fitbit')}
              >
                <Text style={styles.wearableConnectBtnText}>+ Connect Fitbit</Text>
              </TouchableOpacity>
            )}
            {!devices.some(d => d.type === 'garmin') && (
              <TouchableOpacity
                style={styles.wearableConnectBtn}
                onPress={() => connectDevice('garmin', 'Garmin')}
              >
                <Text style={styles.wearableConnectBtnText}>+ Connect Garmin</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Connected device list */}
          {devices.map((device: WearableDevice) => {
            const lastSyncLabel = device.lastSync
              ? new Date(device.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Never';
            const lastLog = syncLogs.find(l => l.deviceId === device.id);
            return (
              <View key={device.id} style={styles.deviceRow}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceStatus}>
                    {device.status === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
                    {' · '}Last sync: {lastSyncLabel}
                    {lastLog ? ` · ${lastLog.dataImported} data points` : ''}
                  </Text>
                </View>
                <View style={styles.deviceActions}>
                  <TouchableOpacity
                    style={[styles.syncBtn, syncing && styles.syncBtnDisabled]}
                    onPress={() => syncNow(device)}
                    disabled={syncing}
                  >
                    <Text style={styles.syncBtnText}>{syncing ? '⟳' : '↻ Sync'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.disconnectBtn}
                    onPress={() => disconnectDevice(device.id)}
                  >
                    <Text style={styles.disconnectBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {devices.length === 0 && (
            <Text style={styles.wearableEmptyText}>
              No devices connected. Connect a wearable to auto-import your health data.
            </Text>
          )}
        </View>

        {/* App settings */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>🔔 Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
          <View style={[styles.settingRow, styles.settingBorder]}>
            <Text style={styles.settingLabel}>🎨 Theme</Text>
            <Text style={styles.settingHint}>Light</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>ℹ️  About</Text>
            <Text style={styles.settingHint}>v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.fieldLabel}>Height (cm)</Text>
            <TextInput
              style={styles.fieldInput}
              value={editHeight}
              onChangeText={setEditHeight}
              keyboardType="numeric"
              placeholder="e.g. 175"
            />
            <Text style={styles.fieldLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.fieldInput}
              value={editWeight}
              onChangeText={setEditWeight}
              keyboardType="numeric"
              placeholder="e.g. 70"
            />
            <Text style={styles.fieldLabel}>Sleep Goal (hours)</Text>
            <TextInput
              style={styles.fieldInput}
              value={editSleepGoal}
              onChangeText={setEditSleepGoal}
              keyboardType="numeric"
              placeholder="e.g. 8"
            />
            <Text style={styles.fieldLabel}>Calorie Goal (kcal)</Text>
            <TextInput
              style={styles.fieldInput}
              value={editCalorieGoal}
              onChangeText={setEditCalorieGoal}
              keyboardType="numeric"
              placeholder="e.g. 2000"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  screenTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}22`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  displayName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  subName: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  metricValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  editButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.surface,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  settingLabel: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
  },
  settingHint: {
    fontSize: typography.size.sm,
    color: colors.text.light,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  modalContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  fieldLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  fieldInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.surface,
  },
  cancelButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cancelButtonText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },
  wearableSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  wearableBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  wearableConnectBtn: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  wearableConnectBtnText: {
    fontSize: typography.size.xs,
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deviceInfo: { flex: 1 },
  deviceName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  deviceStatus: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  deviceActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  syncBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  syncBtnDisabled: { backgroundColor: colors.disabled },
  syncBtnText: {
    fontSize: typography.size.xs,
    color: colors.surface,
    fontWeight: typography.weight.semibold,
  },
  disconnectBtn: {
    backgroundColor: `${colors.error}15`,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  disconnectBtnText: {
    fontSize: typography.size.xs,
    color: colors.error,
    fontWeight: typography.weight.bold,
  },
  wearableEmptyText: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    textAlign: 'center',
    paddingVertical: spacing.md,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
