import { findMatchingRecipes } from "./matcher.js";
import { searchMultipleIngredients } from "./api.js";

const ingredientInput = document.getElementById("ingredients");
const findButton = document.getElementById("find-btn");
const resultsContainer = document.getElementById("results");

function displayResults(recipes, userIngredients) {
  resultsContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    resultsContainer.innerHTML = `
      <div class="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center">
        <p class="font-semibold">No matching recipes found.</p>
        <p class="text-sm mt-1">Try adding basics like eggs, rice, oil, or flour.</p>
      </div>
    `;
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4";

    const ownedTags = [];
    const missingTags = [];

    recipe.ingredients.forEach(ing => {
      const isOwned = userIngredients.some(u => ing.toLowerCase().includes(u.toLowerCase()));

      const tag = `<span class=\"${isOwned ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"} text-xs px-2.5 py-1 rounded-full border\">${isOwned ? "✓" : "✕"} ${ing}</span>`;

      isOwned ? ownedTags.push(tag) : missingTags.push(tag);
    });

    const match = recipe.matchPercentage;

    const badge = match === 100
      ? `<span class=\"bg-emerald-600 text-white text-xs px-2 py-1 rounded\">READY TO COOK</span>`
      : `<span class=\"bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded\">MISSING ITEMS</span>`;

    card.innerHTML = `
      <div class="flex justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold">${recipe.name}</h3>
          <img src="${recipe.image}" alt="${recipe.name}" class="w-full h-48 object-cover rounded-xl mt-3" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" />
          <div class="mt-2">${badge}</div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-emerald-600">${match}%</div>
          <div class="text-xs text-slate-400">Match</div>
        </div>
      </div>
      <div class="w-full bg-slate-100 h-2 rounded">
        <div class="bg-emerald-500 h-2 rounded" style="width:${match}%"></div>
      </div>
      <div class="flex flex-wrap gap-1">
        ${ownedTags.join("")}
        ${missingTags.join("")}
      </div>
      <div class="bg-slate-50 p-3 rounded text-sm">${recipe.instructions}</div>
    `;

    resultsContainer.appendChild(card);
  });
}

findButton.addEventListener("click", async () => {
  const ingredients = ingredientInput.value.split(",").map(i => i.trim()).filter(Boolean);

  if (!ingredients.length) {
    resultsContainer.innerHTML = `<div class="bg-red-50 text-red-700 p-4 rounded-xl text-center">Please enter at least one ingredient.</div>`;
    return;
  }

  try {
    findButton.disabled = true;
    findButton.textContent = "Searching...";

    resultsContainer.innerHTML = `<div class="p-6 text-center text-slate-500 animate-pulse">Finding recipes...</div>`;

    const recipes = await searchMultipleIngredients(ingredients);
    const matches = findMatchingRecipes(ingredients, recipes);

    displayResults(matches, ingredients);
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = `<div class="bg-red-50 text-red-700 p-4 rounded-xl text-center">Failed to load recipes. Try again.</div>`;
  } finally {
    findButton.disabled = false;
    findButton.textContent = "Find Recipes ✨";
  }
});