import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/theme';

export type PortionSize = 'small' | 'medium' | 'large' | 'extra_large';

interface PortionOption {
  size: PortionSize;
  label: string;
  emoji: string;
  multiplier: number;
  description: string;
}

const PORTION_OPTIONS: PortionOption[] = [
  { size: 'small',       label: 'Small',       emoji: '🥄', multiplier: 0.6, description: '~60%' },
  { size: 'medium',      label: 'Medium',      emoji: '🍽️', multiplier: 1.0, description: '~100%' },
  { size: 'large',       label: 'Large',       emoji: '🫕', multiplier: 1.4, description: '~140%' },
  { size: 'extra_large', label: 'Extra Large', emoji: '🪣', multiplier: 1.8, description: '~180%' },
];

interface PortionSizeSelectorProps {
  selectedSize: PortionSize;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  onChange: (size: PortionSize, adjusted: { calories: number; protein: number; carbs: number; fat: number }) => void;
}

export const PortionSizeSelector: React.FC<PortionSizeSelectorProps> = ({
  selectedSize,
  baseCalories,
  baseProtein,
  baseCarbs,
  baseFat,
  onChange,
}) => {
  const selectedOption = PORTION_OPTIONS.find((o) => o.size === selectedSize) ?? PORTION_OPTIONS[1];

  const handleSelect = useCallback(
    (option: PortionOption) => {
      onChange(option.size, {
        calories: Math.round(baseCalories * option.multiplier),
        protein: Math.round(baseProtein * option.multiplier * 10) / 10,
        carbs: Math.round(baseCarbs * option.multiplier * 10) / 10,
        fat: Math.round(baseFat * option.multiplier * 10) / 10,
      });
    },
    [baseCalories, baseProtein, baseCarbs, baseFat, onChange]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portion Size</Text>

      <View style={styles.optionsRow}>
        {PORTION_OPTIONS.map((option) => {
          const isSelected = option.size === selectedSize;
          return (
            <TouchableOpacity
              key={option.size}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {option.label}
              </Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.adjustedRow}>
        <Text style={styles.adjustedTitle}>
          Adjusted ({selectedOption.label}):
        </Text>
        <View style={styles.macroRow}>
          <MacroChip
            value={Math.round(baseCalories * selectedOption.multiplier)}
            unit="kcal"
            color={Colors.text.primary}
          />
          <MacroChip
            value={Math.round(baseProtein * selectedOption.multiplier * 10) / 10}
            unit="P"
            color="#FF6B6B"
          />
          <MacroChip
            value={Math.round(baseCarbs * selectedOption.multiplier * 10) / 10}
            unit="C"
            color="#FFC107"
          />
          <MacroChip
            value={Math.round(baseFat * selectedOption.multiplier * 10) / 10}
            unit="F"
            color="#4CAF50"
          />
        </View>
      </View>
    </View>
  );
};

interface MacroChipProps {
  value: number;
  unit: string;
  color: string;
}

const MacroChip: React.FC<MacroChipProps> = ({ value, unit, color }) => (
  <View style={chipStyles.container}>
    <Text style={[chipStyles.value, { color }]}>{value}</Text>
    <Text style={chipStyles.unit}>{unit}</Text>
  </View>
);

const chipStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 56,
  },
  value: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  unit: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
    ...Shadows.sm,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '22',
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: 9,
    color: Colors.text.muted,
  },
  adjustedRow: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  adjustedTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
  },
  macroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
});

export default PortionSizeSelector;
