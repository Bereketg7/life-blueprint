import React from 'react';
import { StatusBar } from 'react-native';
import { UserProvider } from './context/UserContext';
import { PlanProvider } from './context/PlanContext';
import { HealthProvider } from './context/HealthContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <UserProvider>
      <PlanProvider>
        <HealthProvider>
          <StatusBar />
          <RootNavigator />
        </HealthProvider>
      </PlanProvider>
    </UserProvider>
  );
};

export default App;
