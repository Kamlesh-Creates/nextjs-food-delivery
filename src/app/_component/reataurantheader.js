"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Restaurantheader() {
  const [details, setdetails] = useState();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    let data = localStorage.getItem("restaurantUser");
    if (!data && pathname == "/restaurant/dashboard") {
      router.push("/restaurant");
    } else if (data && pathname == "/restaurant") {
      router.push("/restaurant/dashboard");
    } else {
      setdetails(JSON.parse(data));
    }
  }, []); 

  const handlelogout=()=>{
    localStorage.removeItem("restaurantUser");
    router.push("/restaurant")
  }
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.ibb.co/N68tGX8X/Quick-Serve.png"
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
            {details && details.restoname ? (
              <>
                <Link
                  href="/profile"
                  className="hover:text-blue-600 transition-colors"
                >
                  Profile
                </Link>
                <li>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer" onClick={handlelogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <Link
                href="/"
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

export default Restaurantheader;
