import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../styles/theme';

interface Props {
  onPress: () => void;
  disabled?: boolean;
}

const PhotoUploadButton: React.FC<Props> = ({ onPress, disabled = false }) => (
  <TouchableOpacity
    style={[styles.btn, disabled && styles.btnDisabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.75}
    accessibilityLabel="Take a photo of your meal"
    accessibilityRole="button"
  >
    <Text style={styles.icon}>📷</Text>
    <Text style={styles.label}>Photo</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}18`,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.primary,
  },
});

export default PhotoUploadButton;
