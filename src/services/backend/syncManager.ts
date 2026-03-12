import { SyncJob, SyncQueue as SyncQueueType } from '../../types';

// ─── Persistence helpers (AsyncStorage-compatible interface) ───────────────────
// In production wire this to @react-native-async-storage/async-storage.
// We use a module-level variable so the mock survives across calls within a session.

const _store: Record<string, string> = {};
const AsyncStorage = {
  getItem: async (key: string): Promise<string | null> => _store[key] ?? null,
  setItem: async (key: string, value: string): Promise<void> => { _store[key] = value; },
};

const QUEUE_STORAGE_KEY = 'sync_queue';

// ─── Backoff ───────────────────────────────────────────────────────────────────

function backoffDelay(retryCount: number): number {
  return Math.min(1000 * Math.pow(2, retryCount), 30_000);
}

// ─── SyncQueue class ───────────────────────────────────────────────────────────

export class SyncQueue {
  private queue: SyncQueueType = {
    jobs: [],
    isProcessing: false,
    lastProcessedAt: null,
  };

  private processor: ((job: SyncJob) => Promise<void>) | null = null;

  constructor(processor?: (job: SyncJob) => Promise<void>) {
    if (processor) this.processor = processor;
    this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw) as SyncQueueType;
        // Reset any jobs stuck in 'processing' back to 'pending' after a crash
        this.queue.jobs = this.queue.jobs.map((job) =>
          job.status === 'processing' ? { ...job, status: 'pending' } : job
        );
      }
    } catch {
      // Ignore parse errors; start fresh
    }
  }

  private async persist(): Promise<void> {
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
  }

  async enqueue(
    jobData: Omit<SyncJob, 'id' | 'status' | 'retryCount' | 'createdAt'>
  ): Promise<SyncJob> {
    const job: SyncJob = {
      ...jobData,
      id: `sync_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.queue.jobs.push(job);
    await this.persist();
    return job;
  }

  async processQueue(): Promise<void> {
    if (this.queue.isProcessing || !this.processor) return;

    this.queue.isProcessing = true;
    await this.persist();

    const pending = this.queue.jobs.filter((j) => j.status === 'pending');

    for (const job of pending) {
      job.status = 'processing';
      job.lastAttemptAt = new Date().toISOString();
      await this.persist();

      try {
        await this.processor(job);
        job.status = 'completed';
      } catch (err) {
        job.status = 'failed';
        job.retryCount += 1;
        job.error = err instanceof Error ? err.message : String(err);
      }
      await this.persist();
    }

    this.queue.isProcessing = false;
    this.queue.lastProcessedAt = new Date().toISOString();
    await this.persist();
  }

  async retryFailed(): Promise<void> {
    const failedJobs = this.queue.jobs.filter((j) => j.status === 'failed');
    if (failedJobs.length === 0) return;

    for (const job of failedJobs) {
      const delay = backoffDelay(job.retryCount);
      await new Promise((res) => setTimeout(res, delay));
      job.status = 'pending';
    }
    await this.persist();
    await this.processQueue();
  }

  getQueue(): SyncQueueType {
    return { ...this.queue, jobs: [...this.queue.jobs] };
  }

  getPendingCount(): number {
    return this.queue.jobs.filter((j) => j.status === 'pending' || j.status === 'failed').length;
  }

  clearCompleted(): void {
    this.queue.jobs = this.queue.jobs.filter((j) => j.status !== 'completed');
    this.persist();
  }
}

// ─── Default singleton instance ────────────────────────────────────────────────

export const defaultSyncQueue = new SyncQueue();
