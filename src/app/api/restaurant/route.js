import { connectionStr } from "@/app/lib/db";
import { Quickmodel } from "@/app/lib/restaurantmodel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(connectionStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    const data = await Quickmodel.find();

    return NextResponse.json({ result: true, data });
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json(
      { result: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let success = false;
    const payload = await request.json();

    await mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let result;

    if (payload.login) {
      // Login handler
      result = await Quickmodel.findOne({
        email: payload.email,
        password: payload.password,
      });
      if (result) {
        success = true;
      }
    } else {
      // Signup handler
      console.log(payload)
      const detail = new Quickmodel(payload);
      
      const savedUser = await detail.save();
      result = savedUser.toObject(); // ✅ assign to outer `result`
      delete result.password;
      if (result) {
        success = true;
      } // ✅ remove password before sending
    }

    return NextResponse.json({ success, data: result }); // send result
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
