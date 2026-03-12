// Weekly report template
import { HealthReport, ActivityLog, NutritionLog, SleepLog, MentalHealthLog } from '../../types';
import { generateReport } from './reportGenerator';

export function generateWeeklyReport(
  userId: string,
  activityLogs: ActivityLog[],
  nutritionLogs: NutritionLog[],
  sleepLogs: SleepLog[],
  moodLogs: MentalHealthLog[]
): HealthReport {
  const end = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const start = startDate.toISOString().split('T')[0];

  return generateReport(userId, 'weekly', start, end, activityLogs, nutritionLogs, sleepLogs, moodLogs);
}

export function formatWeeklyReportText(report: HealthReport): string {
  return `
📊 WEEKLY HEALTH REPORT
Period: ${report.period.start} → ${report.period.end}

📈 METRICS
• Workouts completed: ${report.metrics.totalActivity}
• Avg. daily calories: ${report.metrics.avgCalories} kcal
• Avg. sleep: ${report.metrics.avgSleep} hrs
• Avg. mood: ${report.metrics.avgMood}/10

💡 INSIGHTS
${report.insights.map((i) => `• ${i}`).join('\n')}

✅ RECOMMENDATIONS
${report.recommendations.map((r) => `• ${r}`).join('\n')}
`.trim();
}
