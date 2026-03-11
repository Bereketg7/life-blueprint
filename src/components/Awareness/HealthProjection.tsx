import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';
import { HealthProjection } from '../../types';

interface Props {
  projections: HealthProjection[];
}

type TabKey = '1_month' | '3_months' | '6_months' | '12_months';

const TABS: { key: TabKey; label: string }[] = [
  { key: '1_month', label: '1M' },
  { key: '3_months', label: '3M' },
  { key: '6_months', label: '6M' },
  { key: '12_months', label: '12M' },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HealthProjectionComponent({ projections }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('1_month');

  const selected = projections.find((p) => p.timeframe === activeTab);

  if (projections.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          Complete your profile and start logging to see health projections. 📊
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selected ? (
        <View style={styles.card}>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Projected Weight</Text>
              <Text style={styles.metricValue}>{selected.projectedWeight.toFixed(1)} kg</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Consistency Needed</Text>
              <Text style={styles.metricValue}>{selected.consistencyScore}%</Text>
            </View>
          </View>

          <View style={styles.goalDateRow}>
            <Text style={styles.goalDateLabel}>🎯 Goal Achievement Date</Text>
            <Text style={styles.goalDateValue}>{formatDate(selected.goalAchievementDate)}</Text>
          </View>

          {selected.insights.length > 0 && (
            <View style={styles.insightsSection}>
              <Text style={styles.insightsTitle}>Key Insights</Text>
              {selected.insights.map((insight, idx) => (
                <View key={idx} style={styles.insightRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyText}>No projection data for this timeframe.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.muted,
  },
  tabTextActive: {
    color: Colors.text.primary,
    fontWeight: Typography.weights.bold,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  goalDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  goalDateLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  goalDateValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  insightsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  insightsTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  insightRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  bullet: {
    color: Colors.primary,
    fontSize: Typography.sizes.md,
    lineHeight: 20,
  },
  insightText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
