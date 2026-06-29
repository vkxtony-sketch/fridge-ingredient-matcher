// Pantry Chef Scoring Engine

export function calculateUserPreferenceScore(recipe, userProfile = {}) {
  const favorites = userProfile.favorites || [];
  const disliked = userProfile.disliked || [];

  let score = 50; // neutral baseline

  if (favorites.includes(recipe.idMeal)) score += 40;
  if (disliked.includes(recipe.idMeal)) score -= 60;

  return Math.max(0, Math.min(100, score));
}

export function calculateCookingDifficultyScore(recipe = {}) {
  const instructions = recipe.strInstructions || "";

  // naive heuristic: longer instructions = harder recipe
  const length = instructions.length;

  if (length < 200) return 80;
  if (length < 500) return 60;
  if (length < 1000) return 40;
  return 20;
}

export function calculateFinalScore({ ingredientScore = 0, efficiencyScore = 0, preferenceScore = 0, difficultyScore = 0 }) {
  return Math.round(
    ingredientScore * 0.4 +
    efficiencyScore * 0.2 +
    preferenceScore * 0.25 +
    difficultyScore * 0.15
  );
}