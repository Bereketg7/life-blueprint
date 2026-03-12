// Performance monitor – speed & battery tracking

export interface PerformanceMetric {
  name: string;
  duration: number; // ms
  timestamp: string;
  metadata?: Record<string, any>;
}

const _metrics: PerformanceMetric[] = [];
const _timers: Map<string, number> = new Map();

export function startTimer(name: string): void {
  _timers.set(name, Date.now());
}

export function endTimer(name: string, metadata?: Record<string, any>): PerformanceMetric | null {
  const startTime = _timers.get(name);
  if (!startTime) return null;

  const duration = Date.now() - startTime;
  _timers.delete(name);

  const metric: PerformanceMetric = {
    name,
    duration,
    timestamp: new Date().toISOString(),
    metadata,
  };

  _metrics.push(metric);

  if (duration > 3000) {
    console.warn(`[Performance] Slow operation: ${name} took ${duration}ms`);
  }

  return metric;
}

export function getMetrics(): PerformanceMetric[] {
  return [..._metrics];
}

export function getAverageDuration(name: string): number {
  const relevant = _metrics.filter((m) => m.name === name);
  if (relevant.length === 0) return 0;
  return relevant.reduce((s, m) => s + m.duration, 0) / relevant.length;
}

export function clearMetrics(): void {
  _metrics.length = 0;
}

export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  startTimer(name);
  try {
    return await fn();
  } finally {
    endTimer(name, metadata);
  }
}
