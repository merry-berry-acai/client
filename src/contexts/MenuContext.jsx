import React, { createContext, useState, useEffect, useCallback } from "react";
import { getCacheKey, needsRefresh, updateCache } from "../utils/cacheManager";
import { CACHE_CONFIG } from "../config";
import { getWithExpiry } from "../utils/localStorage";
import ServiceFactory from '../api/services/ServiceFactory'; // Import ServiceFactory

// Added another comment to trigger re-render

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(null);
  const [categories, setCategories] = useState(null);
  const [toppings, setToppings] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const menuService = ServiceFactory.getService('menuItems'); // Get MenuService
  const categoryService = ServiceFactory.getService('categories'); // Get CategoryService
  const toppingService = ServiceFactory.getService('toppings'); // Get ToppingService

  // Function to fetch data from API and update both state and cache
  const fetchAndCacheData = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      
      // Track which items need to be loaded
      let needsLoading = {
        menuItems: forceRefresh || needsRefresh('menuItems'),
        categories: forceRefresh || needsRefresh('categories'),
        toppings: forceRefresh || needsRefresh('toppings'),
        featuredItems: forceRefresh || needsRefresh('featuredItems')
      };
      
      // Set loading state only if we need to fetch any data
      const isLoading = Object.values(needsLoading).some(val => val);
      if (isLoading) {
        setLoadingMenu(true);
      }
      
      // Load cached data first (only if not force refreshing)
      if (!forceRefresh) {
        if (!needsLoading.menuItems) {
          const cached = getWithExpiry(getCacheKey(CACHE_CONFIG.keys.menuItems));
          if (cached) setMenuItems(cached);
        }
        
        if (!needsLoading.categories) {
          const cached = getWithExpiry(getCacheKey(CACHE_CONFIG.keys.categories));
          if (cached) setCategories(cached);
        }
        
        if (!needsLoading.toppings) {
          const cached = getWithExpiry(getCacheKey(CACHE_CONFIG.keys.toppings));
          if (cached) setToppings(cached);
        }
        
        if (!needsLoading.featuredItems) {
          const cached = getWithExpiry(getCacheKey(CACHE_CONFIG.keys.featuredItems));
          if (cached) setFeaturedItems(cached);
        }
      }
      
      // Fetch only what needs refreshing
      const promises = [];
      
      if (needsLoading.menuItems) {
        promises.push(
          menuService.getMenuItems().then(data => { // Use menuService
            setMenuItems(data);
            updateCache('menuItems', data);
          })
        );
      }
      
      if (needsLoading.categories) {
        promises.push(
          categoryService.getCategories().then(data => { // Use categoryService
            setCategories(data);
            updateCache('categories', data);
          })
        );
      }
      
      if (needsLoading.toppings) {
        promises.push(
          toppingService.getToppings().then(data => { // Use toppingService
            setToppings(data);
            updateCache('toppings', data);
          })
        );
      }
      
      if (needsLoading.featuredItems) {
        promises.push(
          menuService.getFeaturedItems().then(data => { // Use menuService for featured items
            setFeaturedItems(data);
            updateCache('featuredItems', data);
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
  }, [menuService, categoryService, toppingService]); // Add service dependencies

  // Function to refresh specific menu data type (can be called from admin panels)
  const refreshMenuDataByType = useCallback((dataType) => {
    // Map the dataType to the corresponding cache type
    const cacheTypeMap = {
      'items': 'menuItems',
      'categories': 'categories',
      'toppings': 'toppings',
      'featured': 'featuredItems'
    };
    
    const cacheType = cacheTypeMap[dataType];
    if (!cacheType) {
      console.warn(`Unknown data type for refresh: ${dataType}`);
      return;
    }
    
    // Set this cache type as needing refresh
    fetchAndCacheData(false);
  }, [fetchAndCacheData]);

  // Function to refresh all menu data (can be called manually)
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
      refreshMenuData,
      refreshMenuDataByType
    }}>
      {children}
    </MenuContext.Provider>
  );
};
