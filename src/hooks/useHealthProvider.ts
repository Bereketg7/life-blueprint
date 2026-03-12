import { useState, useCallback } from 'react';
import { HealthProvider, LabResult } from '../types';
import { addLabResult, getLabResults, getAbnormalLabResults } from '../services/healthcare/labResults';
import { addPrescription, getActivePrescriptions, logDose } from '../services/healthcare/prescriptionTracker';
import type { Prescription } from '../services/healthcare/prescriptionTracker';

const _providers: HealthProvider[] = [];

export function useHealthProvider(userId: string) {
  const [providers, setProviders] = useState<HealthProvider[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>(() => getLabResults(userId));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() =>
    getActivePrescriptions(userId)
  );

  const connectProvider = useCallback((provider: HealthProvider) => {
    _providers.push(provider);
    setProviders([..._providers]);
  }, []);

  const addLab = useCallback(
    (result: Omit<LabResult, 'id' | 'status'>) => {
      const lab = addLabResult(result);
      setLabResults(getLabResults(userId));
      return lab;
    },
    [userId]
  );

  const addPrescriptionEntry = useCallback(
    (data: Omit<Prescription, 'id' | 'active'>) => {
      const rx = addPrescription(data);
      setPrescriptions(getActivePrescriptions(userId));
      return rx;
    },
    [userId]
  );

  const takeDose = useCallback(
    (prescriptionId: string, notes?: string) => {
      const doseLog = logDose(prescriptionId, userId, notes);
      return doseLog;
    },
    [userId]
  );

  const abnormalResults = getAbnormalLabResults(userId);

  return {
    providers,
    labResults,
    abnormalResults,
    prescriptions,
    connectProvider,
    addLab,
    addPrescription: addPrescriptionEntry,
    takeDose,
  };
}
