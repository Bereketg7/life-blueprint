import { useState, useCallback } from 'react';
import { DoctorShare, LabResult, Prescription } from '../types';
import { createDoctorShare, revokeDoctorShare, importLabResult, addPrescription, getActivePrescriptions, getAbnormalResults } from '../services/healthcare';

export function useHealthcareSync(userId: string) {
  const [doctorShares, setDoctorShares] = useState<DoctorShare[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const shareWithDoctor = useCallback((doctorId: string, doctorName: string, permissions: DoctorShare['permissions']) => {
    const share = createDoctorShare(userId, doctorId, doctorName, permissions, 30);
    setDoctorShares(prev => [...prev, share]);
  }, [userId]);

  const revokeShare = useCallback((shareId: string) => {
    setDoctorShares(prev => revokeDoctorShare(prev, shareId));
  }, []);

  const addLabResult = useCallback((testName: string, value: number, unit: string, date: string, provider: string, referenceRange?: string) => {
    const result = importLabResult(userId, testName, value, unit, date, provider, referenceRange);
    setLabResults(prev => [...prev, result]);
    return result;
  }, [userId]);

  const addNewPrescription = useCallback((medicationName: string, dosage: string, frequency: string, startDate: string, endDate?: string, notes?: string) => {
    const rx = addPrescription(userId, medicationName, dosage, frequency, startDate, endDate, notes);
    setPrescriptions(prev => [...prev, rx]);
    return rx;
  }, [userId]);

  return {
    doctorShares,
    labResults,
    prescriptions: getActivePrescriptions(prescriptions),
    abnormalResults: getAbnormalResults(labResults),
    shareWithDoctor,
    revokeShare,
    addLabResult,
    addNewPrescription,
  };
}
