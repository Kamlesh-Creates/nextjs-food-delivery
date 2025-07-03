"use client";
import React, { useState, useEffect } from "react";
import Customerheader from "../_component/customerheader";
import Restaurantfooter from "../_component/restaurantfooter";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Cartpage() {
  const [savedcart, setsavedcart] = useState([]);
  const [userinfo,setuserinfo]=useState()
  const router=useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const userdata=JSON.parse(localStorage.getItem("Userinfo"));
      setuserinfo(userdata)

      setsavedcart(storedCart);
    }
  }, []);

  const ordernow = () => {
  if (userinfo) {
    router.push("/cart/order");
  } else {
    
    if (typeof window !== "undefined") {
      localStorage.setItem("postLoginRedirect", "/cart/order");
    }
    router.push("/user-auth?order=true");
  }
};



  const updateQuantity = (index, change) => {
    const updatedCart = [...savedcart];
    const newQty = (updatedCart[index].quantity || 1) + change;
    if (newQty >= 1) {
      updatedCart[index].quantity = newQty;
      setsavedcart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const clearCart = () => {
    setsavedcart([]);
    localStorage.removeItem("cart");
  };

  const subtotal = savedcart.reduce((acc, item) => {
    return acc + item.price * (item.quantity || 1);
  }, 0);

  const gst = subtotal * 0.05;
  const deliveryFee = 40;
  const total = subtotal + gst + deliveryFee;

  return (
    <>
      <Customerheader />
      <div className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-rose-600 mb-8">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Items in Cart
              </h2>

              <div className="space-y-8">
                {savedcart.length > 0 ? (
                  savedcart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-6"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imgpath || "https://via.placeholder.com/60"}
                          alt={item.foodname || "Food Item"}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.foodname}
                          </h3>
                          <p>{item.description}</p>
                          <p className="text-gray-600 text-sm">
                            ₹{item.price} × {item.quantity || 1}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="w-8 h-8 border text-xl font-bold text-gray-600 rounded hover:bg-gray-200 transition duration-200 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-gray-800 font-medium">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="w-8 h-8 border text-xl font-bold text-gray-600 rounded hover:bg-gray-200 transition duration-200 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-8">
                    Your cart is empty.
                  </p>
                )}
              </div>
            </div>

            {/* Billing Section */}
            {savedcart.length > 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md sticky top-20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Bill Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>GST (5%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>

                  <hr className="my-3 border-gray-200" />

                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                
  <button onClick={ordernow} className="mt-6 w-full bg-rose-600 text-white cursor-pointer font-semibold py-3 rounded-lg hover:bg-rose-700 transition duration-200">
    Proceed to Order
  </button>



                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-sm text-gray-400 underline hover:text-gray-600 transition duration-200"
                >
                  Clear Cart
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Restaurantfooter />
    </>
  );
}

export default Cartpage;
