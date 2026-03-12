// Lab results import and management
import { LabResult } from '../../types';

const _labResults: LabResult[] = [];

function generateId(): string {
  return `lab_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function addLabResult(
  result: Omit<LabResult, 'id' | 'status'>
): LabResult {
  const status: LabResult['status'] =
    result.value < result.referenceRange.min
      ? 'low'
      : result.value > result.referenceRange.max
      ? 'high'
      : 'normal';

  const labResult: LabResult = { ...result, id: generateId(), status };
  _labResults.push(labResult);
  return labResult;
}

export function getLabResults(userId: string): LabResult[] {
  return _labResults.filter((r) => r.userId === userId);
}

export function getAbnormalLabResults(userId: string): LabResult[] {
  return getLabResults(userId).filter((r) => r.status !== 'normal');
}

export function getLabResultsByTest(userId: string, testName: string): LabResult[] {
  return getLabResults(userId).filter((r) =>
    r.testName.toLowerCase().includes(testName.toLowerCase())
  );
}

export function getLatestLabResult(
  userId: string,
  testName: string
): LabResult | null {
  const results = getLabResultsByTest(userId, testName);
  if (results.length === 0) return null;
  return results.reduce((latest, r) =>
    r.testDate > latest.testDate ? r : latest
  );
}
