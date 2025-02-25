import React from "react";
import PropTypes from "prop-types";

const OrderTrackingView = ({ orderId }) => {
  // placeholder
  const orderStatus = "Processing";

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Order Tracking</h1>

      <div className="mb-4">
        <p>Order ID: {orderId}</p>
        <p>
          Status: <span className="font-medium">{orderStatus}</span>
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Order Details</h2>
        <p>Order details will be displayed here</p>
      </div>
    </div>
  );
};

OrderTrackingView.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export default OrderTrackingView;
