const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const PROXY = "https://api.allorigins.win/raw?url=";

async function fetchMealDB(url) {
  const res = await fetch(PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

/**
 * Get meals by ingredient (basic search)
 */
export async function searchRecipesByIngredient(ingredient) {
  const data = await fetchMealDB(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  return data.meals || [];
}

/**
 * Get full meal details (safe + consistent)
 */
export async function getRecipeDetails(id) {
  const data = await fetchMealDB(
    `${BASE_URL}/lookup.php?i=${id}`
  );

  return data.meals?.[0] || null;
}

/**
 * Full pipeline: ingredient → meals → full recipes
 */
export async function searchMultipleIngredients(ingredients) {
  if (!ingredients?.length) return [];

  const baseMeals = await searchRecipesByIngredient(ingredients[0]);

  if (!baseMeals.length) return [];

  const fullRecipes = await Promise.all(
    baseMeals.map(async (meal) => {
      try {
        const full = await getRecipeDetails(meal.idMeal);
        return full;
      } catch (e) {
        return null;
      }
    })
  );

  return fullRecipes.filter(Boolean);
}
