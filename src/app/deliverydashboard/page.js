"use client";
import React, { useEffect, useState } from "react";
import Deliveryheader from "../_component/deliveryheader";
import { useRouter } from "next/navigation";

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("deliveryPartnerInfo");
    if (!user) {
      router.push("/deliverypartner/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchOrders = async () => {
      const info = JSON.parse(localStorage.getItem("deliveryPartnerInfo"));
      if (!info?._id) return;

      try {
        const res = await fetch(
          `${baseUrl}/api/deliverypartner/partnerorders/${info._id}`
        );
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          alert("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthorized]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${baseUrl}/api/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert(`Order marked as ${newStatus}`);
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating status");
    }
  };

  const pendingOrders = orders.filter((o) => o.status !== "Delivered");
  const completedOrders = orders.filter((o) => o.status === "Delivered");

  if (!isAuthorized) return null;
  return (
    <>
      <Deliveryheader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Delivery Dashboard
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : (
          <>
            {/* Assigned Orders */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                Assigned Orders
              </h2>
              {pendingOrders.length === 0 ? (
                <p className="text-gray-500">No active orders.</p>
              ) : (
                <div className="space-y-6">
                  {pendingOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg p-6 shadow-md bg-white transition hover:shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          {order.resto && (
                            <p className="text-base text-gray-800 font-semibold">
                              🍽️ Pickup from:{" "}
                              <span className="text-rose-600">
                                {order.resto.restoname}
                              </span>
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            📍 {order.resto.address}, {order.resto.city}
                          </p>
                          <p className="text-sm text-gray-700">
                            💰 <strong>₹{order.total}</strong> –{" "}
                            {order.paymentMethod}
                          </p>
                          <p className="text-sm text-gray-700">
                            🧑‍🤝‍🧑 To: {order.deliveryDetails.fullName},{" "}
                            {order.deliveryDetails.address},{" "}
                            {order.deliveryDetails.city}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            order.status === "Accepted"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "On the way"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        {order.status === "Confirm" ||
                        order.status === "Pending" ? (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "Accepted")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm shadow-sm"
                          >
                            ✅ Accept
                          </button>
                        ) : order.status === "Accepted" ? (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "On the way")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow-sm"
                          >
                            🛵 Picked Up
                          </button>
                        ) : order.status === "On the way" ? (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "Delivered")
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow-sm"
                          >
                            📦 Mark Delivered
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Completed Orders */}
            <section>
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Completed Orders
              </h2>
              {completedOrders.length === 0 ? (
                <p className="text-gray-500">No completed orders yet.</p>
              ) : (
                <div className="space-y-5">
                  {completedOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {order.resto?.name || "Restaurant"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ₹{order.total} - {order.paymentMethod}
                          </p>
                          <p className="text-sm text-gray-500">
                            Delivered to: {order.deliveryDetails.fullName},{" "}
                            {order.deliveryDetails.city}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Delivered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default DeliveryDashboard;
