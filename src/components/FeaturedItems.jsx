import React, { useState } from 'react';
import { toast } from 'react-toastify';

function FeaturedItem({ item }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="border rounded shadow-sm overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={item.image}
        alt={item.name}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
        <div className="relative inline-block">
  <span className="text-2xl font-semibold text-purple-700">
    ${item.price.toFixed(2)}
  </span>
          </div>
          <button
            onClick={() => {
              // Add to cart logic
              toast.success(`${item.name} added to cart!`);
            }}
            className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition-colors cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedItem;