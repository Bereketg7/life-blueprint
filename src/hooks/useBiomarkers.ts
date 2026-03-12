import { useState, useCallback } from 'react';
import { Biomarker, BiomarkerTrend } from '../types';
import { createBiomarker } from '../services/biomarkers/biomarkerCalculations';
import { getAllBiomarkerTrends, getAlertBiomarkers, getLatestReadings } from '../services/biomarkers/biomarkerTrends';

export function useBiomarkers(userId: string) {
  const [readings, setReadings] = useState<Biomarker[]>([]);

  const logBiomarker = useCallback(
    (type: Biomarker['type'], value: number) => {
      const biomarker = createBiomarker(userId, type, value);
      setReadings((prev) => [...prev, biomarker]);
      return biomarker;
    },
    [userId]
  );

  const trends: BiomarkerTrend[] = getAllBiomarkerTrends(readings);
  const alerts = getAlertBiomarkers(readings);
  const latestReadings = getLatestReadings(readings);

  return {
    readings,
    trends,
    alerts,
    latestReadings,
    logBiomarker,
    hasAlerts: alerts.length > 0,
  };
}
