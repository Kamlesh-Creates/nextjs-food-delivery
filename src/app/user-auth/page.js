"use client";
import React, { useState } from "react";
import Customerheader from "../_component/customerheader";
import Restaurantfooter from "../_component/restaurantfooter";
import Usersignup from "../_component/usersignup";
import Userlogin from "../_component/userlogin";

function Userauth() {
  
  return (
    <>
      <Customerheader />
      <Usersignup />
     

      <Restaurantfooter />
    </>
  );
}

export default Userauth;
