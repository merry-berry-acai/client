import React, { createContext, useState, useEffect } from 'react';
import { getMenuItems, getCategories, getToppings, getFeaturedItems } from '../api/apiHandler';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    getMenuItems().then(data => data && setMenuItems(Array.isArray(data) ? data : []));
    getCategories().then(data => data && setCategories(Array.isArray(data) ? data : []));
    getToppings().then(data => data && setToppings(Array.isArray(data) ? data : []));
    getFeaturedItems().then(data => data && setFeaturedItems(Array.isArray(data) ? data : []));
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems, categories, toppings, featuredItems }}>
      {children}
    </MenuContext.Provider>
  );
};
