import React, { createContext, useState, useEffect, useContext } from 'react';
import { MenuContext } from './MenuContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Fix: Check if MenuContext exists and provide fallback for menuItems
  const menuContext = useContext(MenuContext);
  const menuItems = menuContext?.menuItems || [];
  
  // Calculate cart total whenever cart items change
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      const itemPrice = parseFloat(item.basePrice || 0);
      const toppingsPrice = (item.customization || []).reduce(
        (toppingSum, topping) => toppingSum + (topping.price * (topping.quantity || 1)), 
        0
      );
      return sum + ((itemPrice + toppingsPrice) * item.quantity);
    }, 0);
    
    setCartTotal(parseFloat(newTotal.toFixed(2)));
  }, [cartItems]);

  // Get full cart item with image and other menu data
  const getFullCartItem = (cartItem) => {
    // If no item or no menu items available, return the original item
    if (!cartItem || !menuItems || !menuItems.length) {
      return cartItem;
    }

    // Try to find the matching menu item
    const menuItem = menuItems.find(item => item._id === cartItem._id);
    
    if (!menuItem) {
      return cartItem; // If not found, return the original
    }
    
    // Merge the menu item properties with the cart item, prioritizing cart item values for quantities, etc.
    return {
      ...menuItem,          // All menu item properties including images
      ...cartItem,          // Cart-specific properties override menu ones
      imageUrl: menuItem.imageUrl || cartItem.imageUrl // Ensure we have the image URL
    };
  };

  // Update an existing cart item (for quantity changes or customization edits)
  const onUpdateCartItem = (updatedItem) => {
    if (!updatedItem || !updatedItem.cartItemId) {
      return;
    }
    
    // First check if the item exists in the cart
    const exists = cartItems.some(item => item.cartItemId === updatedItem.cartItemId);
    
    if (exists) {
      // If the item exists, update it
      setCartItems(prev => 
        prev.map(item => 
          item.cartItemId === updatedItem.cartItemId ? updatedItem : item
        )
      );
    } else {
      // If the item doesn't exist, add it
      setCartItems(prev => [...prev, updatedItem]);
    }
  };

  // Add item to cart
  const addToCart = (item) => {
    if (!item) {
      return;
    }
    
    // Ensure item has a cartItemId
    const itemWithId = {
      ...item,
      cartItemId: item.cartItemId || `${item._id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    
    setCartItems(prev => {
      // If it's an edit operation (has matching cartItemId), replace the existing item
      if (itemWithId.cartItemId && prev.some(i => i.cartItemId === itemWithId.cartItemId)) {
        return prev.map(i => i.cartItemId === itemWithId.cartItemId ? itemWithId : i);
      }
      
      // Otherwise add as new item
      return [...prev, itemWithId];
    });
  };

  // Remove item from cart - updated to support both removal methods
  const removeFromCart = (itemId, customization, cartItemId) => {
    // If cartItemId is provided, use that for removal (most reliable)
    if (cartItemId) {
      setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      return;
    }
    
    // Fallback to using itemId and optional customization
    setCartItems(prev => {
      if (!customization || !Array.isArray(customization) || customization.length === 0) {
        // Remove all instances of this item if no customization is specified
        return prev.filter(item => item._id !== itemId);
      }
      
      // Otherwise, only remove items that match both ID and customization
      return prev.filter(item => {
        if (item._id !== itemId) return true; // Keep items with different IDs
        
        // Compare customizations to find a match
        const itemCustomization = item.customization || [];
        if (itemCustomization.length !== customization.length) return true;
        
        // This is a simplified comparison - a more robust solution would
        // compare each topping regardless of order
        const itemToppingIds = itemCustomization.map(t => t._id).sort().join(',');
        const removeToppingIds = customization.map(t => t._id).sort().join(',');
        return itemToppingIds !== removeToppingIds;
      });
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const value = {
    cartItems,
    cartTotal,
    isCartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    setIsCartOpen,
    getFullCartItem,
    onUpdateCartItem  // Add the new function to the context value
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
