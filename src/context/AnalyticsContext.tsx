import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { configureAnalytics, trackEvent, Events, measureStartupTime } from '../services/monitoring';

interface AnalyticsContextValue {
  trackEvent: typeof trackEvent;
  Events: typeof Events;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    configureAnalytics({ enabled: true, crashReporting: true });
    const stopMeasure = measureStartupTime();
    stopMeasure();
    trackEvent(Events.APP_OPENED);
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackEvent, Events }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return ctx;
}
