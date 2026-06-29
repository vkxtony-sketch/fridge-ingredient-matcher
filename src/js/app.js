import { buildRecommendationFeed } from "./recommender.js";
import { searchMultipleIngredients } from "./api.js";
import { getQuickIdeas } from "./quickIdeas.js";

const ingredientInput = document.getElementById("ingredients");
const findButton = document.getElementById("find-btn");
const resultsContainer = document.getElementById("results");

function appendRecipe(recipe, userIngredients) {
  const card = document.createElement("div");
  card.className = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4";

  const match = recipe.scores?.finalScore ?? recipe.matchPercentage ?? 0;

  const tags = (recipe.ingredients || []).map(ing => {
    const isOwned = userIngredients.some(u => ing.toLowerCase().includes(u.toLowerCase()));

    return `<span class="${isOwned ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"} text-xs px-2 py-1 rounded border">${isOwned ? "✓" : "✕"} ${ing}</span>`;
  }).join("");

  const image = recipe.image || recipe.strMealThumb || "https://via.placeholder.com/400x300?text=No+Image";
  const title = recipe.name || recipe.strMeal;
  const instructions = recipe.instructions || recipe.strInstructions || "";

  card.innerHTML = `
    <div class="flex justify-between">
      <h3 class="text-lg font-bold">${title}</h3>
      <div class="text-emerald-600 font-bold">${match}</div>
    </div>

    <img src="${image}" class="rounded-xl h-48 object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" />

    <div class="flex flex-wrap gap-1">${tags}</div>

    <div class="bg-slate-50 p-3 rounded text-sm">${instructions}</div>
  `;

  resultsContainer.appendChild(card);
}

findButton.addEventListener("click", async () => {
  const ingredients = ingredientInput.value
    .split(",")
    .map(i => i.trim())
    .filter(Boolean);

  if (!ingredients.length) {
    resultsContainer.innerHTML = `<div class="text-red-600">Please enter ingredients</div>`;
    return;
  }

  try {
    findButton.disabled = true;
    findButton.textContent = "Building feed...";

    resultsContainer.innerHTML = `<div class="text-slate-500 animate-pulse">Generating Pantry Chef recommendations...</div>`;
    resultsContainer.innerHTML = "";

    // ⚡ 1. Quick ideas layer
    const quick = getQuickIdeas(ingredients);

    // ⚡ 2. API recipes
    const apiRecipes = await searchMultipleIngredients(ingredients);

    // ⚡ 3. Merge dataset
    const combined = [...quick, ...apiRecipes];

    // ⚡ 4. Build AI recommendation feed
    const feed = buildRecommendationFeed(ingredients, combined, {});

    // ⚡ 5. Render ranked feed
    for (const r of feed) {
      await new Promise(res => setTimeout(res, 25));
      appendRecipe(r, ingredients);
    }

  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = `<div class="text-red-600">Failed to build recommendation feed</div>`;
  } finally {
    findButton.disabled = false;
    findButton.textContent = "Find Recipes ✨";
  }
});