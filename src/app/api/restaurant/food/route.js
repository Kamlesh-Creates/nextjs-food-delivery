import { connectionStr } from "@/app/lib/db"
import { FoodModel } from "@/app/lib/foodmodel";
import mongoose from "mongoose"
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const payload = await request.json();

    await mongoose.connect(connectionStr, { useNewUrlParser: true });

    const food = new FoodModel(payload);
    const result = await food.save();

    return NextResponse.json({ result, success: true });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
