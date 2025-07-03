import { connectionStr } from "@/app/lib/db";
import { Ordermodel } from "@/app/lib/ordermodel";
import { Quickmodel } from "@/app/lib/restaurantmodel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, content) {
  try {
    const id = content.params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required." },
        { status: 400 }
      );
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr);
    }

    const orders = await Ordermodel.find({ deliveryBoy_Id: id }).lean();

    if (!orders.length) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const restoIds = [
      ...new Set(orders.map((order) => order.resto_id.toString())),
    ];

    const restaurants = await Quickmodel.find({
      _id: { $in: restoIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).lean();

    const restaurantMap = restaurants.reduce((acc, r) => {
      acc[r._id.toString()] = r;
      return acc;
    }, {});

    const result = orders.map((order) => ({
      ...order,
      resto: restaurantMap[order.resto_id.toString()] || null,
    }));

    return NextResponse.json({ success: true, orders: result });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
