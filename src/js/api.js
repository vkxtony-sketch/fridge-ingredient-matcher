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
    try {
        // Search every ingredient simultaneously
        const searchResults = await Promise.all(
            userIngredients.map(ingredient =>
                searchRecipesByIngredient(ingredient)
            )
        );

        // Remove duplicate recipes
        const recipeMap = new Map();

        searchResults.flat().forEach(recipe => {
            recipeMap.set(recipe.idMeal, recipe);
        });

        // Download recipe details simultaneously
        const detailedRecipes = await Promise.all(
            [...recipeMap.values()].map(recipe =>
                getRecipeDetails(recipe.idMeal)
            )
        );

        // Convert to our app's format
        return detailedRecipes
            .filter(recipe => recipe !== null)
            .map(normalizeRecipe);

    } catch (error) {
        console.error("Recipe search failed:", error);
        return [];
    }
}
