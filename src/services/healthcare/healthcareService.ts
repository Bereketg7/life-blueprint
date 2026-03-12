import { DoctorShare, LabResult, Prescription } from '../../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Simple HIPAA-compliant encryption placeholder
// Real impl would use AES-256-GCM via expo-crypto or react-native-crypto
export function encryptData(data: string): string {
  // Mock: base64 encode as placeholder
  return Buffer.from(data).toString('base64');
}

export function decryptData(encrypted: string): string {
  return Buffer.from(encrypted, 'base64').toString('utf-8');
}

// --- Doctor Share Management ---
export function createDoctorShare(
  userId: string,
  doctorId: string,
  doctorName: string,
  permissions: DoctorShare['permissions'],
  expiryDays?: number,
): DoctorShare {
  const expiresAt = expiryDays
    ? new Date(Date.now() + expiryDays * 86400000).toISOString()
    : undefined;

  return {
    id: generateId(),
    userId,
    doctorId,
    doctorName,
    permissions,
    createdAt: new Date().toISOString(),
    expiresAt,
  };
}

export function updateDoctorSharePermissions(
  share: DoctorShare,
  permissions: DoctorShare['permissions'],
): DoctorShare {
  return { ...share, permissions };
}

export function revokeDoctorShare(shares: DoctorShare[], shareId: string): DoctorShare[] {
  return shares.filter(s => s.id !== shareId);
}

export function isShareActive(share: DoctorShare): boolean {
  if (!share.expiresAt) return true;
  return new Date(share.expiresAt) > new Date();
}

// --- Lab Results ---
export function importLabResult(
  userId: string,
  testName: string,
  value: number,
  unit: string,
  date: string,
  provider: string,
  referenceRange?: string,
): LabResult {
  // Check if value is abnormal based on reference range
  let isAbnormal = false;
  if (referenceRange) {
    const parts = referenceRange.split('-');
    if (parts.length === 2) {
      const low = parseFloat(parts[0]);
      const high = parseFloat(parts[1]);
      isAbnormal = value < low || value > high;
    }
  }

  return {
    id: generateId(),
    userId,
    testName,
    value,
    unit,
    referenceRange,
    date,
    provider,
    isAbnormal,
    createdAt: new Date().toISOString(),
  };
}

export function getAbnormalResults(results: LabResult[]): LabResult[] {
  return results.filter(r => r.isAbnormal);
}

// --- Prescriptions ---
export function addPrescription(
  userId: string,
  medicationName: string,
  dosage: string,
  frequency: string,
  startDate: string,
  endDate?: string,
  notes?: string,
): Prescription {
  return {
    id: generateId(),
    userId,
    medicationName,
    dosage,
    frequency,
    startDate,
    endDate,
    reminderEnabled: true,
    reminderTimes: ['08:00', '20:00'],
    notes,
    createdAt: new Date().toISOString(),
  };
}

export function getActivePrescriptions(prescriptions: Prescription[]): Prescription[] {
  const today = new Date().toISOString().split('T')[0];
  return prescriptions.filter(p => !p.endDate || p.endDate >= today);
}

export function updatePrescriptionReminder(
  prescription: Prescription,
  enabled: boolean,
  times?: string[],
): Prescription {
  return {
    ...prescription,
    reminderEnabled: enabled,
    reminderTimes: times ?? prescription.reminderTimes,
  };
}

// --- FHIR Data Import (stub) ---
export async function importFhirData(
  _fhirEndpoint: string,
  _accessToken: string,
  _resourceType: 'Observation' | 'MedicationRequest' | 'DiagnosticReport',
): Promise<Record<string, unknown>[]> {
  // Real impl would call FHIR R4 API and parse resources
  return [];
}
