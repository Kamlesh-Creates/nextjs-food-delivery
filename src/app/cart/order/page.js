"use client";
import React, { useEffect, useState } from "react";
import Customerheader from "@/app/_component/customerheader";
import Restaurantfooter from "@/app/_component/restaurantfooter";
import { useRouter } from "next/navigation";


const OrderPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const gst = subtotal * 0.05;
  const delivery = 40;
  const total = subtotal + gst + delivery;

 const makeorder = async (e) => {
  e.preventDefault();
  setLoading(true);

  const userid = JSON.parse(localStorage.getItem("Userinfo"))?._id;
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!userid || storedCart.length === 0) {
    alert("User not logged in or cart is empty.");
    setLoading(false);
    return;
  }

  const formData = new FormData(e.target);
  const fullName = formData.get("fullName");
  const mobileNumber = formData.get("mobileNumber");
  const address = formData.get("address");
  const city = formData.get("city");
  const pinCode = formData.get("pinCode");
  const paymentMethod = formData.get("paymentMethod");

  if (!fullName || !mobileNumber || !address || !city || !pinCode || !paymentMethod) {
    alert("Please fill all delivery and payment details.");
    setLoading(false);
    return;
  }

  const resto_id = storedCart[0].resto_id;

  // Get delivery partner by city
  let deliveryboyid;
  try {
    const res = await fetch(`${baseUrl}/api/deliverypartner/${city}`);
    const json = await res.json();
    const ids = json.result.map((item) => item._id);
    deliveryboyid = ids[Math.floor(Math.random() * ids.length)];
    if (!deliveryboyid) throw new Error();
  } catch {
    alert("No delivery partner available in your area.");
    setLoading(false);
    return;
  }

  const cartItems = storedCart.map((item) => ({
    foodId: item._id,
    foodname: item.foodname,
    price: item.price,
    quantity: item.quantity || 1,
    imgpath: item.imgpath || "",
  }));

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const delivery = 40;
  const total = subtotal + gst + delivery;

  const orderData = {
  userId: userid,
  resto_id,
  deliveryBoy_Id: deliveryboyid,
  cartItems,
  deliveryDetails: {
    fullName,
    mobileNumber,
    address,
    city,
    pinCode,
  },
  paymentMethod,
  subtotal,
  gst,
  deliveryFee: delivery,
  total,
  status: "Confirm",
  paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid", 
};



  // Razorpay 
  if (paymentMethod === "UPI / Wallet" || paymentMethod === "Credit / Debit Card") {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR",
      name: "Food Delivery App",
      description: "Order Payment",
      handler: async function (response) {
        // after payment
        const finalOrder = {
          ...orderData,
          paymentId: response.razorpay_payment_id,
        };

        const res = await fetch(`${baseUrl}/api/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalOrder),
        });

        const json = await res.json();
        // console.log(" ORDER RESPONSE:", json);
        if (json.success) {
          alert("Payment successful! Order placed.");
          localStorage.removeItem("cart");
          router.push("/myorder");
        } else {
          alert("Order failed to save.");
        }
      },
      prefill: {
        name: fullName,
        contact: mobileNumber,
      },
      theme: {
        color: "#F43F5E",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(false);
    return;
  }

  // Cash on delivery
  try {
    const res = await fetch(`${baseUrl}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const json = await res.json();

    if (json.success) {
      alert("Order placed (Cash on Delivery)");
      localStorage.removeItem("cart");
      router.push("/myorder");
    } else {
      alert("Order failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Customerheader />
      <div className="bg-gray-50 min-h-screen px-4 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Details Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Delivery Details
            </h2>

            <form className="space-y-5" onSubmit={makeorder}>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Mobile Number
                </label>
                <input
                  name="mobileNumber"
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Street Address
                </label>
                <input
                  name="address"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Flat No, Building Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    City
                  </label>
                  <input
                    name="city"
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Pin Code
                  </label>
                  <input
                    name="pinCode"
                    type="text"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select payment method</option>
                  <option>Cash on Delivery</option>
                  <option>UPI / Wallet</option>
                  <option>Credit / Debit Card</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-rose-600"
                } text-white font-semibold py-3 rounded-lg transition duration-200`}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-fit sticky top-20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.imgpath || "https://via.placeholder.com/60"}
                        alt={item.foodname}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {item.foodname}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-800 font-medium">
                      ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  Your cart is empty.
                </p>
              )}
            </div>

            {/* Billing Summary */}
            <div className="mt-6 space-y-3 text-sm">
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
                <span>₹{delivery.toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Restaurantfooter />
    </>
  );
};

export default OrderPage;
