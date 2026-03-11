import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing } from '../styles/theme';
import AtAGlanceDashboard from '../components/Dashboard/AtAGlanceDashboard';
import AwarenessView from '../components/Awareness/AwarenessView';
import AchievementCenter from '../components/Gamification/AchievementCenter';
import NutritionLogger from '../components/Tracking/NutritionLogger';
import SleepTracker from '../components/Tracking/SleepTracker';
import MoodTracker from '../components/Tracking/MoodTracker';
import SymptomLogger from '../components/Tracking/SymptomLogger';
import FriendsList from '../components/Community/FriendsList';
import GroupsList from '../components/Community/GroupsList';
import SuccessStories from '../components/Community/SuccessStories';
import CommunityRecipes from '../components/Community/CommunityRecipes';

const TrackingScreen = () => (
  <ScrollView
    style={styles.screenContainer}
    contentContainerStyle={styles.screenContent}
    showsVerticalScrollIndicator={false}
  >
    <NutritionLogger />
    <SleepTracker />
    <MoodTracker />
    <SymptomLogger />
  </ScrollView>
);

const CommunityScreen = () => (
  <ScrollView
    style={styles.screenContainer}
    contentContainerStyle={styles.screenContent}
    showsVerticalScrollIndicator={false}
  >
    <FriendsList />
    <GroupsList />
    <SuccessStories />
    <CommunityRecipes />
  </ScrollView>
);

type TabId = 'home' | 'track' | 'awareness' | 'rewards' | 'community';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  component: React.ComponentType;
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: '🏠', component: AtAGlanceDashboard },
  { id: 'track', label: 'Track', icon: '📊', component: TrackingScreen },
  { id: 'awareness', label: 'Awareness', icon: '💡', component: AwarenessView },
  { id: 'rewards', label: 'Rewards', icon: '🏆', component: AchievementCenter },
  { id: 'community', label: 'Community', icon: '👥', component: CommunityScreen },
];

const BottomTabNavigator = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component ?? AtAGlanceDashboard;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActiveComponent />
      </View>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContent: {
    paddingBottom: Spacing.lg,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    position: 'relative',
  },
  tabIcon: {
    fontSize: Typography.sizes.xl,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    fontWeight: Typography.weights.medium,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
});

export default BottomTabNavigator;
