import React, { useState } from 'react';
import {
  View,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import AtAGlanceDashboard from '../components/Dashboard/AtAGlanceDashboard';
import ActivityTracker from '../components/Tracking/ActivityTracker';
import SleepTracker from '../components/Tracking/SleepTracker';
import NutritionLogger from '../components/Tracking/NutritionLogger';
import MoodTracker from '../components/Tracking/MoodTracker';
import useTracking from '../hooks/useTracking';
import useRewards from '../hooks/useRewards';
import { useHealth } from '../context/HealthContext';
import { colors, spacing } from '../styles/theme';

type ActiveModal = 'activity' | 'sleep' | 'nutrition' | 'mood' | null;

const HomeScreen = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const {
    userProfile,
    todayActivity,
    todaySleep,
    todayNutrition,
    todayMood,
    consistencyScore,
  } = useHealth();

  const userId = userProfile?.userId ?? 'guest';
  const { logActivity, logSleep, logNutrition, logMood } = useTracking(userId);
  const { streakData } = useRewards();

  const closeModal = () => setActiveModal(null);

  return (
    <SafeAreaView style={styles.container}>
      <AtAGlanceDashboard
        userName={userProfile ? `User` : undefined}
        userProfile={userProfile ?? undefined}
        todayActivity={todayActivity}
        todaySleep={todaySleep ?? undefined}
        todayNutrition={todayNutrition}
        todayMood={todayMood ?? undefined}
        streakData={streakData ?? undefined}
        consistencyScore={consistencyScore ?? undefined}
        onLogActivity={() => setActiveModal('activity')}
        onLogMeal={() => setActiveModal('nutrition')}
        onLogSleep={() => setActiveModal('sleep')}
        onLogMood={() => setActiveModal('mood')}
      />

      {/* Activity Modal */}
      <Modal visible={activeModal === 'activity'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ActivityTracker
            userId={userId}
            userWeightKg={userProfile?.weight}
            onSave={async (data) => {
              await logActivity(data);
              closeModal();
            }}
            onCancel={closeModal}
          />
        </SafeAreaView>
      </Modal>

      {/* Sleep Modal */}
      <Modal visible={activeModal === 'sleep'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <SleepTracker
            userId={userId}
            onSave={async data => {
              await logSleep(data);
              closeModal();
            }}
            onCancel={closeModal}
          />
        </SafeAreaView>
      </Modal>

      {/* Nutrition Modal */}
      <Modal visible={activeModal === 'nutrition'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <NutritionLogger
            userId={userId}
            onSave={async data => {
              await logNutrition(data);
              closeModal();
            }}
            onCancel={closeModal}
          />
        </SafeAreaView>
      </Modal>

      {/* Mood Modal */}
      <Modal visible={activeModal === 'mood'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <MoodTracker
            userId={userId}
            onSave={async data => {
              await logMood(data);
              closeModal();
            }}
            onCancel={closeModal}
          />
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeText: {
    fontSize: 18,
    color: colors.text.secondary,
    fontWeight: '600',
  },
});

export default HomeScreen;