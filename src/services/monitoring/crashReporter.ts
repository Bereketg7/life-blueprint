// Crash reporter – Sentry integration stub
import { CrashReport } from '../../types';

let _dsn = '';
let _appVersion = '1.0.0';
const _reports: CrashReport[] = [];

export function initCrashReporter(dsn: string, appVersion: string): void {
  _dsn = dsn;
  _appVersion = appVersion;
  console.log('[CrashReporter] Initialised', { dsn, appVersion });
}

export function reportCrash(
  userId: string,
  error: Error,
  deviceInfo: any = {}
): CrashReport {
  const report: CrashReport = {
    id: `crash_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    userId,
    error: error.message,
    stackTrace: error.stack ?? '',
    timestamp: new Date().toISOString(),
    appVersion: _appVersion,
    deviceInfo,
  };

  _reports.push(report);

  if (_dsn) {
    // In production, send to Sentry: Sentry.captureException(error)
    console.error('[CrashReporter] Crash captured:', report.id, report.error);
  }

  return report;
}

export function getCrashReports(): CrashReport[] {
  return [..._reports];
}

export function setUserContext(userId: string, email?: string): void {
  console.log('[CrashReporter] User context set:', { userId, email });
}

export function addBreadcrumb(message: string, category: string): void {
  console.log('[CrashReporter] Breadcrumb:', { message, category });
}
