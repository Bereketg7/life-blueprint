// Root Navigator code...

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from '../components/Onboarding/OnboardingScreen';
import AtAGlanceDashboard from '../components/Dashboard/AtAGlanceDashboard';

const RootNavigator = () => {
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    return (
        <NavigationContainer>
            {onboardingComplete ? (
                <AtAGlanceDashboard />
            ) : (
                <OnboardingScreen onComplete={() => setOnboardingComplete(true)} />
            )}
        </NavigationContainer>
    );
};

export default RootNavigator;
