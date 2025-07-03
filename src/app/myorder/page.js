"use client";
import { useEffect, useState } from "react";
import Customerheader from "@/app/_component/customerheader";
import Restaurantfooter from "@/app/_component/restaurantfooter";
import OrderCard from "../_component/ordercard";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userInfoRaw = localStorage.getItem("Userinfo");
      if (!userInfoRaw) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userInfoRaw);
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/order?id=${user._id}`
        );
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Customerheader />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            My Orders
          </h2>

          {!loading && !localStorage.getItem("Userinfo") ? (
            <p className="text-gray-600">Please log in to view your orders.</p>
          ) : loading ? (
            <p className="text-gray-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Restaurantfooter />
    </>
  );
};

export default MyOrdersPage;
