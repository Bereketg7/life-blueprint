import { useState, useCallback } from 'react';
import { HealthPrediction, RiskAssessment, ActivityLog, SleepLog, NutritionLog, MentalHealthLog, UserProfile } from '../types';
import { predictWeightLoss, predictGoalAchievement } from '../services/analytics/predictions';
import { assessInjuryRisk, assessBurnoutRisk } from '../services/analytics/riskAssessment';
import { detectSleepAnomalies, detectCalorieAnomalies } from '../services/analytics/anomalyDetection';

export function useAnalytics(userId: string) {
  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const analyse = useCallback(
    async (
      profile: UserProfile,
      activityLogs: ActivityLog[],
      nutritionLogs: NutritionLog[],
      sleepLogs: SleepLog[],
      moodLogs: MentalHealthLog[]
    ) => {
      setLoading(true);
      try {
        const weightPrediction = predictWeightLoss(userId, profile, activityLogs, nutritionLogs);
        const goalPrediction = predictGoalAchievement(userId, profile.goalType, 65);
        setPredictions([weightPrediction, goalPrediction]);

        const injuryRisk = assessInjuryRisk(activityLogs);
        const burnoutRisk = assessBurnoutRisk(activityLogs, moodLogs, sleepLogs);
        setRiskAssessments([injuryRisk, burnoutRisk]);

        const sleepValues = sleepLogs.map((l) => l.hoursSlept);
        const calorieValues = nutritionLogs.map((l) => l.calories);
        const detectedAnomalies = [
          ...detectSleepAnomalies(sleepValues),
          ...detectCalorieAnomalies(calorieValues),
        ];
        setAnomalies(detectedAnomalies);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { predictions, riskAssessments, anomalies, loading, analyse };
}
