const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const controllerMap = new Map();

async function fetchJSON(url, timeout = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

// ⚡ FAST: single request per ingredient
async function getMealsByIngredient(ingredient) {
  const data = await fetchJSON(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  return data.meals || [];
}

export async function searchMultipleIngredients(ingredients) {
  if (!ingredients?.length) return [];

  // parallel fetch (fast)
  const results = await Promise.all(
    ingredients.map(i => getMealsByIngredient(i))
  );

  // dedupe
  const map = new Map();

  for (const list of results) {
    for (const meal of list) {
      map.set(meal.idMeal, meal);
    }
  }

  // limit early for speed
  return Array.from(map.values()).slice(0, 10);
}