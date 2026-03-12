import { BiomarkerReading, BiomarkerTrend } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const NORMAL_RANGES: Record<BiomarkerReading['type'], { min: number; max: number; unit: string }> = {
  hrv: { min: 20, max: 100, unit: 'ms' },
  vo2max: { min: 30, max: 80, unit: 'ml/kg/min' },
  resting_hr: { min: 40, max: 100, unit: 'bpm' },
  weight: { min: 30, max: 300, unit: 'kg' },
  body_fat: { min: 5, max: 50, unit: '%' },
  blood_pressure_sys: { min: 90, max: 140, unit: 'mmHg' },
  blood_pressure_dia: { min: 60, max: 90, unit: 'mmHg' },
  spo2: { min: 95, max: 100, unit: '%' },
};

export function addBiomarkerReading(
  userId: string,
  type: BiomarkerReading['type'],
  value: number,
  source: BiomarkerReading['source'] = 'manual',
  notes?: string,
): BiomarkerReading {
  const range = NORMAL_RANGES[type];
  return {
    id: generateId(),
    userId,
    type,
    value,
    unit: range.unit,
    timestamp: new Date().toISOString(),
    source,
    notes,
  };
}

export function analyzeBiomarkerTrend(
  readings: BiomarkerReading[],
  type: BiomarkerReading['type'],
): BiomarkerTrend {
  const typeReadings = readings
    .filter(r => r.type === type)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (typeReadings.length === 0) {
    return {
      type,
      readings: [],
      baseline: 0,
      current: 0,
      trend: 'stable',
      alerts: [],
    };
  }

  const values = typeReadings.map(r => r.value);
  const baseline = values.slice(0, Math.max(1, Math.floor(values.length / 4)))
    .reduce((a, b) => a + b, 0) / Math.max(1, Math.floor(values.length / 4));
  const current = values[values.length - 1];

  // Determine trend using last vs first half
  const half = Math.floor(values.length / 2);
  const firstHalfAvg = values.slice(0, Math.max(1, half)).reduce((a, b) => a + b, 0) / Math.max(1, half);
  const secondHalfAvg = values.slice(half).reduce((a, b) => a + b, 0) / (values.length - half);
  const changePct = firstHalfAvg !== 0 ? (secondHalfAvg - firstHalfAvg) / firstHalfAvg : 0;

  let trend: BiomarkerTrend['trend'];
  // For resting_hr and blood pressure: lower is better
  const lowerIsBetter: BiomarkerReading['type'][] = ['resting_hr', 'blood_pressure_sys', 'blood_pressure_dia', 'body_fat'];
  if (Math.abs(changePct) < 0.03) {
    trend = 'stable';
  } else if (lowerIsBetter.includes(type)) {
    trend = changePct < 0 ? 'improving' : 'declining';
  } else {
    trend = changePct > 0 ? 'improving' : 'declining';
  }

  // Generate alerts
  const alerts: string[] = [];
  const range = NORMAL_RANGES[type];
  if (current < range.min) {
    alerts.push(`${type} is below normal range (${current} ${range.unit} < ${range.min})`);
  }
  if (current > range.max) {
    alerts.push(`${type} is above normal range (${current} ${range.unit} > ${range.max})`);
  }
  if (trend === 'declining' && typeReadings.length >= 5) {
    alerts.push(`${type} has been declining over the past ${typeReadings.length} readings`);
  }

  return { type, readings: typeReadings, baseline, current, trend, alerts };
}

export function estimateVo2Max(
  age: number,
  restingHr: number,
  maxHr?: number,
): number {
  // Resting HR method (Uth-Sørensen-Overgaard-Pedersen formula)
  const hrMax = maxHr ?? 220 - age;
  return Math.round((hrMax / restingHr) * 15.3);
}

export function calculateHrv(rrIntervals: number[]): number {
  if (rrIntervals.length < 2) return 0;
  const diffs = rrIntervals.slice(1).map((rr, i) => (rr - rrIntervals[i]) ** 2);
  const rmssd = Math.sqrt(diffs.reduce((a, b) => a + b, 0) / diffs.length);
  return Math.round(rmssd);
}

export function getBiomarkerAlerts(trends: BiomarkerTrend[]): string[] {
  return trends.flatMap(t => t.alerts);
}
