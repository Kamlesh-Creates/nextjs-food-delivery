"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Restaurantheader from "@/app/_component/reataurantheader";
import Restaurantfooter from "@/app/_component/restaurantfooter";
import toast from "react-hot-toast";

const DeliveryPartnerLogin = () => {
  const router = useRouter();
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [form, setForm] = useState({ number: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${baseUrl}/api/deliverypartner/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, login: true }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (data.success) {
      localStorage.setItem("deliveryPartnerInfo", JSON.stringify(data.data));
      router.push("/deliverydashboard");
    } else {
      toast.error(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Something went wrong");
  }
};



  return (
    <>
    <Restaurantheader/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Partner Login</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="number"
            type="number"
            required
            value={form.number}
            onChange={handleChange}
            placeholder="Mobile No"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500"
          />
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            className="w-full bg-rose-600 text-white font-semibold py-3 rounded-lg hover:bg-rose-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/deliverypartner/signup" className="text-rose-600 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
    <Restaurantfooter/>
    </>
  );
};

export default DeliveryPartnerLogin;
