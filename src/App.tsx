// App component code...

import React from 'react';
import { UserProvider } from './context/UserContext';
import { PlanProvider } from './context/PlanContext';
import { HealthProvider } from './context/HealthContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
    return (
        <UserProvider>
            <PlanProvider>
                <HealthProvider>
                    <RootNavigator />
                </HealthProvider>
            </PlanProvider>
        </UserProvider>
    );
};

export default App;
