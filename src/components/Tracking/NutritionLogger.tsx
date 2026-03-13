import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { NutritionLog } from '../../types';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';
import { MealPreset } from '../../services/mealPresets';
import MealPhotoCapture from './MealPhotoCapture';
import MealConfirmationModal from './MealConfirmationModal';
import PhotoUploadButton from './PhotoUploadButton';

interface Props {
  onSave: (log: Omit<NutritionLog, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  userId: string;
}

type MealType = NutritionLog['mealType'];

const MEAL_TYPES: { value: MealType; label: string; emoji: string; color: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅', color: '#F59E0B' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️', color: '#10B981' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙', color: '#6C63FF' },
  { value: 'snack', label: 'Snack', emoji: '🍎', color: '#FF6584' },
];

const MacroInput = ({
  label,
  value,
  onChange,
  unit,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  color: string;
}) => (
  <View style={styles.macroBlock}>
    <Text style={[styles.macroLabel, { color }]}>{label}</Text>
    <TextInput
      style={[styles.macroInput, { borderColor: color }]}
      value={value}
      onChangeText={onChange}
      keyboardType="numeric"
      placeholder="0"
      placeholderTextColor={colors.text.light}
    />
    <Text style={styles.macroUnit}>{unit}</Text>
  </View>
);

const NutritionLogger = ({ onSave, onCancel, userId }: Props) => {
  const today = new Date().toISOString().split('T')[0];
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Photo capture state
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [detectedPreset, setDetectedPreset] = useState<MealPreset | null>(null);
  const [detectedConfidence, setDetectedConfidence] = useState(0);

  const selectedMeal = MEAL_TYPES.find(m => m.value === mealType)!;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!foodName.trim()) newErrors.foodName = 'Food name is required';
    if (!calories || parseInt(calories) <= 0) newErrors.calories = 'Enter valid calories';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      userId,
      date: today,
      mealType,
      foodName: foodName.trim(),
      calories: parseInt(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      notes: notes.trim() || undefined,
    });
  };

  const handleMealDetected = (preset: MealPreset, confidence: number, photoUri?: string) => {
    void photoUri; // reserved for future photo preview
    setDetectedPreset(preset);
    setDetectedConfidence(confidence);
    setShowPhotoCapture(false);
    setConfirming(true);
  };

  const handleConfirmAccept = (nutrition: {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    setFoodName(nutrition.foodName);
    setCalories(String(nutrition.calories));
    setProtein(String(nutrition.protein));
    setCarbs(String(nutrition.carbs));
    setFat(String(nutrition.fat));
    setErrors({});
    setConfirming(false);
    setDetectedPreset(null);
  };

  const handleConfirmReject = () => {
    setConfirming(false);
    setDetectedPreset(null);
  };

  const totalMacroCalories =
    (parseFloat(protein) || 0) * 4 +
    (parseFloat(carbs) || 0) * 4 +
    (parseFloat(fat) || 0) * 9;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Meal 🍽️</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>Meal Type</Text>
        <View style={styles.mealTypeRow}>
          {MEAL_TYPES.map(m => (
            <TouchableOpacity
              key={m.value}
              style={[
                styles.mealTypeBtn,
                mealType === m.value && { backgroundColor: m.color, borderColor: m.color },
              ]}
              onPress={() => setMealType(m.value)}
            >
              <Text style={styles.mealTypeEmoji}>{m.emoji}</Text>
              <Text style={[styles.mealTypeLabel, mealType === m.value && styles.mealTypeLabelSelected]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.foodNameRow}>
          <Text style={[styles.sectionLabel, styles.foodNameLabel]}>Food Name *</Text>
          <PhotoUploadButton onPress={() => setShowPhotoCapture(true)} />
        </View>
        <TextInput
          style={[styles.input, errors.foodName ? styles.inputError : null]}
          placeholder={`What did you have for ${selectedMeal.label.toLowerCase()}?`}
          value={foodName}
          onChangeText={setFoodName}
          placeholderTextColor={colors.text.light}
        />
        {errors.foodName ? <Text style={styles.errorText}>{errors.foodName}</Text> : null}

        <Text style={styles.sectionLabel}>Calories *</Text>
        <TextInput
          style={[styles.input, errors.calories ? styles.inputError : null]}
          placeholder="e.g. 450"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          placeholderTextColor={colors.text.light}
        />
        {errors.calories ? <Text style={styles.errorText}>{errors.calories}</Text> : null}

        <Text style={styles.sectionLabel}>Macronutrients</Text>
        <View style={styles.macrosRow}>
          <MacroInput label="Protein" value={protein} onChange={setProtein} unit="g" color={colors.error} />
          <MacroInput label="Carbs" value={carbs} onChange={setCarbs} unit="g" color={colors.warning} />
          <MacroInput label="Fat" value={fat} onChange={setFat} unit="g" color={colors.success} />
        </View>
        {totalMacroCalories > 0 && (
          <Text style={styles.macroCalcNote}>
            Macro-derived: ~{Math.round(totalMacroCalories)} kcal
          </Text>
        )}

        <Text style={styles.sectionLabel}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Restaurant, brand, serving size..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor={colors.text.light}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: selectedMeal.color }]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save {selectedMeal.label} {selectedMeal.emoji}</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Capture Modal */}
      <Modal visible={showPhotoCapture} animationType="slide" onRequestClose={() => setShowPhotoCapture(false)}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowPhotoCapture(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Identify Meal 📷</Text>
            <View style={{ width: 36 }} />
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
            <MealPhotoCapture onMealDetected={handleMealDetected} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Confirmation Modal */}
      <MealConfirmationModal
        visible={confirming}
        preset={detectedPreset}
        confidence={detectedConfidence}
        onAccept={handleConfirmAccept}
        onReject={handleConfirmReject}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: typography.size.md, color: colors.text.secondary },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  foodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  foodNameLabel: {
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
  },
  mealTypeRow: { flexDirection: 'row', gap: spacing.sm },
  mealTypeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  mealTypeEmoji: { fontSize: 22, marginBottom: spacing.xs },
  mealTypeLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  mealTypeLabelSelected: { color: colors.surface, fontWeight: typography.weight.bold },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },
  inputError: { borderColor: colors.error },
  errorText: { fontSize: typography.size.xs, color: colors.error, marginTop: spacing.xs },
  textArea: { height: 90, textAlignVertical: 'top' },
  macrosRow: { flexDirection: 'row', gap: spacing.md },
  macroBlock: { flex: 1, alignItems: 'center' },
  macroLabel: { fontSize: typography.size.xs, fontWeight: typography.weight.semibold, marginBottom: spacing.xs },
  macroInput: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.size.md,
    color: colors.text.primary,
    textAlign: 'center',
  },
  macroUnit: { fontSize: typography.size.xs, color: colors.text.light, marginTop: spacing.xs },
  macroCalcNote: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  saveBtnText: { fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.surface },
});

export default NutritionLogger;
