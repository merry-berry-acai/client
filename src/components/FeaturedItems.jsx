import React, { useState } from 'react';
import { toast } from 'react-toastify';

function FeaturedItem({ item }) {
  const [showModal, setShowModal] = useState(false);
  const [customOption, setCustomOption] = useState("");

  const addToCart = () => {
    toast.success(`${item.name} added to cart with customization: ${customOption || "None"}`);
    setShowModal(false);
    // ...additional add-to-cart logic...
  };

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
            onClick={() => setShowModal(true)}
            className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition-colors cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Customize {item.name}</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Customization Option</label>
              <select
                value={customOption}
                onChange={(e) => setCustomOption(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">None</option>
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={addToCart}
                className="bg-purple-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeaturedItem;