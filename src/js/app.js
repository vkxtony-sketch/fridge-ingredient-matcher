import { findMatchingRecipes } from "./matcher.js";
import { searchMultipleIngredients } from "./api.js";

const ingredientInput = document.getElementById("ingredients");
const findButton = document.getElementById("find-btn");
const resultsContainer = document.getElementById("results");

function displayResults(recipes, userIngredients) {
  resultsContainer.innerHTML = "";

  if (recipes.length === 0) {
    resultsContainer.innerHTML = `
      <div class="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center">
        <p class="font-semibold">No matching recipes found.</p>
        <p class="text-sm mt-1">Try adding more basic staples like oil, salt, eggs, or flour!</p>
      </div>
    `;
    return;
  }

  // Normalize user input tokens for color tagging comparison
  const normalizedUser = userIngredients.map(i => i.toLowerCase().trim());

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 transition hover:shadow-md";

    // Sort recipe ingredients into matched vs missing categories
    const ownedTags = [];
    const missingTags = [];

    recipe.ingredients.forEach(ing => {
      if (normalizedUser.includes(ing.toLowerCase().trim())) {
        ownedTags.push(`<span class="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-100">✓ ${ing}</span>`);
      } else {
        missingTags.push(`<span class="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full font-medium border border-rose-100">✕ ${ing}</span>`);
      }
    });

    // Check if user can make it completely right now
    const isPerfectMatch = recipe.matchPercentage === 100;
    const badgeHtml = isPerfectMatch 
      ? `<span class="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">READY TO COOK</span>`
      : `<span class="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-md">MISSING ITEMS</span>`;

    card.innerHTML = `
      <div class="flex justify-between items-start gap-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">${recipe.name}</h3>
          <div class="mt-1 flex items-center gap-2">${badgeHtml}</div>
        </div>
        <div class="text-right flex-shrink-0">
          <span class="text-2xl font-black text-emerald-600">${recipe.matchPercentage.toFixed(0)}%</span>
          <p class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Match Score</p>
        </div>
      </div>

      <!-- Animated Progress Bar Visualizer -->
      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${recipe.matchPercentage}%"></div>
      </div>

      <div>
        <h4 class="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Ingredient Checklist</h4>
        <div class="flex flex-wrap gap-1.5">
          ${ownedTags.join("")}
          ${missingTags.join("")}
        </div>
      </div>

      <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm mt-2">
        <h4 class="font-bold text-slate-700 mb-1">Cooking Instructions</h4>
        <p class="text-slate-600 leading-relaxed">${recipe.instructions}</p>
      </div>
    `;

    resultsContainer.appendChild(card);
  });
}

findButton.addEventListener("click", () => {
  const ingredients = ingredientInput.value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

const recipes = await searchMultipleIngredients(userIngredients);

const matches = findMatchingRecipes(userIngredients, recipes);
  displayResults(matches, ingredients);
});
