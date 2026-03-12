// Monthly report template
import { HealthReport, ActivityLog, NutritionLog, SleepLog, MentalHealthLog } from '../../types';
import { generateReport } from './reportGenerator';

export function generateMonthlyReport(
  userId: string,
  activityLogs: ActivityLog[],
  nutritionLogs: NutritionLog[],
  sleepLogs: SleepLog[],
  moodLogs: MentalHealthLog[]
): HealthReport {
  const end = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const start = startDate.toISOString().split('T')[0];

  return generateReport(userId, 'monthly', start, end, activityLogs, nutritionLogs, sleepLogs, moodLogs);
}

export function formatMonthlyReportText(report: HealthReport): string {
  return `
📊 MONTHLY HEALTH REPORT
Period: ${report.period.start} → ${report.period.end}

📈 METRICS
• Total workouts: ${report.metrics.totalActivity}
• Avg. daily calories: ${report.metrics.avgCalories} kcal
• Avg. sleep: ${report.metrics.avgSleep} hrs/night
• Avg. mood: ${report.metrics.avgMood}/10

💡 INSIGHTS
${report.insights.map((i) => `• ${i}`).join('\n') || '• Great month overall!'}

✅ RECOMMENDATIONS FOR NEXT MONTH
${report.recommendations.map((r) => `• ${r}`).join('\n') || '• Keep up the excellent work!'}
`.trim();
}
