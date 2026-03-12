import React from 'react';
import { StatusBar } from 'react-native';
import { UserProvider } from './context/UserContext';
import { PlanProvider } from './context/PlanContext';
import { TrackingProvider } from './context/TrackingContext';
import { AuthProvider } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SyncProvider>
          <UserProvider>
            <PlanProvider>
              <TrackingProvider>
                <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
                <RootNavigator />
              </TrackingProvider>
            </PlanProvider>
          </UserProvider>
        </SyncProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
