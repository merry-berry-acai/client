import React, { createContext, useState, useEffect } from "react";
import { getMenuItems, getCategories, getToppings, getFeaturedItems } from "../api/apiHandler";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(null);
  const [categories, setCategories] = useState(null);
  const [toppings, setToppings] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuData = async () => {
    try {
      setLoadingMenu(true);
      setError(null);
      
      // Pass true to bypass cache and get fresh data
      const [menuItemsData, categoriesData, toppingsData, featuredData] = await Promise.all([
        getMenuItems(true),
        getCategories('', true),
        getToppings(true),
        getFeaturedItems(true)
      ]);

      setMenuItems(menuItemsData);
      setCategories(categoriesData);
      setToppings(toppingsData);
      setFeaturedItems(featuredData);
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError("Failed to load menu data");
    } finally {
      setLoadingMenu(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMenuData();
  }, []);

  // Function to refresh the menu data from database
  const refreshMenuData = () => {
    fetchMenuData();
  };

  return (
    <MenuContext.Provider value={{ 
      menuItems, 
      categories, 
      toppings, 
      featuredItems,
      loadingMenu,
      error,
      refreshMenuData
    }}>
      {children}
    </MenuContext.Provider>
  );
};
