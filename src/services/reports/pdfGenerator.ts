// PDF generator stub – creates exportable reports
import { HealthReport } from '../../types';

export interface PDFGenerationResult {
  filename: string;
  base64Content?: string;
  localPath?: string;
  size: number;
}

export async function generatePDF(
  report: HealthReport,
  htmlContent: string
): Promise<PDFGenerationResult> {
  // In production, use react-native-html-to-pdf or similar
  const filename = `health_report_${report.userId}_${report.type}_${report.period.start}.pdf`;
  console.log('[PDF] Generating:', filename);
  return {
    filename,
    size: 0,
  };
}

export function reportToHTML(report: HealthReport): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Health Report</title></head>
<body style="font-family: Arial, sans-serif; padding: 24px;">
  <h1>Life Blueprint – ${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report</h1>
  <p><strong>Period:</strong> ${report.period.start} to ${report.period.end}</p>
  <h2>Metrics</h2>
  <ul>
    <li>Total Activity Sessions: ${report.metrics.totalActivity}</li>
    <li>Average Calories: ${report.metrics.avgCalories} kcal</li>
    <li>Average Sleep: ${report.metrics.avgSleep} hrs</li>
    <li>Average Mood: ${report.metrics.avgMood}/10</li>
  </ul>
  <h2>Insights</h2>
  <ul>${report.insights.map((i) => `<li>${i}</li>`).join('')}</ul>
  <h2>Recommendations</h2>
  <ul>${report.recommendations.map((r) => `<li>${r}</li>`).join('')}</ul>
  <p style="color: #888; font-size: 12px;">Generated: ${report.generatedAt}</p>
</body>
</html>`;
}

export async function savePDFLocally(
  result: PDFGenerationResult
): Promise<string> {
  console.log('[PDF] Saved to:', result.filename);
  return result.filename;
}
