import mongoose from "mongoose";

const partnerschema = new mongoose.Schema({
  name: String,
  email: String,
  number: Number,
  password: String,

  city: String,
  address: String,
});

export const Deliverypartnermodel =
  mongoose.models.Deliverypartnermodel || mongoose.model("Deliverypartnermodel", partnerschema);
