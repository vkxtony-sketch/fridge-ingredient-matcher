// Pantry Chef - Recipe Index Builder (Vector Indexing Layer)

import { createEmbedding, recipeToText } from "./embeddingService.js";
import { vectorStore } from "./vectorStore.js";

// Build embeddings for all recipes and store in vector DB
export function indexRecipes(recipes = []) {
  recipes.forEach(recipe => {
    const text = recipeToText(recipe);
    const embedding = createEmbedding(text);

    vectorStore.add(recipe.idMeal, embedding, {
      name: recipe.strMeal,
      image: recipe.strMealThumb
    });
  });
}

// Query vector DB using ingredients
export function searchRecipesByVector(userIngredients = [], topK = 5) {
  const queryText = userIngredients.join(" ");
  const queryEmbedding = createEmbedding(queryText);

  const results = vectorStore.search(queryEmbedding, topK);

  return results.map(r => ({
    id: r.id,
    name: r.metadata.name,
    image: r.metadata.image,
    score: Math.round(r.score * 100)
  }));
}