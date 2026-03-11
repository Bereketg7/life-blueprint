import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../components/Onboarding/OnboardingScreen';

type AuthStackParamList = {
  Onboarding: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  onComplete: () => void;
}

const AuthNavigator = ({ onComplete }: AuthNavigatorProps) => {
  const OnboardingWrapper = () => <OnboardingScreen onComplete={onComplete} />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingWrapper} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
