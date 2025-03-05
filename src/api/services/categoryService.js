import { makeRequest } from '../apiClient';

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
  return makeRequest({
    method: 'post',
    endpoint: '/categories/',
    data: categoryData
  });
}

/**
 * Update an existing category
 * @param {string} id - Category ID to update
 * @param {Object} categoryData - The updated category data
 */
export async function updateCategory(id, categoryData) {
  return makeRequest({
    method: 'put',
    endpoint: `/categories/${id}`,
    data: categoryData
  });
}

/**
 * Delete a category
 * @param {string} id - Category ID to delete
 */
export async function deleteCategory(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/categories/${id}`
  });
}
