// Email service – send reports via email
import { ReportEmail } from '../../types';

const _emailLog: ReportEmail[] = [];

export async function sendReportEmail(
  recipientEmail: string,
  reportId: string,
  pdfUrl: string
): Promise<ReportEmail> {
  const email: ReportEmail = {
    recipientEmail,
    reportId,
    pdfUrl,
    sentAt: new Date().toISOString(),
    status: 'pending',
  };

  _emailLog.push(email);

  try {
    // In production, call SendGrid or similar:
    // await sendgrid.send({ to: recipientEmail, subject: 'Your Health Report', ... });
    console.log('[Email] Sending report to', recipientEmail);
    email.status = 'sent';
  } catch (err) {
    email.status = 'failed';
    console.error('[Email] Failed to send:', err);
  }

  return email;
}

export function getEmailLog(): ReportEmail[] {
  return [..._emailLog];
}

export function getEmailsByRecipient(email: string): ReportEmail[] {
  return _emailLog.filter((e) => e.recipientEmail === email);
}

export function scheduleWeeklyEmails(
  userId: string,
  email: string,
  dayOfWeek: number = 0 // 0 = Sunday
): { scheduledAt: string; nextRun: string } {
  const now = new Date();
  const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7 || 7;
  const nextRun = new Date(now);
  nextRun.setDate(nextRun.getDate() + daysUntilNext);
  nextRun.setHours(8, 0, 0, 0);

  console.log(`[Email] Scheduled weekly report for ${email} on ${nextRun.toISOString()}`);
  return {
    scheduledAt: now.toISOString(),
    nextRun: nextRun.toISOString(),
  };
}
