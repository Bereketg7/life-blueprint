// Risk assessment – injury & burnout risk
import { RiskAssessment, ActivityLog, SleepLog, MentalHealthLog } from '../../types';

export function assessInjuryRisk(recentActivity: ActivityLog[]): RiskAssessment {
  const highIntensity = recentActivity.filter((a) => a.intensity === 'high').length;
  const totalSessions = recentActivity.length;
  const highRatio = totalSessions > 0 ? highIntensity / totalSessions : 0;

  const riskScore = Math.min(100, Math.round(highRatio * 100 + (totalSessions > 10 ? 20 : 0)));

  const factors: RiskAssessment['factors'] = [
    { name: 'High-intensity sessions', impact: Math.round(highRatio * 60) },
    { name: 'Volume overload', impact: totalSessions > 10 ? 20 : 0 },
  ];

  return {
    type: 'injury',
    riskScore,
    factors,
    recommendation:
      riskScore > 70
        ? 'Take a rest day immediately. Reduce high-intensity sessions.'
        : riskScore > 40
        ? 'Consider a lower-intensity session tomorrow.'
        : 'Your training load is balanced. Keep it up!',
  };
}

export function assessBurnoutRisk(
  recentActivity: ActivityLog[],
  recentMood: MentalHealthLog[],
  recentSleep: SleepLog[]
): RiskAssessment {
  const avgStress =
    recentMood.length > 0
      ? recentMood.reduce((s, m) => s + m.stress, 0) / recentMood.length
      : 5;

  const avgSleep =
    recentSleep.length > 0
      ? recentSleep.reduce((s, sl) => s + sl.hoursSlept, 0) / recentSleep.length
      : 7;

  const sessionCount = recentActivity.length;

  const riskScore = Math.min(
    100,
    Math.round(avgStress * 5 + (7 - Math.min(avgSleep, 7)) * 5 + sessionCount * 2)
  );

  return {
    type: 'burnout',
    riskScore,
    factors: [
      { name: 'Average stress level', impact: Math.round(avgStress * 5) },
      { name: 'Sleep deficit', impact: Math.round((7 - Math.min(avgSleep, 7)) * 5) },
      { name: 'Training volume', impact: Math.min(sessionCount * 2, 40) },
    ],
    recommendation:
      riskScore > 70
        ? 'You are showing signs of burnout. Take a full recovery week.'
        : riskScore > 40
        ? 'Watch your recovery. Prioritise sleep and stress management.'
        : 'Burnout risk is low. You are managing your load well.',
  };
}

export function assessPlateauRisk(
  consistencyScores: number[]
): RiskAssessment {
  const avg =
    consistencyScores.length > 0
      ? consistencyScores.reduce((s, v) => s + v, 0) / consistencyScores.length
      : 50;

  const riskScore = Math.max(0, Math.round(100 - avg));

  return {
    type: 'plateau',
    riskScore,
    factors: [
      { name: 'Consistency average', impact: riskScore },
    ],
    recommendation:
      riskScore > 60
        ? 'Consider changing your routine to break through the plateau.'
        : 'You are making consistent progress. Keep varying your workouts.',
  };
}
