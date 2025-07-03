import React, { useState } from 'react';

function Addfooditem(props) {
  const [foodname, setFoodname] = useState('');
  const [price, setPrice] = useState('');
  const [imgpath, setimgPath] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({});

  const handleAddItem = async () => {
    const newErrors = {};

    if (!foodname.trim()) newErrors.foodname = 'Food name is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    if (!description.trim()) newErrors.description = 'Description is required';
     if (!imgpath.trim()) newErrors.imgpath = 'Imagepath is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors if all inputs are valid

    const restodata = JSON.parse(localStorage.getItem("restaurantUser"));
    const resto_id = restodata?._id;

    try {
      const response = await fetch("http://localhost:3000/api/restaurant/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodname,
          price,
          imgpath,
          description,
          resto_id,
        }),
      });

      const data = await response.json();
      console.log("Response from API:", data);

      if (data.success) {
        alert("Food Item Added");
        // Clear form
        setFoodname('');
        setPrice('');
        setimgPath('');
        setDescription('');
        props.setadditem(false)
      } else {
        alert("Failed to add food item.");
      }
    } catch (error) {
      console.error("Error adding food item:", error);
      alert("Something went wrong. See console for details.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Food Item</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter food name"
          value={foodname}
          onChange={(e) => setFoodname(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.foodname && <p className="text-red-500 text-sm mt-1">{errors.foodname}</p>}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter image path"
          value={imgpath}
          onChange={(e) => setimgPath(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.imgpath && <p className="text-red-500 text-sm mt-1">{errors.imgpath}</p>}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <button
        onClick={handleAddItem}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
      >
        Add Item
      </button>
    </div>
  );
}

export default Addfooditem;
