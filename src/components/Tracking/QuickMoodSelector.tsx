import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';
import { MOOD_EMOJIS } from '../../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type MoodValue = 1 | 2 | 3 | 4;

export { MOOD_EMOJIS };

interface ExpandableSection {
  key: string;
  label: string;
  children: React.ReactNode;
}

interface Props {
  mood: MoodValue;
  onMoodChange: (value: MoodValue) => void;
  /** Optional collapsible detail sections rendered below the emoji row */
  expandableSections?: ExpandableSection[];
}

const QuickMoodSelector = ({ mood, onMoodChange, expandableSections = [] }: Props) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectedMood = MOOD_EMOJIS.find(m => m.value === mood)!;

  return (
    <View>
      {/* Emoji row */}
      <View style={styles.emojiRow}>
        {MOOD_EMOJIS.map(m => (
          <TouchableOpacity
            key={m.value}
            style={[styles.emojiBtn, mood === m.value && styles.emojiBtnSelected]}
            onPress={() => onMoodChange(m.value)}
            accessibilityLabel={m.label}
            accessibilityRole="button"
          >
            <Text style={[styles.emojiText, mood === m.value && styles.emojiTextSelected]}>
              {m.emoji}
            </Text>
            <Text style={[styles.emojiLabel, mood === m.value && styles.emojiLabelSelected]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback badge */}
      <View style={styles.feedbackBadge}>
        <Text style={styles.feedbackText}>
          {selectedMood.emoji} You're feeling {selectedMood.label.toLowerCase()} today
        </Text>
      </View>

      {/* Optional expandable detail sections */}
      {expandableSections.map(section => (
        <View key={section.key} style={styles.expandableContainer}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSection(section.key)}
          >
            <Text style={styles.expandableLabel}>{section.label}</Text>
            <Text style={styles.expandableChevron}>
              {openSections.has(section.key) ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {openSections.has(section.key) && (
            <View style={styles.expandableContent}>{section.children}</View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  emojiBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emojiBtnSelected: {
    borderColor: colors.secondary,
    backgroundColor: `${colors.secondary}18`,
    transform: [{ scale: 1.05 }],
  },
  emojiText: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  emojiTextSelected: {
    fontSize: 40,
  },
  emojiLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emojiLabelSelected: {
    color: colors.secondary,
    fontWeight: typography.weight.semibold,
  },
  feedbackBadge: {
    backgroundColor: `${colors.secondary}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: typography.size.sm,
    color: colors.secondary,
    fontWeight: typography.weight.semibold,
  },
  expandableContainer: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  expandableLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  expandableChevron: {
    fontSize: typography.size.xs,
    color: colors.text.light,
  },
  expandableContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
});

export default QuickMoodSelector;
