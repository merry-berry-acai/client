import BaseService from './BaseService';
import { API_CONFIG, AUTH_CONFIG } from '../../config';
import { dbLogger as log } from '../../utils/logger';
import { invalidateUsersCache } from '../../utils/cacheManager';
import * as Sentry from '@sentry/react';

const ADMIN_UID = AUTH_CONFIG.adminUID;

class UserService extends BaseService {
  constructor() {
    super('/users', 'users'); // Endpoint for user service and cache key
  }

  /**
   * Send user data to DB with validation and retry capability
   * @param {Object} user - User data to send
   * @param {string} firebaseUid - Firebase User ID for authentication header
   * @param {string} authToken - Authentication token for the request
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - The created user data from the server
   */
  async sendUserToDB (user, firebaseUid, authToken = null, options = {}) {
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
      const result = await this.apiCall(
        'post',
        '/users/register', // Full endpoint will be constructed in BaseService
        user,
        true, // requiresAuth - adjust as needed
        authToken, // authToken
        {
          retries: options.retries || API_CONFIG.retries,
          retryDelay: options.retryDelay || API_CONFIG.retryDelay,
          uidHeader: firebaseUid,
          validateResponse: (response) => {
            const valid = response && response.id;
            log.debug(`Response validation for sendUserToDB: ${valid ? 'Passed' : 'Failed'}`);
            return valid;
          }
        }
      );

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
  async checkIsAdmin(uid, authToken) {
    if (!uid) return false;

    if (uid === ADMIN_UID) {
      console.log("Admin access granted via direct UID match");
      return true;
    }

    try {
      const response = await this.apiCall('get', `/users/${uid}/role`, null, true, authToken, { retries: 0, uidHeader: uid });
      return response === 'admin';
    } catch (error) {
      console.error("API admin check failed:", error.message);
      Sentry.captureException(error, {
        extra: {
          action: "checkIsAdmin",
          userId: uid
        }
      });
      return uid === ADMIN_UID;
    }
  }

  /**
   * Get user orders with pagination support
   * @param {string} uid - User ID to fetch orders for
   * @param {string} authToken - Authentication token for the request
   * @returns {Promise<Array>} - Array of order objects
   */
  async getUserOrders(uid, authToken) {
    try {
      return await this.apiCall('get', `/users/orders/me`, null, true, authToken, { uidHeader: uid });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      Sentry.captureException(error, {
        extra: {
          action: "getUserOrders",
          userId: uid
        }
      });
      throw error;
    }
  }

  /**
   * Fetches all users (admin only)
   * @returns {Promise<Array>} Array of user objects
   */
  async fetchUsers(authToken) {
    try {
      return await this.apiCall('get', '/users/all', null, true, authToken);
    } catch (error) {
      log.error('Error fetching users:', error);
      Sentry.captureException(error, {
        extra: {
          action: "fetchUsers"
        }
      });
      throw error;
    }
  }

  /**
   * Creates a new user (admin only)
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    try {
      const result = await this.apiCall('post', '/users', userData, true);
      invalidateUsersCache();
      return result;
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
  async updateUser(userId, userData) {
    try {
      const result = await this.apiCall('put', `/users/${userId}`, userData, true); // Corrected endpoint
      invalidateUsersCache();
      return result;
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
  async deleteUser(userId) {
    try {
      const result = await this.apiCall('delete', `/users/${userId}`, null, true); // Corrected endpoint
      invalidateUsersCache();
      return result;
    } catch (error) {
      log.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch a user by ID (admin only)
   * @param {string} userId - The ID of the user to fetch
   * @returns {Promise<Object>} - The user data
   */
  async fetchUserById(userId) {
    try {
      return await this.apiCall('get', `/${userId}`, null, true); // Corrected endpoint
    } catch (error) {
      log.error(`Error fetching user ${userId} details:`, error);
      throw error;
    }
  }
}

const userService = new UserService();
export default UserService;

// Add named exports for individual methods
export const sendUserToDB = userService.sendUserToDB.bind(userService);
export const checkIsAdmin = userService.checkIsAdmin.bind(userService);
export const getUserOrders = userService.getUserOrders.bind(userService);
export const fetchUsers = userService.fetchUsers.bind(userService);
export const createUser = userService.createUser.bind(userService);
export const updateUser = userService.updateUser.bind(userService);
export const deleteUser = userService.deleteUser.bind(userService);
export const fetchUserById = userService.fetchUserById.bind(userService);
