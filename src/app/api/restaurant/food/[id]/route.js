import { connectionStr } from "@/app/lib/db";
import { FoodModel } from "@/app/lib/foodmodel";
import mongoose from "mongoose";
import { Content } from "next/font/google";
import { NextResponse } from "next/server";

export async function GET(request, content) {
  const { id } = await content.params;

  let success = false;
  await mongoose.connect(connectionStr, { useNewUrlParser: true });
  const result = await FoodModel.find({ resto_id: id });

  return NextResponse.json({ result, success: true });
}

export async function DELETE(request, content) {
  const id = content.params.id;

  let success = false;
  await mongoose.connect(connectionStr, { useNewUrlParser: true });
  const result = await FoodModel.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    success = true;
  }

  return NextResponse.json({ result, success });
}


