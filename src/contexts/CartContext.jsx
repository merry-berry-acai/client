import React, { createContext, useState } from 'react';
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = (item, customization, quantity) => {
		// Normalize customization if needed
		const normalizedCustomization = Array.isArray(customization)
      ? customization
      : (customization && customization.customization ? customization.customization : []);
		setCartItems(prevItems => [...prevItems, { ...item, customization: normalizedCustomization, quantity }]);
		console.log('Added to cart:', item, normalizedCustomization, quantity);
		toast.success("Item added to cart!");
	};

	const onUpdateCartItem = (updatedItem) => {
		// Normalize customization to always be an array
		let normalizedItem = { ...updatedItem };
		if (normalizedItem.customization && !Array.isArray(normalizedItem.customization)) {
			normalizedItem.customization = normalizedItem.customization.customization || [];
		}
		setCartItems(prevItems =>
			prevItems.map(item => (item.id === normalizedItem.id ? normalizedItem : item))
		);
		toast.success("Cart item updated!");
	};

	const removeFromCart = (itemId) => {
		setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
		toast.success("Item removed from cart!");
	};

	return (
		<CartContext.Provider value={{ cartItems, addToCart, onUpdateCartItem, removeFromCart }}>
			{children}
		</CartContext.Provider>
	);
};
