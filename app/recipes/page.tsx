"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Users, Zap, CheckCircle2, ShoppingCart } from "lucide-react";
import CartBottomSheet from "@/components/CartBottomSheet";
import AuthModal from "@/components/AuthModal";

async function fetchRecipeImage(recipeName: string): Promise<string> {
  try {
    const query = encodeURIComponent(`${recipeName} food dish`);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
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
  const [recipeImage, setRecipeImage] = useState<string>(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=450&h=300&q=90"
  );
  const [recipe, setRecipe] = useState<{
    recipeName: string;
    steps: string[];
    missingItems: string[];
  } | null>(null);

  const ingredients = searchParams.get("ingredients") ?? "";
  const diet        = searchParams.get("diet") ?? "";
  const time        = searchParams.get("time") ?? "30";

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredient: ingredients,
            type: "single",
            dietaryProfile: {
              diet: diet || "any",
              allergies: [],
              fitnessGoal: "balanced",
            },
          }),
        });

        if (!response.ok) throw new Error("Failed to generate recipe");
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setRecipe(data);

        const image = await fetchRecipeImage(data.recipeName);
        setRecipeImage(image);

      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [ingredients, diet]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans">
        <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF2E8] flex items-center justify-center animate-pulse">
            <span className="text-3xl">🍽️</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[#1C1C1E] font-bold text-[16px]">Crafting your recipe…</p>
            <p className="text-[#8E8E93] text-[13px]">Finding the perfect photo too</p>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#3B6E38]"
                style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); opacity: 0.4; }
              50% { transform: translateY(-6px); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans">
        <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F0] flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[#1C1C1E] font-bold text-[16px]">Something went wrong</p>
            <p className="text-[#8E8E93] text-[13px] leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="w-full h-[54px] rounded-[20px] bg-[#3B6E38] text-white font-bold text-[15px] active:scale-[0.98] transition-all"
          >
            Go Back & Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* Hero image */}
        <div className="relative w-full h-[220px] shrink-0 overflow-hidden">
          <img
            src={recipeImage}
            alt={recipe.recipeName}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFBF7]" />
          <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-6">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2] text-[#1C1C1E]" />
            </button>
            <button
              onClick={() => setSaved((s) => !s)}
              className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform"
            >
              {saved
                ? <BookmarkCheck className="w-5 h-5 text-[#3B6E38] stroke-[2.2]" />
                : <Bookmark      className="w-5 h-5 text-[#1C1C1E] stroke-[2.2]" />
              }
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
          <div className="px-6 pt-3 space-y-5">

            <div>
              <h1 className="text-[#1C1C1E] font-bold text-[24px] tracking-tight leading-tight">
                {recipe.recipeName}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-[#8E8E93] text-[13px] font-medium">
                  <Clock className="w-4 h-4 stroke-[2.2] text-[#3B6E38]" />
                  {time} min
                </span>
                <span className="flex items-center gap-1.5 text-[#8E8E93] text-[13px] font-medium">
                  <Users className="w-4 h-4 stroke-[2.2] text-[#3B6E38]" />
                  2 servings
                </span>
                <span className="flex items-center gap-1.5 text-[#8E8E93] text-[13px] font-medium">
                  <Zap className="w-4 h-4 stroke-[2.2] text-[#3B6E38]" />
                  Quick Recipe
                </span>
              </div>
            </div>

            {ingredients && (
              <div className="bg-[#EAF2E8] rounded-[20px] p-4">
                <p className="text-[#3B6E38] font-bold text-[13px] uppercase tracking-widest mb-2">
                  Your Ingredients
                </p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.split(",").filter(Boolean).map((item) => (
                    <span key={item} className="bg-white text-[#3B6E38] text-[12px] font-semibold px-3 py-1 rounded-full">
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {recipe.missingItems.length > 0 && (
              <div className="bg-[#FFF9F0] rounded-[20px] p-4 border border-[#FFE5B4]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#F1A23A] stroke-[2.2]" />
                    <p className="text-[#1C1C1E] font-bold text-[14px]">You'll also need</p>
                  </div>
                  <button
                    onClick={() => {
                      if (isLoggedIn) {
                        setCartOpen(true);
                      } else {
                        setAuthOpen(true);
                      }
                    }}
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

            <div>
              <h2 className="text-[#1C1C1E] font-bold text-[16px] tracking-tight mb-3">Instructions</h2>
              <div className="space-y-3">
                {recipe.steps.map((text, index) => (
                  <div key={index} className="flex gap-3 bg-white rounded-[18px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="w-7 h-7 rounded-full bg-[#EAF2E8] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#3B6E38] text-[12px] font-bold">{index + 1}</span>
                    </div>
                    <p className="text-[#3C3C43] text-[14px] leading-relaxed font-normal flex-1">{text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Save button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-3 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent">
          <button
            onClick={() => {
              if (isLoggedIn) {
                setSaved(true);
              } else {
                setAuthOpen(true);
              }
            }}
            className={`w-full h-[58px] rounded-[20px] flex items-center justify-center gap-2 font-bold text-[16px] transition-all active:scale-[0.98] ${
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

        {/* Cart Bottom Sheet */}
        <CartBottomSheet
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          ingredients={recipe.missingItems}
          mode={ingredients ? "missing" : "all"}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={authOpen}
          onClose={() => {
            setAuthOpen(false);
            setIsLoggedIn(true);
            setSaved(true);
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