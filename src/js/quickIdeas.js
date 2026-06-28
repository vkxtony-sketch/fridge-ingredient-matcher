const QUICK_IDEAS = {
  egg: [
    {
      name: "Scrambled Eggs",
      ingredients: ["egg", "butter", "salt"],
      instructions: "Whisk eggs and cook in butter while stirring."
    },
    {
      name: "Fried Egg",
      ingredients: ["egg", "oil"],
      instructions: "Fry egg in pan until cooked."
    },
    {
      name: "Boiled Egg",
      ingredients: ["egg"],
      instructions: "Boil egg in water for 8–10 minutes."
    }
  ],

  bread: [
    {
      name: "Toast",
      ingredients: ["bread"],
      instructions: "Toast bread until golden brown."
    },
    {
      name: "Butter Toast",
      ingredients: ["bread", "butter"],
      instructions: "Toast bread and spread butter."
    }
  ],

  cheese: [
    {
      name: "Cheese Toast",
      ingredients: ["cheese", "bread"],
      instructions: "Toast bread and melt cheese on top."
    },
    {
      name: "Grilled Cheese",
      ingredients: ["bread", "cheese", "butter"],
      instructions: "Butter bread, add cheese, grill until golden."
    }
  ],

  rice: [
    {
      name: "Plain Rice",
      ingredients: ["rice", "water"],
      instructions: "Boil rice until soft."
    }
  ]
};

function scoreSimpleRecipe(userIngredients, recipe) {
  const user = userIngredients.map(i => i.toLowerCase().trim());

  let score = 0;

  for (const ing of recipe.ingredients) {
    if (user.some(u => ing.includes(u) || u.includes(ing))) {
      score++;
    }
  }

  return recipe.ingredients.length
    ? Math.round((score / recipe.ingredients.length) * 100)
    : 0;
}

export function getQuickIdeas(userIngredients) {
  const results = [];

  for (const ing of userIngredients) {
    const key = ing.toLowerCase().trim();

    if (QUICK_IDEAS[key]) {
      results.push(...QUICK_IDEAS[key]);
    }
  }

  return results.map(r => ({
    id: `quick-${r.name}`,
    name: r.name,
    image: `https://via.placeholder.com/400x300?text=${encodeURIComponent(r.name)}`,
    ingredients: r.ingredients,
    instructions: r.instructions,
    matchPercentage: scoreSimpleRecipe(userIngredients, r)
  }));
}