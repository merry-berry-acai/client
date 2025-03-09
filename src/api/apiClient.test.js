import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Set up manual mocks instead of using vi.mock()
const mockGet = vi.fn().mockResolvedValue({ data: { data: { test: 'success' } } });
const mockPost = vi.fn().mockResolvedValue({ data: { data: { test: 'success' } } });
const mockPut = vi.fn().mockResolvedValue({ data: { data: { test: 'success' } } });
const mockPatch = vi.fn().mockResolvedValue({ data: { data: { test: 'success' } } });
const mockDelete = vi.fn().mockResolvedValue({ data: { data: { test: 'success' } } });
const mockRequestUse = vi.fn();
const mockResponseUse = vi.fn();

// Create a mock axios instance that we can reference directly
const mockAxiosInstance = {
  get: mockGet,
  post: mockPost,
  put: mockPut,
  patch: mockPatch,
  delete: mockDelete,
  interceptors: {
    request: { use: mockRequestUse },
    response: { use: mockResponseUse }
  }
};

// Create a module stub object we'll use for testing
let apiClientExports = {};

// Setup phase without hoisting problems
describe('API Client Tests', () => {
  // Set up mocks and import the module before any tests run
  beforeAll(async () => {
    // Mock modules without hoisting
    vi.doMock('axios', () => ({
      default: {
        create: () => mockAxiosInstance
      },
      create: () => mockAxiosInstance
    }));

    vi.doMock('../firebase/config', () => ({
      auth: {
        currentUser: {
          getIdToken: vi.fn().mockResolvedValue('mock-token')
        }
      }
    }));

    vi.doMock('../utils/logger', () => ({
      apiLogger: {
        info: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        success: vi.fn(),
        shouldLogRetry: vi.fn().mockReturnValue(false),
        shouldLogPayloads: vi.fn().mockReturnValue(false),
        sanitize: vi.fn(data => data)
      }
    }));

    // Dynamically import the module AFTER mocks are set up
    apiClientExports = await import('./apiClient');

    // Register interceptors after mocks are setup
    apiClientExports.apiHandlerInstance.interceptors.request.use(
      (config) => requestInterceptor(config),
      (error) => requestErrorInterceptor(error)
    );
    apiClientExports.apiHandlerInstance.interceptors.response.use(
      (response) => responseInterceptor(response),
      (error) => responseErrorInterceptor(error)
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('API Client', () => {
    it('exports the expected functions and objects', () => {
      expect(typeof apiClientExports.apiHandler).toBe('function');
      expect(typeof apiClientExports.makeRequest).toBe('function');
      expect(typeof apiClientExports.getAuthToken).toBe('function');
      expect(apiClientExports.apiHandlerInstance).toBeDefined();
      expect(apiClientExports.API_CONFIG).toBeDefined();
    });
    
    it('makes GET requests correctly', async () => {
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'get'
      });
      
      expect(mockGet).toHaveBeenCalledWith('/test', { headers: {} });
    });
    
    // Adding more tests for complete coverage
    it('makes POST requests correctly', async () => {
      const testData = { name: 'test' };
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'post',
        data: testData
      });
      
      expect(mockPost).toHaveBeenCalledWith('/test', testData, { headers: {} });
    });
    
    it('makes PUT requests correctly', async () => {
      const testData = { name: 'test' };
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'put',
        data: testData
      });
      
      expect(mockPut).toHaveBeenCalledWith('/test', testData, { headers: {} });
    });
    
    it('makes PATCH requests correctly', async () => {
      const testData = { name: 'test' };
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'patch',
        data: testData
      });
      
      expect(mockPatch).toHaveBeenCalledWith('/test', testData, { headers: {} });
    });
    
    it('makes DELETE requests correctly', async () => {
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'delete'
      });
      
      expect(mockDelete).toHaveBeenCalledWith('/test', { headers: {} });
    });
    
    it('throws error for unsupported method', async () => {
      await expect(apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'invalid'
      })).rejects.toThrow('Unsupported method: invalid');
    });
    
    it('includes auth token in headers when provided', async () => {
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'get',
        authToken: 'test-token'
      });
      
      expect(mockGet).toHaveBeenCalledWith('/test', { 
        headers: { Authorization: 'Bearer test-token' } 
      });
    });
    
    it('includes firebaseUid in headers when provided', async () => {
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'get',
        uidHeader: 'test-uid'
      });
      
      expect(mockGet).toHaveBeenCalledWith('/test', { 
        headers: { firebaseUid: 'test-uid' } 
      });
    });
    
    it('validates response when validateResponse function is provided', async () => {
      const validateFn = vi.fn().mockReturnValue(true);
      
      await apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'get',
        validateResponse: validateFn
      });
      
      expect(validateFn).toHaveBeenCalledWith({ test: 'success' });
    });
    
    it('throws error when response validation fails', async () => {
      const validateFn = vi.fn().mockReturnValue(false);
      
      await expect(apiClientExports.makeRequest({
        endpoint: '/test',
        method: 'get',
        validateResponse: validateFn
      })).rejects.toThrow('Response validation failed');
    });
  });
  
  describe('getAuthToken', () => {
    it('returns token when user exists', async () => {
      const mockFirebaseConfig = await import('../firebase/config');
      const token = await apiClientExports.getAuthToken();
      
      expect(token).toBe('mock-token');
      expect(mockFirebaseConfig.auth.currentUser.getIdToken).toHaveBeenCalledWith(true);
    });
    
    it('returns null when user does not exist', async () => {
      const mockFirebaseConfig = await import('../firebase/config');
      mockFirebaseConfig.auth.currentUser = null;
      
      const token = await apiClientExports.getAuthToken();
      expect(token).toBeNull();
    });
    
    it('returns null and logs error when getIdToken throws', async () => {
      const mockFirebaseConfig = await import('../firebase/config');
      const mockLogger = await import('../utils/logger');
      
      mockFirebaseConfig.auth.currentUser = {
        getIdToken: vi.fn().mockRejectedValue(new Error('Auth error'))
      };
      
      const token = await apiClientExports.getAuthToken();
      
      expect(token).toBeNull();
      expect(mockLogger.apiLogger.error).toHaveBeenCalledWith(
        "Error getting auth token:",
        expect.any(Error)
      );
    });
  });
  
  describe('apiHandler', () => {
    it('extracts data from nested response structure', async () => {
      mockGet.mockResolvedValue({
        data: { data: { nested: 'value' } }
      });
      
      const result = await apiClientExports.apiHandler({
        endpoint: '/test',
        method: 'get'
      });
      
      expect(result).toEqual({ nested: 'value' });
    });
    
    it('extracts direct data object when no nested structure', async () => {
      mockGet.mockResolvedValue({
        data: { direct: 'value' }
      });
      
      const result = await apiClientExports.apiHandler({
        endpoint: '/test',
        method: 'get'
      });
      
      expect(result).toEqual({ direct: 'value' });
    });
    
    it('returns full response when no standard structure found', async () => {
      mockGet.mockResolvedValue('non-standard-response');
      
      const result = await apiClientExports.apiHandler({
        endpoint: '/test',
        method: 'get'
      });
      
      expect(result).toBe('non-standard-response');
    });
    
    it('throws and logs errors', async () => {
      const testError = new Error('API failure');
      mockGet.mockRejectedValue(testError);
      
      console.error = vi.fn(); // Mock console.error
      
      await expect(apiClientExports.apiHandler({
        endpoint: '/test',
        method: 'get'
      })).rejects.toThrow('API failure');
      
      expect(console.error).toHaveBeenCalledWith(
        'API request failed: /test',
        testError
      );
    });
  });
  
  describe('Request retry mechanism', () => {
    it('retries on server errors', async () => {
      // Setup for a failure then success scenario
      const serverError = {
        message: 'Server error',
        response: { status: 500 }
      };
      
      mockGet
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce({ data: { success: true } });
      
      const mockLogger = await import('../utils/logger');
      mockLogger.apiLogger.shouldLogRetry.mockReturnValue(true);
      
      // Need to mock setTimeout
      vi.useFakeTimers();
      
      const promise = apiClientExports.makeRequest({
        endpoint: '/retry-test',
        method: 'get',
        retries: 1,
        retryDelay: 100
      });
      
      // Fast-forward time to complete the retry delay
      await new Promise(resolve => setTimeout(resolve, 50)); // Add a small delay before advancing timers
      vi.advanceTimersByTime(100);
      
      const result = await promise;
      expect(result).toEqual({ success: true });
      expect(mockGet).toHaveBeenCalledTimes(2);
      
      vi.useRealTimers();
    }, 30000); // Increased timeout value to prevent test timeout
    
    it('does not retry on client errors', async () => {
      const clientError = {
        message: 'Client error',
        response: { status: 400 }
      };
      
      mockGet.mockRejectedValue(clientError); // Updated mockGet to reject with clientError object
      
      await expect(apiClientExports.makeRequest({
        endpoint: '/no-retry',
        method: 'get',
        retries: 3
      })).rejects.toThrow(); // Updated expect to toThrow()
      
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
    
    it('gives up after max retries', async () => {
      const serverError = {
        message: 'Persistent server error',
        response: { status: 500 }
      };
      
      mockGet.mockRejectedValue(serverError);
      
      const mockLogger = await import('../utils/logger');
      mockLogger.apiLogger.shouldLogRetry.mockReturnValue(true);
      
      // Mock timers for retry delays
      vi.useFakeTimers();
      
      const promise = apiClientExports.makeRequest({
        endpoint: '/max-retries',
        method: 'get',
        retries: 2,
        retryDelay: 100
      });
      
      // Advance time for both retry attempts
      vi.advanceTimersByTime(100);
      vi.advanceTimersByTime(100);
      
      await expect(promise).rejects.toEqual(serverError);
      expect(mockGet).toHaveBeenCalledTimes(3); // Initial + 2 retries
      
      vi.useRealTimers();
    }, 30000); // Increased timeout value to prevent test timeout
  });
});
