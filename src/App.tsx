// App component code...

import React from 'react';
import { UserProvider } from './context/UserContext';
import { PlanProvider } from './context/PlanContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
    return (
        <UserProvider>
            <PlanProvider>
                <RootNavigator />
            </PlanProvider>
        </UserProvider>
    );
};

export default App;
