import React, { createContext, useState, useEffect, useCallback } from "react";
import { getMenuItems, getCategories, getToppings, getFeaturedItems } from "../api/apiHandler";
import { storeWithExpiry, getWithExpiry, removeItem } from "../utils/localStorage";

export const MenuContext = createContext();

// Cache configuration
const CACHE_CONFIG = {
  storagePrefix: 'menu_cache_',
  defaultExpiry: 1000 * 60 * 30, // 30 minutes
  refreshInterval: 1000 * 60 * 5, // 5 minutes - interval for background refresh
  forceRefreshThreshold: 1000 * 60 * 60, // 60 minutes - when to force refresh on user action
  keys: {
    menuItems: 'menuItems',
    categories: 'categories',
    toppings: 'toppings',
    featuredItems: 'featuredItems'
  }
};

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(null);
  const [categories, setCategories] = useState(null);
  const [toppings, setToppings] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Helper function to get cache key with prefix
  const getCacheKey = (key) => `${CACHE_CONFIG.storagePrefix}${key}`;

  // Function to fetch data from API and update both state and cache
  const fetchAndCacheData = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      
      // If force refresh is true, remove all cache entries first
      if (forceRefresh) {
        Object.values(CACHE_CONFIG.keys).forEach(key => {
          removeItem(getCacheKey(key));
        });
      }
      
      // Track which items need to be loaded
      let needsLoading = {
        menuItems: forceRefresh || !getWithExpiry(getCacheKey(CACHE_CONFIG.keys.menuItems)),
        categories: forceRefresh || !getWithExpiry(getCacheKey(CACHE_CONFIG.keys.categories)),
        toppings: forceRefresh || !getWithExpiry(getCacheKey(CACHE_CONFIG.keys.toppings)),
        featuredItems: forceRefresh || !getWithExpiry(getCacheKey(CACHE_CONFIG.keys.featuredItems))
      };
      
      // Set loading state only if we need to fetch any data
      const isLoading = Object.values(needsLoading).some(val => val);
      if (isLoading) {
        setLoadingMenu(true);
      }
      
      // Load cached data first (only if not force refreshing)
      if (!forceRefresh) {
        Object.keys(needsLoading).forEach(key => {
          const cached = getWithExpiry(getCacheKey(CACHE_CONFIG.keys[key]));
          if (cached) {
            switch(key) {
              case 'menuItems': setMenuItems(cached); break;
              case 'categories': setCategories(cached); break;
              case 'toppings': setToppings(cached); break;
              case 'featuredItems': setFeaturedItems(cached); break;
            }
          }
        });
      }
      
      // Fetch only what needs refreshing
      const promises = [];
      
      if (needsLoading.menuItems) {
        promises.push(
          getMenuItems().then(data => {
            setMenuItems(data);
            storeWithExpiry(getCacheKey(CACHE_CONFIG.keys.menuItems), data, CACHE_CONFIG.defaultExpiry);
          })
        );
      }
      
      if (needsLoading.categories) {
        promises.push(
          getCategories().then(data => {
            setCategories(data);
            storeWithExpiry(getCacheKey(CACHE_CONFIG.keys.categories), data, CACHE_CONFIG.defaultExpiry);
          })
        );
      }
      
      if (needsLoading.toppings) {
        promises.push(
          getToppings().then(data => {
            setToppings(data);
            storeWithExpiry(getCacheKey(CACHE_CONFIG.keys.toppings), data, CACHE_CONFIG.defaultExpiry);
          })
        );
      }
      
      if (needsLoading.featuredItems) {
        promises.push(
          getFeaturedItems().then(data => {
            setFeaturedItems(data);
            storeWithExpiry(getCacheKey(CACHE_CONFIG.keys.featuredItems), data, CACHE_CONFIG.defaultExpiry);
          })
        );
      }
      
      // Wait for all necessary fetches to complete
      if (promises.length > 0) {
        await Promise.all(promises);
        setLastRefresh(new Date().getTime());
      }
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError("Failed to load menu data");
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  // Function to refresh menu data (can be called manually)
  const refreshMenuData = useCallback(() => {
    fetchAndCacheData(true);
  }, [fetchAndCacheData]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchAndCacheData(false);
  }, [fetchAndCacheData]);

  // Set up periodic background refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAndCacheData(false);
    }, CACHE_CONFIG.refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchAndCacheData]);

  return (
    <MenuContext.Provider value={{ 
      menuItems, 
      categories, 
      toppings, 
      featuredItems,
      loadingMenu,
      error,
      lastRefresh,
      refreshMenuData
    }}>
      {children}
    </MenuContext.Provider>
  );
};
