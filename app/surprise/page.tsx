"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";

type Step = "preferences" | "loading" | "result";

const DIETARY_OPTIONS = [
  { label: "No Preference", emoji: "🍽️" },
  { label: "Vegetarian",    emoji: "🥗" },
  { label: "Vegan",         emoji: "🌱" },
  { label: "Keto",          emoji: "🥩" },
  { label: "Gluten-Free",   emoji: "🌾" },
  { label: "Low-Carb",      emoji: "🥦" },
  { label: "Dairy-Free",    emoji: "🥛" },
  { label: "High-Protein",  emoji: "💪" },
];

const LOADING_MESSAGES = [
  "Consulting the recipe gods...",
  "Picking something delicious...",
  "Raiding the pantry...",
  "Chef Gemini is thinking...",
  "Almost ready to surprise you...",
];

export default function SurprisePage() {
  const router = useRouter();
  const [step, setStep]         = useState<Step>("preferences");
  const [diet, setDiet]         = useState("No Preference");
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [recipe, setRecipe]     = useState<{
    weekTheme: string;
    signatureRecipe: string;
    recipeSteps: string[];
    mysteryIngredient: string;
    chefNote: string;
  } | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const handleGenerate = async () => {
    setStep("loading");
    setError(null);

    // Cycle loading messages
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(msgIndex);
    }, 1200);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient: "surprise me with anything creative and delicious",
          type: "surprise",
          dietaryProfile: {
            diet: diet === "No Preference" ? "any" : diet,
            allergies: [],
            fitnessGoal: "balanced",
          },
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      clearInterval(msgInterval);
      setRecipe(data);
      setStep("result");
    } catch (err: any) {
      clearInterval(msgInterval);
      setError(err.message || "Something went wrong");
      setStep("preferences");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* ── STEP 1: Dietary Preferences ── */}
        {step === "preferences" && (
          <>
            {/* Green hero header */}
            <div className="w-full bg-[#3B6E38] px-6 pt-14 pb-8 relative overflow-hidden shrink-0">
              <div className="absolute right-0 top-0 w-40 h-40 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M10 80 Q40 50 80 20 M40 50 Q20 30 15 10 M40 50 Q60 40 70 60 M60 35 Q80 50 90 40" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <button
                onClick={() => router.push("/")}
                className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center active:scale-95 transition-transform mb-5"
              >
                <ArrowLeft className="w-5 h-5 text-white stroke-[2.2]" />
              </button>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-white fill-white stroke-0" />
              </div>
              <h1 className="text-white font-bold text-[26px] tracking-tight leading-tight">
                Surprise Me!
              </h1>
              <p className="text-[#E2ECD2] text-[14px] font-normal mt-1">
                Tell us your diet and we'll pick something amazing
              </p>
              <div
                className="absolute bottom-0 left-0 right-0 h-8 bg-[#FDFBF7]"
                style={{ borderRadius: "100% 100% 0 0 / 32px 32px 0 0", transform: "scaleX(1.1) translateY(4px)" }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between px-6 pb-8 overflow-hidden">
              <div className="pt-4">
                <p className="text-[#1C1C1E] font-bold text-[16px] mb-1">Any dietary preferences?</p>
                <p className="text-[#8E8E93] text-[13px] mb-5">Pick one and we'll handle the rest</p>

                <div className="grid grid-cols-2 gap-3">
                  {DIETARY_OPTIONS.map(({ label, emoji }) => {
                    const active = diet === label;
                    return (
                      <button
                        key={label}
                        onClick={() => setDiet(label)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-95 ${
                          active
                            ? "bg-[#3B6E38] shadow-[0_4px_16px_rgba(59,110,56,0.25)]"
                            : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#F2F2F7]"
                        }`}
                      >
                        <span className="text-xl">{emoji}</span>
                        <span className={`font-semibold text-[13px] ${active ? "text-white" : "text-[#1C1C1E]"}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-4 bg-[#FFF0F0] rounded-2xl p-3 border border-red-100">
                    <p className="text-[#FF6B6B] text-[13px] font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                className="w-full h-[58px] rounded-[20px] bg-[#3B6E38] text-white font-bold text-[16px] flex items-center justify-between px-6 shadow-[0_10px_24px_rgba(59,110,56,0.25)] active:scale-[0.98] transition-all mt-6"
              >
                <span>Surprise Me!</span>
                <Sparkles className="w-5 h-5 fill-white stroke-0" />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: Fun Loading Screen ── */}
        {step === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">

            {/* Animated emoji */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-[#EAF2E8] flex items-center justify-center"
                style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
                <span className="text-6xl" style={{ animation: "spin 3s linear infinite" }}>🍽️</span>
              </div>
              {/* Orbiting sparkles */}
              {["✨", "🌟", "⭐"].map((star, i) => (
                <div
                  key={i}
                  className="absolute text-xl"
                  style={{
                    top: "50%",
                    left: "50%",
                    animation: `orbit 2s linear ${i * 0.66}s infinite`,
                    transformOrigin: `${50 + 60}px 0px`,
                  }}
                >
                  {star}
                </div>
              ))}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-[#1C1C1E] font-bold text-[22px] tracking-tight">
                Hold tight!
              </h2>
              <p
                className="text-[#8E8E93] text-[15px] font-medium transition-all duration-500"
                key={loadingMsg}
              >
                {LOADING_MESSAGES[loadingMsg]}
              </p>
            </div>

            {/* Bouncing dots */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-[#3B6E38]"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </div>

            {/* Diet badge */}
            <div className="bg-[#EAF2E8] px-4 py-2 rounded-full">
              <p className="text-[#3B6E38] text-[13px] font-semibold">
                {DIETARY_OPTIONS.find(d => d.label === diet)?.emoji} {diet} recipe incoming...
              </p>
            </div>

            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); opacity: 0.4; }
                50% { transform: translateY(-8px); opacity: 1; }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes orbit {
                from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
                to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
              }
            `}</style>
          </div>
        )}

        {/* ── STEP 3: Recipe Result ── */}
        {step === "result" && recipe && (
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Hero */}
            <div className="relative w-full h-[200px] shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=450&h=220&q=90"
                alt="surprise recipe"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFBF7]" />

              {/* Back + try again */}
              <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-6">
                <button
                  onClick={() => router.push("/")}
                  className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2] text-[#1C1C1E]" />
                </button>
                <button
                  onClick={() => { setRecipe(null); setStep("preferences"); }}
                  className="h-10 px-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.12)] flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-[#3B6E38] fill-[#3B6E38] stroke-0" />
                  <span className="text-[#1C1C1E] font-bold text-[13px]">Try Again</span>
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto pb-8 px-6 pt-2 space-y-4" style={{ scrollbarWidth: "none" }}>

              {/* Theme badge */}
              <div className="flex items-center gap-2">
                <span className="bg-[#EAF2E8] text-[#3B6E38] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {recipe.weekTheme}
                </span>
                <span className="bg-[#FFF6E9] text-[#F1A23A] text-[11px] font-bold px-3 py-1 rounded-full">
                  ✨ Surprise Pick
                </span>
              </div>

              {/* Recipe name */}
              <div>
                <h1 className="text-[#1C1C1E] font-bold text-[24px] tracking-tight leading-tight">
                  {recipe.signatureRecipe}
                </h1>
              </div>

              {/* Mystery ingredient */}
              <div className="bg-[#FFF9F0] rounded-[20px] p-4 border border-[#FFE5B4] flex items-center gap-3">
                <span className="text-2xl">🔮</span>
                <div>
                  <p className="text-[#1C1C1E] font-bold text-[13px]">Mystery Ingredient</p>
                  <p className="text-[#C27A10] text-[13px] font-semibold mt-0.5">{recipe.mysteryIngredient}</p>
                </div>
              </div>

              {/* Steps */}
              <div>
                <h2 className="text-[#1C1C1E] font-bold text-[15px] tracking-tight mb-3">Instructions</h2>
                <div className="space-y-2.5">
                  {recipe.recipeSteps.map((text, i) => (
                    <div key={i} className="flex gap-3 bg-white rounded-[18px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                      <div className="w-6 h-6 rounded-full bg-[#EAF2E8] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[#3B6E38] text-[11px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-[#3C3C43] text-[13px] leading-relaxed flex-1">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef note */}
              <div className="bg-[#EAF2E8] rounded-[20px] p-4 flex gap-3">
                <span className="text-xl shrink-0">👨‍🍳</span>
                <div>
                  <p className="text-[#3B6E38] font-bold text-[13px] mb-1">Chef's Note</p>
                  <p className="text-[#3C3C43] text-[13px] leading-relaxed">{recipe.chefNote}</p>
                </div>
              </div>

              {/* Try another */}
              <button
                onClick={() => { setRecipe(null); setStep("preferences"); }}
                className="w-full h-[54px] rounded-[20px] bg-[#3B6E38] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(59,110,56,0.25)] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 fill-white stroke-0" />
                Surprise Me Again!
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}