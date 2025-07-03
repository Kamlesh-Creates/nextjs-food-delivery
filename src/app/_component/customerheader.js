"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Customerheader({ triggerUpdate }) {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("Userinfo");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (parsed?.isAuthenticated === true) {
          setUserData(parsed);
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Failed to parse Userinfo:", err);
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const quantitySum = storedCart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setTotalQuantity(quantitySum);
    }
  }, [triggerUpdate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const Logout = () => {
    localStorage.removeItem("Userinfo");
    router.push("/user-auth");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="https://i.ibb.co/N68tGX8X/Quick-Serve.png"
              className="h-20 w-auto"
              loading="lazy"
            />
          </Link>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex items-center space-x-4 lg:hidden">
            <Link href="/cart" className="relative text-gray-600">
              <span className="text-2xl">🛒</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={toggleMobileMenu}
            >
              <img
                src="https://www.svgrepo.com/show/506800/burger-menu.svg"
                alt="Menu"
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm">
            {/* Left Navigation */}
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-800 font-semibold hover:text-red-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/myorder"
                className="text-gray-800 font-semibold hover:text-red-600 transition-colors"
              >
                My Orders
              </Link>
              <Link
                href="/restaurant"
                className="text-gray-800 font-semibold hover:text-red-600 transition-colors"
              >
                Add Restaurant
              </Link>
              <Link
                href="/deliverypartner/login"
                className="text-gray-800 font-semibold hover:text-red-600 transition-colors"
              >
                Delivery Partner
              </Link>
              <Link
                href="/about"
                className="text-gray-800 font-semibold hover:text-red-600 transition-colors"
              >
                About Us
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="text-2xl">🛒</span>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* User Authentication */}
              {userData ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-800 font-medium">
                    {userData.name}
                  </span>
                  <button
                    onClick={Logout}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/user-auth/login">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition">
                      Login
                    </button>
                  </Link>
                  <Link href="/user-auth">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-700 hover:text-indigo-700">
                Home
              </Link>
              <Link
                href="/myorder"
                className="text-gray-700 hover:text-indigo-700"
              >
                My Orders
              </Link>
              <Link
                href="/restaurant"
                className="text-gray-700 hover:text-indigo-700"
              >
                Add Restaurant
              </Link>
              <Link
                href="/deliverypartner/login"
                className="text-gray-700 hover:text-indigo-700"
              >
                Delivery Partner
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-indigo-700"
              >
                About Us
              </Link>
            </div>
            <div className="flex flex-col space-y-2 mt-2">
              {userData ? (
                <>
                  <span className="text-gray-800 text-center font-medium">
                    Hello, {userData.name}
                  </span>
                  <button
                    onClick={Logout}
                    className="w-full px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/user-auth/login">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                      Login
                    </button>
                  </Link>
                  <Link href="/user-auth">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Customerheader;
