import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	// State to store cart items
	const [cartItems, setCartItems] = useState([]);

	// Function to add an item to the cart with customization details
	const addToCart = (item, customization) => {
		setCartItems(prevItems => [...prevItems, { ...item, customization }]);
	};

	return (
		<CartContext.Provider value={{ cartItems, addToCart }}>
			{children}
		</CartContext.Provider>
	);
};
