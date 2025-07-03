"use client";
import React, { useEffect, useState } from "react";
import Customerheader from "@/app/_component/customerheader";
import Restaurantfooter from "@/app/_component/restaurantfooter";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
      toast.error("User not logged in or cart is empty.");
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
      toast.error("Please fill all delivery and payment details.");
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
      toast.error("No delivery partner available in your area.");
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

          if (json.success) {
            toast.success("Payment successful! Order placed.");
            localStorage.removeItem("cart");
            router.push("/myorder");
          } else {
            toast.error("Order failed to save.");
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
        toast.success("Order placed (Cash on Delivery)");
        localStorage.removeItem("cart");
        router.push("/myorder");
      } else {
        toast.error("Order failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Customerheader />
      <div className="bg-gray-50 min-h-screen px-4 py-10">
        {/* ... UI remains unchanged ... */}
      </div>
      <Restaurantfooter />
    </>
  );
};

export default OrderPage;
