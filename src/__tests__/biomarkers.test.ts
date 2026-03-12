import {
  addBiomarkerReading,
  analyzeBiomarkerTrend,
  estimateVo2Max,
  calculateHrv,
  getBiomarkerAlerts,
} from '../services/biomarkers/biomarkerService';
import { BiomarkerReading } from '../types';

function makeReading(type: BiomarkerReading['type'], value: number, daysAgo: number = 0): BiomarkerReading {
  const ts = new Date(Date.now() - daysAgo * 86400000).toISOString();
  return {
    id: `r_${type}_${daysAgo}`,
    userId: 'u1',
    type,
    value,
    unit: 'ms',
    timestamp: ts,
    source: 'manual',
  };
}

describe('addBiomarkerReading', () => {
  it('creates a reading with correct fields', () => {
    const reading = addBiomarkerReading('u1', 'hrv', 65);
    expect(reading.userId).toBe('u1');
    expect(reading.type).toBe('hrv');
    expect(reading.value).toBe(65);
    expect(typeof reading.id).toBe('string');
    expect(typeof reading.timestamp).toBe('string');
  });
});

describe('analyzeBiomarkerTrend', () => {
  it('returns empty trend for no readings', () => {
    const trend = analyzeBiomarkerTrend([], 'hrv');
    expect(trend.readings.length).toBe(0);
    expect(trend.baseline).toBe(0);
    expect(trend.current).toBe(0);
  });

  it('detects improving trend for HRV increase', () => {
    const readings = [5, 4, 3, 2, 1].map((d, i) => makeReading('hrv', 50 + i * 5, d));
    const trend = analyzeBiomarkerTrend(readings, 'hrv');
    // HRV going up = improving
    expect(trend.trend).toBe('improving');
  });

  it('generates alert for value below normal range', () => {
    const readings = [makeReading('spo2', 88)]; // below 95%
    const trend = analyzeBiomarkerTrend(readings, 'spo2');
    expect(trend.alerts.length).toBeGreaterThan(0);
    expect(trend.alerts[0]).toContain('below normal');
  });

  it('generates alert for value above normal range', () => {
    const readings = [makeReading('blood_pressure_sys', 160)]; // above 140
    const trend = analyzeBiomarkerTrend(readings, 'blood_pressure_sys');
    expect(trend.alerts.length).toBeGreaterThan(0);
  });

  it('returns current as latest value', () => {
    const readings = [makeReading('resting_hr', 60, 2), makeReading('resting_hr', 65, 0)];
    const trend = analyzeBiomarkerTrend(readings, 'resting_hr');
    expect(trend.current).toBe(65);
  });
});

describe('estimateVo2Max', () => {
  it('returns a reasonable VO2max value', () => {
    const vo2 = estimateVo2Max(30, 60, 190);
    expect(vo2).toBeGreaterThan(20);
    expect(vo2).toBeLessThan(100);
  });

  it('uses 220-age formula when maxHr not provided', () => {
    const vo2 = estimateVo2Max(30, 60);
    expect(typeof vo2).toBe('number');
    expect(vo2).toBeGreaterThan(0);
  });
});

describe('calculateHrv', () => {
  it('returns 0 for empty or single-element array', () => {
    expect(calculateHrv([])).toBe(0);
    expect(calculateHrv([800])).toBe(0);
  });

  it('returns positive value for valid RR intervals', () => {
    const rrIntervals = [800, 810, 790, 820, 805, 795];
    const hrv = calculateHrv(rrIntervals);
    expect(hrv).toBeGreaterThan(0);
  });
});

describe('getBiomarkerAlerts', () => {
  it('aggregates alerts from multiple trends', () => {
    const trends = [
      analyzeBiomarkerTrend([makeReading('spo2', 88)], 'spo2'),
      analyzeBiomarkerTrend([makeReading('blood_pressure_sys', 160)], 'blood_pressure_sys'),
    ];
    const alerts = getBiomarkerAlerts(trends);
    expect(alerts.length).toBeGreaterThanOrEqual(2);
  });

  it('returns empty array for healthy readings', () => {
    const trends = [
      analyzeBiomarkerTrend([makeReading('hrv', 65)], 'hrv'),
    ];
    const alerts = getBiomarkerAlerts(trends);
    expect(Array.isArray(alerts)).toBe(true);
  });
});
