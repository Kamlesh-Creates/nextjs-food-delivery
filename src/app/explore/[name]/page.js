"use client";

import Customerheader from "@/app/_component/customerheader";
import Restaurantfooter from "@/app/_component/restaurantfooter";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Restopage() {
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const params = useParams();
  const searchParams = useSearchParams();

  const name = params.name;
  const id = searchParams.get("id");

  const [fooddata, setFoodData] = useState([]);
  const [cartdata, setCartData] = useState();
  const [cartstorage, setCartStorage] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(Date.now());

  // Load cart on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartStorage(storedCart);
    }
  }, []);

  const handleAddItem = (item) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const isSameRestaurant =
      storedCart.length === 0 || storedCart[0].resto_id === item.resto_id;

    let updatedCart;

    if (!isSameRestaurant) {
      updatedCart = [{ ...item, quantity: 1 }];
    } else {
      const existingIndex = storedCart.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      if (existingIndex !== -1) {
        updatedCart = [...storedCart];
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart = [...storedCart, { ...item, quantity: 1 }];
      }
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartStorage(updatedCart);
    setCartData(item); // Pass to header
    setTriggerUpdate(Date.now()); // Force header refresh
  };

  const handleremoveitem = (id) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = storedCart.findIndex((item) => item._id === id);
    if (existingIndex === -1) return;

    let updatedCart = [...storedCart];

    if (updatedCart[existingIndex].quantity > 1) {
      updatedCart[existingIndex].quantity -= 1;
    } else {
      updatedCart = updatedCart.filter((item) => item._id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartStorage(updatedCart);
    setTriggerUpdate(Date.now());
  };

  const totalQuantity = cartstorage.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  useEffect(() => {
    if (id) restodetails();
  }, [id]);

  const restodetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/customer/${id}`);
      const result = await response.json();
      if (result.success) {
        setFoodData(result.fooditems);
      }
    } catch (err) {
      console.error("Failed to fetch restaurant food items:", err);
    }
  };

  return (
    <>
      <Customerheader
        cartdata={cartdata}
        triggerUpdate={triggerUpdate}
        totalQuantity={totalQuantity}
      />

      <div className="w-full h-full bg-rose-50 py-6">
        <div className="max-w-6xl mx-auto flex flex-col justify-center items-center px-4">
          <p className="pb-2 text-lg lg:text-6xl text-rose-600 font-semibold">
            {decodeURIComponent(name || "")}
          </p>
          <h2 className="text-3xl lg:text-5xl text-center font-serif font-semibold mb-12 text-gray-800">
            Choose Your Best Food
          </h2>

          <div className="flex flex-wrap gap-8 justify-center items-center">
            {fooddata.length > 0 ? (
              fooddata.map((item) => {
                const inCartItem = cartstorage.find((ci) => ci._id === item._id);
                const quantity = inCartItem ? inCartItem.quantity : 0;

                return (
                  <div
                    key={item._id}
                    className="group w-[18rem] sm:w-[20rem] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-full h-[14rem] bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.imgpath || "https://via.placeholder.com/400x300"}
                        alt={item.foodname || "Food Item"}
                        className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-rose-600">
                        {item.foodname}
                      </h2>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-black-600">
                          ₹{item.price}
                        </span>
                        <div className="flex items-center text-yellow-500 text-sm font-medium">
                          ⭐{" "}
                          <span className="ml-1 text-gray-700">
                            {item.rating || "4.5"}
                          </span>
                        </div>
                      </div>

                      {quantity > 0 ? (
                        <div className="inline-flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            className="w-6 h-6 flex items-center justify-center cursor-pointer text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                            aria-label="Decrease"
                            onClick={() => handleremoveitem(item._id)}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            readOnly
                            className="w-10 text-center bg-transparent border-0 text-gray-900"
                          />
                          <button
                            type="button"
                            className="w-6 h-6 flex items-center justify-center cursor-pointer text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                            aria-label="Increase"
                            onClick={() => handleAddItem(item)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddItem(item)}
                          className="w-full py-2 border cursor-pointer border-rose-600 text-rose-700 rounded-full uppercase font-bold transition duration-300 hover:bg-rose-600 hover:text-white"
                        >
                          Add To Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-full">No food items found.</p>
            )}
          </div>
        </div>
      </div>

      <Restaurantfooter />
    </>
  );
}

export default Restopage;
