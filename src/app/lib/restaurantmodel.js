import mongoose from "mongoose";

const QuickSchema = new mongoose.Schema({
  email:String,
  password:String,
  restoname:String,
  city:String,
  address:String,
  contact:String,
  imgpath:String,
});

export const Quickmodel = mongoose.models.Quickmodel || mongoose.model("Quickmodel", QuickSchema);
