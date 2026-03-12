export interface MealPreset {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MEAL_PRESETS: MealPreset[] = [
  { name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 58, fat: 7 },
  { name: 'Scrambled Eggs (3)', calories: 280, protein: 21, carbs: 2, fat: 20 },
  { name: 'Greek Yogurt & Granola', calories: 320, protein: 18, carbs: 42, fat: 8 },
  { name: 'Avocado Toast', calories: 380, protein: 10, carbs: 36, fat: 22 },
  { name: 'Protein Smoothie', calories: 300, protein: 30, carbs: 28, fat: 6 },
  { name: 'Chicken & Rice', calories: 450, protein: 42, carbs: 48, fat: 8 },
  { name: 'Grilled Salmon', calories: 400, protein: 38, carbs: 0, fat: 26 },
  { name: 'Caesar Salad', calories: 310, protein: 14, carbs: 20, fat: 22 },
  { name: 'Turkey Sandwich', calories: 420, protein: 28, carbs: 44, fat: 14 },
  { name: 'Veggie Stir Fry', calories: 280, protein: 10, carbs: 42, fat: 9 },
  { name: 'Pasta Bolognese', calories: 560, protein: 28, carbs: 72, fat: 16 },
  { name: 'Beef Burrito', calories: 580, protein: 32, carbs: 66, fat: 20 },
  { name: 'Grilled Chicken Breast', calories: 240, protein: 44, carbs: 0, fat: 5 },
  { name: 'Mixed Nuts (handful)', calories: 180, protein: 5, carbs: 8, fat: 16 },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Apple with Peanut Butter', calories: 260, protein: 7, carbs: 34, fat: 12 },
  { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fat: 6 },
  { name: 'Cottage Cheese', calories: 150, protein: 25, carbs: 6, fat: 2 },
];
