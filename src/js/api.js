const API_BASE = "https://www.themealdb.com/api/json/v1/1";

/**
 * Search recipes by a single ingredient
 */
export async function searchRecipesByIngredient(ingredient) {
    try {
        const response = await fetch(
            `${API_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`
        );

        const data = await response.json();

        return data.meals || [];
    } catch (error) {
        console.error("Ingredient search failed:", error);
        return [];
    }
}

/**
 * Get complete recipe details
 */
export async function getRecipeDetails(id) {
    try {
        const response = await fetch(
            `${API_BASE}/lookup.php?i=${id}`
        );

        const data = await response.json();

        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error("Recipe lookup failed:", error);
        return null;
    }
}

/**
 * Convert MealDB recipe into our application's format
 */
export function normalizeRecipe(recipe) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(ingredient.trim().toLowerCase());
        }
    }

    return {
        id: recipe.idMeal,
        name: recipe.strMeal,
        category: recipe.strCategory,
        cuisine: recipe.strArea,
        image: recipe.strMealThumb,
        instructions: recipe.strInstructions,
        ingredients
    };
}

/**
 * Search using multiple ingredients
 */
export async function searchMultipleIngredients(userIngredients) {

    const recipeMap = new Map();

    for (const ingredient of userIngredients) {

        const recipes = await searchRecipesByIngredient(ingredient);

        recipes.forEach(recipe => {
            recipeMap.set(recipe.idMeal, recipe);
        });
    }

    const detailedRecipes = [];

    for (const recipe of recipeMap.values()) {

        const fullRecipe = await getRecipeDetails(recipe.idMeal);

        if (fullRecipe) {
            detailedRecipes.push(
                normalizeRecipe(fullRecipe)
            );
        }
    }

    return detailedRecipes;
}
