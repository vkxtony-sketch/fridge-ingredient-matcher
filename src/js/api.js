const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const PROXY = "https://api.allorigins.win/raw?url=";

/**
 * Safe fetch through CORS proxy
 */
async function fetchMealDB(url) {
  const res = await fetch(PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

/**
 * Search recipes by ingredient (fast lightweight results)
 */
export async function searchRecipesByIngredient(ingredient) {
  const data = await fetchMealDB(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  return data.meals || [];
}

/**
 * Get full recipe details (NO CORS ERROR NOW)
 */
export async function getRecipeDetails(id) {
  const data = await fetchMealDB(
    `${BASE_URL}/lookup.php?i=${id}`
  );

  return data.meals ? data.meals[0] : null;
}

/**
 * Search multiple ingredients and return FULL recipes
 */
export async function searchMultipleIngredients(ingredients) {
  if (!ingredients || ingredients.length === 0) return [];

  // 1. Get basic meals from first ingredient
  const basicMeals = await searchRecipesByIngredient(ingredients[0]);

  if (!basicMeals.length) return [];

  // 2. Fetch full details safely (now through proxy)
  const fullRecipes = await Promise.all(
    basicMeals.map(async (meal) => {
      try {
        return await getRecipeDetails(meal.idMeal);
      } catch (err) {
        console.warn("Recipe lookup failed:", err);
        return null;
      }
    })
  );

  return fullRecipes.filter(Boolean);
}
