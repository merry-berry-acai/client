import axios from "axios";
import { API_CONFIG, AUTH_CONFIG, ENV_CONFIG } from "../config";

// Create the API handler instance
const apiHandler = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

const ADMIN_UID = AUTH_CONFIG.adminUID;
// Add request interceptor for logging
apiHandler.interceptors.request.use(
  config => {
    if (API_CONFIG.logRequests) {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
      
      if (API_CONFIG.logLevel === 'verbose' && config.data) {
        console.log('📦 Request Payload:', config.data);
      }
    }
    return config;
  },
  error => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiHandler.interceptors.response.use(
  response => {
    if (API_CONFIG.logRequests) {
      console.log(`✅ API Response: ${response.status} from ${response.config.url}`);
      
      if (API_CONFIG.logLevel === 'verbose') {
        console.log('📄 Response Data:', response.data);
      }
    }
    return response;
  },
  error => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}: ${error.response.data?.message || error.message}`);
      console.error('📍 Error occurred at:', error.config.url);
      
      if (API_CONFIG.logLevel === 'verbose') {
        console.error('🔍 Error details:', error.response.data);
        console.error('🔄 Original request:', { 
          method: error.config.method, 
          url: error.config.url,
          data: error.config.data ? JSON.parse(error.config.data) : null
        });
      }
    } else if (error.request) {
      console.error(`❌ API Request failed: No response received`);
      console.error('📍 Request details:', { 
        method: error.config?.method, 
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      });
    } else {
      console.error(`❌ API Request setup failed: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

/**
 * Unified API request function with retry capability
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (get, post, put, delete)
 * @param {string} options.endpoint - API endpoint
 * @param {Object} options.data - Request payload (for POST/PUT)
 * @param {number} options.retries - Number of retries (defaults to API_CONFIG.retries)
 * @param {number} options.retryDelay - Delay between retries (defaults to API_CONFIG.retryDelay)
 * @returns {Promise<any>} - API response data
 */
async function makeRequest(options) {
  const {
    method = 'get',
    endpoint,
    data = null,
    retries = API_CONFIG.retries,
    retryDelay = API_CONFIG.retryDelay,
    validateResponse = null
  } = options;

  console.log(`🔵 makeRequest: ${method.toUpperCase()} ${endpoint} initiated`);

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt + 1}/${retries + 1} for ${method.toUpperCase()} ${endpoint}`);
      
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiHandler.get(endpoint);
          break;
        case 'post':
          console.log(`📤 POST payload for ${endpoint}:`, data);
          response = await apiHandler.post(endpoint, data);
          break;
        case 'put':
          response = await apiHandler.put(endpoint, data);
          break;
        case 'delete':
          response = await apiHandler.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      console.log(`✅ ${method.toUpperCase()} ${endpoint} succeeded on attempt ${attempt + 1}`);
      
      // Validate response if validator function is provided
      if (validateResponse && !validateResponse(response.data.data)) {
        console.warn(`⚠️ Response validation failed for ${endpoint}`);
        throw new Error("Response validation failed");
      }
      
      return response.data.data || response.data;
    } 
    catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt + 1} failed for ${method.toUpperCase()} ${endpoint}:`, error.message);
      
      // Don't retry if it's a client error (400-499)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        console.error(`🛑 Not retrying ${method.toUpperCase()} ${endpoint} due to client error:`, error.response.status);
        throw error;
      }
      
      if (attempt < retries) {
        console.warn(`🕒 ${method.toUpperCase()} ${endpoint}: Attempt ${attempt + 1}/${retries + 1} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error(`❌ Failed ${method.toUpperCase()} request to ${endpoint} after ${retries + 1} attempts`);
  throw lastError || new Error(`Request to ${endpoint} failed`);
}

// ==== Menu Items API ====

/**
 * Get all menu items
 */
async function getMenuItems() {
  return makeRequest({
    method: 'get',
    endpoint: '/items/'
  });
}

/**
 * Create a new menu item
 * @param {Object} itemData - The item data to create
 */
async function createMenuItem(itemData) {
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
async function updateMenuItem(id, itemData) {
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
async function deleteMenuItem(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/items/${id}`
  });
}

// ==== Categories API ====

/**
 * Get all categories or a specific category
 * @param {string} category - Optional specific category to fetch
 */
