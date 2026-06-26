const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const PROXY = "https://api.allorigins.win/raw?url=";

async function fetchMealDB(url) {
  const res = await fetch(PROXY + encodeURIComponent(url));
  return res.json();
}

/**
 * Get meals for ONE ingredient
 */
async function getMealsByIngredient(ingredient) {
  const data = await fetchMealDB(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  return data.meals || [];
}

/**
 * Get full recipe details
 */
async function getRecipeDetails(id) {
  const data = await fetchMealDB(
    `${BASE_URL}/lookup.php?i=${id}`
  );

  return data.meals?.[0] || null;
}

/**
 * MAIN SEARCH (FIXED)
 * - uses ALL ingredients
 * - merges results
 * - removes duplicates
 * - fetches full recipes
 */
export async function searchMultipleIngredients(ingredients) {
  if (!ingredients?.length) return [];

  // 1. search ALL ingredients (not just first one)
  const allResults = await Promise.all(
    ingredients.map(i => getMealsByIngredient(i))
  );

  // 2. flatten + remove duplicates
  const unique = {};
  allResults.flat().forEach(meal => {
    unique[meal.idMeal] = meal;
  });

  const uniqueMeals = Object.values(unique);

  if (!uniqueMeals.length) return [];

  // 3. fetch full recipe details
  const fullRecipes = await Promise.all(
    uniqueMeals.map(m => getRecipeDetails(m.idMeal))
  );

  return fullRecipes.filter(Boolean);
}
