import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SingleRecipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recipeName:   { type: Type.STRING },
    description:  { type: Type.STRING },
    difficulty:   { type: Type.STRING },
    calories:     { type: Type.STRING },
    protein:      { type: Type.STRING },
    carbs:        { type: Type.STRING },
    fat:          { type: Type.STRING },
    steps:        { type: Type.ARRAY, items: { type: Type.STRING } },
    missingItems: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["recipeName", "description", "difficulty", "calories", "protein", "carbs", "fat", "steps", "missingItems"]
};

const WeeklyPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    estimatedSavings: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day:       { type: Type.STRING },
          meal:      { type: Type.STRING },
          wasteSaved:{ type: Type.STRING },
          missing:   { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["day", "meal", "wasteSaved", "missing"]
      }
    }
  },
  required: ["estimatedSavings", "days"]
};

const SurpriseRecipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    weekTheme:         { type: Type.STRING },
    signatureRecipe:   { type: Type.STRING },
    recipeSteps:       { type: Type.ARRAY, items: { type: Type.STRING } },
    mysteryIngredient: { type: Type.STRING },
    chefNote:          { type: Type.STRING }
  },
  required: ["weekTheme", "signatureRecipe", "recipeSteps", "mysteryIngredient", "chefNote"]
};

export async function POST(request: Request) {
  try {
    const { ingredient, type, dietaryProfile } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const constraints = [
      dietaryProfile?.diet && dietaryProfile.diet !== "any" ? `Diet: Strict ${dietaryProfile.diet}.` : "",
      dietaryProfile?.allergies?.length > 0 ? `EXCLUDE completely: ${dietaryProfile.allergies.join(", ")}.` : "",
      dietaryProfile?.fitnessGoal && dietaryProfile.fitnessGoal !== "balanced" ? `Macro-target: ${dietaryProfile.fitnessGoal}.` : ""
    ].filter(Boolean).join(" ");

    let prompt = "";
    let activeSchema: Schema;

    if (type === "surprise") {
      prompt = `Generate 1 unique creative theme, 1 signature recipe dish name using "${ingredient || "seasonal staples"}", simple sequential preparation instructions, an ordinary mystery kitchen ingredient, and 1 tip. Constraints: ${constraints}`;
      activeSchema = SurpriseRecipeSchema;
    } else if (type === "weekly") {
      prompt = `Create a realistic 5-day waste-saving schedule utilizing: "${ingredient}". Estimate monetary savings in INR. Constraints: ${constraints}`;
      activeSchema = WeeklyPlanSchema;
    } else {
      prompt = `The user typed: "${ingredient}". First silently auto-correct any spelling mistakes in the ingredient or dish name (for example "marsala dosa" should become "masala dosa", "panner" becomes "paneer", "chiken" becomes "chicken"). Then create an everyday recipe based on the corrected name. Use the corrected name as the recipeName. Write a short 1-2 sentence description of the dish. Set difficulty to one of: Easy, Medium, or Hard. Estimate calories per serving as a number with "kcal" (e.g. "420 kcal"). Estimate protein, carbs, fat per serving in grams (e.g. "28g"). Write clear actionable preparation instructions in the steps array. If any common spices or secondary elements are recommended list them in missingItems. Never return an error for misspelled ingredients — always attempt to find the closest matching dish. Constraints: ${constraints}`;
      activeSchema = SingleRecipeSchema;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: activeSchema,
        temperature: 0.5
      }
    });

    const rawText = response.text?.trim();
    if (!rawText) throw new Error("Null response packet received from engine.");

    return NextResponse.json(JSON.parse(rawText));

  } catch (error: any) {
    console.error("🔒 Critical Pipeline Failure Context:", error);
    return NextResponse.json({ error: "Data processing exception incurred." }, { status: 500 });
  }
}