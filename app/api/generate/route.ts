import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// ==========================================
// STRICT ENGINE SCHEMAS
// This locks the AI into the exact property keys your UI needs
// ==========================================
const SingleRecipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING },
    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingItems: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["recipeName", "steps", "missingItems"]
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
          day: { type: Type.STRING },
          meal: { type: Type.STRING },
          wasteSaved: { type: Type.STRING },
          missing: { type: Type.ARRAY, items: { type: Type.STRING } }
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
    weekTheme: { type: Type.STRING },
    signatureRecipe: { type: Type.STRING },
    recipeSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    mysteryIngredient: { type: Type.STRING },
    chefNote: { type: Type.STRING }
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

    // Constraint Processing
    const constraints = [
      dietaryProfile?.diet && dietaryProfile.diet !== "any" ? `Diet: Strict ${dietaryProfile.diet}.` : "",
      dietaryProfile?.allergies && dietaryProfile.allergies.length > 0 ? `EXCLUDE completely: ${dietaryProfile.allergies.join(", ")}.` : "",
      dietaryProfile?.fitnessGoal && dietaryProfile.fitnessGoal !== "balanced" ? `Macro-target: ${dietaryProfile.fitnessGoal}.` : ""
    ].filter(Boolean).join(" ");

    let prompt = "";
    let activeSchema: Schema;

    // Direct Pipeline Assignment
    if (type === "surprise") {
      prompt = `Generate 1 unique creative theme, 1 signature recipe dish name using "${ingredient || "seasonal staples"}", simple sequential preparation instructions, an ordinary mystery kitchen ingredient, and 1 tip. Constraints: ${constraints}`;
      activeSchema = SurpriseRecipeSchema;
    } else if (type === "weekly") {
      prompt = `Create a realistic 5-day waste-saving schedule utilizing: "${ingredient}". Estimate monetary savings in INR. Constraints: ${constraints}`;
      activeSchema = WeeklyPlanSchema;
    } else {
      prompt = `Create an everyday recipe based on: "${ingredient}". Write clear, actionable preparation instructions in the steps array. If any common spices or secondary elements are recommended, list them in missingItems. Constraints: ${constraints}`;
      activeSchema = SingleRecipeSchema;
    }

    // Execute API Call with native Engine-level JSON Constraints
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: activeSchema,
        temperature: 0.5 // Allows enough creativity to fully flesh out the instruction text arrays
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