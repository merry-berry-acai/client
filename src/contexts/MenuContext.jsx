import React, { createContext, useState, useEffect, useCallback } from "react";
import { getMenuItems, getCategories, getToppings, getFeaturedItems } from "../api/apiHandler";

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

  // Helper function to save data to localStorage with timestamp
  const saveToCache = useCallback((key, data) => {
    try {
      const cacheItem = {
        data,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(
        `${CACHE_CONFIG.storagePrefix}${key}`,
        JSON.stringify(cacheItem)
      );
      console.log(`💾 Cached ${key} data to localStorage`);
    } catch (err) {
      console.error(`Failed to cache ${key} data:`, err);
    }
  }, []);

  // Helper function to get data from localStorage with timestamp checking
  const getFromCache = useCallback((key, forceRefresh = false) => {
    try {
      const cachedItem = localStorage.getItem(`${CACHE_CONFIG.storagePrefix}${key}`);
      
      if (!cachedItem) return null;
      
      const { data, timestamp } = JSON.parse(cachedItem);
      const now = new Date().getTime();
      const age = now - timestamp;
      
      // If force refresh is requested and data is older than threshold, return null
      if (forceRefresh && age > CACHE_CONFIG.forceRefreshThreshold) {
        console.log(`🔄 Force refreshing ${key}, cache too old (${Math.round(age/1000/60)} minutes)`);
        return null;
      }
      
      // If data is expired, return null
      if (age > CACHE_CONFIG.defaultExpiry) {
        console.log(`⏰ Cache expired for ${key} (${Math.round(age/1000/60)} minutes old)`);
        return null;
      }
      
      console.log(`📋 Using cached ${key} data (${Math.round(age/1000/60)} minutes old)`);
      return data;
    } catch (err) {
      console.error(`Failed to retrieve ${key} from cache:`, err);
      return null;
    }
  }, []);

  // Function to fetch data from API and update both state and cache
  const fetchAndCacheData = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      
      // Track which items need to be loaded
      let needsLoading = {
        menuItems: !getFromCache(CACHE_CONFIG.keys.menuItems, forceRefresh),
        categories: !getFromCache(CACHE_CONFIG.keys.categories, forceRefresh),
        toppings: !getFromCache(CACHE_CONFIG.keys.toppings, forceRefresh),
        featuredItems: !getFromCache(CACHE_CONFIG.keys.featuredItems, forceRefresh)
      };
      
      // Set loading state only if we need to fetch any data
      const isLoading = Object.values(needsLoading).some(val => val);
      if (isLoading) {
        setLoadingMenu(true);
      }
      
      // Load cached data first (even if we're going to refresh)
      Object.keys(needsLoading).forEach(key => {
        const cached = getFromCache(CACHE_CONFIG.keys[key], false);
        if (cached) {
          switch(key) {
            case 'menuItems': setMenuItems(cached); break;
            case 'categories': setCategories(cached); break;
            case 'toppings': setToppings(cached); break;
            case 'featuredItems': setFeaturedItems(cached); break;
          }
        }
      });
      
      // Fetch only what needs refreshing
      const promises = [];
      
      if (needsLoading.menuItems) {
        promises.push(
          getMenuItems().then(data => {
            setMenuItems(data);
            saveToCache(CACHE_CONFIG.keys.menuItems, data);
          })
        );
      }
      
      if (needsLoading.categories) {
        promises.push(
          getCategories().then(data => {
            setCategories(data);
            saveToCache(CACHE_CONFIG.keys.categories, data);
          })
        );
      }
      
      if (needsLoading.toppings) {
        promises.push(
          getToppings().then(data => {
            setToppings(data);
            saveToCache(CACHE_CONFIG.keys.toppings, data);
          })
        );
      }
      
      if (needsLoading.featuredItems) {
        promises.push(
          getFeaturedItems().then(data => {
            setFeaturedItems(data);
            saveToCache(CACHE_CONFIG.keys.featuredItems, data);
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
  }, [getFromCache, saveToCache]);

  // Function to refresh menu data (can be called manually)
  const refreshMenuData = useCallback(() => {
    console.log("🔄 Manual refresh of menu data requested");
    fetchAndCacheData(true);
  }, [fetchAndCacheData]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchAndCacheData(false);
  }, [fetchAndCacheData]);

  // Set up periodic background refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("⏰ Background refresh interval triggered");
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
