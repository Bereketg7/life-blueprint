import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../styles/theme';

interface GoalSelectionProps {
  selectedGoal: string;
  onSelect: (goal: string) => void;
}

const GOALS = [
  {
    id: 'weight_loss',
    emoji: '🏃',
    label: 'Weight Loss',
    description: 'Shed excess weight and improve body composition',
  },
  {
    id: 'muscle_gain',
    emoji: '💪',
    label: 'Muscle Gain',
    description: 'Build lean muscle mass and increase strength',
  },
  {
    id: 'maintenance',
    emoji: '⚖️',
    label: 'Maintenance',
    description: 'Maintain current weight and improve overall fitness',
  },
  {
    id: 'endurance',
    emoji: '🚴',
    label: 'Endurance',
    description: 'Improve cardiovascular endurance and stamina',
  },
  {
    id: 'flexibility',
    emoji: '🧘',
    label: 'Flexibility',
    description: 'Enhance flexibility and mobility',
  },
];

const GoalSelection: React.FC<GoalSelectionProps> = ({ selectedGoal, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Choose Your Goal</Text>
      <Text style={styles.subtitle}>Select the primary goal you want to achieve</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {GOALS.map((goal) => {
          const active = selectedGoal === goal.id;
          return (
            <TouchableOpacity
              key={goal.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onSelect(goal.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{goal.emoji}</Text>
              <View style={styles.textWrap}>
                <Text style={[styles.goalLabel, active && styles.goalLabelActive]}>{goal.label}</Text>
                <Text style={styles.goalDesc}>{goal.description}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  cardActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}18`,
  },
  emoji: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  textWrap: {
    flex: 1,
  },
  goalLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  goalLabelActive: {
    color: Colors.primary,
  },
  goalDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});

export default GoalSelection;
