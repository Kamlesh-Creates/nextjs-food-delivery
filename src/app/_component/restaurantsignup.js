"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function Restaurantsignup() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [c_password, setc_password] = useState("");
  const [restoname, setrestoname] = useState("");
  const [city, setcity] = useState("");
  const [address, setaddress] = useState("");
  const [contact, setcontact] = useState("");
  const [imgpath, setimgpath] = useState("");

  const [errors, setErrors] = useState({});
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!c_password.trim())
      newErrors.c_password = "Confirm Password is required";
    if (!restoname.trim()) newErrors.restoname = "Restaurant Name is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!contact.trim()) newErrors.contact = "Contact is required";
    if (!imgpath.trim()) newErrors.imgpath = "Image URL is required";


    if (password && c_password && password !== c_password) {
      newErrors.passwordMatch = "Password and Confirm Password Do Not Match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlesignup = async () => {
    if (!validate()) return;

    try {
      const result = await fetch(`${baseUrl}/api/restaurant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          restoname,
          city,
          address,
          contact,
          imgpath,
        }),
      });

      const response = await result.json();
      console.log("API Response:", response);

      if (response.success && response.data) {
        localStorage.setItem("restaurantUser", JSON.stringify(response.data));
        toast.success("Registration Successful");
        router.push("/restaurant/dashboard");
      } else {
        toast.error("Registration failed: " + (response.error || "Unknown error"));
      }
    } catch (err) { 
      console.error("Signup error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <h3 className="text-center text-2xl font-bold mb-4">Restaurant Signup</h3>
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-white rounded shadow">
        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Enter Email Id"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: "",
                passwordMatch: "",
              }));
            }}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={c_password}
            onChange={(e) => {
              setc_password(e.target.value);
              setErrors((prev) => ({
                ...prev,
                c_password: "",
                passwordMatch: "",
              }));
            }}
          />
          {errors.c_password && (
            <span className="text-red-500 text-sm">{errors.c_password}</span>
          )}
          {errors.passwordMatch && (
            <span className="text-red-500 text-sm">{errors.passwordMatch}</span>
          )}
        </div>

        {/* Restaurant Name */}
        <div>
          <input
            type="text"
            placeholder="Enter Restaurant Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={restoname}
            onChange={(e) => {
              setrestoname(e.target.value);
              setErrors((prev) => ({ ...prev, restoname: "" }));
            }}
          />
          {errors.restoname && (
            <span className="text-red-500 text-sm">{errors.restoname}</span>
          )}
        </div>

        {/* City */}
        <div>
          <input
            type="text"
            placeholder="Enter City"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={city}
            onChange={(e) => {
              setcity(e.target.value);
              setErrors((prev) => ({ ...prev, city: "" }));
            }}
          />
          {errors.city && (
            <span className="text-red-500 text-sm">{errors.city}</span>
          )}
        </div>

        {/* Address */}
        <div>
          <input
            type="text"
            placeholder="Enter Address"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={address}
            onChange={(e) => {
              setaddress(e.target.value);
              setErrors((prev) => ({ ...prev, address: "" }));
            }}
          />
          {errors.address && (
            <span className="text-red-500 text-sm">{errors.address}</span>
          )}
        </div>

        {/* Contact */}
        <div>
          <input
            type="number"
            placeholder="Contact No"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={contact}
            onChange={(e) => {
              setcontact(e.target.value);
              setErrors((prev) => ({ ...prev, contact: "" }));
            }}
          />
          {errors.contact && (
            <span className="text-red-500 text-sm">{errors.contact}</span>
          )}
        </div>
        {/* Image URL */}
        <div>
          <input
            type="text"
            placeholder="Image URL (imgpath)"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={imgpath}
            onChange={(e) => {
              setimgpath(e.target.value);
              setErrors((prev) => ({ ...prev, imgpath: "" }))
            }}
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handlesignup}
        >
          Sign Up
        </button>
      </div>
    </>
  );
}

export default Restaurantsignup;
