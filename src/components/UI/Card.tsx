import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 4,
}) => {
  const shadowStyle =
    elevation <= 2 ? Shadows.sm : elevation <= 5 ? Shadows.md : Shadows.lg;

  const containerStyle = [styles.card, shadowStyle, { elevation }, style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default Card;
