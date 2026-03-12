import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTracking } from '../../context/TrackingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';
import { NutritionLog } from '../../types';
import { MEAL_PRESETS, MealPreset } from '../../services/mealPresets';
import MealPhotoCapture from './MealPhotoCapture';

interface Props {
  onSubmit?: () => void;
}

type MealType = NutritionLog['mealType'];

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function NutritionLogger({ onSubmit }: Props) {
  const { logNutrition } = useTracking();

  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const applyPreset = (preset: MealPreset, uri?: string) => {
    setCalories(String(preset.calories));
    setProtein(String(preset.protein));
    setCarbs(String(preset.carbs));
    setFat(String(preset.fat));
    setSelectedPreset(preset.name);
    if (uri) setPhotoUri(uri);
    setShowScanner(false);
  };

  const parsePositiveNum = (val: string): number | null => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? null : n;
  };

  const handleSubmit = () => {
    const caloriesNum = parsePositiveNum(calories);
    const proteinNum = parsePositiveNum(protein);
    const carbsNum = parsePositiveNum(carbs);
    const fatNum = parsePositiveNum(fat);

    if (caloriesNum === null) {
      Alert.alert('Validation Error', 'Please enter valid calories.');
      return;
    }
    if (proteinNum === null) {
      Alert.alert('Validation Error', 'Please enter valid protein amount.');
      return;
    }
    if (carbsNum === null) {
      Alert.alert('Validation Error', 'Please enter valid carbs amount.');
      return;
    }
    if (fatNum === null) {
      Alert.alert('Validation Error', 'Please enter valid fat amount.');
      return;
    }

    logNutrition({
      userId: 'current_user',
      date: new Date().toISOString().split('T')[0],
      mealType,
      calories: caloriesNum,
      protein: proteinNum,
      carbs: carbsNum,
      fat: fatNum,
      notes,
      photoUri,
      status: 'logged',
    });

    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setNotes('');
    setPhotoUri(undefined);
    setSelectedPreset('');
    setMealType('breakfast');
    setShowScanner(false);

    Alert.alert('Success', 'Nutrition logged!');
    onSubmit?.();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Log Nutrition</Text>

      <Text style={styles.label}>Meal Type</Text>
      <View style={styles.mealTypeRow}>
        {MEAL_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.mealTypeBtn, mealType === type && styles.mealTypeBtnActive]}
            onPress={() => setMealType(type)}
          >
            <Text style={[styles.mealTypeBtnText, mealType === type && styles.mealTypeBtnTextActive]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Meal Presets */}
      <Text style={styles.label}>Quick Presets</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
        <View style={styles.presetsRow}>
          {MEAL_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.name}
              style={[styles.presetChip, selectedPreset === preset.name && styles.presetChipActive]}
              onPress={() => applyPreset(preset)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.presetChipText,
                  selectedPreset === preset.name && styles.presetChipTextActive,
                ]}
              >
                {preset.name}
              </Text>
              <Text style={styles.presetChipCals}>{preset.calories} kcal</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Scan / Photo toggle */}
      <TouchableOpacity
        style={styles.scanToggle}
        onPress={() => setShowScanner((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={styles.scanToggleText}>
          {showScanner ? '▲ Hide Scanner' : '📷 Scan / Identify Meal'}
        </Text>
      </TouchableOpacity>

      {showScanner && (
        <View style={styles.scannerPanel}>
          <MealPhotoCapture onMealDetected={applyPreset} />
        </View>
      )}

      <Text style={styles.label}>Calories</Text>
      <TextInput
        style={styles.input}
        value={calories}
        onChangeText={setCalories}
        placeholder="e.g. 500"
        placeholderTextColor={Colors.text.muted}
        keyboardType="numeric"
      />

      <View style={styles.macroRow}>
        <View style={styles.macroField}>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={setProtein}
            placeholder="0"
            placeholderTextColor={Colors.text.muted}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.macroField}>
          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            value={carbs}
            onChangeText={setCarbs}
            placeholder="0"
            placeholderTextColor={Colors.text.muted}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.macroField}>
          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            value={fat}
            onChangeText={setFat}
            placeholder="0"
            placeholderTextColor={Colors.text.muted}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Any notes about this meal..."
        placeholderTextColor={Colors.text.muted}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Log Nutrition</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  mealTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  mealTypeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mealTypeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mealTypeBtnText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  mealTypeBtnTextActive: {
    color: Colors.text.primary,
  },
  presetsScroll: {
    marginBottom: Spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  presetChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    minWidth: 110,
  },
  presetChipActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}22`,
  },
  presetChipText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  presetChipTextActive: {
    color: Colors.primary,
  },
  presetChipCals: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  scanToggle: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  scanToggleText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  scannerPanel: {
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  macroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  macroField: {
    flex: 1,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  submitBtnText: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
});
