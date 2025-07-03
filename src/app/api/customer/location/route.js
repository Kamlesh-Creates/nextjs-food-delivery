import { connectionStr } from "@/app/lib/db";
import { Quickmodel } from "@/app/lib/restaurantmodel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

let isConnected = false; // ✅ Prevent reconnects

export async function GET() {
  try {
    if (!isConnected) {
      await mongoose.connect(connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("✅ Connected to MongoDB");
    }

    let result = await Quickmodel.find();

    result = result.map((item) => {
      const city = item.city || "";
      return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    });

    result = [...new Set(result)]; // ✅ remove duplicates

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    return NextResponse.json({ success: false, error: "Database query failed" }, { status: 500 });
  }
}
