// Pantry Chef - Embedding Service (Vector Generation Layer)
// This simulates real embeddings (FAISS / OpenAI style) using deterministic hashing

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seedRandom(seed) {
  return function () {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

// Convert text → fixed-length vector (simulated embedding)
export function createEmbedding(text, dimensions = 64) {
  const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);

  const vector = new Array(dimensions).fill(0);

  tokens.forEach((token, idx) => {
    const seed = hashString(token);
    const rand = seedRandom(seed);

    for (let i = 0; i < dimensions; i++) {
      vector[i] += (rand() - 0.5) * (1 / (idx + 1));
    }
  });

  // normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;

  return vector.map(v => v / magnitude);
}

// Convert ingredients + recipe into embedding-ready text
export function recipeToText(recipe) {
  return `${recipe.strMeal || ""} ${(recipe.ingredients || []).join(" ")} ${recipe.strInstructions || ""}`;
}

export function ingredientsToText(ingredients = []) {
  return ingredients.join(" ");
}