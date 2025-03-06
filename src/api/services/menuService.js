import { makeRequest, getAuthToken } from '../apiClient';
import { invalidateMenuItemsCache } from '../../utils/cacheManager';

/**
 * Get all menu items
 */
export async function getMenuItems() {
  return makeRequest({
    method: 'get',
    endpoint: '/items/'
  });
}

/**
 * Get featured items
 */
export async function getFeaturedItems() {
  return makeRequest({
    method: 'get',
    endpoint: '/items/home/featured'
  });
}

/**
 * Get items in a specific category
 * @param {string} category - Category to fetch items for
 */
export async function getItemsInCategory(category) {
  return makeRequest({
    method: 'get',
    endpoint: `/items/category/${category}`
  });
}

/**
 * Create a new menu item
 * @param {Object} itemData - The item data to create
 */
export async function createMenuItem(itemData) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'post',
      endpoint: '/items/',
      data: itemData,
      authToken
    });
    
    // Invalidate menu items cache after successful creation
    invalidateMenuItemsCache();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing menu item
 * @param {string} id - Item ID to update
 * @param {Object} itemData - The updated item data
 */
export async function updateMenuItem(id, itemData) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'patch',
      endpoint: `/items/${id}`,
      data: itemData,
      authToken
    });
    
    // Invalidate menu items cache after successful update
    invalidateMenuItemsCache();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a menu item
 * @param {string} id - Item ID to delete
 */
export async function deleteMenuItem(id) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'delete',
      endpoint: `/items/${id}`,
      authToken
    });
    
    // Invalidate menu items cache after successful deletion
    invalidateMenuItemsCache();
    return result;
  } catch (error) {
    throw error;
  }
}
