"use client"
import Addfooditem from '@/app/_component/addfooditem'
import Fooditemlist from '@/app/_component/fooditemlist'
import Restaurantheader from '@/app/_component/reataurantheader'
import React, { useState } from 'react'

function Dashboard() {
  const [additem, setadditem] = useState(false)

  return (
    <>
      <Restaurantheader />
      
      <div className="flex gap-4 p-4 bg-gray-100 border-b border-gray-300">
        <button 
          onClick={() => setadditem(true)} 
          className={`px-4 py-2 rounded-md font-semibold transition duration-200 cursor-pointer 
            ${additem ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
        >
          Add Food
        </button>

        <button 
          onClick={() => setadditem(false)} 
          className={`px-4 py-2 rounded-md font-semibold transition duration-200 cursor-pointer
            ${!additem ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
        >
          Dashboard
        </button>
      </div>

      <div className="p-6">
        {additem ? (
          <Addfooditem setadditem={setadditem}/>
        ) : (<>
          <h1 className="text-2xl font-bold text-gray-800">Restaurant Dashboard</h1>
          <Fooditemlist/>
          </>
        )}
      </div>
    </>
  )
}

export default Dashboard
