import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from '../components/Onboarding/OnboardingScreen';
import AtAGlanceDashboard from '../components/Dashboard/AtAGlanceDashboard';
import { UserProfile } from '../types';

const RootNavigator = () => {
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [userProfile, setUserProfile] = useState<Partial<UserProfile>>();

    const handleOnboardingComplete = (profile: Partial<UserProfile>) => {
        setUserProfile(profile);
        setOnboardingComplete(true);
    };

    const noop = () => {};

    return (
        <NavigationContainer>
            {onboardingComplete ? (
                <AtAGlanceDashboard
                    userProfile={userProfile as UserProfile | undefined}
                    onLogActivity={noop}
                    onLogMeal={noop}
                    onLogSleep={noop}
                    onLogMood={noop}
                />
            ) : (
                <OnboardingScreen onComplete={handleOnboardingComplete} />
            )}
        </NavigationContainer>
    );
};

export default RootNavigator;
