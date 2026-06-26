function extractIngredients(recipe) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ing && ing.trim()) {
      ingredients.push(
        `${measure ? measure + " " : ""}${ing}`.trim()
      );
    }
  }

  return ingredients;
}

function calculateMatch(userIngredients, recipeIngredients) {
  const user = userIngredients.map(i => i.toLowerCase().trim());

  let matchCount = 0;

  recipeIngredients.forEach(ing => {
    const clean = ing.toLowerCase();

    if (user.some(u => clean.includes(u))) {
      matchCount++;
    }
  });

  return recipeIngredients.length === 0
    ? 0
    : Math.round((matchCount / recipeIngredients.length) * 100);
}

export function findMatchingRecipes(userIngredients, recipes) {
  const results = recipes.map(recipe => {
    const ingredients = extractIngredients(recipe);

    const matchPercentage = calculateMatch(userIngredients, ingredients);

    return {
      id: recipe.idMeal,
      name: recipe.strMeal,

      // 🔥 IMAGE FIX (THIS is what you were missing before)
      image: recipe.strMealThumb,

      ingredients,
      instructions: recipe.strInstructions || "No instructions available.",

      matchPercentage
    };
  });

  // 🔥 SORT HIGHEST MATCH FIRST 
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
