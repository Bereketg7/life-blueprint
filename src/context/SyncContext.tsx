import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { SyncJob } from '../types';
import { enqueueSyncJob, getPendingJobs, getFailedJobs, retryFailedJobs, flushQueue } from '../services/backend/syncManager';

interface SyncContextType {
  pendingCount: number;
  failedCount: number;
  isSyncing: boolean;
  enqueueMutation: (action: SyncJob['action'], collection: string, data: any) => void;
  retryFailed: () => void;
  forceSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshCounts = useCallback(() => {
    setPendingCount(getPendingJobs().length);
    setFailedCount(getFailedJobs().length);
  }, []);

  const enqueueMutation = useCallback(
    (action: SyncJob['action'], collection: string, data: any) => {
      enqueueSyncJob(action, collection, data);
      refreshCounts();
    },
    [refreshCounts]
  );

  const retryFailed = useCallback(() => {
    retryFailedJobs();
    refreshCounts();
  }, [refreshCounts]);

  const forceSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await flushQueue();
    } finally {
      setIsSyncing(false);
      refreshCounts();
    }
  }, [refreshCounts]);

  return (
    <SyncContext.Provider
      value={{ pendingCount, failedCount, isSyncing, enqueueMutation, retryFailed, forceSync }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useSyncContext must be used within a SyncProvider');
  return context;
};
