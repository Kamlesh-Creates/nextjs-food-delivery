import { connectionStr } from "@/app/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { Usermodel } from "@/app/lib/usemodel";

dotenv.config();



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
      result = await Usermodel.findOne({
        email: payload.email,
        password: payload.password,
      });
      if (result) {
        success = true;
      }
    } else {
      // Signup handler
      const detail = new Usermodel(payload);
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
