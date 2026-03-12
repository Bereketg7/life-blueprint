import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/theme';
import { MealPhoto } from '../../types';

interface MealPhotoCaptureProps {
  onPhotoSelected: (photo: MealPhoto) => void;
  onAnalyze: (photo: MealPhoto) => void;
  isAnalyzing?: boolean;
}

export const MealPhotoCapture: React.FC<MealPhotoCaptureProps> = ({
  onPhotoSelected,
  onAnalyze,
  isAnalyzing = false,
}) => {
  const [photo, setPhoto] = useState<MealPhoto | null>(null);

  // Simulates picking an image.
  // In production replace with:
  //   import * as ImagePicker from 'expo-image-picker';
  //   const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.8 });
  const handleCapture = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => simulatePhotoCapture('camera'),
        },
        {
          text: 'Choose from Library',
          onPress: () => simulatePhotoCapture('library'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const simulatePhotoCapture = (source: 'camera' | 'library') => {
    const mockPhoto: MealPhoto = {
      uri: `mock://meal_photo_${Date.now()}_${source}.jpg`,
      width: 1080,
      height: 1080,
      capturedAt: new Date().toISOString(),
    };
    setPhoto(mockPhoto);
    onPhotoSelected(mockPhoto);
  };

  const handleAnalyze = () => {
    if (photo) onAnalyze(photo);
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewArea}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🍽️</Text>
            <Text style={styles.placeholderText}>Take a photo of your meal</Text>
            <Text style={styles.placeholderSubtext}>AI will identify the food and estimate nutrition</Text>
          </View>
        )}

        {photo && !isAnalyzing && (
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake} activeOpacity={0.8}>
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        )}

        {isAnalyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.analyzingText}>Analyzing meal…</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {!photo ? (
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture} activeOpacity={0.8}>
            <Text style={styles.captureButtonText}>📷  Add Photo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.captureButton, isAnalyzing && styles.disabledButton]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
            activeOpacity={0.8}
          >
            {isAnalyzing ? (
              <ActivityIndicator color={Colors.text.primary} size="small" />
            ) : (
              <Text style={styles.captureButtonText}>🔍  Analyze Meal</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  previewArea: {
    height: 280,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    ...Shadows.md,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  placeholderIcon: {
    fontSize: 56,
    marginBottom: Spacing.xs,
  },
  placeholderText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retakeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.md,
  },
  retakeText: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,13,26,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  analyzingText: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
  actions: {
    gap: Spacing.sm,
  },
  captureButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...Shadows.sm,
  },
  captureButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default MealPhotoCapture;
