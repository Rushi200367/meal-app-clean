import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: "No image data payload present" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing from .env.local");
      return NextResponse.json({ error: "Vision Key Missing from server environment." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: base64Data } },
        "Identify all raw cooking ingredients or food items in this image. Return ONLY a plain comma-separated list of items found. Example: paneer, tomatoes, onions. Do not write full sentences."
      ],
    });

    const textResult = (response.text as any) || "";
    return NextResponse.json({ ingredients: textResult.trim() });
  } catch (error: any) {
    // This logs the exact root cause directly inside your terminal console window!
    console.error("❌ ACTUAL BACKEND CRASH ERROR:", error);
    return NextResponse.json({ error: error.message || "Vision Parse Failure" }, { status: 500 });
  }
}