import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

interface Recipe {
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  prepTime: number;
  category: string;
  color: string;
}

const RECIPES: Recipe[] = [
  {
    name: 'Protein Power Bowl',
    emoji: '🥗',
    calories: 450,
    protein: 35,
    prepTime: 15,
    category: 'Lunch',
    color: '#4CAF50',
  },
  {
    name: 'Overnight Oats',
    emoji: '🥣',
    calories: 380,
    protein: 18,
    prepTime: 5,
    category: 'Breakfast',
    color: '#FFC107',
  },
  {
    name: 'Grilled Salmon & Veggies',
    emoji: '🐟',
    calories: 520,
    protein: 42,
    prepTime: 25,
    category: 'Dinner',
    color: '#6C63FF',
  },
  {
    name: 'Greek Yogurt Parfait',
    emoji: '🫙',
    calories: 290,
    protein: 22,
    prepTime: 5,
    category: 'Snack',
    color: '#FF6B6B',
  },
];

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: recipe.color + '33' }]}>
          <Text style={styles.icon}>{recipe.emoji}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: recipe.color + '22' }]}>
            <Text style={[styles.categoryText, { color: recipe.color }]}>{recipe.category}</Text>
          </View>
        </View>
      </View>

      <View style={styles.macroRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{recipe.calories}</Text>
          <Text style={styles.macroLabel}>kcal</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{recipe.protein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{recipe.prepTime} min</Text>
          <Text style={styles.macroLabel}>Prep Time</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CommunityRecipes() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Community Recipes</Text>
      <Text style={styles.subtitle}>Healthy meals shared by the community</Text>

      {RECIPES.map((recipe) => (
        <RecipeCard key={recipe.name} recipe={recipe} />
      ))}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 30,
  },
  headerInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  recipeName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  macroRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  macroLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  macroDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  bottomPad: {
    height: Spacing.xl,
  },
});
