export interface StoredRecipe {
  id: string;
  recipeName: string;
  description: string;
  difficulty: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  image: string;
  steps: string[];
  missingItems: string[];
  ingredients: string;
  time: string;
  diet: string;
  saved: boolean;
  generatedAt: number;
}

const STORAGE_KEY = "smartrecipe_recipes";
const MAX_RECIPES = 10;

export function getAllRecipes(): StoredRecipe[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecipeToHistory(
  recipe: Omit<StoredRecipe, "id" | "generatedAt" | "saved">
): StoredRecipe {
  const all = getAllRecipes();
  const newRecipe: StoredRecipe = {
    ...recipe,
    id: Date.now().toString(),
    generatedAt: Date.now(),
    saved: false,
  };
  const updated = [newRecipe, ...all].slice(0, MAX_RECIPES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newRecipe;
}

export function toggleSaveRecipe(id: string): void {
  const all = getAllRecipes();
  const updated = all.map((r) =>
    r.id === id ? { ...r, saved: !r.saved } : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteRecipe(id: string): void {
  const all = getAllRecipes();
  const updated = all.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSavedRecipes(): StoredRecipe[] {
  return getAllRecipes().filter((r) => r.saved);
}

export function getRecentRecipes(): StoredRecipe[] {
  return getAllRecipes();
}

export function clearHistory(): void {
  const saved = getSavedRecipes();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}