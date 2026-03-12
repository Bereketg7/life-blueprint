import { HealthReport, ActivityLog, SleepLog, NutritionLog, MentalHealthLog } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

type LogBundle = {
  activity: ActivityLog[];
  sleep: SleepLog[];
  nutrition: NutritionLog[];
  mental: MentalHealthLog[];
};

function getDateRange(period: HealthReport['period']): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  switch (period) {
    case 'weekly':
      start.setDate(start.getDate() - 7);
      break;
    case 'monthly':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'quarterly':
      start.setMonth(start.getMonth() - 3);
      break;
  }
  return { start, end };
}

export function generateReport(
  userId: string,
  period: HealthReport['period'],
  logs: LogBundle,
  achievementNames: string[] = [],
): HealthReport {
  const { start, end } = getDateRange(period);

  const inRange = (date: string) => {
    const d = new Date(date);
    return d >= start && d <= end;
  };

  const periodActivity = logs.activity.filter(l => inRange(l.date));
  const periodSleep = logs.sleep.filter(l => inRange(l.date));
  const periodNutrition = logs.nutrition.filter(l => inRange(l.date));
  const periodMental = logs.mental.filter(l => inRange(l.date));

  const avgSleep = periodSleep.length
    ? periodSleep.reduce((s, l) => s + l.duration, 0) / periodSleep.length
    : 0;

  const totalWorkouts = periodActivity.length;

  const avgCalories = periodNutrition.length
    ? periodNutrition.reduce((s, l) => s + l.calories, 0) / periodNutrition.length
    : 0;

  const avgMood = periodMental.length
    ? periodMental.reduce((s, l) => s + l.mood, 0) / periodMental.length
    : 0;

  return {
    id: generateId(),
    userId,
    period,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    generatedAt: new Date().toISOString(),
    pdfUrl: undefined,
    emailSent: false,
    summaryData: {
      avgSleep: Math.round(avgSleep * 10) / 10,
      totalWorkouts,
      avgCalories: Math.round(avgCalories),
      avgMood: Math.round(avgMood * 10) / 10,
      topAchievements: achievementNames.slice(0, 3),
    },
  };
}

export async function generateAndEmailReport(
  userId: string,
  period: HealthReport['period'],
  logs: LogBundle,
  emailAddress: string,
): Promise<HealthReport> {
  const report = generateReport(userId, period, logs);

  // Mock: In real impl, use a PDF generation library + email service
  void emailAddress;
  const updatedReport: HealthReport = {
    ...report,
    pdfUrl: `https://reports.example.com/${report.id}.pdf`,
    emailSent: true,
  };

  return updatedReport;
}

export function scheduleReportDelivery(
  userId: string,
  period: HealthReport['period'],
  emailAddress: string,
): { userId: string; period: HealthReport['period']; email: string; nextDelivery: string } {
  const next = new Date();
  switch (period) {
    case 'weekly':
      next.setDate(next.getDate() + (7 - next.getDay())); // next Sunday
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1, 1); // 1st of next month
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3, 1);
      break;
  }
  return {
    userId,
    period,
    email: emailAddress,
    nextDelivery: next.toISOString(),
  };
}
