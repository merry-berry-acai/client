import React, { createContext, useState, useEffect, useContext } from 'react';
import { MenuContext } from './MenuContext';
import  MenuItemBuilder  from '../components/menu-browsing/MenuItemBuilder';
import { getCartFromStorage, saveCartToStorage } from '../utils/localStorage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    return getCartFromStorage();
  });
  
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Fix: Check if MenuContext exists and provide fallback for menuItems
  const menuContext = useContext(MenuContext);
  const menuItems = menuContext?.menuItems || [];
  
  // Calculate cart total whenever cart items change
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      const itemPrice = !isNaN(parseFloat(item.basePrice)) ? parseFloat(item.basePrice) : 0;
      const toppingsPrice = (item.customization || []).reduce(
        (toppingSum, topping) => toppingSum + (!isNaN(parseFloat(topping.price)) ? parseFloat(topping.price) : 0) * (topping.quantity || 1), 
        0
      );
      const itemQuantity = item.quantity || 1;
      const validQuantity = itemQuantity > 0 ? itemQuantity : 1;
      return sum + ((itemPrice + toppingsPrice) * validQuantity);
    }, 0);
    
    setCartTotal(parseFloat(newTotal.toFixed(2)));
    saveCartToStorage(cartItems);
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
  const addToCart = (item, selectedToppings, quantity) => {
    if (!item) return;
  
    // Check if the item already has customization (coming from modal)
    if (item.customization && Array.isArray(item.customization)) {
      // No need to rebuild - item is already properly formatted
  
      setCartItems(prev => {
        const existingCartItemIndex = prev.findIndex(i => i.cartItemId === item.cartItemId);
  
        if (existingCartItemIndex > -1) {
          // Item already exists, increase quantity
          const updatedCartItems = [...prev];
          updatedCartItems[existingCartItemIndex].quantity += (quantity || 1); 
          return updatedCartItems;
        } else {
          // Item doesn't exist, add as new item
          return [...prev, item];
        }
      });
      return;
    }
  
    // If we get here, we're dealing with the old style where item and toppings are separate
    const itemWithCustomizations = new MenuItemBuilder(item)
      .addItemProperty('quantity', quantity || 1)  // Use passed quantity or default to 1
      .addCustomization(selectedToppings.cuztomization)
      .addItemProperty('cartItemId', item.cartItemId || `${item._id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
      .build();
  

    setCartItems(prev => {
      const existingCartItemIndex = prev.findIndex(i => i.cartItemId === itemWithCustomizations.cartItemId);

      if (existingCartItemIndex > -1) {
        // Item already exists, increase quantity
        const updatedCartItems = [...prev];
        updatedCartItems[existingCartItemIndex].quantity += quantity; // Add to existing quantity
        return updatedCartItems;
      } else {
        // Item doesn't exist, add as new item
        return [...prev, itemWithCustomizations];
      }
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
