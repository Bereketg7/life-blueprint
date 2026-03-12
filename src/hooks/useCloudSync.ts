import { useCallback } from 'react';
import { useSyncContext } from '../context/SyncContext';
import { SyncJob } from '../types';

export function useCloudSync() {
  const { enqueueMutation, forceSync, isSyncing } = useSyncContext();

  const syncCreate = useCallback(
    (collection: string, data: any) => {
      enqueueMutation('create', collection, data);
    },
    [enqueueMutation]
  );

  const syncUpdate = useCallback(
    (collection: string, data: any) => {
      enqueueMutation('update', collection, data);
    },
    [enqueueMutation]
  );

  const syncDelete = useCallback(
    (collection: string, id: string) => {
      enqueueMutation('delete', collection, { id });
    },
    [enqueueMutation]
  );

  return { syncCreate, syncUpdate, syncDelete, forceSync, isSyncing };
}
