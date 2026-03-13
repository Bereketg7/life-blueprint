import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { borderRadius as BorderRadius, colors as Colors, spacing as Spacing, typography as Typography } from '../../styles/theme';
import { MealPreset, MEAL_PRESETS } from '../../services/mealPresets';
import { recognizeMealFromPhoto } from '../../services/mealRecognition';

interface MealPhotoCaptureProps {
  onMealDetected: (preset: MealPreset, confidence: number, photoUri?: string) => void;
}

type Tab = 'photo' | 'gallery' | 'quick';

const MealPhotoCapture: React.FC<MealPhotoCaptureProps> = ({ onMealDetected }) => {
  const [activeTab, setActiveTab] = useState<Tab>('photo');
  const [recognizing, setRecognizing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<MealPreset | null>(null);

  const TABS: { key: Tab; label: string; emoji: string }[] = [
    { key: 'photo', label: 'Take Photo', emoji: '📷' },
    { key: 'gallery', label: 'Gallery', emoji: '🖼️' },
    { key: 'quick', label: 'Quick Select', emoji: '⚡' },
  ];

  const simulateCapture = async (photoUri: string) => {
    setRecognizing(true);
    try {
      const result = await recognizeMealFromPhoto(photoUri);
      onMealDetected(result.meal, result.confidence, photoUri);
    } catch {
      Alert.alert('Recognition failed', 'Could not identify the meal. Please enter manually.');
    } finally {
      setRecognizing(false);
    }
  };

  const handleTakePhoto = () => {
    // In production: use expo-image-picker with camera
    Alert.alert(
      '📷 Camera',
      'Camera access requires expo-image-picker. For now, a sample meal will be identified.',
      [
        {
          text: 'Simulate Scan',
          onPress: () => simulateCapture('camera://mock-capture'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleGallery = () => {
    // In production: use expo-image-picker with gallery
    Alert.alert(
      '🖼️ Gallery',
      'Photo library access requires expo-image-picker. For now, a sample meal will be identified.',
      [
        {
          text: 'Simulate Scan',
          onPress: () => simulateCapture('gallery://mock-image'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleQuickSelect = () => {
    if (!selectedPreset) {
      Alert.alert('Select a meal', 'Please pick a meal from the list first.');
      return;
    }
    onMealDetected(selectedPreset, 1.0);
  };

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      {activeTab === 'photo' && (
        <View style={styles.panel}>
          <Text style={styles.panelHint}>Point your camera at a meal to auto-detect nutrition</Text>
          {recognizing ? (
            <View style={styles.recognizing}>
              <ActivityIndicator color={Colors.primary} size="large" />
              <Text style={styles.recognizingText}>Analyzing meal…</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.captureBtn} onPress={handleTakePhoto} activeOpacity={0.8}>
              <Text style={styles.captureBtnEmoji}>📷</Text>
              <Text style={styles.captureBtnText}>Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab === 'gallery' && (
        <View style={styles.panel}>
          <Text style={styles.panelHint}>Select a photo from your gallery to identify the meal</Text>
          {recognizing ? (
            <View style={styles.recognizing}>
              <ActivityIndicator color={Colors.primary} size="large" />
              <Text style={styles.recognizingText}>Analyzing meal…</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.captureBtn} onPress={handleGallery} activeOpacity={0.8}>
              <Text style={styles.captureBtnEmoji}>🖼️</Text>
              <Text style={styles.captureBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab === 'quick' && (
        <View style={styles.panel}>
          <Text style={styles.panelHint}>Pick a common meal to instantly fill in nutrition data</Text>
          <View style={styles.presetList}>
            {MEAL_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.name}
                style={[
                  styles.presetItem,
                  selectedPreset?.name === preset.name && styles.presetItemActive,
                ]}
                onPress={() => setSelectedPreset(preset)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.presetName,
                    selectedPreset?.name === preset.name && styles.presetNameActive,
                  ]}
                >
                  {preset.name}
                </Text>
                <Text style={styles.presetCals}>{preset.calories} kcal</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.captureBtn, !selectedPreset && styles.captureBtnDisabled]}
            onPress={handleQuickSelect}
            disabled={!selectedPreset}
            activeOpacity={0.8}
          >
            <Text style={styles.captureBtnText}>
              {selectedPreset ? `Use "${selectedPreset.name}"` : 'Select a meal above'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  tabLabelActive: {
    color: Colors.surface,
  },
  panel: {
    gap: Spacing.sm,
  },
  panelHint: {
    fontSize: Typography.size.sm,
    color: Colors.text.light,
    textAlign: 'center',
  },
  recognizing: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  recognizingText: {
    fontSize: Typography.size.md,
    color: Colors.text.secondary,
  },
  captureBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  captureBtnDisabled: {
    opacity: 0.45,
  },
  captureBtnEmoji: {
    fontSize: 18,
  },
  captureBtnText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.surface,
  },
  presetList: {
    gap: Spacing.xs,
    maxHeight: 200,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  presetItemActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}22`,
  },
  presetName: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
    flex: 1,
  },
  presetNameActive: {
    color: Colors.primary,
  },
  presetCals: {
    fontSize: Typography.size.xs,
    color: Colors.text.light,
  },
});

export default MealPhotoCapture;
