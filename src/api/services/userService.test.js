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
  getAuthToken: vi.fn(() => Promise.resolve('mock-token')),
  apiHandler: vi.fn(options => makeRequest(options).then(res => res.data)) // Mock apiHandler
}));

vi.mock('../../config', () => ({
  AUTH_CONFIG: {
    adminUID: 'admin-123'
  },
  LOG_CONFIG: {
    logLevel: 'debug',
    contextIcons: {
      api: '🌐',
      firebase: '🔥',
      auth: '🔐',
      app: '📱',
      database: '💾',
      config: '⚙️',
      default: '📋'
    },
    componentConfig: {
      api: { 
        showSuccess: false,
        showPayloads: true,
        showRetryAttempts: true 
      },
      firebase: {
        showAuthFlow: true
      }
    }
  },
  FIREBASE_CONFIG: { // Mock FIREBASE_CONFIG with minimal valid config
    apiKey: 'dummy-api-key',
    authDomain: 'dummy-auth-domain',
    projectId: 'dummy-project-id',
    storageBucket: 'dummy-storage-bucket',
    messagingSenderId: 'dummy-messaging-sender-id',
    appId: 'dummy-app-id',
    measurementId: 'dummy-measurement-id'
  },
  API_CONFIG: { // Mock API_CONFIG with baseURL
    baseURL: 'http://dummy-api.com'
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
      expect(result).toHaveProperty('authToken', 'mock-token');
    });
    
    it('should use provided token if available', async () => {
      const options = { endpoint: '/users/123', method: 'get' };
      const providedToken = 'provided-token';
      
      const result = await ensureAuthTokenForUserEndpoint(options, providedToken);
      
      expect(getAuthToken).not.toHaveBeenCalled();
      expect(result).toHaveProperty('authToken', providedToken);
    });
    
    it('should not modify options for non-user endpoints', async () => {
      const options = { endpoint: '/items', method: 'get' };
      const result = await ensureAuthTokenForUserEndpoint(options);
      
      expect(getAuthToken).not.toHaveBeenCalled();
      expect(result).toEqual(options);
      expect(result).not.toHaveProperty('authToken'); // Ensure authToken is not added
    });
  });
  
  describe('sendUserToDB', () => {
    it('should call makeRequest with correct parameters', async () => {
      const userData = { 
        name: 'Test User',
        uid: 'test-uid', 
        email: 'test@example.com' 
      };
      const firebaseUid = 'user-123';
      await sendUserToDB(userData, firebaseUid);
      
      expect(makeRequest).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        endpoint: '/users/register', // Updated endpoint to /users/register
        data: userData,
        uidHeader: firebaseUid
      }));
    });
    
    it('should use provided auth token when available', async () => {
      const userData = { 
        name: 'Test User',
        uid: 'test-uid', 
        email: 'test@example.com' 
      };
      const firebaseUid = 'user-123';
      const authToken = 'custom-token';
      
      await sendUserToDB(userData, firebaseUid, authToken);
      
      expect(makeRequest).toHaveBeenCalledWith(expect.objectContaining({
        authToken: 'custom-token'
      }));
    });
  });
  
  describe('checkIsAdmin', () => {
    it('should return true for admin UID', async () => {
      const result = await checkIsAdmin('admin-123');
      expect(result).toBe(true);
    });
    
    it('should return false for non-admin UID', async () => {
      const result = await checkIsAdmin('regular-user');
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
        endpoint: `/users/orders/me`, // Updated endpoint to /users/orders/me
        authToken: 'order-token'
      }));
    });
  });
});
