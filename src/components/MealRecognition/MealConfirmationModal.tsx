import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MealRecognitionResult } from '../../types';

interface Props {
  visible: boolean;
  result: MealRecognitionResult | null;
  onConfirm: (result: MealRecognitionResult) => void;
  onCancel: () => void;
}

const MealConfirmationModal: React.FC<Props> = ({ visible, result, onConfirm, onCancel }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Meal Identified</Text>
        {result && (
          <>
            <Text style={styles.mealName}>{result.mealName}</Text>
            <Text style={styles.confidence}>Confidence: {result.confidence}%</Text>
            <View style={styles.macros}>
              <Text style={styles.macro}>Calories: {result.suggestedMacros.calories}</Text>
              <Text style={styles.macro}>Protein: {result.suggestedMacros.protein}g</Text>
              <Text style={styles.macro}>Carbs: {result.suggestedMacros.carbs}g</Text>
              <Text style={styles.macro}>Fat: {result.suggestedMacros.fat}g</Text>
            </View>
            <TouchableOpacity style={styles.confirm} onPress={() => onConfirm(result)}>
              <Text style={styles.confirmText}>Log This Meal</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { backgroundColor: '#1A1A2E', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  mealName: { color: '#6C63FF', fontSize: 18, fontWeight: '600' },
  confidence: { color: '#B0B0CC', marginVertical: 4 },
  macros: { backgroundColor: '#16213E', borderRadius: 12, padding: 12, marginVertical: 8 },
  macro: { color: '#fff', marginBottom: 4 },
  confirm: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  confirmText: { color: '#fff', fontWeight: '700' },
  cancel: { alignItems: 'center', padding: 12 },
  cancelText: { color: '#B0B0CC' },
});

export default MealConfirmationModal;
