"use client";
import React, { useState } from "react";
import Restaurantlogin from "../_component/restaurantlogin";
import Restaurantsignup from "../_component/restaurantsignup";
import Restaurantheader from "../_component/reataurantheader";
import "./style.css";
import Restaurantfooter from "../_component/restaurantfooter";
function Restaurant() {
  const [login, setlogin] = useState(true);
  return (
    <>
      <div className="container">
        <Restaurantheader />
        <h1>Restaurant Login/Registration Page</h1>
        {login ? <Restaurantlogin /> : <Restaurantsignup />}
        <div>
          <button
            onClick={() => setlogin(!login)}
            className="mt-2 w-full text-indigo-600 hover:underline focus:outline-none"
          >
            {login
              ? "Do not have Account? SignUp"
              : "Already have account? Login"}
          </button>
        </div>
        <Restaurantfooter />
      </div>
    </>
  );
}

export default Restaurant;
