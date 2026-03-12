import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from '../components/Onboarding/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import TrackScreen from '../screens/TrackScreen';
import PlanScreen from '../screens/PlanScreen';
import AwarenessScreen from '../screens/AwarenessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useHealth } from '../context/HealthContext';
import { colors, spacing, typography, borderRadius, shadow } from '../styles/theme';
import { UserProfile } from '../types';

type Tab = 'home' | 'track' | 'plan' | 'awareness' | 'profile';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'track', label: 'Track', icon: '📊' },
  { key: 'plan', label: 'Plan', icon: '📅' },
  { key: 'awareness', label: 'Mind', icon: '🧠' },
  { key: 'profile', label: 'Me', icon: '👤' },
];

const MainApp = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'track':
        return <TrackScreen />;
      case 'plan':
        return <PlanScreen />;
      case 'awareness':
        return <AwarenessScreen />;
      case 'profile':
        return <ProfileScreen />;
    }
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Custom bottom tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.tabIconContainer, isActive && styles.tabIconActive]}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const RootNavigator = () => {
  const { userProfile, setUserProfile } = useHealth();

  const handleOnboardingComplete = (data: Partial<UserProfile> & { name?: string; email?: string }) => {
    const profile: UserProfile = {
      id: data.id ?? Date.now().toString(36),
      userId: data.userId ?? Date.now().toString(36),
      age: data.age ?? 25,
      gender: data.gender ?? 'prefer-not-to-say',
      height: data.height ?? 170,
      weight: data.weight ?? 70,
      activityLevel: data.activityLevel ?? 'moderately-active',
      primaryGoal: data.primaryGoal ?? 'general-wellness',
      secondaryGoals: data.secondaryGoals ?? [],
      healthConditions: data.healthConditions ?? [],
      dietaryRestrictions: data.dietaryRestrictions ?? [],
      fitnessLevel: data.fitnessLevel ?? 'beginner',
      timeAvailablePerDay: data.timeAvailablePerDay ?? 30,
      sleepGoal: data.sleepGoal ?? 8,
      waterGoal: data.waterGoal ?? 2000,
      calorieGoal: data.calorieGoal ?? 2000,
      proteinGoal: data.proteinGoal ?? 150,
      carbGoal: data.carbGoal ?? 200,
      fatGoal: data.fatGoal ?? 65,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserProfile(profile);
  };

  return (
    <NavigationContainer>
      {userProfile ? (
        <MainApp />
      ) : (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...shadow.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabIconActive: {
    backgroundColor: `${colors.primary}18`,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: typography.size.xs,
    color: colors.text.light,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});

export default RootNavigator;

    <NavigationContainer>
      {profile ? (
        <AppNavigator />
      ) : (
        <OnboardingScreen onComplete={() => {}} />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});

export default RootNavigator;
