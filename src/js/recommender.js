// Pantry Chef Recommendation Engine
import { calculateFinalScore, calculateUserPreferenceScore, calculateCookingDifficultyScore } from "./scoring.js";

export function buildRecommendationFeed(userIngredients, recipes, userProfile = {}) {
  return recipes.map(recipe => {
    const ingredientScore = recipe.matchPercentage || 0;
    const efficiencyScore = recipe.efficiency || 50;

    const preferenceScore = calculateUserPreferenceScore(recipe, userProfile);
    const difficultyScore = calculateCookingDifficultyScore(recipe);

    const finalScore = calculateFinalScore({
      ingredientScore,
      efficiencyScore,
      preferenceScore,
      difficultyScore
    });

    return {
      ...recipe,
      scores: {
        ingredientScore,
        efficiencyScore,
        preferenceScore,
        difficultyScore,
        finalScore
      }
    };
  }).sort((a, b) => b.scores.finalScore - a.scores.finalScore);
}