import React from 'react';
import { UserProvider } from './context/UserContext';
import { PlanProvider } from './context/PlanContext';
import { HealthProvider } from './context/HealthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { GameificationProvider } from './context/GameContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
    return (
        <ErrorBoundary>
            <AnalyticsProvider>
                <ThemeProvider>
                    <UserProvider>
                        <PlanProvider>
                            <HealthProvider>
                                <GameificationProvider userId="current_user">
                                    <ErrorBoundary>
                                        <RootNavigator />
                                    </ErrorBoundary>
                                </GameificationProvider>
                            </HealthProvider>
                        </PlanProvider>
                    </UserProvider>
                </ThemeProvider>
            </AnalyticsProvider>
        </ErrorBoundary>
    );
};

export default App;
