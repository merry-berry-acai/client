import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './categoryService';
import { makeRequest, getAuthToken } from '../apiClient';
import { invalidateCategoriesCache } from '../../utils/cacheManager';

// Mock dependencies
vi.mock('../apiClient', () => ({
  makeRequest: vi.fn(() => Promise.resolve({ data: 'mock data' })),
  getAuthToken: vi.fn(() => Promise.resolve('mock-token'))
}));

vi.mock('../../utils/cacheManager', () => ({
  invalidateCategoriesCache: vi.fn()
}));

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('getCategories', () => {
    it('should call makeRequest with default endpoint when no category provided', async () => {
      await getCategories();
      
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'get',
        endpoint: '/categories/'
      });
    });
    
    it('should call makeRequest with specific category endpoint when provided', async () => {
      const category = 'pizza';
      await getCategories(category);
      
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'get',
        endpoint: `/categories/${category}`
      });
    });
  });
  
  describe('createCategory', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const categoryData = { name: 'Desserts' };
      await createCategory(categoryData);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'post',
        endpoint: '/categories/new',
        data: categoryData,
        authToken: 'mock-token'
      });
      expect(invalidateCategoriesCache).toHaveBeenCalled();
    });
    
    it('should propagate errors', async () => {
      const error = new Error('Failed to create category');
      makeRequest.mockRejectedValueOnce(error);
      
      await expect(createCategory({ name: 'Failed category' })).rejects.toThrow(error);
    });
  });
  
  describe('updateCategory', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const id = '123';
      const categoryData = { name: 'Updated Desserts' };
      await updateCategory(id, categoryData);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'put',
        endpoint: `/categories/${id}`,
        data: categoryData,
        authToken: 'mock-token'
      });
      expect(invalidateCategoriesCache).toHaveBeenCalled();
    });
  });
  
  describe('deleteCategory', () => {
    it('should call makeRequest with correct parameters and invalidate cache', async () => {
      const id = '123';
      await deleteCategory(id);
      
      expect(getAuthToken).toHaveBeenCalled();
      expect(makeRequest).toHaveBeenCalledWith({
        method: 'delete',
        endpoint: `/categories/${id}`,
        authToken: 'mock-token'
      });
      expect(invalidateCategoriesCache).toHaveBeenCalled();
    });
  });
});