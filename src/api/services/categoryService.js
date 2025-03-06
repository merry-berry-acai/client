import { makeRequest, getAuthToken } from '../apiClient';
import { invalidateCategoriesCache } from '../../utils/cacheManager';

/**
 * Get all categories or a specific category
 * @param {string} category - Optional specific category to fetch
 */
export async function getCategories(category = "") {
  const endpoint = category ? `/categories/${category}` : '/categories/';
  return makeRequest({
    method: 'get',
    endpoint
  });
}

/**
 * Create a new category
 * @param {Object} categoryData - The category data to create
 */
export async function createCategory(categoryData) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'post',
      endpoint: '/categories/new',
      data: categoryData,
      authToken
    });
    
    // Invalidate categories cache after successful creation
    invalidateCategoriesCache();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing category
 * @param {string} id - Category ID to update
 * @param {Object} categoryData - The updated category data
 */
export async function updateCategory(id, categoryData) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'put',
      endpoint: `/categories/${id}`,
      data: categoryData,
      authToken
    });
    
    // Invalidate categories cache after successful update
    invalidateCategoriesCache();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a category
 * @param {string} id - Category ID to delete
 */
export async function deleteCategory(id) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'delete',
      endpoint: `/categories/${id}`,
      authToken
    });
    
    // Invalidate categories cache after successful deletion
    invalidateCategoriesCache();
    return result;
  } catch (error) {
    throw error;
  }
}
