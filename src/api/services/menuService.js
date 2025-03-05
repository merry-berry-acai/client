import { makeRequest } from '../apiClient';

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
  return makeRequest({
    method: 'post',
    endpoint: '/items/',
    data: itemData
  });
}

/**
 * Update an existing menu item
 * @param {string} id - Item ID to update
 * @param {Object} itemData - The updated item data
 */
export async function updateMenuItem(id, itemData) {
  return makeRequest({
    method: 'put',
    endpoint: `/items/${id}`,
    data: itemData
  });
}

/**
 * Delete a menu item
 * @param {string} id - Item ID to delete
 */
export async function deleteMenuItem(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/items/${id}`
  });
}
