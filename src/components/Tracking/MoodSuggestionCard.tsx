/**
 * MoodSuggestionCard — Displays a contextual mood suggestion before the user
 * logs their mood.  The user can accept the suggested value (pre-selecting
 * that emoji) or ignore it and pick any mood themselves.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MoodSuggestion } from '../../services/moodSuggestions';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface Props {
  suggestion: MoodSuggestion | null;
  loading: boolean;
  onAccept: (mood: 1 | 2 | 3 | 4 | 5) => void;
  onDismiss: () => void;
  dismissed: boolean;
}

const MoodSuggestionCard = ({ suggestion, loading, onAccept, onDismiss, dismissed }: Props) => {
  if (dismissed || (!loading && !suggestion)) return null;

  return (
    <View style={styles.card}>
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.secondary} />
          <Text style={styles.loadingText}>Getting suggestion…</Text>
        </View>
      ) : suggestion ? (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.emoji}>{suggestion.emoji}</Text>
            <View style={styles.textBlock}>
              <Text style={styles.label}>Smart Suggestion</Text>
              <Text style={styles.message}>{suggestion.message}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => onAccept(suggestion.expectedMood)}
            >
              <Text style={styles.acceptBtnText}>
                Use suggestion (mood {suggestion.expectedMood})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
              <Text style={styles.dismissBtnText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: `${colors.secondary}12`,
    borderWidth: 1.5,
    borderColor: `${colors.secondary}40`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  emoji: { fontSize: 28, lineHeight: 34 },
  textBlock: { flex: 1 },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.size.md,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.surface,
  },
  dismissBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dismissBtnText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
});

export default MoodSuggestionCard;
