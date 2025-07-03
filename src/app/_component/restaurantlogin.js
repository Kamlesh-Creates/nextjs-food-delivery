"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Restaurantlogin() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();

 const validate = () => {
  const newErrors = {};
  if (!email.trim()) newErrors.email = "Email is required";
  if (!password.trim()) newErrors.password = "Password is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handlelogin = async () => {
    if (!validate()) return;

    try {
      const response = await fetch(`${baseUrl}/api/restaurant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, login: true }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        const user = { ...resData.data };
        delete user.password;

        localStorage.setItem("restaurantUser", JSON.stringify(user));
        alert("Login Successful");
        router.push("/restaurant/dashboard");
      } else {
        alert("Login Failed: Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mx-auto">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Restaurant Login
      </h3>

      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className={`w-full px-4 py-2 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className={`w-full px-4 py-2 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Login Button */}
      <button
        onClick={handlelogin}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
      >
        Login
      </button>
    </div>
  );
}

export default Restaurantlogin;
