"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Deliveryheader() {
  const [details, setdetails] = useState();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const data = localStorage.getItem("deliveryPartnerInfo");

    if (!data) {
      if (pathname === "/deliverydashboard") {
        router.push("/deliverypartner/login");
      }
    } else {
      setdetails(JSON.parse(data));
    }
  }, [pathname, router]);

  const handlelogout = () => {
    localStorage.removeItem("deliveryPartnerInfo");
    router.push("/deliverypartner/login");
  };
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src="https://imgs.search.brave.com/VLBoRjfa1gO1by23PvJaNDwPRiqChL3ZlyWo_jxf7lo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzg0LzRk/Lzg1Lzg0NGQ4NTM1/ZmIzNmI4NjBkM2Ex/NjYzNWVmMjBmYmFi/LmpwZw"
            alt="QuickServe Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-semibold text-gray-800">
            QuickServe
          </span>
        </div>

        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            {details && details.name ? (
              <>
                <Link
                  href="/profile"
                  className="hover:text-blue-600 transition-colors"
                >
                  {details.name}
                </Link>
                <li>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                    onClick={handlelogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <Link
                href="/login"
                className="hover:text-blue-600 transition-colors"
              >
                Login/Signup
              </Link>
            )}
            <li></li>
            <li></li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Deliveryheader;
