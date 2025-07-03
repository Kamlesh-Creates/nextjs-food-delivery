"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Restaurantheader from "@/app/_component/reataurantheader";
import Restaurantfooter from "@/app/_component/restaurantfooter";

const DeliveryPartnerSignup = () => {
  const router = useRouter();
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const { confirmPassword, ...formDataToSend } = form;

  try {
    const res = await fetch(`${baseUrl}/api/deliverypartner/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataToSend),
    });

    const data = await res.json();
    console.log("Signup response:", data);

    if (data.success) {
      localStorage.setItem("deliveryPartnerInfo", JSON.stringify(data.data));
      alert("Signup successful");
      router.push("/deliverydashboard");
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong");
  }
};



  return (
    <>
    <Restaurantheader/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Delivery Partner Signup
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500"
          />
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500"
          />
          <input
            name="number"
            type="tel"
            required
            value={form.number}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500"
          />
          <input
            name="address"
            type="text"
            required
            value={form.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500"
          />
          <input
            name="city"
            type="text"
            required
            value={form.city}
            onChange={handleChange}
            placeholder="City"
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
          <input
            name="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            className="w-full bg-rose-600 text-white font-semibold py-3 rounded-lg hover:bg-rose-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a href="/deliverypartner/login" className="text-rose-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
    <Restaurantfooter/>
    </>
  );
};

export default DeliveryPartnerSignup;
