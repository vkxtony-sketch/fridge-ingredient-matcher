function extractIngredients(recipe) {
  const list = [];

  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ing && ing.trim()) {
      list.push(`${measure ? measure + " " : ""}${ing}`.trim());
    }
  }

  return list;
}

function calculateMatch(userIngredients, recipeIngredients) {
  const user = userIngredients.map(i => i.toLowerCase().trim());

  let matches = 0;

  recipeIngredients.forEach(ing => {
    const clean = ing.toLowerCase();

    if (user.some(u => clean.includes(u))) {
      matches++;
    }
  });

  return recipeIngredients.length
    ? Math.round((matches / recipeIngredients.length) * 100)
    : 0;
}

export function findMatchingRecipes(userIngredients, recipes) {
  const results = recipes.map(recipe => {
    const ingredients = extractIngredients(recipe);

    return {
      id: recipe.idMeal,
      name: recipe.strMeal,

      // FIXED IMAGE
      image: recipe.strMealThumb,

      ingredients,
      instructions: recipe.strInstructions || "No instructions available.",

      matchPercentage: calculateMatch(userIngredients, ingredients)
    };
  });

  // 🔥 SORT FIX (MOST IMPORTANT)
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
