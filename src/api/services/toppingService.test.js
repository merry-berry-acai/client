import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getToppings,
  createTopping,
  updateTopping,
  deleteTopping
} from './toppingService';
import { makeRequest, getAuthToken } from '../apiClient';
import { invalidateToppingsCache } from '../../utils/cacheManager';

// Mock dependencies
vi.mock('../apiClient', () => ({
  makeRequest: vi.fn(() => Promise.resolve({ data: 'mock data' })),
  getAuthToken: vi.fn(() => Promise.resolve('mock-token'))
}));

vi.mock('../../utils/cacheManager', () => ({
  invalidateToppingsCache: vi.fn()
}));

describe('toppingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('getToppings', () => {
    it('should call makeRequest with correct parameters', async () => {
      await getToppings();
      
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'get',
        endpoint: '/toppings/'
      });
    });
  });
  
  describe('createTopping', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const toppingData = { name: 'Cheese', price: 1.5 };
      await createTopping(toppingData);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'post',
        endpoint: '/toppings/',
        data: toppingData,
        authToken: 'mock-token'
      });
      expect(invalidateToppingsCache).toHaveBeenCalled();
    });
    
    it('should propagate errors', async () => {
      const error = new Error('Failed to create topping');
      makeRequest.mockRejectedValueOnce(error);
      
      await expect(createTopping({ name: 'Failed topping' })).rejects.toThrow(error);
    });
  });
  
  describe('updateTopping', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const id = '123';
      const toppingData = { name: 'Extra Cheese', price: 2.0 };
      await updateTopping(id, toppingData);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'put',
        endpoint: `/toppings/${id}`,
        data: toppingData,
        authToken: 'mock-token'
      });
      expect(invalidateToppingsCache).toHaveBeenCalled();
    });
  });
  
  describe('deleteTopping', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const id = '123';
      await deleteTopping(id);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'delete',
        endpoint: `/toppings/${id}`,
        authToken: 'mock-token'
      });
      expect(invalidateToppingsCache).toHaveBeenCalled();
    });
  });
});