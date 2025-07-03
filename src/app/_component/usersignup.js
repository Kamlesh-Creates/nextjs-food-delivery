"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

function Usersignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const { name, email, password } = formData;

    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const response = await res.json();
    console.log("API Response:", response);

    if (response?.success && response?.data) {
      if (typeof window !== "undefined") {
        const user = {
          ...response.data,
          isAuthenticated: true,
        };
        localStorage.setItem("Userinfo", JSON.stringify(user));
        alert("Signup Successful");

        const redirectPath = localStorage.getItem("postLoginRedirect") || "/cart";
        localStorage.removeItem("postLoginRedirect");

        router.push(redirectPath);
      }
    } else {
      alert("Signup failed: " + (response?.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("An unexpected error occurred. Please try again.");
  }
};


  return (
    <div
      className="min-h-screen py-20"
      style={{ backgroundImage: "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
          {/* Left */}
          <div
            className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-center bg-cover"
            style={{
              backgroundImage:
                'url("https://i.pinimg.com/736x/56/d7/3d/56d73dfe6f81a4b0c78505360cabe7bd.jpg")',
            }}
          >
            <h1 className="text-white text-3xl font-bold mb-3">
              Welcome Foodie!
            </h1>
            <p className="text-white text-center">
              Join now to explore delicious meals from your favorite local
              restaurants.
            </p>
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/2 py-16 px-12">
            <h2 className="text-3xl mb-4">Create Your Account</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-400 py-2 px-3 w-full mb-5"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-400 py-2 px-3 w-full mb-5"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-400 py-2 px-3 w-full mb-5"
                  placeholder="Password"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border border-gray-400 py-2 px-3 w-full mb-5"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className="mb-5">
                <input type="checkbox" required className="mr-2" />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-purple-500 font-semibold">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-500 font-semibold">
                    Privacy Policy
                  </a>
                  .
                </span>
              </div>

              <button
                type="submit"
                className="bg-purple-600 w-full text-white py-3 rounded hover:bg-purple-700"
              >
                Sign Up
              </button>
              <Link
                href="/user-auth/login"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-200"
              >
                Already have an account?{" "}
                <span className="underline">Login</span>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usersignup;
