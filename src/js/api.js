const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?"
];

const cache = new Map();

async function fetchMealDB(url) {
  const cacheKey = url;

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url));
      const data = await res.json();

      if (data) {
        cache.set(cacheKey, data);
        return data;
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error("All proxies failed");
}

async function getMealsByIngredient(ingredient) {
  const data = await fetchMealDB(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  return data.meals || [];
}

async function getRecipeDetails(id) {
  const data = await fetchMealDB(
    `${BASE_URL}/lookup.php?i=${id}`
  );

  return data.meals?.[0] || null;
}

export async function searchMultipleIngredients(ingredients) {
  if (!ingredients?.length) return [];

  const allResults = await Promise.all(
    ingredients.map(i => getMealsByIngredient(i))
  );

  const unique = {};
  allResults.flat().forEach(meal => {
    unique[meal.idMeal] = meal;
  });

  const uniqueMeals = Object.values(unique);
  if (!uniqueMeals.length) return [];

  const fullRecipes = await Promise.all(
    uniqueMeals.map(m => getRecipeDetails(m.idMeal))
  );

  return fullRecipes.filter(Boolean);
}