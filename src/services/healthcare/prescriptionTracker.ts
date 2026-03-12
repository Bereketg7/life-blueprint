// Prescription / medication tracker

export interface Prescription {
  id: string;
  userId: string;
  medicationName: string;
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  notes: string;
  active: boolean;
}

export interface DoseLog {
  prescriptionId: string;
  userId: string;
  takenAt: string;
  notes?: string;
}

const _prescriptions: Prescription[] = [];
const _doseLogs: DoseLog[] = [];

function generateId(): string {
  return `rx_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function addPrescription(
  data: Omit<Prescription, 'id' | 'active'>
): Prescription {
  const prescription: Prescription = { ...data, id: generateId(), active: true };
  _prescriptions.push(prescription);
  return prescription;
}

export function logDose(prescriptionId: string, userId: string, notes?: string): DoseLog {
  const log: DoseLog = {
    prescriptionId,
    userId,
    takenAt: new Date().toISOString(),
    notes,
  };
  _doseLogs.push(log);
  return log;
}

export function getActivePrescriptions(userId: string): Prescription[] {
  return _prescriptions.filter((p) => p.userId === userId && p.active);
}

export function getDoseHistory(prescriptionId: string): DoseLog[] {
  return _doseLogs.filter((d) => d.prescriptionId === prescriptionId);
}

export function discontinuePrescription(prescriptionId: string): void {
  const rx = _prescriptions.find((p) => p.id === prescriptionId);
  if (rx) rx.active = false;
}
