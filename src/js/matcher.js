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

  let score = 0;

  for (const ing of recipeIngredients) {
    const clean = ing.toLowerCase();
    const words = clean.split(/[\s,()-]+/);

    if (user.some(u => words.includes(u))) {
      score++;
    }
  }

  return recipeIngredients.length
    ? Math.round((score / recipeIngredients.length) * 100)
    : 0;
}

export function findMatchingRecipes(userIngredients, recipes) {
  const results = recipes.map(recipe => {
    const ingredients = extractIngredients(recipe);

    return {
      id: recipe.idMeal,
      name: recipe.strMeal,

      image: recipe.strMealThumb?.startsWith("http")
        ? recipe.strMealThumb
        : "https://via.placeholder.com/400x300?text=No+Image",

      ingredients,
      instructions: recipe.strInstructions || "No instructions available.",
      matchPercentage: calculateMatch(userIngredients, ingredients)
    };
  });

  // ⚡ FAST PATH: always show 100% matches first
  const perfect = [];
  const others = [];

  for (const r of results) {
    if (r.matchPercentage === 100) perfect.push(r);
    else others.push(r);
  }

  others.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return [...perfect, ...others];
}