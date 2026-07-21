"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Camera, Loader2, AlertCircle, ChevronRight } from "lucide-react";

export default function ScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "preview" | "results">("upload");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setStep("preview");
      setIngredients([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const found = data.ingredients
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean);

      setIngredients(found);
      setStep("results");
    } catch (err: any) {
      setError(err.message || "Failed to scan image");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecipe = () => {
    const params = new URLSearchParams({
      ingredients: ingredients.join(","),
      diet: "",
      time: "30",
    });
    router.push(`/recipes?${params.toString()}`);
  };

  const handleReset = () => {
    setImage(null);
    setIngredients([]);
    setError(null);
    setStep("upload");
  };

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* Header */}
        <div className="px-6 pt-14 pb-4 flex items-center gap-3 shrink-0">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2] text-[#1C1C1E]" />
          </button>
          <div>
            <h1 className="text-[#1C1C1E] font-bold text-[22px] tracking-tight leading-tight">
              Scan Groceries
            </h1>
            <p className="text-[#8E8E93] text-[13px] font-normal mt-0.5">
              Upload a photo of your ingredients
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5" style={{ scrollbarWidth: "none" }}>

          {/* ── STEP 1: Upload ── */}
          {step === "upload" && (
            <>
              {/* Upload zone */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-[28px] bg-white border-2 border-dashed border-[#C7C7CC] flex flex-col items-center justify-center gap-4 active:scale-[0.99] transition-all"
                style={{ height: "280px" }}
              >
                <div className="w-20 h-20 rounded-full bg-[#EAF2E8] flex items-center justify-center">
                  <Camera className="w-9 h-9 text-[#3B6E38] stroke-[1.8]" />
                </div>
                <div className="text-center">
                  <p className="text-[#1C1C1E] font-bold text-[16px]">Upload a Photo</p>
                  <p className="text-[#8E8E93] text-[13px] mt-1">Tap to choose from your gallery</p>
                </div>
                <div className="flex items-center gap-2 bg-[#3B6E38] px-5 py-2.5 rounded-full">
                  <Upload className="w-4 h-4 text-white stroke-[2.2]" />
                  <span className="text-white font-bold text-[13px]">Choose Photo</span>
                </div>
              </button>

              {/* Tips */}
              <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3">
                <p className="text-[#1C1C1E] font-bold text-[14px]">📸 Tips for best results</p>
                {[
                  "Take a photo of your fridge or pantry",
                  "Make sure ingredients are clearly visible",
                  "Good lighting helps Gemini identify items",
                  "Works with grocery bags, countertops too",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B6E38] mt-1.5 shrink-0" />
                    <p className="text-[#8E8E93] text-[13px] leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>

              {/* Example images */}
              <div>
                <p className="text-[#8E8E93] text-[12px] font-semibold uppercase tracking-widest mb-3 px-1">
                  Example photos that work
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=150&h=150&q=80",
                    "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=150&h=150&q=80",
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&h=150&q=80",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="example"
                      className="w-full h-24 object-cover rounded-2xl"
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Preview ── */}
          {step === "preview" && image && (
            <>
              {/* Image preview */}
              <div className="relative w-full rounded-[28px] overflow-hidden" style={{ height: "280px" }}>
                <img
                  src={image}
                  alt="uploaded"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="text-white text-[16px] font-bold leading-none">×</span>
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-[#FFF0F0] rounded-[20px] p-4 flex items-center gap-3 border border-red-100">
                  <AlertCircle className="w-5 h-5 text-[#FF6B6B] stroke-[2] shrink-0" />
                  <p className="text-[#FF6B6B] text-[13px] font-medium">{error}</p>
                </div>
              )}

              {/* Scan button */}
              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full h-[58px] rounded-[20px] bg-[#3B6E38] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(59,110,56,0.25)] active:scale-[0.98] transition-all disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 stroke-[2.2] animate-spin" />
                    Scanning with Gemini…
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 stroke-[2.2]" />
                    Scan Ingredients
                  </>
                )}
              </button>

              {!loading && (
                <button
                  onClick={handleReset}
                  className="w-full h-[48px] rounded-[20px] bg-[#F2F2F7] text-[#8E8E93] font-bold text-[14px] active:scale-[0.98] transition-all"
                >
                  Choose Different Photo
                </button>
              )}
            </>
          )}

          {/* ── STEP 3: Results ── */}
          {step === "results" && (
            <>
              {/* Image thumbnail */}
              {image && (
                <div className="relative w-full rounded-[28px] overflow-hidden" style={{ height: "160px" }}>
                  <img src={image} alt="scanned" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="bg-[#3B6E38] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      ✓ Scanned
                    </span>
                  </div>
                </div>
              )}

              {/* Ingredients found */}
              <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <p className="text-[#8E8E93] text-[12px] font-semibold uppercase tracking-widest mb-3">
                  Ingredients Found ({ingredients.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((item) => (
                    <span
                      key={item}
                      className="bg-[#EAF2E8] text-[#3B6E38] text-[13px] font-semibold px-3 py-1.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerateRecipe}
                className="w-full h-[58px] rounded-[20px] bg-[#3B6E38] text-white font-bold text-[16px] flex items-center justify-between px-6 shadow-[0_10px_24px_rgba(59,110,56,0.25)] active:scale-[0.98] transition-all"
              >
                <span>Generate Recipe</span>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Scan again */}
              <button
                onClick={handleReset}
                className="w-full h-[48px] rounded-[20px] bg-[#F2F2F7] text-[#8E8E93] font-bold text-[14px] active:scale-[0.98] transition-all"
              >
                Scan Another Photo
              </button>
            </>
          )}

        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

      </div>
    </div>
  );
}