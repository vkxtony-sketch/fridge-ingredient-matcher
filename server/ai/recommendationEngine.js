// Pantry Chef - AI Recommendation Engine (Next Level)

// This is the first step toward a real AI-like system:
// - embedding-style similarity
// - semantic matching
// - hybrid scoring (rules + AI signals)

function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter(Boolean);
}

function buildVector(tokens) {
  const map = new Map();

  for (const t of tokens) {
    map.set(t, (map.get(t) || 0) + 1);
  }

  return map;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  const keys = new Set([...vecA.keys(), ...vecB.keys()]);

  for (const k of keys) {
    const a = vecA.get(k) || 0;
    const b = vecB.get(k) || 0;

    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

export function aiScoreRecipe(userIngredients = [], recipe = {}) {
  const userText = userIngredients.join(" ");
  const recipeText = `${recipe.strMeal || ""} ${(recipe.ingredients || []).join(" ")} ${recipe.strInstructions || ""}`;

  const userVec = buildVector(tokenize(userText));
  const recipeVec = buildVector(tokenize(recipeText));

  const similarity = cosineSimilarity(userVec, recipeVec);

  // hybrid boost (still keeps your old system relevant)
  const ingredientBoost = recipe.matchPercentage || 0;

  const finalScore = (similarity * 70) + (ingredientBoost * 0.3);

  return {
    aiSimilarity: Math.round(similarity * 100),
    finalScore: Math.round(finalScore)
  };
}

export function rankWithAI(userIngredients, recipes) {
  return recipes
    .map(r => {
      const ai = aiScoreRecipe(userIngredients, r);

      return {
        ...r,
        ai,
        scores: {
          ...(r.scores || {}),
          aiSimilarity: ai.aiSimilarity,
          finalScore: ai.finalScore
        }
      };
    })
    .sort((a, b) => b.scores.finalScore - a.scores.finalScore);
}