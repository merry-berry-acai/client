import { makeRequest, getAuthToken } from '../apiClient';
import { invalidateToppingsCache } from '../../utils/cacheManager';

/**
 * Get all toppings
 */
export async function getToppings() {
  return makeRequest({
    method: 'get',
    endpoint: '/toppings/'
  });
}

/**
 * Create a new topping
 * @param {Object} toppingData - The topping data to create
 */
export async function createTopping(toppingData) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'post',
      endpoint: '/toppings/',
      data: toppingData,
      authToken
    });
    
    // Invalidate toppings cache after successful creation
    invalidateToppingsCache();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing topping
 * @param {string} id - Topping ID to update
 * @param {Object} toppingData - The updated topping data
 */
export async function updateTopping(id, toppingData) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'put',
      endpoint: `/toppings/${id}`,
      data: toppingData,
      authToken
    });
    
    // Invalidate toppings cache after successful update
    invalidateToppingsCache();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a topping
 * @param {string} id - Topping ID to delete
 */
export async function deleteTopping(id) {
  const authToken = await getAuthToken();
  
  try {
    const result = await makeRequest({
      method: 'delete',
      endpoint: `/toppings/${id}`,
      authToken
    });
    
    // Invalidate toppings cache after successful deletion
    invalidateToppingsCache();
    return result;
  } catch (error) {
    throw error;
  }
}
