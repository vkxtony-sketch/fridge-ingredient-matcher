// Pantry Chef User Memory System (Local-first)

const STORAGE_KEY = "pantry_chef_user_profile";

function loadProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultProfile();
  } catch (e) {
    return getDefaultProfile();
  }
}

function getDefaultProfile() {
  return {
    favorites: [],
    disliked: [],
    viewed: [],
    saved: [],
    ingredientHistory: {},
    lastUpdated: Date.now()
  };
}

function saveProfile(profile) {
  profile.lastUpdated = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function getUserProfile() {
  return loadProfile();
}

export function likeRecipe(recipeId) {
  const profile = loadProfile();

  if (!profile.favorites.includes(recipeId)) {
    profile.favorites.push(recipeId);
  }

  profile.disliked = profile.disliked.filter(id => id !== recipeId);

  return saveProfile(profile);
}

export function dislikeRecipe(recipeId) {
  const profile = loadProfile();

  if (!profile.disliked.includes(recipeId)) {
    profile.disliked.push(recipeId);
  }

  profile.favorites = profile.favorites.filter(id => id !== recipeId);

  return saveProfile(profile);
}

export function trackView(recipeId) {
  const profile = loadProfile();

  profile.viewed.push({ recipeId, time: Date.now() });

  return saveProfile(profile);
}

export function trackIngredients(ingredients = []) {
  const profile = loadProfile();

  ingredients.forEach(i => {
    const key = i.toLowerCase();
    profile.ingredientHistory[key] = (profile.ingredientHistory[key] || 0) + 1;
  });

  return saveProfile(profile);
}
