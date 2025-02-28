import axios from "axios";

// Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  retries: 2,
  retryDelay: 1000,
  logRequests: import.meta.env.VITE_NODE_ENV !== 'production'
};

// For development: hardcoded admin UID
const ADMIN_UID = "EszW3BDsb4P6qLp9gJ03IRkCTKn2";

// Create the API handler instance
const apiHandler = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Add response interceptor for logging
apiHandler.interceptors.response.use(
  response => {
    if (API_CONFIG.logRequests) {
      console.log(`✅ API Response: ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  error => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}: ${error.response.data?.message || error.message}`);
    } else if (error.request) {
      console.error(`❌ API Request failed: No response received`);
    } else {
      console.error(`❌ API Request setup failed: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

// Cache state for API responses
const state = {
  menuItems: null,
  categories: null,
  toppings: null,
  featuredItems: null,
};

/**
 * Clear specific cache entries or all if no keys provided
 * @param {Array} keys - Keys to clear from cache
 */
const clearCache = (keys = []) => {
  if (keys.length === 0) {
    // Clear all cache
    Object.keys(state).forEach(key => {
      state[key] = null;
    });
  } else {
    // Clear only specified keys
    keys.forEach(key => {
      if (key in state) {
        state[key] = null;
      }
    });
  }
};

/**
 * Unified API request function with retry capability and caching
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (get, post, put, delete)
 * @param {string} options.endpoint - API endpoint
 * @param {Object} options.data - Request payload (for POST/PUT)
 * @param {string} options.cacheKey - Cache key to store/retrieve results
 * @param {boolean} options.bypassCache - Force bypass cache for reads
 * @param {Array} options.cacheToClear - Cache keys to clear after mutation
 * @param {number} options.retries - Number of retries (defaults to API_CONFIG.retries)
 * @param {number} options.retryDelay - Delay between retries (defaults to API_CONFIG.retryDelay)
 * @returns {Promise<any>} - API response data
 */
async function makeRequest(options) {
  const {
    method = 'get',
    endpoint,
    data = null,
    cacheKey = null,
    bypassCache = false,
    cacheToClear = [],
    retries = API_CONFIG.retries,
    retryDelay = API_CONFIG.retryDelay,
    validateResponse = null
  } = options;

  // Check cache for GET requests
  if (method === 'get' && cacheKey && state[cacheKey] && !bypassCache) {
    return state[cacheKey];
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiHandler.get(endpoint);
          break;
        case 'post':
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

      // Validate response if validator function is provided
      if (validateResponse && !validateResponse(response.data)) {
        throw new Error("Response validation failed");
      }
      
      // Cache the result for GET requests
      if (method === 'get' && cacheKey) {
        state[cacheKey] = response.data;
      }
      
      // Clear cache entries for mutations
      if (method !== 'get' && cacheToClear.length > 0) {
        clearCache(cacheToClear);
      }
      
      return response.data;
    } 
    catch (error) {
      lastError = error;
      
      // Don't retry if it's a client error (400-499)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      if (attempt < retries) {
        console.warn(`${method.toUpperCase()} ${endpoint}: Attempt ${attempt + 1}/${retries + 1} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error(`Failed ${method.toUpperCase()} request to ${endpoint} after ${retries + 1} attempts`);
  throw lastError || new Error(`Request to ${endpoint} failed`);
}

// ==== Menu Items API ====

/**
 * Get all menu items
 * @param {boolean} refresh - Whether to bypass cache and fetch fresh data
 */
async function getMenuItems(refresh = false) {
  return makeRequest({
    method: 'get',
    endpoint: '/items/',
    cacheKey: 'menuItems',
    bypassCache: refresh
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
    data: itemData,
    cacheToClear: ['menuItems', 'featuredItems']
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
    data: itemData,
    cacheToClear: ['menuItems', 'featuredItems']
  });
}

/**
 * Delete a menu item
 * @param {string} id - Item ID to delete
 */
async function deleteMenuItem(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/items/${id}`,
    cacheToClear: ['menuItems', 'featuredItems']
  });
}

// ==== Categories API ====

/**
 * Get all categories or a specific category
 * @param {string} category - Optional specific category to fetch
 * @param {boolean} refresh - Whether to bypass cache and fetch fresh data
 */
async function getCategories(category = "", refresh = false) {
  const endpoint = category ? `/categories/${category}` : '/categories/';
  return makeRequest({
    method: 'get',
    endpoint,
    cacheKey: 'categories',
    bypassCache: refresh
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
    data: categoryData,
    cacheToClear: ['categories']
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
    data: categoryData,
    cacheToClear: ['categories', 'menuItems']
  });
}

/**
 * Delete a category
 * @param {string} id - Category ID to delete
 */
async function deleteCategory(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/categories/${id}`,
    cacheToClear: ['categories', 'menuItems']
  });
}

// ==== Toppings API ====

/**
 * Get all toppings
 * @param {boolean} refresh - Whether to bypass cache and fetch fresh data
 */
async function getToppings(refresh = false) {
  return makeRequest({
    method: 'get',
    endpoint: '/toppings/',
    cacheKey: 'toppings',
    bypassCache: refresh
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
    data: toppingData,
    cacheToClear: ['toppings']
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
    data: toppingData,
    cacheToClear: ['toppings']
  });
}

/**
 * Delete a topping
 * @param {string} id - Topping ID to delete
 */
async function deleteTopping(id) {
  return makeRequest({
    method: 'delete',
    endpoint: `/toppings/${id}`,
    cacheToClear: ['toppings']
  });
}

// ==== Payment & Checkout API ====

/**
 * Create a checkout session with Stripe
 * @param {Object} checkoutData - Data required for checkout
 * @param {Array} checkoutData.items - Cart items for checkout
 * @param {Object} checkoutData.customerInfo - Customer information (optional)
 * @param {string} checkoutData.successUrl - URL to redirect after successful payment
 * @param {string} checkoutData.cancelUrl - URL to redirect if checkout is cancelled
 * @returns {Promise<Object>} - Checkout session data including client secret
 */
async function createCheckoutSession(checkoutData) {
  if (!checkoutData || !checkoutData.items || !checkoutData.items.length) {
    throw new Error("Checkout requires at least one item");
  }

  return makeRequest({
    method: 'post',
    endpoint: '/checkout/create-session',
    data: checkoutData,
    validateResponse: (response) => response && response.clientSecret
  });
}

/**
 * Retrieve checkout session status
 * @param {string} sessionId - Stripe checkout session ID
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
 * @param {boolean} refresh - Whether to bypass cache and fetch fresh data
 */
async function getFeaturedItems(refresh = false) {
  return makeRequest({
    method: 'get',
    endpoint: '/items/home/featured',
    cacheKey: 'featuredItems',
    bypassCache: refresh
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
  // Input validation
  if (!user) {
    throw new Error("User data is required");
  }
  
  // Validate required fields
  const requiredFields = ['uid', 'email'];
  const missingFields = requiredFields.filter(field => !user[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required user fields: ${missingFields.join(', ')}`);
  }

  return makeRequest({
    method: 'post',
    endpoint: '/users/',
    data: user,
    retries: options.retries,
    retryDelay: options.retryDelay,
    validateResponse: (response) => response && response.id
  });
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
  getCheckoutSession,
  
  clearCache,
  
  // Export for testing or extending
  makeRequest,
  API_CONFIG
};
