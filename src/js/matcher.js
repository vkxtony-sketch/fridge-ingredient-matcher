function extractIngredients(recipe) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ing && ing.trim()) {
      ingredients.push(`${measure ? measure + " " : ""}${ing}`.trim());
    }
  }

  return ingredients;
}

function calculateMatch(userIngredients, recipeIngredients) {
  const user = userIngredients.map(i => i.toLowerCase());

  let matchCount = 0;

  recipeIngredients.forEach(ing => {
    const clean = ing.toLowerCase();
    if (user.some(u => clean.includes(u))) {
      matchCount++;
    }
  });

  return Math.round((matchCount / recipeIngredients.length) * 100);
}

export function findMatchingRecipes(userIngredients, recipes) {
  return recipes.map(recipe => {
    const ingredients = extractIngredients(recipe);

    return {
      id: recipe.idMeal,
      name: recipe.strMeal,

      // 🔥 THIS FIXES YOUR IMAGE PROBLEM
      image: recipe.strMealThumb,

      ingredients,
      instructions: recipe.strInstructions || "No instructions available.",
      matchPercentage: calculateMatch(userIngredients, ingredients)
    };
  });
}
