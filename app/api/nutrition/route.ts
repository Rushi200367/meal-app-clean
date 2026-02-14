import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { ingredient } = await req.json();

    const appId = process.env.EDAMAM_APP_ID;
    const appKey = process.env.EDAMAM_APP_KEY;

    console.log("APP ID:", appId);
    console.log("APP KEY:", appKey);
    console.log("Ingredient:", ingredient);

    if (!appId || !appKey) {
      return NextResponse.json(
        { error: "API keys missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=200g%20${ingredient}`
    );

    const data = await response.json();

    console.log("Edamam response:", data);

    return NextResponse.json({
      calories: data.calories || 0,
      protein: data.totalNutrients?.PROCNT?.quantity?.toFixed(1) || 0,
      carbs: data.totalNutrients?.CHOCDF?.quantity?.toFixed(1) || 0,
      fat: data.totalNutrients?.FAT?.quantity?.toFixed(1) || 0,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
