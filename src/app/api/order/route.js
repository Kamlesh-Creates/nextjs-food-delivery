import { connectionStr } from "@/app/lib/db";
import { Ordermodel } from "@/app/lib/ordermodel";
import { Quickmodel } from "@/app/lib/restaurantmodel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Deliverypartnermodel } from "@/app/lib/deliverypartnermodel";

export async function POST(request) {
  try {
    const payload = await request.json();
    console.log("Received payload:", payload);

    await mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const order = new Ordermodel(payload);
    const result = await order.save();

    console.log("✅ Order saved to DB:", result);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error(" Order save failed:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionStr);
    }

    // Fetch orders by user ID
    const orders = await Ordermodel.find({ userId }).sort({ createdAt: -1 }).lean();

    if (!orders.length) {
      return NextResponse.json({ success: true, orders: [] });
    }

    // --- Restaurant Info ---
    const restoIds = [...new Set(orders.map(order => order.resto_id))];
    const restaurants = await Quickmodel.find({ _id: { $in: restoIds } }).lean();
    const restaurantMap = restaurants.reduce((acc, r) => {
      acc[r._id.toString()] = r;
      return acc;
    }, {});

    // --- Delivery Partner Info ---
    const deliveryPartnerIds = orders
      .map(order => order.deliveryBoy_Id)
      .filter(id => id != null)
      .map(id => id.toString());

    const uniqueDeliveryPartnerIds = [...new Set(deliveryPartnerIds)];

    const deliveryPartners = await Deliverypartnermodel.find({
      _id: { $in: uniqueDeliveryPartnerIds }
    }).lean();

    const deliveryPartnerMap = deliveryPartners.reduce((acc, partner) => {
      acc[partner._id.toString()] = partner;
      return acc;
    }, {});

    // --- Final Result ---
    const result = orders.map(order => ({
      _id: order._id,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      gst: order.gst,
      deliveryFee: order.deliveryFee,
      cartItems: order.cartItems,
      paymentMethod: order.paymentMethod,
      deliveryDetails: order.deliveryDetails,
      resto: restaurantMap[order.resto_id?.toString()] || null,
      deliveryPartner: order.deliveryBoy_Id
        ? deliveryPartnerMap[order.deliveryBoy_Id.toString()] || null
        : null,
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


export async function PUT(request) {
  try {
    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { success: false, message: "Missing orderId or newStatus" },
        { status: 400 }
      );
    }

    await mongoose.connect(connectionStr);

    const updatedOrder = await Ordermodel.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Error updating order status:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
