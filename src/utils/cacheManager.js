import { storeWithExpiry, getWithExpiry, removeItem } from "./localStorage";
import { CACHE_CONFIG } from "../config";

// Helper function to get cache key with prefix
export const getCacheKey = (key) => `${CACHE_CONFIG.storagePrefix}${key}`;

/**
 * Invalidate specific cache entries
 * @param {string[]} cacheTypes - Array of cache types to invalidate ('menuItems', 'categories', etc)
 */
export const invalidateCache = (cacheTypes) => {
  if (!cacheTypes || cacheTypes.length === 0) {
    console.warn('No cache types specified for invalidation');
    return;
  }
  
  cacheTypes.forEach(cacheType => {
    if (CACHE_CONFIG.keys[cacheType]) {
      console.log('invalidateCache: CACHE_CONFIG.keys[cacheType] is true for:', cacheType);
      removeItem(getCacheKey(CACHE_CONFIG.keys[cacheType])); // removeItem is called here
      console.log(`Cache invalidated for: ${cacheType}`);
      console.log('invalidateCache: removeItem called for:', cacheType);
    } else {
      console.warn(`Unknown cache type: ${cacheType}`);
    }
  });
};

/**
 * Invalidate menu items cache
 */
export const invalidateMenuItemsCache = () => {
  invalidateCache(['menuItems', 'featuredItems']);
};

/**
 * Invalidate categories cache
 */
export const invalidateCategoriesCache = () => {
  invalidateCache(['categories']);
};

/**
 * Invalidate toppings cache
 */
export const invalidateToppingsCache = () => {
  invalidateCache(['toppings']);
};

/**
 * Invalidate users cache
 */
export const invalidateUsersCache = () => {
  invalidateCache(['users']);
};

/**
 * Check if a cache entry needs refreshing
 * @param {string} cacheType - Type of cache to check
 * @returns {boolean} - Whether the cache needs refreshing
 */
export const needsRefresh = (cacheType) => {
  if (!CACHE_CONFIG.keys[cacheType]) {
    console.warn(`Unknown cache type: ${cacheType}`);
    return true;
  }
  
  const key = getCacheKey(CACHE_CONFIG.keys[cacheType]);
  const cached = getWithExpiry(key);
  return !cached;
};

/**
 * Store data in cache
 * @param {string} cacheType - Type of cache to store
 * @param {any} data - Data to store
 */
export const updateCache = (cacheType, data) => {
  if (!CACHE_CONFIG.keys[cacheType]) {
    console.warn(`Unknown cache type: ${cacheType}`);
    return;
  }
  
  storeWithExpiry(
    getCacheKey(CACHE_CONFIG.keys[cacheType]), 
    data, 
    CACHE_CONFIG.defaultExpiry
  );
};

// Re-export CACHE_CONFIG for backward compatibility
export { CACHE_CONFIG };
