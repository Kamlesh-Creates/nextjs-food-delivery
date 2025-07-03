"use client";
import Customerheader from "@/app/_component/customerheader";
import Restaurantfooter from "@/app/_component/restaurantfooter";
import Userlogin from "@/app/_component/userlogin";
import React from "react";

function Loginpage() {

  return (
    <>
      <Customerheader />
      <Userlogin />
      <Restaurantfooter />
    </>
  );
}

export default Loginpage;
