import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/theme';
import { MealRecognitionResult } from '../../types';

interface MealConfirmationModalProps {
  visible: boolean;
  result: MealRecognitionResult | null;
  onConfirm: (result: MealRecognitionResult) => void;
  onReject: () => void;
  onClose: () => void;
}

function confidenceLabel(score: number): { text: string; color: string } {
  if (score >= 0.85) return { text: 'High confidence', color: Colors.success };
  if (score >= 0.65) return { text: 'Medium confidence', color: Colors.warning };
  return { text: 'Low confidence', color: Colors.error };
}

export const MealConfirmationModal: React.FC<MealConfirmationModalProps> = ({
  visible,
  result,
  onConfirm,
  onReject,
  onClose,
}) => {
  const [editedResult, setEditedResult] = useState<MealRecognitionResult | null>(result);

  // Sync internal state when parent updates result
  React.useEffect(() => {
    setEditedResult(result);
  }, [result]);

  if (!editedResult) return null;

  const { text: confText, color: confColor } = confidenceLabel(editedResult.overallConfidence);

  const updateItemName = (index: number, name: string) => {
    const updatedItems = editedResult.foodItems.map((item, i) =>
      i === index ? { ...item, name } : item
    );
    setEditedResult({ ...editedResult, foodItems: updatedItems });
  };

  const updateItemPortion = (
    index: number,
    portionSize: MealRecognitionResult['foodItems'][0]['portionSize']
  ) => {
    const multipliers = { small: 0.6, medium: 1.0, large: 1.4, extra_large: 1.8 };
    const currentMultiplier = multipliers[editedResult.foodItems[index].portionSize];
    const newMultiplier = multipliers[portionSize];
    const ratio = newMultiplier / currentMultiplier;

    const updatedItems = editedResult.foodItems.map((item, i) => {
      if (i !== index) return item;
      return {
        ...item,
        portionSize,
        calories: Math.round(item.calories * ratio),
        protein: Math.round(item.protein * ratio * 10) / 10,
        carbs: Math.round(item.carbs * ratio * 10) / 10,
        fat: Math.round(item.fat * ratio * 10) / 10,
      };
    });

    const totals = updatedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setEditedResult({
      ...editedResult,
      foodItems: updatedItems,
      totalCalories: totals.calories,
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFat: Math.round(totals.fat * 10) / 10,
    });
  };

  const PORTION_OPTIONS: MealRecognitionResult['foodItems'][0]['portionSize'][] = [
    'small', 'medium', 'large', 'extra_large',
  ];
  const PORTION_LABELS: Record<string, string> = {
    small: 'S', medium: 'M', large: 'L', extra_large: 'XL',
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Meal</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.confidenceBadge}>
          <Text style={[styles.confidenceText, { color: confColor }]}>
            {confText} ({Math.round(editedResult.overallConfidence * 100)}%)
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {editedResult.foodItems.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <TextInput
                style={styles.itemNameInput}
                value={item.name}
                onChangeText={(text) => updateItemName(index, text)}
                placeholderTextColor={Colors.text.muted}
              />

              <View style={styles.portionRow}>
                <Text style={styles.portionLabel}>Portion:</Text>
                {PORTION_OPTIONS.map((portion) => (
                  <TouchableOpacity
                    key={portion}
                    style={[
                      styles.portionButton,
                      item.portionSize === portion && styles.portionButtonActive,
                    ]}
                    onPress={() => updateItemPortion(index, portion)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.portionButtonText,
                        item.portionSize === portion && styles.portionButtonTextActive,
                      ]}
                    >
                      {PORTION_LABELS[portion]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.macroRow}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{item.calories}</Text>
                  <Text style={styles.macroLabel}>kcal</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#FF6B6B' }]}>{item.protein}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#FFC107' }]}>{item.carbs}g</Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#4CAF50' }]}>{item.fat}g</Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.totalsCard}>
            <Text style={styles.totalsTitle}>Total</Text>
            <View style={styles.macroRow}>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, styles.totalValue]}>{editedResult.totalCalories}</Text>
                <Text style={styles.macroLabel}>kcal</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, styles.totalValue, { color: '#FF6B6B' }]}>
                  {editedResult.totalProtein}g
                </Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, styles.totalValue, { color: '#FFC107' }]}>
                  {editedResult.totalCarbs}g
                </Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, styles.totalValue, { color: '#4CAF50' }]}>
                  {editedResult.totalFat}g
                </Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject} activeOpacity={0.8}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => onConfirm(editedResult)}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>✓  Log Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: Colors.text.secondary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  confidenceText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  itemNameInput: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.xs,
  },
  portionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  portionLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  portionButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  portionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  portionButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
  },
  portionButtonTextActive: {
    color: Colors.text.primary,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xs,
  },
  macroItem: {
    alignItems: 'center',
    gap: 2,
  },
  macroValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  macroLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
  totalsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '55',
    gap: Spacing.sm,
  },
  totalsTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  totalValue: {
    fontSize: Typography.sizes.lg,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  rejectButtonText: {
    color: Colors.error,
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.md,
  },
  confirmButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  confirmButtonText: {
    color: Colors.text.primary,
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.md,
  },
});

export default MealConfirmationModal;
