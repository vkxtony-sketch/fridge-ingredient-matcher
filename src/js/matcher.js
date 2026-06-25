export function findMatchingRecipes(userIngredients, recipes) {
  const normalizedIngredients = userIngredients.map(item =>
    item.trim().toLowerCase()
  );

  const matches = recipes
    .map(recipe => {
      const matchingIngredients = recipe.ingredients.filter(ingredient =>
        normalizedIngredients.includes(ingredient.toLowerCase())
      );

      const missingIngredients = recipe.ingredients.filter(
        ingredient => !normalizedIngredients.includes(ingredient.toLowerCase())
      );

      return {
        ...recipe,
        matchCount: matchingIngredients.length,
        missingIngredients,
        matchPercentage:
          (matchingIngredients.length / recipe.ingredients.length) * 100
      };
    })
    .filter(recipe => recipe.matchCount > 0)
    .sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }

      return b.matchCount - a.matchCount;
    });

  return matches;
}
