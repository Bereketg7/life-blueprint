// Plan Context code...

import React, { createContext, useContext, useState } from 'react';

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
    const [plan, setPlan] = useState(null);
    return <PlanContext.Provider value={{ plan, setPlan }}>{children}</PlanContext.Provider>
};

export const usePlan = () => useContext(PlanContext);
