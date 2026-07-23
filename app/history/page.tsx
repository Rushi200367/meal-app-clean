"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Trash2, Bookmark, BookmarkCheck, Zap } from "lucide-react";
import { getRecentRecipes, clearHistory, deleteRecipe, toggleSaveRecipe, StoredRecipe } from "@/lib/recipeStorage";

function groupByDate(recipes: StoredRecipe[]) {
  const today     = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const groups: Record<string, StoredRecipe[]> = { Today: [], Yesterday: [], Older: [] };
  recipes.forEach((r) => {
    const d = new Date(r.generatedAt); d.setHours(0,0,0,0);
    if (d.getTime() === today.getTime())     groups.Today.push(r);
    else if (d.getTime() === yesterday.getTime()) groups.Yesterday.push(r);
    else                                     groups.Older.push(r);
  });
  return groups;
}

export default function HistoryPage() {
  const router = useRouter();
  const [recipes, setRecipes]         = useState<StoredRecipe[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { setRecipes(getRecentRecipes()); }, []);

  const refresh = () => setRecipes(getRecentRecipes());

  const handleClear = () => { clearHistory(); refresh(); setShowConfirm(false); };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRecipe(id);
    refresh();
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveRecipe(id);
    refresh();
  };

  const timeAgo = (ts: number) => {
    const diff  = Date.now() - ts;
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const groups = groupByDate(recipes);

  const RecipeCard = ({ recipe }: { recipe: StoredRecipe }) => (
    <div
      onClick={() => router.push(`/recipes?ingredients=${encodeURIComponent(recipe.ingredients)}&diet=${recipe.diet}&time=${recipe.time}`)}
      className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer active:scale-[0.99] transition-all"
    >
      <div className="relative h-[130px] overflow-hidden">
        <img src={recipe.image} alt={recipe.recipeName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {recipe.saved && (
          <div className="absolute top-2.5 left-3 bg-[#3B6E38] px-2 py-0.5 rounded-full">
            <p className="text-white text-[9px] font-bold uppercase tracking-wide">Saved</p>
          </div>
        )}
        <div className="absolute top-2.5 right-3 flex gap-1.5">
          <button
            onClick={(e) => handleToggleSave(recipe.id, e)}
            className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            {recipe.saved
              ? <BookmarkCheck className="w-3.5 h-3.5 text-[#3B6E38] stroke-[2.2]" />
              : <Bookmark      className="w-3.5 h-3.5 text-[#8E8E93] stroke-[2.2]" />
            }
          </button>
          <button
            onClick={(e) => handleDelete(recipe.id, e)}
            className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#FF6B6B] stroke-[2.2]" />
          </button>
        </div>
        <div className="absolute bottom-2.5 left-3 right-3">
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
          <span className="text-[#8E8E93] text-[11px] font-medium">{recipe.difficulty}</span>
        </div>
        <span className="text-[#C7C7CC] text-[10px]">{timeAgo(recipe.generatedAt)}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

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
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#E2ECD2] text-[13px] font-medium">Your kitchen history</p>
              <h1 className="text-white font-bold text-[24px] tracking-tight mt-0.5">Recently Generated</h1>
              <p className="text-[#E2ECD2] text-[12px] mt-1">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""}</p>
            </div>
            {recipes.length > 0 && (
              <button onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1.5 bg-white/20 px-3 py-2 rounded-xl active:scale-95 transition-transform">
                <Trash2 className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                <span className="text-white text-[12px] font-semibold">Clear</span>
              </button>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#FDFBF7]"
            style={{ borderRadius: "100% 100% 0 0 / 32px 32px 0 0", transform: "scaleX(1.1) translateY(4px)" }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2" style={{ scrollbarWidth: "none" }}>
          {recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
              <div className="w-20 h-20 bg-[#EAF2E8] rounded-full flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <div className="text-center">
                <p className="text-[#1C1C1E] font-bold text-[18px]">No recipes yet</p>
                <p className="text-[#8E8E93] text-[13px] mt-1 leading-relaxed">
                  Generate your first recipe and it'll appear here
                </p>
              </div>
              <button onClick={() => router.push("/home")}
                className="h-[50px] px-8 rounded-2xl bg-[#3B6E38] text-white font-bold text-[14px] shadow-[0_8px_20px_rgba(59,110,56,0.25)] active:scale-95 transition-transform">
                Generate a Recipe
              </button>
            </div>
          ) : (
            <div className="space-y-5 pt-2">
              {Object.entries(groups).map(([group, items]) =>
                items.length > 0 ? (
                  <div key={group}>
                    <p className="text-[#8E8E93] text-[11px] font-bold uppercase tracking-widest mb-2 px-1">{group}</p>
                    <div className="space-y-3">
                      {items.map((r) => <RecipeCard key={r.id} recipe={r} />)}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Clear confirm */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center px-8">
            <div className="bg-white rounded-[24px] p-6 w-full shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
              <h3 className="text-[#1C1C1E] font-bold text-[18px] mb-2">Clear History?</h3>
              <p className="text-[#8E8E93] text-[13px] mb-5 leading-relaxed">
                This removes all recently generated recipes. Your saved recipes won't be affected.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 h-[48px] rounded-2xl bg-[#F2F2F7] text-[#1C1C1E] font-bold text-[14px] active:scale-95 transition-transform">
                  Cancel
                </button>
                <button onClick={handleClear}
                  className="flex-1 h-[48px] rounded-2xl bg-[#FF6B6B] text-white font-bold text-[14px] active:scale-95 transition-transform">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}