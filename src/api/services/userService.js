import { makeRequest, apiHandler } from '../apiClient';
import { API_CONFIG } from '../../config';
import { AUTH_CONFIG } from '../../config';
import { dbLogger as log } from '../../utils/logger';
import { auth } from '../../firebase/config';  // Import auth to get current user

const ADMIN_UID = AUTH_CONFIG.adminUID;

/**
 * Helper function to get current user's token
 * @returns {Promise<string|null>} - Auth token or null
 */
async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken(true);
  } catch (error) {
    log.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Ensures that any request to /users/* endpoints includes an auth token
 * @param {Object} options - Request options
 * @param {string} providedToken - Optional token to use instead of fetching a new one
 * @returns {Promise<Object>} - Updated options with auth token
 */
async function ensureAuthTokenForUserEndpoint(options, providedToken = null) {
  // Skip if endpoint doesn't start with /users/
  if (!options.endpoint.startsWith('/users/') && !options.endpoint === '/users') {
    return options;
  }
  
  // Use provided token or fetch a new one
  const authToken = providedToken || await getAuthToken();
  
  if (!authToken) {
    log.warn(`No auth token available for user endpoint: ${options.endpoint}`);
  } else {
    log.debug(`Adding auth token to user endpoint: ${options.endpoint}`);
    options.authToken = authToken;
  }
  
  return options;
}

/**
 * Send user data to DB with validation and retry capability
 * @param {Object} user - User data to send
 * @param {string} firebaseUid - Firebase User ID for authentication header
 * @param {string} authToken - Authentication token for the request
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - The created user data from the server
 */
export async function sendUserToDB(user, firebaseUid, authToken = null, options = {}) {
  log.info('sendUserToDB called with user data');
  log.debug('User data:', user);
  
  // Input validation
  if (!user) {
    log.error('User data is required');
    throw new Error("User data is required");
  }
  
  // Validate required fields
  const requiredFields = ['uid', 'email'];
  const missingFields = requiredFields.filter(field => !user[field]);
  
  if (missingFields.length > 0) {
    log.error(`Missing required fields: ${missingFields.join(', ')}`);
    throw new Error(`Missing required user fields: ${missingFields.join(', ')}`);
  }

  log.info('All required fields are present');
  
  if (!API_CONFIG.baseURL) {
    log.error('API base URL is not configured');
    throw new Error("API base URL is not configured");
  }
  
  log.info(`Sending user data to ${API_CONFIG.baseURL}/users/register`);
  
  try {
    // Ensure auth token is included for user endpoints
    const requestOptions = await ensureAuthTokenForUserEndpoint({
      method: 'post',
      endpoint: '/users/register',
      data: user,
      retries: options.retries || API_CONFIG.retries,
      retryDelay: options.retryDelay || API_CONFIG.retryDelay,
      uidHeader: firebaseUid,
      authToken: authToken, 
      validateResponse: (response) => {
        const valid = response && response.id;
        log.debug(`Response validation for sendUserToDB: ${valid ? 'Passed' : 'Failed'}`);
        return valid;
      }
    }, authToken);

    const result = await makeRequest(requestOptions);
    
    log.info('User successfully saved to database', result);
    return result;
  } catch (error) {
    log.error('sendUserToDB failed:', error);
    throw error;
  }
}

/**
 * Check if a user is an admin
 * @param {string} uid - User ID to check
 */
export async function checkIsAdmin(uid) {
  if (!uid) return false;
  
  if (uid === ADMIN_UID) {
    console.log("Admin access granted via direct UID match");
    return true;
  }
  
  try {
    // Get auth token for user endpoint
    const requestOptions = await ensureAuthTokenForUserEndpoint({
      method: 'get',
      endpoint: `/users/${uid}/role`,
      uidHeader: uid,
      retries: 0
    });

    const response = await makeRequest(requestOptions);
    return response && response.role === 'admin';
  } catch (error) {
    console.error("API admin check failed:", error.message);
    return uid === ADMIN_UID;
  }
}

/**
 * Get user orders with pagination support
 * @param {string} uid - User ID to fetch orders for
 * @param {string} authToken - Authentication token for the request
 * @returns {Promise<Array>} - Array of order objects
 */
export async function getUserOrders(uid, authToken) {
  try {
    // Ensure auth token is included for user endpoints
    const requestOptions = await ensureAuthTokenForUserEndpoint({
      method: 'get',
      endpoint: `/users/orders/me`,
      uidHeader: uid
    }, authToken);

    // Use apiHandler to automatically extract data
    return await apiHandler(requestOptions);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

/**
 * Fetches all users (admin only)
 * @returns {Promise<Array>} Array of user objects
 */
export async function fetchUsers() {
  const authToken = await getAuthToken();
  log.info('Fetching all users (admin operation)');
  
  try {
    const requestOptions = await ensureAuthTokenForUserEndpoint({
      method: 'get',
      endpoint: '/users',
      authToken: authToken
    });
    
    return await apiHandler(requestOptions);
  } catch (error) {
    log.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Creates a new user (admin only)
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user object
 */
export async function createUser(userData) {
  const authToken = await getAuthToken();
  log.info('Creating new user (admin operation)');
  
  try {
    const requestOptions = await ensureAuthTokenForUserEndpoint({
      method: 'post',
      endpoint: '/users',
      data: userData,
      authToken: authToken
    });
    
    return await apiHandler(requestOptions);
  } catch (error) {
    log.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Updates an existing user (admin only)
 * @param {string} userId - ID of user to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
export async function updateUser(userId, userData) {
  const authToken = await getAuthToken();
  log.info(`Updating user ${userId} (admin operation)`);
  
  try {
    const requestOptions = await ensureAuthTokenForUserEndpoint({
      method: 'put',
      endpoint: `/users/${userId}`,
      data: userData,
      authToken: authToken
    });
    
    return await apiHandler(requestOptions);
  } catch (error) {
    log.error(`Error updating user ${userId}:`, error);
    throw error;
  }
}

/**
 * Deletes a user (admin only)
 * @param {string} userId - ID of user to delete
 * @returns {Promise<Object>} Response data
 */
export async function deleteUser(userId) {
  const authToken = await getAuthToken();
  log.info(`Deleting user ${userId} (admin operation)`);
  
  try {
    const requestOptions = await ensureAuthTokenForUserEndpoint({
      method: 'delete',
      endpoint: `/users/${userId}`,
      authToken: authToken
    });
    
    return await apiHandler(requestOptions);
  } catch (error) {
    log.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
}

// Export the helper function for other services that might need to access user endpoints
export { ensureAuthTokenForUserEndpoint };
