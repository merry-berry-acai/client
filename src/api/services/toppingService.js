import { makeRequest } from '../apiClient';

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
  return makeRequest({
    method: 'post',
    endpoint: '/toppings/',
    data: toppingData
  });
}

/**
 * Update an existing topping
 * @param {string} id - Topping ID to update
 * @param {Object} toppingData - The updated topping data
 */
export async function updateTopping(id, toppingData) {
  return makeRequest({
    method: 'put',
    endpoint: `/toppings/${id}`,
    data: toppingData
  });
}

/**
 * Delete a topping
 * @param {string} id - Topping ID to delete
 */
export async function deleteTopping(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/toppings/${id}`
  });
}
