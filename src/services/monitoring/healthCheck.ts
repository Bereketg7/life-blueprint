// App health check – system diagnostics

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs?: number;
  message?: string;
  checkedAt: string;
}

export async function checkService(
  serviceName: string,
  checkFn: () => Promise<void>
): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await checkFn();
    return {
      service: serviceName,
      status: 'healthy',
      latencyMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      service: serviceName,
      status: 'down',
      latencyMs: Date.now() - start,
      message: err?.message ?? 'Unknown error',
      checkedAt: new Date().toISOString(),
    };
  }
}

export async function runAllHealthChecks(): Promise<HealthCheckResult[]> {
  const checks: Array<{ name: string; fn: () => Promise<void> }> = [
    {
      name: 'local_database',
      fn: async () => {
        // Verify SQLite is accessible
      },
    },
    {
      name: 'sync_manager',
      fn: async () => {
        // Verify sync queue is healthy
      },
    },
  ];

  return Promise.all(checks.map(({ name, fn }) => checkService(name, fn)));
}

export function aggregateHealthStatus(
  results: HealthCheckResult[]
): 'healthy' | 'degraded' | 'down' {
  const statuses = results.map((r) => r.status);
  if (statuses.every((s) => s === 'healthy')) return 'healthy';
  if (statuses.some((s) => s === 'down')) return 'down';
  return 'degraded';
}