async function getCategories(category = "") {
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
async function createCategory(categoryData) {
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
async function updateCategory(id, categoryData) {
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
async function deleteCategory(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/categories/${id}`
  });
}

// ==== Toppings API ====

/**
 * Get all toppings
 */
async function getToppings() {
  return makeRequest({
    method: 'get',
    endpoint: '/toppings/'
  });
}

/**
 * Create a new topping
 * @param {Object} toppingData - The topping data to create
 */
async function createTopping(toppingData) {
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
async function updateTopping(id, toppingData) {
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
async function deleteTopping(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/toppings/${id}`
  });
}

// ==== Payment & Checkout API ====

/**
 * Create a checkout session with mock payment API
 * @param {Object} checkoutData - Data required for checkout
 * @param {Array} checkoutData.items - Cart items for checkout
 * @param {Object} checkoutData.customerInfo - Customer information (optional)
 * @param {string} checkoutData.successUrl - URL to redirect after successful payment
 * @param {string} checkoutData.cancelUrl - URL to redirect if checkout is cancelled
 * @returns {Promise<Object>} - Checkout session data including session ID
 */
async function createCheckoutSession(checkoutData) {
  if (!checkoutData || !checkoutData.items || !checkoutData.items.length) {
    throw new Error("Checkout requires at least one item");
  }

  return makeRequest({
    method: 'post',
    endpoint: '/checkout/mock-session',
    data: checkoutData,
    validateResponse: (response) => response && response.sessionId
  });
}

/**
 * Process a mock order payment
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<Object>} - Payment confirmation
 */
async function processPayment(paymentDetails) {
  if (!paymentDetails) {
    throw new Error("Payment details are required");
  }
  
  return makeRequest({
    method: 'post',
    endpoint: '/checkout/process-payment',
    data: paymentDetails,
    retries: 1
  });
}

/**
 * Retrieve checkout session status
 * @param {string} sessionId - Mock checkout session ID
 * @returns {Promise<Object>} - Session status information
 */
async function getCheckoutSession(sessionId) {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }
  
  return makeRequest({
    method: 'get',
    endpoint: `/checkout/sessions/${sessionId}`,
    retries: 1
  });
}

// ==== Other API Methods ====

/**
 * Get items in a specific category
 * @param {string} category - Category to fetch items for
 */
async function getItemsInCategory(category) {
  return makeRequest({
    method: 'get',
    endpoint: `/items/category/${category}`
  });
}

/**
 * Get featured items
 */
async function getFeaturedItems() {
  return makeRequest({
    method: 'get',
    endpoint: '/items/home/featured'
  });
}

/**
 * Send user data to DB with validation and retry capability
 * @param {Object} user - User data to send
 * @param {Object} options - Additional options
 * @param {number} options.retries - Number of retry attempts
 * @param {number} options.retryDelay - Delay between retries in ms
 * @returns {Promise<Object>} - The created user data from the server
 * @throws {Error} - If validation fails or if all retry attempts fail
 */
async function sendUserToDB(user, options = {}) {
  console.log('🧪 sendUserToDB called with user data:', JSON.stringify(user, null, 2));
  
  // Input validation
  if (!user) {
    console.error('❌ sendUserToDB: User data is required');
    throw new Error("User data is required");
  }
  
  // Validate required fields
  const requiredFields = ['uid', 'email'];
  const missingFields = requiredFields.filter(field => !user[field]);
  
  if (missingFields.length > 0) {
    console.error(`❌ sendUserToDB: Missing required fields: ${missingFields.join(', ')}`);
    throw new Error(`Missing required user fields: ${missingFields.join(', ')}`);
  }

  console.log('✅ sendUserToDB: All required fields are present');
  
  // Check if the API endpoint is configured
  if (!API_CONFIG.baseURL) {
    console.error('❌ sendUserToDB: API base URL is not configured');
    throw new Error("API base URL is not configured");
  }
  
  console.log(`🔵 sendUserToDB: Sending user data to ${API_CONFIG.baseURL}/users/new`);
  
  try {
    const result = await makeRequest({
      method: 'post',
      endpoint: '/users/register',
      data: user,
      retries: options.retries || API_CONFIG.retries,
      retryDelay: options.retryDelay || API_CONFIG.retryDelay,
      validateResponse: (response) => {
        const valid = response && response.id;
        console.log(`🔍 Response validation for sendUserToDB: ${valid ? 'Passed' : 'Failed'}`);
        return valid;
      }
    });
    
    console.log('🎉 sendUserToDB: User successfully saved to database', result);
    return result;
  } catch (error) {
    console.error('💥 sendUserToDB failed:', error);
    throw error;
  }
}

/**
 * Check if a user is an admin
 * @param {string} uid - User ID to check
 */
async function checkIsAdmin(uid) {
  if (!uid) return false;
  
  // Direct UID check as immediate fallback
  if (uid === ADMIN_UID) {
    console.log("Admin access granted via direct UID match");
    return true;
  }
  
  try {
    // Try the API call with reduced retry attempts for speed
    const response = await makeRequest({
      method: 'get',
      endpoint: `/users/${uid}/role`,
      retries: 0  // No retries for admin check
    });
    return response && response.role === 'admin';
  } catch (error) {
    console.error("API admin check failed:", error.message);
    return uid === ADMIN_UID;
  }
}

/**
 * Get user orders with pagination support
 * 
 * @param {string} uid - User ID to fetch orders for
 * @returns {Promise<Array>} - Array of order objects
 */
export const getUserOrders = async (uid) => {
  try {
    const response = await makeRequest({
      method: 'get',
      endpoint: `/users/${uid}`,
    });

    return response.orderHistory || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Export API functions
export {
  getMenuItems,
  getCategories,
  getToppings,
  getItemsInCategory,
  getFeaturedItems,
  sendUserToDB,
  checkIsAdmin,
  
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  
  createCategory,
  updateCategory,
  deleteCategory,
  
  createTopping,
  updateTopping,
  deleteTopping,
  
  createCheckoutSession,
  processPayment,
  getCheckoutSession,
  
  // Export for testing or extending
  makeRequest,
  API_CONFIG
};
