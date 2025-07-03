import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    resto_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    deliveryBoy_Id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    cartItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        foodname: String,
        price: Number,
        quantity: Number,
        imgpath: String,
      },
    ],
    deliveryDetails: {
      fullName: String,
      mobileNumber: String,
      address: String,
      city: String,
      pinCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "UPI / Wallet", "Credit / Debit Card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    subtotal: Number,
    gst: Number,
    deliveryFee: Number,
    total: Number,
    status: {
      type: String,
      enum: [
        "Confirm",
        "Pending",
        "Accepted",
        "Preparing",
        "On the way",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Ordermodel =
  mongoose.models.Ordermodel || mongoose.model("Ordermodel", orderSchema);
