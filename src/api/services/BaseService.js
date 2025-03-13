import { apiHandler } from '../apiClient';
import { invalidateCache } from '../../utils/cacheManager'; // Will need to adjust invalidateCache to accept a cache key

class BaseService {
  constructor(endpoint, cacheKey) {
    this.endpoint = endpoint;
    this.cacheKey = cacheKey;
  }

  async get(id = '') {
    const requestEndpoint = id ? `${this.endpoint}/${id}` : this.endpoint;
    return this.apiCall('get', requestEndpoint);
  }

  async create(data) {
    return this.apiCall('post', `${this.endpoint}/new`, data, true);
  }

  async update(id, data) {
    try {
      // Try PATCH first (for partial updates)
      return await this.apiCall('patch', `${this.endpoint}/${id}`, data, true);
    } catch (patchError) {
      try {
        // If PATCH failed, try PUT as fallback (for full resource replacement)
        return await this.apiCall('put', `${this.endpoint}/${id}`, data, true);
      } catch (putError) {
        // If both methods fail, throw the original error
        throw patchError;
      }
    }
  }

  async delete(id) {
    return this.apiCall('delete', `${this.endpoint}/${id}`, null, true);
  }

  async apiCall(method, endpoint, data = null, requiresAuth = false, authToken = null) {
    try {
      const result = await apiHandler({
        method,
        endpoint,
        data,
        requiresAuth,
        authToken, // Conditionally include authToken
      });
      if (this.cacheKey && (method === 'post' || method === 'patch' || method === 'delete')) {
        invalidateCache([this.cacheKey]);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default BaseService;
