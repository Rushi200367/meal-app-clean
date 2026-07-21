"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Clock, ChevronRight } from "lucide-react";

const DIETARY_CHIPS = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free",
  "Keto", "Paleo", "Nut-Free", "Low-Carb",
];

const COOK_TIMES = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr+",  value: 60 },
];

export default function PreferencesPage() {
  const router = useRouter();

  const [inputValue, setInputValue]     = useState("");
  const [ingredients, setIngredients]   = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [cookTime, setCookTime]         = useState<number | null>(null);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  const removeIngredient = (item: string) =>
    setIngredients((prev) => prev.filter((i) => i !== item));

  const toggleDiet = (chip: string) =>
    setSelectedDiet((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );

  const canGenerate = ingredients.length > 0 && cookTime !== null;

  const handleGenerate = () => {
    const params = new URLSearchParams({
      ingredients: ingredients.join(","),
      diet: selectedDiet.join(","),
      time: String(cookTime),
    });
    router.push(`/recipes?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center gap-3 shrink-0">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2] text-[#1C1C1E]" />
          </button>
          <div>
            <h1 className="text-[#1C1C1E] font-bold text-[22px] tracking-tight leading-tight">
              Build Your Recipe
            </h1>
            <p className="text-[#8E8E93] text-[13px] font-normal mt-0.5">
              Tell us what you have
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6" style={{ scrollbarWidth: "none" }}>

          {/* Ingredients input */}
          <section>
            <label className="text-[#1C1C1E] font-bold text-[15px] tracking-tight block mb-3">
              Ingredients
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                placeholder="e.g. chicken, tomatoes…"
                className="flex-1 h-[50px] rounded-2xl bg-white border border-[#F2F2F7] px-4 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus:border-[#3B6E38] transition-colors"
              />
              <button
                onClick={addIngredient}
                className="w-[50px] h-[50px] rounded-2xl bg-[#3B6E38] flex items-center justify-center shadow-[0_4px_16px_rgba(59,110,56,0.25)] active:scale-95 transition-transform shrink-0"
              >
                <Plus className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
            </div>

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {ingredients.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 bg-[#EAF2E8] text-[#3B6E38] text-[13px] font-semibold px-3 py-1.5 rounded-full"
                  >
                    {item}
                    <button onClick={() => removeIngredient(item)} className="active:scale-90 transition-transform">
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Dietary preferences */}
          <section>
            <label className="text-[#1C1C1E] font-bold text-[15px] tracking-tight block mb-3">
              Dietary Preferences
              <span className="text-[#8E8E93] font-normal text-[13px] ml-2">Optional</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_CHIPS.map((chip) => {
                const active = selectedDiet.includes(chip);
                return (
                  <button
                    key={chip}
                    onClick={() => toggleDiet(chip)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all active:scale-95 ${
                      active
                        ? "bg-[#3B6E38] text-white shadow-[0_4px_12px_rgba(59,110,56,0.2)]"
                        : "bg-white text-[#1C1C1E] border border-[#F2F2F7] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Cooking time */}
          <section>
            <label className="text-[#1C1C1E] font-bold text-[15px] tracking-tight block mb-3">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B6E38] stroke-[2.2]" />
                Cooking Time
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COOK_TIMES.map(({ label, value }) => {
                const active = cookTime === value;
                return (
                  <button
                    key={value}
                    onClick={() => setCookTime(value)}
                    className={`h-[56px] rounded-2xl text-[13px] font-bold transition-all active:scale-95 ${
                      active
                        ? "bg-[#3B6E38] text-white shadow-[0_4px_16px_rgba(59,110,56,0.25)]"
                        : "bg-white text-[#1C1C1E] border border-[#F2F2F7] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Summary card */}
          {ingredients.length > 0 && (
            <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F2F2F7]">
              <p className="text-[#8E8E93] text-[12px] font-semibold uppercase tracking-widest mb-2">Ready to cook</p>
              <p className="text-[#1C1C1E] text-[14px] font-medium leading-relaxed">
                <span className="text-[#3B6E38] font-bold">{ingredients.length} ingredient{ingredients.length > 1 ? "s" : ""}</span>
                {selectedDiet.length > 0 && <> · {selectedDiet.join(", ")}</>}
                {cookTime && <> · {COOK_TIMES.find(t => t.value === cookTime)?.label}</>}
              </p>
            </div>
          )}

        </div>

        {/* Generate button */}
        <div className="px-6 pb-10 pt-3 shrink-0 bg-[#FDFBF7]">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`w-full h-[58px] rounded-[20px] flex items-center justify-between px-6 font-bold text-[16px] transition-all active:scale-[0.98] ${
              canGenerate
                ? "bg-[#3B6E38] text-white shadow-[0_10px_24px_rgba(59,110,56,0.25)]"
                : "bg-[#F2F2F7] text-[#C7C7CC]"
            }`}
          >
            <span>Generate Recipe</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
          {!canGenerate && (
            <p className="text-center text-[#C7C7CC] text-[12px] mt-2">
              {ingredients.length === 0 ? "Add at least one ingredient" : "Select a cooking time"}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}