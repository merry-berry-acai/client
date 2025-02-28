import React, { createContext, useCallback, useEffect } from 'react';
import { toast } from "react-toastify";

export const CartContext = createContext();

// Create a simpler cart implementation without relying on useLocalStorage hook
export const CartProvider = ({ children }) => {
	// Read initial cart from localStorage
	const [cartItems, setCartItemsState] = React.useState(() => {
		try {
			const savedCart = localStorage.getItem('simple-cart');
			return savedCart ? JSON.parse(savedCart) : [];
		} catch (err) {
			console.error("Failed to load cart from localStorage:", err);
			return [];
		}
	});

	// Update localStorage whenever cart changes
	const setCartItems = useCallback((items) => {
		try {
			// If items is a function, call it with current state
			const newItems = typeof items === 'function' ? items(cartItems) : items;
			setCartItemsState(newItems);
			localStorage.setItem('simple-cart', JSON.stringify(newItems));
		} catch (err) {
			console.error("Failed to save cart to localStorage:", err);
			// Reset cart in case of error
			setCartItemsState([]);
			localStorage.removeItem('simple-cart');
		}
	}, [cartItems]);

	// Generate a simple unique ID for cart items
	const generateCartItemId = () => `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

	// Add item to cart with a unique cartItemId
	const addToCart = useCallback((item, customization = null, quantity = 1) => {
		setCartItems(prev => {
			// Create a clean customization array
			const cleanCustomization = customization 
				? Array.isArray(customization) 
					? customization 
					: Array.isArray(customization.customization) 
						? customization.customization 
						: []
				: [];
			
			// Check if exact same item with exact same customization exists
			const existingItemIndex = prev.findIndex(cartItem => {
				// Check basic item equality
				if (cartItem._id !== item._id) return false;
				
				// If no customizations on both, they match
				if (cleanCustomization.length === 0 && (!cartItem.customization || cartItem.customization.length === 0)) 
					return true;
				
				// If only one has customization, no match
				if (cleanCustomization.length === 0 || (!cartItem.customization || cartItem.customization.length === 0))
					return false;
				
				// Otherwise compare customizations
				if (cleanCustomization.length !== cartItem.customization.length) return false;
				
				// Compare each customization item
				for (let i = 0; i < cleanCustomization.length; i++) {
					const c1 = cleanCustomization[i];
					const c2 = cartItem.customization[i];
					if (c1.id !== c2.id || c1.name !== c2.name) return false;
				}
				
				return true;
			});
			
			// If item exists, update quantity
			if (existingItemIndex !== -1) {
				const updated = [...prev];
				updated[existingItemIndex] = {
					...updated[existingItemIndex],
					quantity: (updated[existingItemIndex].quantity || 1) + quantity
				};
				toast.success("Item quantity updated in cart!");
				return updated;
			}
			
			// Otherwise add as new item
			const newItem = {
				...item,
				customization: cleanCustomization,
				quantity,
				cartItemId: generateCartItemId()
			};
			toast.success("Item added to cart!");
			return [...prev, newItem];
		});
	}, [setCartItems]);

	// Update cart item (simpler approach - always find by cartItemId)
	const onUpdateCartItem = useCallback((updatedItem) => {
		if (!updatedItem.cartItemId) {
			console.error("Cannot update item without cartItemId");
			return;
		}
		
		setCartItems(prev => {
			const index = prev.findIndex(item => item.cartItemId === updatedItem.cartItemId);
			if (index === -1) return prev;
			
			const updated = [...prev];
			updated[index] = {
				...updatedItem,
				quantity: updatedItem.quantity || 1
			};
			toast.success("Cart item updated!");
			return updated;
		});
	}, [setCartItems]);

	// Remove from cart (simplified to use cartItemId only)
	const removeFromCart = useCallback((itemId, customization = null, cartItemId = null) => {
		setCartItems(prev => {
			// If we have a cartItemId, use that for exact removal
			if (cartItemId) {
				const filtered = prev.filter(item => item.cartItemId !== cartItemId);
				if (filtered.length < prev.length) {
					toast.success("Item removed from cart!");
				}
				return filtered;
			}
			
			// Otherwise just use the item ID
			const filtered = prev.filter(item => item._id !== itemId);
			if (filtered.length < prev.length) {
				toast.success("Item removed from cart!");
			}
			return filtered;
		});
	}, [setCartItems]);

	// Clear cart completely
	const clearCart = useCallback(() => {
		setCartItemsState([]);
		localStorage.removeItem('simple-cart');
		// Also try to clear the old cart format
		localStorage.removeItem('cart-items');
		toast.info("Cart has been cleared");
	}, []);

	// Final validation on component mount
	useEffect(() => {
		// Reset cart if it's not an array
		if (!Array.isArray(cartItems)) {
			console.error("Cart is not an array, resetting");
			clearCart();
		}
	}, [clearCart]);

	return (
		<CartContext.Provider value={{ 
			cartItems, 
			addToCart, 
			onUpdateCartItem, 
			removeFromCart,
			clearCart
		}}>
			{children}
		</CartContext.Provider>
	);
};
