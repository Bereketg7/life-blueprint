import { useState, useCallback } from 'react';
import { HealthReport, ActivityLog, NutritionLog, SleepLog, MentalHealthLog } from '../types';
import { generateWeeklyReport } from '../services/reports/weeklyReport';
import { generateMonthlyReport } from '../services/reports/monthlyReport';
import { generateQuarterlyReport } from '../services/reports/quarterlyReport';
import { reportToHTML, generatePDF } from '../services/reports/pdfGenerator';
import { sendReportEmail } from '../services/reports/emailService';

export function useReports(userId: string) {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(false);

  const generateWeekly = useCallback(
    (
      activityLogs: ActivityLog[],
      nutritionLogs: NutritionLog[],
      sleepLogs: SleepLog[],
      moodLogs: MentalHealthLog[]
    ) => {
      const report = generateWeeklyReport(userId, activityLogs, nutritionLogs, sleepLogs, moodLogs);
      setReports((prev) => [report, ...prev]);
      return report;
    },
    [userId]
  );

  const generateMonthly = useCallback(
    (
      activityLogs: ActivityLog[],
      nutritionLogs: NutritionLog[],
      sleepLogs: SleepLog[],
      moodLogs: MentalHealthLog[]
    ) => {
      const report = generateMonthlyReport(userId, activityLogs, nutritionLogs, sleepLogs, moodLogs);
      setReports((prev) => [report, ...prev]);
      return report;
    },
    [userId]
  );

  const generateQuarterly = useCallback(
    (
      activityLogs: ActivityLog[],
      nutritionLogs: NutritionLog[],
      sleepLogs: SleepLog[],
      moodLogs: MentalHealthLog[]
    ) => {
      const report = generateQuarterlyReport(userId, activityLogs, nutritionLogs, sleepLogs, moodLogs);
      setReports((prev) => [report, ...prev]);
      return report;
    },
    [userId]
  );

  const exportPDF = useCallback(async (report: HealthReport) => {
    setLoading(true);
    try {
      const html = reportToHTML(report);
      return await generatePDF(report, html);
    } finally {
      setLoading(false);
    }
  }, []);

  const emailReport = useCallback(
    async (report: HealthReport, recipientEmail: string) => {
      setLoading(true);
      try {
        const pdfResult = await exportPDF(report);
        return await sendReportEmail(recipientEmail, report.id, pdfResult.filename);
      } finally {
        setLoading(false);
      }
    },
    [exportPDF]
  );

  return {
    reports,
    loading,
    generateWeekly,
    generateMonthly,
    generateQuarterly,
    exportPDF,
    emailReport,
  };
}
