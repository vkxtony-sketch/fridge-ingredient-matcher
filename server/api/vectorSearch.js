import { indexRecipes, searchRecipesByVector } from "../vector/recipeIndex.js";

// Simple request handler (Express-style)
export function vectorSearchHandler(req, res) {
  try {
    const { ingredients, recipes } = req.body;

    if (recipes && recipes.length) {
      indexRecipes(recipes);
    }

    const results = searchRecipesByVector(ingredients || [], 10);

    res.json({
      success: true,
      results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}