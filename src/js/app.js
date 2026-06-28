import { findMatchingRecipes } from "./matcher.js";
import { searchMultipleIngredients } from "./api.js";
import { getQuickIdeas } from "./quickIdeas.js";

const ingredientInput = document.getElementById("ingredients");
const findButton = document.getElementById("find-btn");
const resultsContainer = document.getElementById("results");

function appendRecipe(recipe, userIngredients) {
  const card = document.createElement("div");
  card.className = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4";

  const match = recipe.matchPercentage || 0;

  const tags = (recipe.ingredients || []).map(ing => {
    const isOwned = userIngredients.some(u => ing.toLowerCase().includes(u.toLowerCase()));

    return `<span class=\"${isOwned ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"} text-xs px-2 py-1 rounded border\">${isOwned ? "✓" : "✕"} ${ing}</span>`;
  }).join("");

  card.innerHTML = `
    <div class="flex justify-between">
      <h3 class="text-lg font-bold">${recipe.name}</h3>
      <div class="text-emerald-600 font-bold">${match}%</div>
    </div>

    <img src="${recipe.image}" class="rounded-xl h-48 object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" />

    <div class="flex flex-wrap gap-1">${tags}</div>

    <div class="bg-slate-50 p-3 rounded text-sm">${recipe.instructions}</div>
  `;

  resultsContainer.appendChild(card);
}

findButton.addEventListener("click", async () => {
  const ingredients = ingredientInput.value.split(",").map(i => i.trim()).filter(Boolean);

  if (!ingredients.length) {
    resultsContainer.innerHTML = `<div class=\"text-red-600\">Please enter ingredients</div>`;
    return;
  }

  try {
    findButton.disabled = true;
    findButton.textContent = "Searching...";

    resultsContainer.innerHTML = `<div class=\"text-slate-500 animate-pulse\">Finding recipes...</div>`;

    resultsContainer.innerHTML = "";

    // ⚡ 1. QUICK IDEAS (instant)
    const quick = getQuickIdeas(ingredients);
    for (const r of quick) {
      appendRecipe(r, ingredients);
    }

    // ⚡ 2. MEALDB (streamed)
    const recipes = await searchMultipleIngredients(ingredients);
    const matches = findMatchingRecipes(ingredients, recipes);

    for (const r of matches) {
      await new Promise(res => setTimeout(res, 40));
      appendRecipe(r, ingredients);
    }

  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = `<div class=\"text-red-600\">Failed to load recipes</div>`;
  } finally {
    findButton.disabled = false;
    findButton.textContent = "Find Recipes ✨";
  }
});