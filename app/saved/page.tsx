"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Bookmark, Clock, Zap, ShoppingCart, X } from "lucide-react";
import { getSavedRecipes, toggleSaveRecipe, StoredRecipe } from "@/lib/recipeStorage";

export default function SavedPage() {
  const router = useRouter();
  const [recipes, setRecipes]   = useState<StoredRecipe[]>([]);
  const [search, setSearch]     = useState("");

  useEffect(() => { setRecipes(getSavedRecipes()); }, []);

  const refresh = () => setRecipes(getSavedRecipes());

  const handleUnsave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveRecipe(id);
    refresh();
  };

  const filtered = recipes.filter((r) =>
    r.recipeName.toLowerCase().includes(search.toLowerCase()) ||
    r.ingredients.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-[#3B6E38] px-6 pt-14 pb-7 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M10 80 Q40 50 80 20 M40 50 Q20 30 15 10 M40 50 Q60 40 70 60 M60 35 Q80 50 90 40" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <button onClick={() => router.push("/home")}
            className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center active:scale-95 transition-transform mb-5">
            <ArrowLeft className="w-5 h-5 text-white stroke-[2.2]" />
          </button>
          <p className="text-[#E2ECD2] text-[13px] font-medium">Your collection</p>
          <h1 className="text-white font-bold text-[24px] tracking-tight mt-0.5">Saved Recipes</h1>
          <p className="text-[#E2ECD2] text-[12px] mt-1">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved</p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#FDFBF7]"
            style={{ borderRadius: "100% 100% 0 0 / 32px 32px 0 0", transform: "scaleX(1.1) translateY(4px)" }} />
        </div>

        {/* Search */}
        {recipes.length > 0 && (
          <div className="px-5 pt-4 pb-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
              <input
                type="text"
                placeholder="Search saved recipes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[46px] rounded-2xl bg-white border border-[#F2F2F7] pl-10 pr-10 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 active:scale-90">
                  <X className="w-4 h-4 text-[#C7C7CC] stroke-[2]" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2" style={{ scrollbarWidth: "none" }}>
          {recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
              <div className="w-20 h-20 bg-[#EAF2E8] rounded-full flex items-center justify-center">
                <Bookmark className="w-9 h-9 text-[#3B6E38] stroke-[1.5]" />
              </div>
              <div className="text-center">
                <p className="text-[#1C1C1E] font-bold text-[18px]">No saved recipes</p>
                <p className="text-[#8E8E93] text-[13px] mt-1 leading-relaxed">
                  Tap the bookmark on any recipe to save it here
                </p>
              </div>
              <button onClick={() => router.push("/home")}
                className="h-[50px] px-8 rounded-2xl bg-[#3B6E38] text-white font-bold text-[14px] shadow-[0_8px_20px_rgba(59,110,56,0.25)] active:scale-95 transition-transform">
                Find a Recipe
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 pb-16">
              <span className="text-4xl">🔍</span>
              <p className="text-[#1C1C1E] font-bold text-[16px]">No results for "{search}"</p>
              <p className="text-[#8E8E93] text-[13px]">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {filtered.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => router.push(`/recipes?ingredients=${encodeURIComponent(recipe.ingredients)}&diet=${recipe.diet}&time=${recipe.time}`)}
                  className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer active:scale-[0.99] transition-all"
                >
                  <div className="relative h-[130px] overflow-hidden">
                    <img src={recipe.image} alt={recipe.recipeName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-2.5 right-3 flex gap-1.5">
                      <button onClick={(e) => handleUnsave(recipe.id, e)}
                        className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                        <Bookmark className="w-3.5 h-3.5 text-[#3B6E38] fill-[#3B6E38] stroke-[2.2]" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/recipes?ingredients=${encodeURIComponent(recipe.ingredients)}&diet=${recipe.diet}&time=${recipe.time}`); }}
                        className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                        <ShoppingCart className="w-3.5 h-3.5 text-[#F1A23A] stroke-[2.2]" />
                      </button>
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-16">
                      <h3 className="text-white font-bold text-[15px] leading-tight">{recipe.recipeName}</h3>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[#8E8E93] text-[11px] font-medium">
                        <Clock className="w-3 h-3 stroke-[2.2] text-[#3B6E38]" />{recipe.time} min
                      </span>
                      <span className="flex items-center gap-1 text-[#8E8E93] text-[11px] font-medium">
                        <Zap className="w-3 h-3 stroke-[2.2] text-[#F1A23A]" />{recipe.calories}
                      </span>
                      <span className="text-[#8E8E93] text-[11px]">{recipe.difficulty}</span>
                    </div>
                    <span className="bg-[#EAF2E8] text-[#3B6E38] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Saved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}