import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Userlogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const router=useRouter()

   const validate = () => {
  const newErrors = {};
  if (!email.trim()) newErrors.email = "Email is required";
  if (!password.trim()) newErrors.password = "Password is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const response = await fetch(`${baseUrl}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, login: true }),
    });

    const resData = await response.json();

    if (resData.success && resData.data) {
      const user = { ...resData.data ,
        isAuthenticated: true
      };
      delete user.password;

      localStorage.setItem("Userinfo", JSON.stringify(user));
      toast.success("Login Successful");

      
      const redirectPath = localStorage.getItem("postLoginRedirect") || "/";
      localStorage.removeItem("postLoginRedirect");

      router.push(redirectPath);
    } else {
      toast.error("Login Failed: Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    toast.error("An error occurred during login. Please try again.");
  }

  
  setEmail("");
  setPassword("");
};


  return (
    <section className="h-screen bg-gray-50">
  <div className="flex h-full items-center justify-center px-4 py-8">
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Left Column (Image) */}
      <div className="w-full lg:w-1/2">
        <img
          src="https://imgs.search.brave.com/OQh_trdSNiIHDb-H27gkdm_iC-a8HbuXI8L11UgDcWw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vRUFGVU1a/am1NSDQvMi8wLzEy/ODB3L2NhbnZhLXll/bGxvdy1hYnN0cmFj/dC1mb29kLWRlbGl2/ZXJ5LXByb21vdGlv/bi1pbnN0YWdyYW0t/cG9zdC1zeVZyQ01l/Mm43Zy5qcGc"
          alt="Login Illustration"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Sign in to your account
        </h2>

        {/* Social Login */}
        <div className="flex space-x-4 mb-6">
          <button className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
            <i className="fab fa-facebook-f" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center">
            <i className="fab fa-x-twitter" />
          </button>
          <button className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center">
            <i className="fab fa-linkedin-in" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm text-gray-600">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="example@domain.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?
          <Link
            href="/user-auth"
            className="text-blue-600 hover:underline font-medium ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  </div>
</section>

  );
}

export default Userlogin;
