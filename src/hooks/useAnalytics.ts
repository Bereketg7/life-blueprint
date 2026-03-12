import { useState, useCallback } from 'react';
import {
  UserProfile,
  ActivityLog,
  NutritionLog,
  SleepLog,
  MentalHealthLog,
  HealthPrediction,
  RiskAssessment,
  Trajectory,
  Anomaly,
} from '../types';
import {
  predictWeightTrajectory,
  predictGoalAchievementDate,
  estimateCalorieNeeds,
} from '../services/analytics/predictions';
import {
  calculateFitnessTrend,
} from '../services/analytics/trajectoryAnalysis';
import {
  assessInjuryRisk,
  assessBurnoutRisk,
} from '../services/analytics/riskAssessment';
import { detectAnomalies } from '../services/analytics/anomalyDetection';

type LogBundle = {
  activityLogs: ActivityLog[];
  nutritionLogs: NutritionLog[];
  sleepLogs: SleepLog[];
  mentalHealthLogs: MentalHealthLog[];
};

type UseAnalyticsResult = {
  predictions: HealthPrediction[];
  riskAssessments: RiskAssessment[];
  trajectories: Trajectory[];
  anomalies: Anomaly[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useAnalytics(
  userProfile: UserProfile,
  logs: LogBundle,
): UseAnalyticsResult {
  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();

      // ── Trajectories ──────────────────────────────────────────────────────
      const weightTrajectory = predictWeightTrajectory(
        userProfile,
        logs.nutritionLogs,
        12,
      );
      const fitnessData = calculateFitnessTrend(logs.activityLogs);
      const fitnessTraj: Trajectory = {
        metric: 'workout_duration_min',
        currentValue:
          fitnessData.values[fitnessData.values.length - 1] ?? 0,
        projectedValues: fitnessData.values.map((v, i) => ({
          date: fitnessData.dates[i] ?? now,
          value: v,
          isProjected: false,
        })),
        trend: fitnessData.trend,
        changePerWeek: parseFloat((fitnessData.slope * 7).toFixed(2)),
      };
      setTrajectories([weightTrajectory, fitnessTraj]);

      // ── Predictions ───────────────────────────────────────────────────────
      const goalDate = predictGoalAchievementDate(
        userProfile,
        logs.nutritionLogs,
      );
      const calorieNeeds = estimateCalorieNeeds(
        userProfile,
        logs.activityLogs,
      );

      const newPredictions: HealthPrediction[] = [
        {
          id: `pred_goal_${Date.now()}`,
          type: 'goal_achievement',
          title: 'Goal Achievement Estimate',
          prediction: goalDate,
          confidence: 0.72,
          timeframe: 'Projected date to reach goal',
          factors: [
            'Based on average calorie deficit',
            'Assumes consistent nutrition habits',
          ],
          createdAt: now,
        },
        {
          id: `pred_cal_${Date.now()}`,
          type: 'performance',
          title: 'Estimated Daily Calorie Needs',
          prediction: calorieNeeds,
          confidence: 0.8,
          timeframe: 'Current estimate',
          factors: [
            `Age: ${userProfile.age ?? 'N/A'}`,
            `Activity level: ${userProfile.activityLevel ?? 'moderate'}`,
          ],
          createdAt: now,
        },
      ];
      setPredictions(newPredictions);

      // ── Risk assessments ─────────────────────────────────────────────────
      const injuryRisk = assessInjuryRisk(
        logs.activityLogs,
        logs.sleepLogs,
      );
      const burnoutRisk = assessBurnoutRisk(logs);
      setRiskAssessments([injuryRisk, burnoutRisk]);

      // ── Anomalies ─────────────────────────────────────────────────────────
      const detected = detectAnomalies(logs);
      setAnomalies(detected);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to compute analytics',
      );
    } finally {
      setLoading(false);
    }
  }, [userProfile, logs]);

  return {
    predictions,
    riskAssessments,
    trajectories,
    anomalies,
    loading,
    error,
    refresh,
  };
}

export default useAnalytics;
