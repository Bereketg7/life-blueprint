import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserLevel } from '../../types';
import { getTier, TIER_COLORS } from '../../services/gamification/levelingSystem';

type BadgeSize = 'small' | 'medium' | 'large';

interface LevelBadgeProps {
  level: number;
  size?: BadgeSize;
  dimmed?: boolean;
}

const SIZE_CONFIG: Record<BadgeSize, { diameter: number; fontSize: number; borderWidth: number }> = {
  small:  { diameter: 36, fontSize: 13, borderWidth: 2 },
  medium: { diameter: 56, fontSize: 20, borderWidth: 3 },
  large:  { diameter: 96, fontSize: 36, borderWidth: 4 },
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'medium',
  dimmed = false,
}) => {
  const tier = getTier(level) as UserLevel['tier'];
  const tierColor = TIER_COLORS[tier];
  const config = SIZE_CONFIG[size];
  const isLegendary = tier === 'legendary';

  return (
    <View
      style={[
        styles.badge,
        {
          width: config.diameter,
          height: config.diameter,
          borderRadius: config.diameter / 2,
          borderWidth: config.borderWidth,
          borderColor: isLegendary ? '#6C63FF' : tierColor,
          backgroundColor: isLegendary ? '#1A1A2E' : tierColor + '22',
          opacity: dimmed ? 0.4 : 1,
        },
        isLegendary && styles.legendaryBadge,
      ]}
    >
      {isLegendary && (
        <View style={[styles.legendaryGlow, { borderRadius: config.diameter / 2 }]} />
      )}
      <Text
        style={[
          styles.levelText,
          {
            fontSize: config.fontSize,
            color: isLegendary ? '#B9F2FF' : tierColor,
          },
        ]}
      >
        {level}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  legendaryBadge: {
    borderColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
  },
  legendaryGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6C63FF',
    opacity: 0.15,
  },
  levelText: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
});

export default LevelBadge;
