// app/edit/[id]/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditFoodItemPage() {
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    foodname: "",
    price: "",
    description: "",
    imgpath: "",
  });

useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(`${baseUrl}/api/restaurant/food/edit/${id}`); // ✅ updated path
    const data = await res.json();
    if (data.success) {
      setFormData(data.result);
    } else {
      alert("Failed to load food item.");
      
    }
  };

  fetchData();
}, [id, router]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/restaurant/food/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      alert("Food item updated!");
      router.push("../dashboard")
     
    } else {
      alert("Failed to update item.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Edit Food Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="foodname"
          value={formData.foodname}
          onChange={handleChange}
          placeholder="Food Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="imgpath"
          value={formData.imgpath}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        ></textarea>
        <div className="flex gap-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            Save Changes
          </button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
