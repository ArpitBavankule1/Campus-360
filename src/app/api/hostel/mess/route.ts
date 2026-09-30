import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_MESS_MENUS,
  generateMealPassCode,
} from "@/lib/hostel/hostel-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { MealType, MessDayOfWeek } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");
    const meal = searchParams.get("meal");

    if (
      (day && (containsSQLInjection(day) || containsXSS(day))) ||
      (meal && (containsSQLInjection(meal) || containsXSS(meal)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid day or meal parameter." },
        { status: 400 }
      );
    }

    let results = [...MOCK_MESS_MENUS];

    if (day && day !== "all") {
      const sanitizedDay = sanitizeInput(day).toLowerCase() as MessDayOfWeek;
      results = results.filter((m) => m.day_of_week === sanitizedDay);
    }

    if (meal && meal !== "all") {
      const sanitizedMeal = sanitizeInput(meal).toLowerCase() as MealType;
      results = results.filter((m) => m.meal_type === sanitizedMeal);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Hostel mess menu fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve mess schedule." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, mealType, dietaryPreference } = body;

    if (!mealType || !["breakfast", "lunch", "snacks", "dinner"].includes(mealType)) {
      return NextResponse.json(
        { success: false, error: "Valid meal type is required (breakfast, lunch, snacks, dinner)." },
        { status: 400 }
      );
    }

    if (dietaryPreference && (containsSQLInjection(dietaryPreference) || containsXSS(dietaryPreference))) {
      return NextResponse.json(
        { success: false, error: "Invalid dietary preference parameter." },
        { status: 400 }
      );
    }

    const passCode = generateMealPassCode(mealType as MealType);
    const passTimestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: {
        passCode,
        studentId: studentId || "00000000-0000-0000-0000-000000000001",
        mealType,
        dietaryPreference: dietaryPreference ? sanitizeInput(dietaryPreference) : "Standard Vegetarian",
        issuedAt: passTimestamp,
        validUntil: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        status: "active",
      },
    });
  } catch (error) {
    console.error("Meal coupon generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate meal coupon." },
      { status: 500 }
    );
  }
}
