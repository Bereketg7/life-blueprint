import React from 'react';
import { StatusBar } from 'react-native';
import { UserProvider } from './context/UserContext';
import { PlanProvider } from './context/PlanContext';
import { TrackingProvider } from './context/TrackingContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <UserProvider>
      <PlanProvider>
        <TrackingProvider>
          <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
          <RootNavigator />
        </TrackingProvider>
      </PlanProvider>
    </UserProvider>
  );
};

export default App;
