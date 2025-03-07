import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getMenuItems,
  getFeaturedItems,
  getItemsInCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from './menuService';
import { makeRequest, getAuthToken } from '../apiClient';
import { invalidateMenuItemsCache } from '../../utils/cacheManager';

// Mock dependencies
vi.mock('../apiClient', () => ({
  makeRequest: vi.fn(() => Promise.resolve({ data: 'mock data' })),
  getAuthToken: vi.fn(() => Promise.resolve('mock-token'))
}));

vi.mock('../../utils/cacheManager', () => ({
  invalidateMenuItemsCache: vi.fn()
}));

describe('menuService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('getMenuItems', () => {
    it('should call makeRequest with correct parameters', async () => {
      await getMenuItems();
      
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'get',
        endpoint: '/items/'
      });
    });
  });
  
  describe('getFeaturedItems', () => {
    it('should call makeRequest with correct parameters', async () => {
      await getFeaturedItems();
      
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'get',
        endpoint: '/items/home/featured'
      });
    });
  });
  
  describe('getItemsInCategory', () => {
    it('should call makeRequest with correct category', async () => {
      const category = 'pizza';
      await getItemsInCategory(category);
      
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'get',
        endpoint: `/items/category/${category}`
      });
    });
  });
  
  describe('createMenuItem', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const itemData = { name: 'Pizza', price: 10 };
      await createMenuItem(itemData);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'post',
        endpoint: '/items/',
        data: itemData,
        authToken: 'mock-token'
      });
      expect(invalidateMenuItemsCache).toHaveBeenCalled();
    });
    
    it('should propagate errors', async () => {
      const error = new Error('Failed to create item');
      makeRequest.mockRejectedValueOnce(error);
      
      await expect(createMenuItem({ name: 'Failed item' })).rejects.toThrow(error);
    });
  });
  
  describe('updateMenuItem', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const id = '123';
      const itemData = { name: 'Updated Pizza' };
      await updateMenuItem(id, itemData);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'patch',
        endpoint: `/items/${id}`,
        data: itemData,
        authToken: 'mock-token'
      });
      expect(invalidateMenuItemsCache).toHaveBeenCalled();
    });
  });
  
  describe('deleteMenuItem', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const id = '123';
      await deleteMenuItem(id);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'delete',
        endpoint: `/items/${id}`,
        authToken: 'mock-token'
      });
      expect(invalidateMenuItemsCache).toHaveBeenCalled();
    });
  });
});