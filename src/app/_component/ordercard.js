"use client";
import React from "react";

const statusColor = {
  confirmed: "bg-yellow-100 text-yellow-700",
  preparing: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 space-y-4">
      {/* Status */}
      <div className="flex justify-between items-center">
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${
            statusColor[order.status?.toLowerCase()] || "bg-gray-100 text-gray-600"
          }`}
        >
          {order.status}
        </span>
        <p className="text-sm text-gray-500">
          Order #{order._id.slice(-5).toUpperCase()} • {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Items with images */}
      <div className="space-y-3">
        {order.cartItems.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-gray-700"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.imgpath || "https://via.placeholder.com/48"}
                alt={item.foodname}
                className="w-22 h-22 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">{item.foodname}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      {/* Billing Details */}
      <div className="text-sm text-gray-700 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{order.subtotal?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>₹{order.gst?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>₹{order.deliveryFee?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t mt-2">
          <span>Total</span>
          <span>₹{order.total?.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-gray-50 p-3 rounded-lg mt-4 text-sm text-gray-700 space-y-1 border border-gray-100">
        <p className="font-medium text-gray-800">📍 Delivery To:</p>
        <p>{order.deliveryDetails?.fullName}</p>
        <p>{order.deliveryDetails?.mobileNumber}</p>
        <p>
          {order.deliveryDetails?.address}, {order.deliveryDetails?.city} -{" "}
          {order.deliveryDetails?.pinCode}
        </p>
      </div>

      {/* Delivery Partner Info */}
      {order.deliveryPartner && (
        <div className="bg-blue-50 p-3 rounded-lg mt-4 text-sm text-blue-800 border border-blue-200">
          <p className="font-medium">🚚 Delivery Partner:</p>
          <p>Name: {order.deliveryPartner.name}</p>
          <p>Contact: {order.deliveryPartner.number}</p>
        </div>
      )}

      {/* Payment Method */}
      <div className="text-sm text-gray-600 mt-2">
        <span className="font-medium">💳 Payment Method:</span>{" "}
        {order.paymentMethod}
      </div>
    </div>
  );
};

export default OrderCard;
