"use client";

import { useState } from "react";

export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const [macros, setMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const generateRecipe = () => {
    if (!ingredient) return;

    setLoading(true);
    setRecipe("");

    setTimeout(() => {
      setRecipe(`
High Protein ${ingredient} Bowl

Ingredients:
• 200g ${ingredient}
• 1 tbsp olive oil
• 1 tsp garlic paste
• Salt & pepper
• Fresh herbs

Instructions:
1. Heat olive oil in a pan.
2. Add garlic and sauté.
3. Add ${ingredient} and cook evenly.
4. Season and cook for 8–10 minutes.
5. Garnish and serve.
      `);

      // Fake dynamic macro generation
      setMacros({
        calories: 350 + Math.floor(Math.random() * 150),
        protein: 25 + Math.floor(Math.random() * 20),
        carbs: 10 + Math.floor(Math.random() * 25),
        fat: 8 + Math.floor(Math.random() * 15),
      });

      setLoading(false);
    }, 1200);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      setIngredient(event.results[0][0].transcript);
    };
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 px-4">
      <div className="bg-white/80 backdrop-blur-lg w-full max-w-md p-10 rounded-3xl shadow-2xl border border-white/40">

        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">
          🍳 AI Meal Generator
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter ingredient..."
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="flex-1 px-5 py-4 text-lg text-gray-900 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
          />

          <button
            onClick={startVoiceInput}
            className="px-4 py-4 bg-gray-900 text-white rounded-xl hover:opacity-80 transition"
          >
            🎤
          </button>
        </div>

        <button
          onClick={generateRecipe}
          className="w-full py-4 text-lg font-semibold bg-black text-white rounded-xl hover:scale-[1.02] active:scale-[0.98] transition duration-200"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>

        {recipe && (
          <div className="mt-8 bg-gray-100 p-6 rounded-2xl border border-gray-300 animate-fadeIn">

            <pre className="whitespace-pre-line text-gray-900 text-base leading-7 font-medium">
              {recipe}
            </pre>

            {/* MACROS SECTION */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
                <p className="text-sm text-gray-500">Calories</p>
                <p className="text-xl font-bold">{macros.calories} kcal</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="text-xl font-bold">{macros.protein}g</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="text-xl font-bold">{macros.carbs}g</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
                <p className="text-sm text-gray-500">Fat</p>
                <p className="text-xl font-bold">{macros.fat}g</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
