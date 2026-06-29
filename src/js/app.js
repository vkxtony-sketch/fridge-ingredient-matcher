import { getQuickIdeas } from "./quickIdeas.js";

const ingredientInput = document.getElementById("ingredients");
const findButton = document.getElementById("find-btn");
const resultsContainer = document.getElementById("results");

function appendRecipe(recipe, userIngredients) {
  const card = document.createElement("div");
  card.className = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4";

  const score = recipe.score || 0;

  const tags = (recipe.ingredients || []).map(ing => {
    const isOwned = userIngredients.some(u => ing.toLowerCase().includes(u.toLowerCase()));

    return `<span class="${isOwned ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"} text-xs px-2 py-1 rounded border">${isOwned ? "✓" : "✕"} ${ing}</span>`;
  }).join("");

  const image = recipe.image || "https://via.placeholder.com/400x300?text=No+Image";

  card.innerHTML = `
    <div class="flex justify-between">
      <h3 class="text-lg font-bold">${recipe.name}</h3>
      <div class="text-emerald-600 font-bold">${score}</div>
    </div>

    <img src="${image}" class="rounded-xl h-48 object-cover" />

    <div class="flex flex-wrap gap-1">${tags}</div>
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
    findButton.textContent = "AI Searching...";

    resultsContainer.innerHTML = `<div class="text-slate-500 animate-pulse">Vector AI running search...</div>`;
    resultsContainer.innerHTML = "";

    // quick ideas layer
    getQuickIdeas(ingredients).forEach(r => appendRecipe(r, ingredients));

    // VECTOR DB SEARCH (final evolution)
    const res = await fetch("/api/vector-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients })
    });

    const data = await res.json();

    if (!data.success) throw new Error("Vector search failed");

    for (const r of data.results) {
      await new Promise(res => setTimeout(res, 25));
      appendRecipe(r, ingredients);
    }

  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = `<div class="text-red-600">AI system error</div>`;
  } finally {
    findButton.disabled = false;
    findButton.textContent = "Find Recipes ✨";
  }
});