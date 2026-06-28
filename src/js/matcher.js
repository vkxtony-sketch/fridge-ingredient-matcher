function calculateMatch(userIngredients, recipeName) {
  const user = userIngredients.map(i => i.toLowerCase().trim());
  const name = recipeName.toLowerCase();

  let score = 0;

  for (const u of user) {
    if (name.includes(u)) score++;
  }

  return user.length ? Math.round((score / user.length) * 100) : 0;
}

export function findMatchingRecipes(userIngredients, recipes) {
  const enriched = recipes.map(r => ({
    id: r.idMeal,
    name: r.strMeal,
    image: r.strMealThumb,
    ingredients: [],
    instructions: "Open recipe for details",
    matchPercentage: calculateMatch(userIngredients, r.strMeal)
  }));

  const perfect = [];
  const others = [];

  for (const r of enriched) {
    if (r.matchPercentage >= 100) perfect.push(r);
    else others.push(r);
  }

  others.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return [...perfect, ...others];
}