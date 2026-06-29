function normalize(text) {
  return text.toLowerCase().trim();
}

function calculateIngredientOverlap(userIngredients, recipeName, recipeIngredients = []) {
  const user = userIngredients.map(normalize);
  const recipe = recipeIngredients.map(normalize);

  let matches = 0;

  for (const u of user) {
    if (recipeName.toLowerCase().includes(u)) matches++;
    if (recipe.some(r => r.includes(u))) matches++;
  }

  const max = Math.max(user.length, 1);
  return Math.min(100, Math.round((matches / max) * 100));
}

function calculateCookingEfficiency(recipe = {}) {
  // placeholder scoring (future: time, steps, complexity)
  return recipe.strInstructions ? 50 : 20;
}

export function findMatchingRecipes(userIngredients, recipes) {
  const enriched = recipes.map(r => {
    const ingredientScore = calculateIngredientOverlap(
      userIngredients,
      r.strMeal,
      r.ingredients || []
    );

    const efficiency = calculateCookingEfficiency(r);

    const score =
      ingredientScore * 0.7 +
      efficiency * 0.3;

    return {
      id: r.idMeal,
      name: r.strMeal,
      image: r.strMealThumb,
      matchPercentage: Math.round(score),
      ingredientScore,
      efficiency
    };
  });

  return enriched.sort((a, b) => b.matchPercentage - a.matchPercentage);
}