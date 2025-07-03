"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

function Homebanner() {
  const [location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const dropdownRef = useRef();

  useEffect(() => {
    loadLocation();
    fetchAllRestaurants();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowLocation(false);
    }
  };

  const fetchAllRestaurants = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/customer");
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.result);
      }
    } catch (error) {
      console.error("Failed to load restaurants", error);
    }
  };

  const loadLocation = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/customer/location"
      );
      console.log(response)
      const data = await response.json();
      if (data.success) {
        setLocation(data.result);
      }
    } catch (error) {
      console.error("Failed to load locations", error);
    }
  };

  const handleListItem = (item) => {
    setSelectedLocation(item);
    setShowLocation(false);
  };

  const handleSearch = async () => {
    try {
      let query = "";

      if (selectedLocation) {
        query = `location=${encodeURIComponent(selectedLocation)}`;
      } else if (searchText) {
        query = `restaurant=${encodeURIComponent(searchText)}`;
      }

      const res = await fetch(`http://localhost:3000/api/customer?${query}`);

      const data = await res.json();

      if (data.success) {
        setSearchResults(data.result);
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-6 lg:px-16 py-16 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://plus.unsplash.com/premium_photo-1695762436987-1cf827e5f1dd?w=800&auto=format&fit=crop&q=60")',
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-60" />

        <div className="relative z-10 text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            Find Your Favorite Meal
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow">
            Browse top-rated restaurants and delicious local dishes near you.
          </p>

          {/* Search Form */}
          <div className="mt-8 max-w-3xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-xl p-4 shadow-lg">
              {/* Location Input with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="📍 Select a place"
                  value={selectedLocation}
                  onClick={() => setShowLocation(true)}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-black cursor-pointer"
                />
                {showLocation && (
                  <ul className="absolute left-0 right-0 max-h-48 overflow-y-auto text-black bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50">
                    {location.length > 0 ? (
                      location.map((item, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleListItem(item)}
                          className="px-4 py-2 hover:bg-red-100 cursor-pointer"
                        >
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No locations</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Food Search */}
              <input
                type="text"
                placeholder="🍔 Enter food or restaurant"
                className="px-4 py-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-black"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {/* Search Button */}
              <button
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleSearch}
              >
                <i className="fa-solid fa-magnifying-glass" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="px-8 mt-8 max-w-7xl mx-auto">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-start font-semibold text-xl md:text-2xl">
            Popular Restaurant
          </h1>
          <a
            href="#"
            className="px-6 py-3 text-red-500 font-semibold rounded-lg hover:text-red-600 transition"
          >
            View All
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => (
              <div
                key={item._id || idx}
                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
              >
                {/* Image */}
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={
                      item.imgpath ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={item.restoname || "Restaurant Image"}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  {/* Title and Rank */}
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {item.restoname || "Restaurant Name"}
                    </h2>
                    <span className="text-sm text-white bg-red-500 rounded-full px-3 py-1">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>
                      <span className="font-medium">📍 City:</span>{" "}
                      {item.city || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">🏠 Address:</span>{" "}
                      {item.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">✉️ Email:</span>{" "}
                      <a
                        href={`mailto:${item.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.email || "Not provided"}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">📞 Contact:</span>{" "}
                      {item.contact || "N/A"}
                    </p>
                  </div>

                  {/* Button */}
                  <button
                    className="mt-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full"
                    onClick={() =>
                      router.push(
                        "/explore/" +
                          encodeURIComponent(item.restoname) +
                          "?id=" +
                          encodeURIComponent(item._id)
                      )
                    }
                  >
                    View Items
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full">
              No results found.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Homebanner;
