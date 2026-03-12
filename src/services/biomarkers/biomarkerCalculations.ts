// Biomarker calculations
import { Biomarker } from '../../types';

function generateId(): string {
  return `bm_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

type BiomarkerType = Biomarker['type'];

const NORMAL_RANGES: Record<BiomarkerType, { min: number; max: number; unit: string }> = {
  hrv: { min: 20, max: 80, unit: 'ms' },
  vo2_max: { min: 30, max: 60, unit: 'mL/kg/min' },
  rhr: { min: 40, max: 80, unit: 'bpm' },
  body_fat: { min: 10, max: 30, unit: '%' },
  muscle_mass: { min: 30, max: 60, unit: 'kg' },
  blood_pressure: { min: 60, max: 120, unit: 'mmHg' },
};

export function createBiomarker(
  userId: string,
  type: BiomarkerType,
  value: number
): Biomarker {
  const range = NORMAL_RANGES[type];
  const status: Biomarker['status'] =
    value < range.min * 0.8 || value > range.max * 1.2
      ? 'alert'
      : value < range.min || value > range.max
      ? 'warning'
      : 'normal';

  return {
    id: generateId(),
    userId,
    type,
    value,
    unit: range.unit,
    timestamp: new Date().toISOString(),
    status,
  };
}

export function getBiomarkerStatus(type: BiomarkerType, value: number): Biomarker['status'] {
  const range = NORMAL_RANGES[type];
  if (value < range.min * 0.8 || value > range.max * 1.2) return 'alert';
  if (value < range.min || value > range.max) return 'warning';
  return 'normal';
}

export function getNormalRange(type: BiomarkerType): { min: number; max: number; unit: string } {
  return NORMAL_RANGES[type];
}
