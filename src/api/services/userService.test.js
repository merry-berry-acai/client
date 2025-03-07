import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sendUserToDB,
  checkIsAdmin,
  getUserOrders,
  ensureAuthTokenForUserEndpoint
} from './userService';
import { makeRequest, getAuthToken } from '../apiClient';
import { AUTH_CONFIG, LOG_CONFIG } from '../../config';

// Mock dependencies
vi.mock('../apiClient', () => ({
  makeRequest: vi.fn(() => Promise.resolve({ data: 'mock data' })),
  getAuthToken: vi.fn(() => Promise.resolve('mock-token'))
}));

vi.mock('../../config', () => ({
  AUTH_CONFIG: {
    adminUID: 'admin-123'
  },
  LOG_CONFIG: {
    logLevel: 'debug'
  }
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('ensureAuthTokenForUserEndpoint', () => {
    it('should add token to options for user endpoints', async () => {
      const options = { endpoint: '/users/123', method: 'get' };
      const result = await ensureAuthTokenForUserEndpoint(options);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(result.authToken).toBe('mock-token');
    });
    
    it('should use provided token if available', async () => {
      const options = { endpoint: '/users/123', method: 'get' };
      const providedToken = 'provided-token';
      
      const result = await ensureAuthTokenForUserEndpoint(options, providedToken);
      
      expect(getAuthToken).not.toHaveBeenCalled();
      expect(result.authToken).toBe(providedToken);
    });
    
    it('should not modify options for non-user endpoints', async () => {
      const options = { endpoint: '/items', method: 'get' };
      const result = await ensureAuthTokenForUserEndpoint(options);
      
      expect(getAuthToken).not.toHaveBeenCalled();
      expect(result).toEqual(options);
    });
  });
  
  describe('sendUserToDB', () => {
    it('should call makeRequest with correct parameters', async () => {
      const userData = { name: 'Test User' };
      const firebaseUid = 'user-123';
      await sendUserToDB(userData, firebaseUid);
      
      expect(makeRequest).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        endpoint: '/users',
        data: userData,
        uidHeader: firebaseUid
      }));
    });
    
    it('should use provided auth token when available', async () => {
      const userData = { name: 'Test User' };
      const firebaseUid = 'user-123';
      const authToken = 'custom-token';
      
      await sendUserToDB(userData, firebaseUid, authToken);
      
      expect(makeRequest).toHaveBeenCalledWith(expect.objectContaining({
        authToken: 'custom-token'
      }));
    });
  });
  
  describe('checkIsAdmin', () => {
    it('should return true for admin UID', () => {
      const result = checkIsAdmin('admin-123');
      expect(result).toBe(true);
    });
    
    it('should return false for non-admin UID', () => {
      const result = checkIsAdmin('regular-user');
      expect(result).toBe(false);
    });
  });
  
  describe('getUserOrders', () => {
    it('should call makeRequest with correct parameters', async () => {
      const uid = 'user-123';
      const authToken = 'order-token';
      await getUserOrders(uid, authToken);
      
      expect(makeRequest).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        endpoint: `/users/${uid}/orders`,
        authToken: 'order-token'
      }));
    });
  });
});