import { findMatchingRecipes } from "./matcher.js";

const ingredientInput = document.getElementById("ingredients");
const findButton = document.getElementById("find-btn");
const resultsContainer = document.getElementById("results");

function displayResults(recipes) {
  resultsContainer.innerHTML = "";

  if (recipes.length === 0) {
    resultsContainer.innerHTML =
      "<p>No matching recipes found.</p>";
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${recipe.name}</h3>
      <p>Match: ${recipe.matchPercentage.toFixed(0)}%</p>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
      <p>${recipe.instructions}</p>
      <hr>
    `;

    resultsContainer.appendChild(card);
  });
}

findButton.addEventListener("click", () => {
  const ingredients = ingredientInput.value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

  const matches = findMatchingRecipes(ingredients);

  displayResults(matches);
});
