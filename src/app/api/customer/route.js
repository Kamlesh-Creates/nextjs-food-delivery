import mongoose from "mongoose";
import { FoodModel } from "@/app/lib/foodmodel";
import { Quickmodel } from "@/app/lib/restaurantmodel";
import { NextResponse } from "next/server";
import { connectionStr } from "@/app/lib/db";

let isConnected = false; // ✅ simple caching flag

export async function GET(request) {
  try {
    if (!isConnected) {
      await mongoose.connect(connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("✅ MongoDB connected");
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const restaurantOrFood = searchParams.get("restaurant");

    let restaurants = [];

    if (restaurantOrFood) {
      const restByName = await Quickmodel.find({
        restoname: { $regex: restaurantOrFood, $options: "i" },
      });

      const foodItems = await FoodModel.find({
        foodname: { $regex: restaurantOrFood, $options: "i" },
      });

      const restoIdsFromFood = [
        ...new Set(foodItems.map((food) => food.resto_id.toString())),
      ];

      const restByFood = await Quickmodel.find({
        _id: { $in: restoIdsFromFood },
      });

      const combined = [...restByName, ...restByFood];
      const uniqueRestaurantsMap = new Map();
      combined.forEach((r) => uniqueRestaurantsMap.set(r._id.toString(), r));
      restaurants = Array.from(uniqueRestaurantsMap.values());
    } else if (location) {
      restaurants = await Quickmodel.find({
        city: { $regex: location, $options: "i" },
      });
    } else {
      restaurants = await Quickmodel.find();
    }

    return NextResponse.json({ success: true, result: restaurants });
  } catch (err) {
    console.error("❌ Error in /api:", err);
    return NextResponse.json(
      { success: false, error: "Query or DB connection failed" },
      { status: 500 }
    );
  }
}
