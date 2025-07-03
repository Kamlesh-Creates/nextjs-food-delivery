import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { FoodModel } from "@/app/lib/foodmodel";
import { connectionStr } from "@/app/lib/db"; 


export async function GET(request, content) {
  const { id } = await content.params;
  let success = false;
  try {
    await mongoose.connect(connectionStr);
    const result = await FoodModel.findById(id);
    if (result) success = true;
    return NextResponse.json({ result, success });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function PUT(request, content) {
  const { id } = await content.params;
  let success = false;

  try {
    await mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const body = await request.json();
    const result = await FoodModel.updateOne({ _id: id }, { $set: body });

    if (result.modifiedCount > 0) success = true;

    return NextResponse.json({ result, success });
  } catch (error) {
    console.error("Error updating food item:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
