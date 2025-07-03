import { connectionStr } from "@/app/lib/db"
import { FoodModel } from "@/app/lib/foodmodel"
import { Quickmodel } from "@/app/lib/restaurantmodel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request,content) {
    const id=content.params.id
   await mongoose.connect(connectionStr,{useNewUrlParser:true})
   const details=await Quickmodel.findOne({_id:id})
   const fooditems=await FoodModel.find({resto_id:id})

    return NextResponse.json({success:true,details,fooditems})
}