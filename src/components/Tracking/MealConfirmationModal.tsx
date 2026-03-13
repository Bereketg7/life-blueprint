import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MealPreset } from '../../services/mealPresets';
import { colors, typography, spacing, borderRadius, shadow } from '../../styles/theme';

export interface ConfirmedNutrition {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Props {
  visible: boolean;
  preset: MealPreset | null;
  confidence: number;
  onAccept: (nutrition: ConfirmedNutrition) => void;
  onReject: () => void;
}

const MealConfirmationModal: React.FC<Props> = ({ visible, preset, confidence, onAccept, onReject }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Sync fields when a new preset arrives
  React.useEffect(() => {
    if (preset) {
      setFoodName(preset.name);
      setCalories(String(preset.calories));
      setProtein(String(preset.protein));
      setCarbs(String(preset.carbs));
      setFat(String(preset.fat));
    }
  }, [preset]);

  const handleAccept = () => {
    onAccept({
      foodName: foodName.trim() || (preset?.name ?? ''),
      calories: parseInt(calories) || preset?.calories || 0,
      protein: parseFloat(protein) || preset?.protein || 0,
      carbs: parseFloat(carbs) || preset?.carbs || 0,
      fat: parseFloat(fat) || preset?.fat || 0,
    });
  };

  const confidencePct = Math.round(confidence * 100);
  const confidenceColor =
    confidencePct >= 85 ? colors.success :
    confidencePct >= 70 ? colors.warning :
    colors.error;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onReject}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🍽️ Meal Detected</Text>
            <TouchableOpacity onPress={onReject} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Confidence badge */}
            <View style={[styles.confidenceBadge, { borderColor: confidenceColor }]}>
              <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                {confidencePct}% confidence
              </Text>
            </View>

            <Text style={styles.hint}>Review and edit the detected nutrition before saving.</Text>

            {/* Food name */}
            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={styles.input}
              value={foodName}
              onChangeText={setFoodName}
              placeholderTextColor={colors.text.light}
              placeholder="Meal name"
            />

            {/* Calories */}
            <Text style={styles.label}>Calories (kcal)</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholderTextColor={colors.text.light}
              placeholder="0"
            />

            {/* Macros row */}
            <Text style={styles.label}>Macronutrients</Text>
            <View style={styles.macrosRow}>
              <View style={styles.macroBlock}>
                <Text style={[styles.macroLabel, { color: colors.error }]}>Protein</Text>
                <TextInput
                  style={[styles.macroInput, { borderColor: colors.error }]}
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.text.light}
                />
                <Text style={styles.macroUnit}>g</Text>
              </View>
              <View style={styles.macroBlock}>
                <Text style={[styles.macroLabel, { color: colors.warning }]}>Carbs</Text>
                <TextInput
                  style={[styles.macroInput, { borderColor: colors.warning }]}
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.text.light}
                />
                <Text style={styles.macroUnit}>g</Text>
              </View>
              <View style={styles.macroBlock}>
                <Text style={[styles.macroLabel, { color: colors.success }]}>Fat</Text>
                <TextInput
                  style={[styles.macroInput, { borderColor: colors.success }]}
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.text.light}
                />
                <Text style={styles.macroUnit}>g</Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
              <Text style={styles.rejectBtnText}>Enter Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
              <Text style={styles.acceptBtnText}>Use This Meal ✓</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
    ...shadow.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  confidenceBadge: {
    alignSelf: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  confidenceText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  hint: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
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
  macrosRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  macroBlock: {
    flex: 1,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xs,
  },
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
  macroUnit: {
    fontSize: typography.size.xs,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rejectBtn: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  rejectBtnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  acceptBtn: {
    flex: 2,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.primary,
    ...shadow.md,
  },
  acceptBtnText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface,
  },
});

export default MealConfirmationModal;
