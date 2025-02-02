import { FaHeart, FaClock, FaLeaf } from "react-icons/fa";
import { useState } from "react";
import FeaturedItem from "./FeaturedItems";
import { Link } from "react-router-dom";
const acaiBowl = new URL("../assets/acai-bowl.png", import.meta.url).href;
const smoothie = new URL("../assets/smoothie.png", import.meta.url).href;
const smoothie2 = new URL("../assets/smoothie2.png", import.meta.url).href;
const HomePage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Temporary data - replace with API calls
  const featuredItems = [
    {
      id: 1,
      name: "Classic Açaí Bowl",
      price: 9.99,
      fsf: 1.055,
      description: "Organic açaí topped with granola and seasonal fruits",
      image: acaiBowl,
    },
    {
      id: 2,
      name: "Tropical Smoothie",
      price: 7.99,
      fsf: 1.055,
      description: "Mango, pineapple, and coconut milk blend",
      image: smoothie,
    },
    {
      id: 3,
      name: "Merry Berry Smoothie",
      price: 8.99,
      fsf: 1.055,
      description: "Strawberry, blueberry, and banana blend",
      image: smoothie2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-purple-500 to-violet-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Craft Your Perfect Bowl</h1>
          <p className="text-xl mb-8">
            Fresh ingredients, endless combinations
          </p>
          <div className="flex justify-center">
            <Link to="/order" className="bg-white text-purple-500 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-md">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Most Popular Creations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <FeaturedItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <FaLeaf className="text-4xl text-purple-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">100% Organic</h3>
            <p className="text-gray-600">Locally sourced ingredients</p>
          </div>
          <div className="text-center p-6">
            <FaClock className="text-4xl text-purple-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Order Online</h3>
            <p className="text-gray-600">Skip the Line</p>
          </div>
          <div className="text-center p-6">
            <FaHeart className="text-4xl text-purple-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Customizable</h3>
            <p className="text-gray-600">Build your perfect combination</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
