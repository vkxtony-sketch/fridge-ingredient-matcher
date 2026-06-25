import { findMatchingRecipes } from "./matcher.js";
import { searchMultipleIngredients } from "./api.js";

const ingredientInput = document.getElementById("ingredients");
const findButton = document.getElementById("find-btn");
const resultsContainer = document.getElementById("results");

/**
 * Smarter ingredient match (handles "egg" vs "1 large egg")
 */
function hasIngredient(recipeIng, userIngredients) {
  const recipe = recipeIng.toLowerCase();
  return userIngredients.some(userIng =>
    recipe.includes(userIng.toLowerCase())
  );
}

function displayResults(recipes, userIngredients) {
  resultsContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    resultsContainer.innerHTML = `
      <div class="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center">
        <p class="font-semibold">No matching recipes found.</p>
        <p class="text-sm mt-1">Try adding more basic staples like oil, salt, eggs, or flour!</p>
      </div>
    `;
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className =
      "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 transition hover:shadow-md";

    const ownedTags = [];
    const missingTags = [];

    const ingredients = recipe.ingredients || [];

    ingredients.forEach(ing => {
      if (hasIngredient(ing, userIngredients)) {
        ownedTags.push(
          `<span class="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-100">✓ ${ing}</span>`
        );
      } else {
        missingTags.push(
          `<span class="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full font-medium border border-rose-100">✕ ${ing}</span>`
        );
      }
    });

    const match = recipe.matchPercentage ?? 0;

    const badgeHtml =
      match === 100
        ? `<span class="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">READY TO COOK</span>`
        : `<span class="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-md">MISSING ITEMS</span>`;

    card.innerHTML = `
      <div class="flex justify-between items-start gap-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">${recipe.name}</h3>

          <img 
            src="${recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'}" 
            alt="${recipe.name}" 
            class="w-full h-48 object-cover rounded-xl border border-slate-100 mt-3"
          />

          <div class="mt-1 flex items-center gap-2">${badgeHtml}</div>
        </div>

        <div class="text-right flex-shrink-0">
          <span class="text-2xl font-black text-emerald-600">
            ${match.toFixed(0)}%
          </span>
          <p class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Match Score
          </p>
        </div>
      </div>

      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500"
             style="width: ${match}%"></div>
      </div>

      <div>
        <h4 class="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
          Ingredient Checklist
        </h4>
        <div class="flex flex-wrap gap-1.5">
          ${ownedTags.join("")}
          ${missingTags.join("")}
        </div>
      </div>

      <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm mt-2">
        <h4 class="font-bold text-slate-700 mb-1">Cooking Instructions</h4>
        <p class="text-slate-600 leading-relaxed">
          ${recipe.instructions || "No instructions available."}
        </p>
      </div>
    `;

    resultsContainer.appendChild(card);
  });
}

findButton.addEventListener("click", async () => {
  const ingredients = ingredientInput.value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

  if (ingredients.length === 0) {
    resultsContainer.innerHTML = `
      <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center">
        Please enter at least one ingredient.
      </div>
    `;
    return;
  }

  try {
    findButton.disabled = true;
    findButton.textContent = "Searching...";

    const recipes = await searchMultipleIngredients(ingredients);
    const matches = findMatchingRecipes(ingredients, recipes);

    displayResults(matches, ingredients);
  } catch (err) {
    console.error(err);

    resultsContainer.innerHTML = `
      <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center">
        Failed to load recipes. Check console for details.
      </div>
    `;
  } finally {
    findButton.disabled = false;
    findButton.textContent = "Find Recipes";
  }
});
