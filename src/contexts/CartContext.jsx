import React, { createContext, useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	// Use local storage to persist cart data between browser sessions
	const [cartItems, setCartItems] = useLocalStorage('cart-items', []);

	// Helper function to normalize customization to always be an array
	const normalizeCustomization = useCallback((customization) => {
		if (!customization) return [];
		if (Array.isArray(customization)) return customization;
		if (customization.customization && Array.isArray(customization.customization)) return customization.customization;
		return [];
	}, []);

	// Helper function to get a unique key for an item based on ID and customization
	const getItemKey = useCallback((item, customization) => {
		const normalizedCustomization = normalizeCustomization(customization);
		// Sort and stringify the customization to create a consistent key
		const customizationKey = JSON.stringify(
			normalizedCustomization
				.map(c => ({
					id: c.id || c._id || '',
					name: c.name || '',
					quantity: c.quantity || 1,
					price: parseFloat(c.price || 0)
				}))
				.sort((a, b) => a.name.localeCompare(b.name))
		);
		
		return `${item._id || item.id || ''}-${customizationKey}`;
	}, [normalizeCustomization]);

	const addToCart = useCallback((item, customization, quantity = 1) => {
		const normalizedCustomization = normalizeCustomization(customization);
		const itemKey = getItemKey(item, normalizedCustomization);
		
		setCartItems(prevItems => {
			// Check if an item with same ID and customization already exists
			const existingItemIndex = prevItems.findIndex(cartItem => 
				getItemKey(cartItem, cartItem.customization) === itemKey
			);
			
			if (existingItemIndex >= 0) {
				// Update existing item quantity
				const updatedItems = [...prevItems];
				updatedItems[existingItemIndex] = {
					...updatedItems[existingItemIndex],
					quantity: (updatedItems[existingItemIndex].quantity || 1) + quantity
				};
				toast.success("Item quantity updated in cart!");
				return updatedItems;
			} else {
				// Add as new item
				toast.success("Item added to cart!");
				return [...prevItems, { 
					...item, 
					customization: normalizedCustomization, 
						quantity,
					// Add a unique cart item ID for more reliable tracking
					cartItemId: `${item._id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
				}];
			}
		});
	}, [normalizeCustomization, getItemKey, setCartItems]);

	const onUpdateCartItem = useCallback((updatedItem) => {
		const normalizedCustomization = normalizeCustomization(updatedItem.customization);
		const updatedItemWithNormalizedCustomization = {
			...updatedItem,
			customization: normalizedCustomization,
			quantity: updatedItem.quantity || 1
		};
		
		setCartItems(prevItems => {
				// First try to find the item by cartItemId (most reliable)
				if (updatedItem.cartItemId) {
					const itemIndex = prevItems.findIndex(item => item.cartItemId === updatedItem.cartItemId);
					if (itemIndex >= 0) {
						const newItems = [...prevItems];
						newItems[itemIndex] = updatedItemWithNormalizedCustomization;
						toast.success("Cart item updated!");
						return newItems;
					}
				}
				
				// If cartItemId match fails or isn't available, try matching by _id
				const itemIndex = prevItems.findIndex(item => item._id === updatedItem._id);
				
				if (itemIndex >= 0) {
					const newItems = [...prevItems];
					newItems[itemIndex] = updatedItemWithNormalizedCustomization;
					toast.success("Cart item updated!");
					return newItems;
					}
					
					// If we still can't find the item, add it as a new item
					toast.success("Item added to cart!");
					return [...prevItems, updatedItemWithNormalizedCustomization];
				});
			}, [normalizeCustomization, setCartItems]);

	const removeFromCart = useCallback((itemId, customization, cartItemId) => {
		// If we have a cartItemId, use that for exact removal
		if (cartItemId) {
			setCartItems(prevItems => {
				const newItems = prevItems.filter(item => item.cartItemId !== cartItemId);
				
				// Only toast if an item was actually removed
				if (newItems.length < prevItems.length) {
					toast.success("Item removed from cart!");
				}
				
				return newItems;
			});
			return;
		}
		
		// Otherwise use ID and customization
		const normalizedCustomization = normalizeCustomization(customization);
		
		setCartItems(prevItems => {
			// Create a new array with the item removed
			const previousLength = prevItems.length;
			
			// Make a copy to avoid mutation during filtering
			const itemsCopy = [...prevItems];
			
			// Find the exact index to remove
			const itemToRemoveIndex = itemsCopy.findIndex(item => {
				// First check item ID
				if (item._id !== itemId) return false;
				
				// If customization isn't provided, match the first item with this ID
				if (!customization) return true;
				
				// Otherwise, compare customizations using our key function
				try {
					const itemKey = getItemKey(item, item.customization);
					const removeKey = getItemKey({_id: itemId}, normalizedCustomization);
					return itemKey === removeKey;
				} catch (err) {
					console.error("Error comparing item keys:", err);
					return false;
				}
			});
			
			// If item not found, return unchanged cart
			if (itemToRemoveIndex === -1) {
				console.warn("Item not found for removal:", itemId, normalizedCustomization);
				return prevItems;
			}
			
			// Create new array without the item
			const newItems = [
				...itemsCopy.slice(0, itemToRemoveIndex),
				...itemsCopy.slice(itemToRemoveIndex + 1)
			];
			
			// Verify the item was actually removed
			if (newItems.length < previousLength) {
				toast.success("Item removed from cart!");
			}
			
			return newItems;
		});
	}, [normalizeCustomization, getItemKey, setCartItems]);

	// Add a method to clear the cart
	const clearCart = useCallback(() => {
		setCartItems([]);
		toast.info("Cart has been cleared");
	}, [setCartItems]);

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
