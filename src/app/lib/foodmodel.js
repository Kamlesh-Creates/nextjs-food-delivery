import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  foodname: { type: String, required: true },
  price: { type: Number, required: true },
  imgpath: { type: String },
  description: { type: String },
  resto_id:mongoose.Schema.Types.ObjectId
}, { timestamps: true });

export const FoodModel = mongoose.models.FoodModel || mongoose.model("FoodModel", FoodSchema);
