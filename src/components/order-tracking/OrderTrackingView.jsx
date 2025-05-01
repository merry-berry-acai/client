import React from "react";
import PropTypes from "prop-types";

// Define order status constants - pickup only
const ORDER_STATUS = {
  PROCESSING: 'Processing',
  PREPARING: 'Preparing',
  READY: 'Ready for Pickup',
  COMPLETED: 'Completed'
};

const OrderTrackingView = ({ orderId }) => {
  // Mock order details - will be replaced with real data later
  const mockOrderDetails = {
    id: orderId,
    status: ORDER_STATUS.PROCESSING, // Using the status constant
    date: "2024-03-14T10:30:00Z",
    items: [
      { id: 1, name: "Berry Blast Smoothie", quantity: 2, price: 8.99 },
      { id: 2, name: "Tropical Paradise Bowl", quantity: 1, price: 12.99 },
    ],
    total: 30.97,
    pickupTime: "2024-03-14T11:00:00Z",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PROCESSING:
        return "bg-yellow-100 text-yellow-800";
      case ORDER_STATUS.PREPARING:
        return "bg-blue-100 text-blue-800";
      case ORDER_STATUS.READY:
        return "bg-green-100 text-green-800";
      case ORDER_STATUS.COMPLETED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Order Tracking</h1>

      <div className="mb-4">
        <p>Order ID: {mockOrderDetails.id}</p>
        <p>Order Date: {formatDate(mockOrderDetails.date)}</p>
        <p className="mt-2">
          Status: {" "}
          <span className={`${getStatusColor(mockOrderDetails.status)} px-3 py-1 rounded-full text-sm font-medium`}>
            {mockOrderDetails.status}
          </span>
        </p>
        <p>Pickup Time: {formatDate(mockOrderDetails.pickupTime)}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Order Details</h2>
        <ul className="space-y-2">
          {mockOrderDetails.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <p className="font-bold">Total: ${mockOrderDetails.total}</p>
        </div>
      </div>
    </div>
  );
};

OrderTrackingView.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export default OrderTrackingView;
