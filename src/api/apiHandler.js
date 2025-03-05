// Re-export all API services from a single entry point

// Import the API client core
import { makeRequest, apiHandler, apiHandlerInstance, API_CONFIG } from './apiClient';

// Import service modules
import * as menuService from './services/menuService';
import * as categoryService from './services/categoryService';
import * as toppingService from './services/toppingService';
import * as userService from './services/userService';

// Re-export menu services
export const {
  getMenuItems,
  getFeaturedItems,
  getItemsInCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = menuService;

// Re-export category services
export const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = categoryService;

// Re-export topping services
export const {
  getToppings,
  createTopping,
  updateTopping,
  deleteTopping
} = toppingService;

// Re-export user services
export const {
  sendUserToDB,
  checkIsAdmin,
  getUserOrders
} = userService;

// Export core API utilities
export { makeRequest, apiHandler, apiHandlerInstance, API_CONFIG };
