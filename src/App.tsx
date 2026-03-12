import React from 'react';
import { UserProvider } from './context/UserContext';
import { PlanProvider } from './context/PlanContext';
import { HealthProvider } from './context/HealthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { GameificationProvider } from './context/GameContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
    return (
        <AnalyticsProvider>
            <ThemeProvider>
                <UserProvider>
                    <PlanProvider>
                        <HealthProvider>
                            <GameificationProvider userId="current_user">
                                <RootNavigator />
                            </GameificationProvider>
                        </HealthProvider>
                    </PlanProvider>
                </UserProvider>
            </ThemeProvider>
        </AnalyticsProvider>
    );
};

export default App;
