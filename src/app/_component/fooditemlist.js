"use client"; // if you're using App Router

import React, { useEffect, useState } from "react";
import Link from "next/link";

function Fooditemlist() {
  const [fooditems, setfooditems] = useState([]);

  useEffect(() => {
    loadfooditem();
  }, []);

const loadfooditem = async () => {
  const restodata = JSON.parse(localStorage.getItem("restaurantUser"));
  const resto_id = restodata?._id;

  try {
    const response = await fetch(`http://localhost:3000/api/restaurant/food/${resto_id}`);
    const data = await response.json();

    if (data.success) {
      setfooditems(data.result);
    } else {
      alert("Food items not loaded.");
    }
  } catch (error) {
    console.error("Error fetching food items:", error);
   
  }
};

  const handledeleteitem = async (id) => {
    try {
      let response = await fetch(`http://localhost:3000/api/restaurant/food/${id}`, {
        method: "DELETE",
      });
      response = await response.json();
      if (response.success) {
        loadfooditem();
      } else {
        alert("Food item not deleted");
      }
    } catch (error) {
      console.log("Error With Deleting Item", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Food Items List</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">Sr. No</th>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Price</th>
              <th className="px-4 py-2 text-left border-b">Image</th>
              <th className="px-4 py-2 text-left border-b">Description</th>
              <th className="px-4 py-2 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {fooditems.map((item, key) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{key + 1}</td>
                <td className="px-4 py-2 border-b text-xl">{item.foodname}</td>
                <td className="px-4 py-2 border-b text-xl">₹{item.price}</td>
                <td className="px-4 py-2 border-b">
                  <img src={item.imgpath} alt={item.foodname} className="h-20 w-28 object-contain" />
                </td>
                <td className="px-4 py-2 border-b">{item.description}</td>
                <td className="px-4 py-2 border-b">
                  <div className="flex gap-2">
                    <Link href={`/restaurant/dashboard/${item._id}`}>
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                      onClick={() => handledeleteitem(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fooditemlist;
