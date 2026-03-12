// Offline sync queue – queues mutations when offline and flushes when online
import { SyncJob } from '../../types';
import { createDocument, updateDocument, deleteDocument } from './firestore';

const _queue: SyncJob[] = [];
let _isOnline = true;

export function setOnlineStatus(online: boolean): void {
  _isOnline = online;
  if (online) {
    flushQueue().catch(console.error);
  }
}

export function enqueueSyncJob(
  action: SyncJob['action'],
  collection: string,
  data: any
): SyncJob {
  const job: SyncJob = {
    id: `sync_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    action,
    collection,
    data,
    timestamp: Date.now(),
    status: 'pending',
  };
  _queue.push(job);
  if (_isOnline) {
    flushQueue().catch(console.error);
  }
  return job;
}

export async function flushQueue(): Promise<void> {
  const pending = _queue.filter((j) => j.status === 'pending');
  for (const job of pending) {
    try {
      if (job.action === 'create') {
        await createDocument(job.collection, job.data.id, job.data);
      } else if (job.action === 'update') {
        await updateDocument(job.collection, job.data.id, job.data);
      } else if (job.action === 'delete') {
        await deleteDocument(job.collection, job.data.id);
      }
      job.status = 'synced';
    } catch {
      job.status = 'failed';
    }
  }
}

export function getPendingJobs(): SyncJob[] {
  return _queue.filter((j) => j.status === 'pending');
}

export function getFailedJobs(): SyncJob[] {
  return _queue.filter((j) => j.status === 'failed');
}

export function retryFailedJobs(): void {
  _queue
    .filter((j) => j.status === 'failed')
    .forEach((j) => {
      j.status = 'pending';
    });
  if (_isOnline) {
    flushQueue().catch(console.error);
  }
}
