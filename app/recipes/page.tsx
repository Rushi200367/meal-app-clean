"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Users, Zap, CheckCircle2, ShoppingCart, Share2, RefreshCw } from "lucide-react";
import CartBottomSheet from "@/components/CartBottomSheet";
import AuthModal from "@/components/AuthModal";
import { saveRecipeToHistory, toggleSaveRecipe, StoredRecipe } from "@/lib/recipeStorage";

async function fetchRecipeImage(recipeName: string): Promise<string> {
  try {
    const query = encodeURIComponent(`${recipeName} food dish`);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results?.length > 0) return data.results[0].urls.regular;
  } catch (err) {
    console.error("Unsplash fetch failed:", err);
  }
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=450&h=300&q=90";
}

function RecipeContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [saved, setSaved]             = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [cartOpen, setCartOpen]       = useState(false);
  const [authOpen, setAuthOpen]       = useState(false);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [storedRecipe, setStoredRecipe] = useState<StoredRecipe | null>(null);
  const [recipeImage, setRecipeImage] = useState("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=450&h=300&q=90");
  const [recipe, setRecipe] = useState<{
    recipeName: string;
    description: string;
    difficulty: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    steps: string[];
    missingItems: string[];
  } | null>(null);

  const ingredients = searchParams.get("ingredients") ?? "";
  const diet        = searchParams.get("diet") ?? "";
  const time        = searchParams.get("time") ?? "30";

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      setSaved(false);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient: ingredients,
          type: "single",
          dietaryProfile: { diet: diet || "any", allergies: [], fitnessGoal: "balanced" },
        }),
      });

      if (!response.ok) throw new Error("Failed to generate recipe");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setRecipe(data);

      const image = await fetchRecipeImage(data.recipeName);
      setRecipeImage(image);

      const stored = saveRecipeToHistory({
        recipeName:  data.recipeName,
        description: data.description || "",
        difficulty:  data.difficulty  || "Medium",
        calories:    data.calories    || "—",
        protein:     data.protein     || "—",
        carbs:       data.carbs       || "—",
        fat:         data.fat         || "—",
        image,
        steps:        data.steps,
        missingItems: data.missingItems,
        ingredients,
        time,
        diet,
      });
      setStoredRecipe(stored);

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipe(); }, [ingredients, diet]);

  const handleSave = () => {
    if (!isLoggedIn) { setAuthOpen(true); return; }
    if (storedRecipe) {
      toggleSaveRecipe(storedRecipe.id);
      setSaved((s) => !s);
    }
  };

  const handleShare = () => {
    if (navigator.share && recipe) {
      navigator.share({ title: recipe.recipeName, text: recipe.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans">
        <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF2E8] flex items-center justify-center animate-pulse">
            <span className="text-3xl">🍽️</span>
          </div>
          <div className="text-center">
            <p className="text-[#1C1C1E] font-bold text-[16px]">Crafting your recipe…</p>
            <p className="text-[#8E8E93] text-[13px] mt-1">Finding the perfect photo too</p>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#3B6E38]"
                style={{ animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
            ))}
          </div>
          <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-6px);opacity:1}}`}</style>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans">
        <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-4 px-8">
          <span className="text-5xl">⚠️</span>
          <div className="text-center">
            <p className="text-[#1C1C1E] font-bold text-[16px]">Something went wrong</p>
            <p className="text-[#8E8E93] text-[13px] mt-1 leading-relaxed">{error}</p>
          </div>
          <button onClick={() => router.back()}
            className="w-full h-[54px] rounded-[20px] bg-[#3B6E38] text-white font-bold text-[15px] active:scale-[0.98] transition-all">
            Go Back & Try Again
          </button>
        </div>
      </div>
    );
  }

  const difficultyColor = recipe.difficulty === "Easy" ? "#3B6E38" : recipe.difficulty === "Hard" ? "#FF6B6B" : "#F1A23A";
  const difficultyBg   = recipe.difficulty === "Easy" ? "#EAF2E8" : recipe.difficulty === "Hard" ? "#FFF0F0" : "#FFF6E9";

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* Hero */}
        <div className="relative w-full h-[240px] shrink-0 overflow-hidden">
          <img src={recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-[#FDFBF7]" />
          <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-5">
            <button onClick={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft className="w-5 h-5 stroke-[2.2] text-[#1C1C1E]" />
            </button>
            <div className="flex gap-2">
              <button onClick={handleShare}
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform">
                <Share2 className="w-4 h-4 stroke-[2.2] text-[#1C1C1E]" />
              </button>
              <button onClick={handleSave}
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform">
                {saved
                  ? <BookmarkCheck className="w-5 h-5 text-[#3B6E38] stroke-[2.2]" />
                  : <Bookmark      className="w-5 h-5 text-[#1C1C1E] stroke-[2.2]" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
          <div className="px-5 pt-3 space-y-5">

            {/* Title + badges */}
            <div>
              <h1 className="text-[#1C1C1E] font-bold text-[24px] tracking-tight leading-tight">
                {recipe.recipeName}
              </h1>
              <p className="text-[#8E8E93] text-[13px] mt-2 leading-relaxed">{recipe.description}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-[#8E8E93] text-[12px] font-medium bg-white px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <Clock className="w-3.5 h-3.5 stroke-[2.2] text-[#3B6E38]" />{time} min
                </span>
                <span className="flex items-center gap-1.5 text-[#8E8E93] text-[12px] font-medium bg-white px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <Users className="w-3.5 h-3.5 stroke-[2.2] text-[#3B6E38]" />2 servings
                </span>
                <span className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full"
                  style={{ color: difficultyColor, backgroundColor: difficultyBg }}>
                  <Zap className="w-3.5 h-3.5 stroke-[2.2]" />{recipe.difficulty}
                </span>
              </div>
            </div>

            {/* Nutrition */}
            <div>
              <h2 className="text-[#1C1C1E] font-bold text-[15px] tracking-tight mb-3">Nutrition per serving</h2>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Calories", value: recipe.calories },
                  { label: "Protein",  value: recipe.protein  },
                  { label: "Carbs",    value: recipe.carbs    },
                  { label: "Fat",      value: recipe.fat      },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-[16px] p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <p className="text-[#3B6E38] font-bold text-[13px]">{value}</p>
                    <p className="text-[#8E8E93] text-[10px] font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Your ingredients */}
            {ingredients && (
              <div className="bg-[#EAF2E8] rounded-[20px] p-4">
                <p className="text-[#3B6E38] font-bold text-[13px] uppercase tracking-widest mb-2">Your Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.split(",").filter(Boolean).map((item) => (
                    <span key={item} className="bg-white text-[#3B6E38] text-[12px] font-semibold px-3 py-1 rounded-full">
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing items */}
            {recipe.missingItems.length > 0 && (
              <div className="bg-[#FFF9F0] rounded-[20px] p-4 border border-[#FFE5B4]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#F1A23A] stroke-[2.2]" />
                    <p className="text-[#1C1C1E] font-bold text-[14px]">You'll also need</p>
                  </div>
                  <button
                    onClick={() => isLoggedIn ? setCartOpen(true) : setAuthOpen(true)}
                    className="bg-[#3B6E38] text-white text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                  >
                    {ingredients ? "Add Missing" : "Shop Ingredients"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.missingItems.map((item) => (
                    <span key={item} className="bg-white border border-[#FFE5B4] text-[#C27A10] text-[12px] font-semibold px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            <div>
              <h2 className="text-[#1C1C1E] font-bold text-[15px] tracking-tight mb-3">Instructions</h2>
              <div className="space-y-3">
                {recipe.steps.map((text, index) => (
                  <div key={index} className="flex gap-3 bg-white rounded-[18px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="w-7 h-7 rounded-full bg-[#EAF2E8] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#3B6E38] text-[12px] font-bold">{index + 1}</span>
                    </div>
                    <p className="text-[#3C3C43] text-[14px] leading-relaxed flex-1">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate similar */}
            <button
              onClick={() => router.push(`/preferences`)}
              className="w-full h-[52px] rounded-[20px] bg-[#F2F2F7] text-[#1C1C1E] font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.2]" />
              Generate Similar Recipe
            </button>

          </div>
        </div>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent">
          <button
            onClick={handleSave}
            className={`w-full h-[56px] rounded-[20px] flex items-center justify-center gap-2 font-bold text-[16px] transition-all active:scale-[0.98] ${
              saved
                ? "bg-[#EAF2E8] text-[#3B6E38]"
                : "bg-[#3B6E38] text-white shadow-[0_10px_24px_rgba(59,110,56,0.25)]"
            }`}
          >
            {saved
              ? <><CheckCircle2 className="w-5 h-5 stroke-[2.2]" /> Recipe Saved</>
              : <><Bookmark     className="w-5 h-5 stroke-[2.2]" /> Save Recipe</>
            }
          </button>
        </div>

        <CartBottomSheet
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          ingredients={recipe.missingItems}
          mode={ingredients ? "missing" : "all"}
        />

        <AuthModal
          isOpen={authOpen}
          onClose={() => {
            setAuthOpen(false);
            setIsLoggedIn(true);
            if (storedRecipe) { toggleSaveRecipe(storedRecipe.id); setSaved(true); }
          }}
          trigger="save"
        />

      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-200 flex items-center justify-center">
        <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF2E8] flex items-center justify-center mx-auto animate-pulse">
              <span className="text-2xl">🍽️</span>
            </div>
            <p className="text-[#8E8E93] text-[14px] font-medium">Crafting your recipe…</p>
          </div>
        </div>
      </div>
    }>
      <RecipeContent />
    </Suspense>
  );
}