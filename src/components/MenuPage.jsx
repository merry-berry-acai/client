import React from 'react';

const acaiBowl = new URL("../assets/acai-bowl.png", import.meta.url).href;
const smoothie = new URL("../assets/smoothie.png", import.meta.url).href;
const smoothie2 = new URL("../assets/smoothie2.png", import.meta.url).href;

const MenuPage = () => {
  const menuItems = [
    {
      id: 1,
      name: "Classic Açaí Bowl",
      description: "Organic açaí topped with granola and seasonal fruits",
      price: "$9.99",
      image: acaiBowl,
    },
    {
      id: 2,
      name: "Tropical Smoothie",
      description: "Mango, pineapple, and coconut milk blend",
      price: "$7.99",
      image: smoothie,
    },
    {
      id: 3,
      name: "Merry Berry Smoothie",
      description: "Strawberry, blueberry, and banana blend",
      price: "$8.99",
      image: smoothie2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Menu</h1>
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className="mb-6 border p-4 rounded shadow-sm">
              {/* Display the menu item image */}
              <img src={item.image} alt={item.name} className="w-full h-64 object-cover mb-4 rounded" />
              <h2 className="text-2xl font-semibold">{item.name}</h2>
              <p className="text-md text-gray-700">{item.description}</p>
              <span className="text-lg text-purple-700">{item.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuPage;
