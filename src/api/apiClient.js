import axios from "axios";
import { API_CONFIG } from "../config";
import { apiLogger } from "../utils/logger";
import { auth } from '../firebase/config';  // Add this import for auth

// Create the API handler instance
const apiHandlerInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Add request interceptor for logging
apiHandlerInstance.interceptors.request.use(
  config => {
    if (API_CONFIG.logRequests) {
      apiLogger.info(`Request: ${config.method.toUpperCase()} ${config.url}`);
      
      if (API_CONFIG.logLevel === 'verbose') {
        if (config.data) {
          apiLogger.debug('Request Payload:', config.data);
        }
        
        // Log headers with sensitive info redacted
        const safeHeaders = { ...config.headers };
        if (safeHeaders.Authorization) {
          safeHeaders.Authorization = safeHeaders.Authorization.substring(0, 15) + '...';
        }
        apiLogger.debug('Request Headers:', safeHeaders);
      }
    }
    return config;
  },
  error => {
    apiLogger.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiHandlerInstance.interceptors.response.use(
  response => {
    if (API_CONFIG.logRequests) {
      apiLogger.info(`Response: ${response.status} from ${response.config.url}`);
      
      if (API_CONFIG.logLevel === 'verbose') {
        apiLogger.debug('Response Data:', response.data);
      }
    }
    return response;
  },
  error => {
    if (error.response) {
      apiLogger.error(`API Error ${error.response.status}: ${error.response.data?.message || error.message}`);
      apiLogger.error('Error occurred at:', error.config.url);
      
      if (error.response.status === 401) {
        apiLogger.error('Authentication error: Token missing or invalid');
      }
      
      if (API_CONFIG.logLevel === 'verbose') {
        apiLogger.error('Error details:', error.response.data);
        apiLogger.error('Original request:', { 
          method: error.config.method, 
          url: error.config.url,
          data: error.config.data ? JSON.parse(error.config.data) : null
        });
      }
    } else if (error.request) {
      apiLogger.error('API Request failed: No response received');
      apiLogger.error('Request details:', { 
        method: error.config?.method, 
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      });
    } else {
      apiLogger.error('API Request setup failed:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Helper function to get current user's token
 * @returns {Promise<string|null>} - Auth token or null
 */
export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken(true);
  } catch (error) {
    apiLogger.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Unified API request function with retry capability
 * @param {Object} options - Request options
 * @returns {Promise<any>} - API response data
 */
export async function makeRequest(options) {
  const {
    method = 'get',
    endpoint,
    data = null,
    retries = API_CONFIG.retries,
    retryDelay = API_CONFIG.retryDelay,
    validateResponse = null,
    authToken = null,
    uidHeader = null
  } = options;
  
  // Only log endpoint info once at the beginning
  apiLogger.info(`${method.toUpperCase()} ${endpoint}`);
  
  // Special handling for user endpoints
  if (endpoint.startsWith('/users/') || endpoint === '/users') {
    if (!authToken) {
      apiLogger.warn(`User endpoint accessed without auth token: ${endpoint}`);
    }
  }
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Only log attempt number if not the first attempt or if retry logging is enabled
      if (attempt > 0 && apiLogger.shouldLogRetry()) {
        apiLogger.info(`Retry attempt ${attempt}/${retries} for ${method.toUpperCase()} ${endpoint}`);
      }
      
      // Create headers with auth token or UID if provided
      const headers = {};
      const currentAuthToken = await getAuthToken(); // Get auth token here
      if (currentAuthToken) {
        headers['Authorization'] = `Bearer ${currentAuthToken}`;
        // Don't log auth token details to reduce noise
      }
      if (uidHeader) {
        headers['firebaseUid'] = uidHeader;
        // Don't log UID details to reduce noise
      }
      
      // Only log headers in debug mode and if payload logging is enabled
      if (apiLogger.shouldLogPayloads()) {
        apiLogger.debug('Request Headers:', apiLogger.sanitize(headers));
        
        // Only log request body for POST/PUT and if it exists
        if ((method === 'post' || method === 'put') && data) {
          apiLogger.debug(`${method.toUpperCase()} payload:`, data);
        }
      }
      
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiHandlerInstance.get(endpoint, { headers });
          break;
        case 'post':
          response = await apiHandlerInstance.post(endpoint, data, { headers });
          break;
        case 'put':
          response = await apiHandlerInstance.put(endpoint, data, { headers });
          break;
        case 'patch':
          response = await apiHandlerInstance.patch(endpoint, data, { headers });
          break;
        case 'delete':
          response = await apiHandlerInstance.delete(endpoint, { headers });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      // Use the success logger which respects the showSuccess config
      apiLogger.success(`${method.toUpperCase()} ${endpoint} succeeded`);
      
      // Validate response if validator function is provided
      if (validateResponse && !validateResponse(response.data.data)) {
        apiLogger.warn(`Response validation failed for ${endpoint}`);
        throw new Error("Response validation failed");
      }
      
      return response.data?.data || response.data || response;
    } catch (error) {
      lastError = error;
      
      // Don't log all error details except in specific cases
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        apiLogger.error(`${method.toUpperCase()} ${endpoint} failed with client error ${error.response.status}: ${error.message}`);
      } else {
        apiLogger.error(`${method.toUpperCase()} ${endpoint} failed: ${error.message}`);
      }
      
      // Don't retry if it's a client error (400-499)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      if (attempt < retries && apiLogger.shouldLogRetry()) {
        apiLogger.warn(`Will retry ${method.toUpperCase()} ${endpoint} in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  apiLogger.error(`${method.toUpperCase()} ${endpoint} failed after ${retries + 1} attempts`);
  throw lastError || new Error(`Request to ${endpoint} failed`);
}

/**
 * Main API request handler with automatic response data extraction
 * @param {Object} options - Configuration for the request
 * @returns {Promise<any>} The response data, automatically extracted from nested structures
 */
export const apiHandler = async (options) => {
  try {
    const response = await makeRequest(options);
    
    // Extract data from common response patterns
    if (response && response.data && (Array.isArray(response.data) || typeof response.data === 'object')) {
      // If response.data.data exists (nested data structure), return that
      if (response.data.data !== undefined) {
        return response.data.data;
      }
      // Otherwise return response.data directly
      return response.data;
    }
    
    // Fallback to entire response if no standard structure found
    return response;
  } catch (error) {
    apiLogger.error(`API request failed: ${options.endpoint}`, error);
    throw error;
  }
};

export { apiHandlerInstance, API_CONFIG };
