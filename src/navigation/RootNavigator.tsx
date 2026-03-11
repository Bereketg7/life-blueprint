import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import AppNavigator from './AppNavigator';
import OnboardingScreen from '../components/Onboarding/OnboardingScreen';
import { Colors } from '../styles/theme';

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const RootNavigator = () => {
  const { profile, loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
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
