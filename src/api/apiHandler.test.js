import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the dependencies
vi.mock('./apiClient', () => ({
  makeRequest: vi.fn(),
  apiHandler: vi.fn(),
  apiHandlerInstance: { test: 'test' },
  API_CONFIG: { baseURL: 'test' }
}));

vi.mock('./services/menuService', () => ({
  getMenuItems: vi.fn(),
  getFeaturedItems: vi.fn(),
  getItemsInCategory: vi.fn(),
  createMenuItem: vi.fn(),
  updateMenuItem: vi.fn(),
  deleteMenuItem: vi.fn()
}));

vi.mock('./services/categoryService', () => ({
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn()
}));

vi.mock('./services/toppingService', () => ({
  getToppings: vi.fn(),
  createTopping: vi.fn(),
  updateTopping: vi.fn(),
  deleteTopping: vi.fn()
}));

vi.mock('./services/userService', () => ({
  sendUserToDB: vi.fn(),
  checkIsAdmin: vi.fn(),
  getUserOrders: vi.fn()
}));

// Import the mocked originals for comparison
import * as menuServiceMock from './services/menuService';
import * as categoryServiceMock from './services/categoryService';
import * as toppingServiceMock from './services/toppingService';
import * as userServiceMock from './services/userService';
import { makeRequest, apiHandler, apiHandlerInstance, API_CONFIG } from './apiClient';

// Import the module after mocking its dependencies
import {
  // menu service exports
  getMenuItems, getFeaturedItems, getItemsInCategory,
  createMenuItem, updateMenuItem, deleteMenuItem,
  
  // category service exports
  getCategories, createCategory, updateCategory, deleteCategory,
  
  // topping service exports
  getToppings, createTopping, updateTopping, deleteTopping,
  
  // user service exports
  sendUserToDB, checkIsAdmin, getUserOrders,
  
  // core API utilities
} from './apiHandler';

describe('apiHandler.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('menu service re-exports', () => {
    it('should correctly re-export getMenuItems function', () => {
      const testArg = { test: 'value' };
      getMenuItems(testArg);
      expect(menuServiceMock.getMenuItems).toHaveBeenCalledWith(testArg);
      expect(getMenuItems).toBe(menuServiceMock.getMenuItems);
    });
    
    it('should correctly re-export getFeaturedItems function', () => {
      const testArg = { test: 'value' };
      getFeaturedItems(testArg);
      expect(menuServiceMock.getFeaturedItems).toHaveBeenCalledWith(testArg);
      expect(getFeaturedItems).toBe(menuServiceMock.getFeaturedItems);
    });
    
    it('should correctly re-export getItemsInCategory function', () => {
      const testCategory = 'pizza';
      getItemsInCategory(testCategory);
      expect(menuServiceMock.getItemsInCategory).toHaveBeenCalledWith(testCategory);
      expect(getItemsInCategory).toBe(menuServiceMock.getItemsInCategory);
    });
    
    it('should correctly re-export createMenuItem function', () => {
      const testItem = { name: 'Pizza', price: 10 };
      createMenuItem(testItem);
      expect(menuServiceMock.createMenuItem).toHaveBeenCalledWith(testItem);
      expect(createMenuItem).toBe(menuServiceMock.createMenuItem);
    });
    
    it('should correctly re-export updateMenuItem function', () => {
      const id = '123';
      const testItem = { name: 'Updated Pizza' };
      updateMenuItem(id, testItem);
      expect(menuServiceMock.updateMenuItem).toHaveBeenCalledWith(id, testItem);
      expect(updateMenuItem).toBe(menuServiceMock.updateMenuItem);
    });
    
    it('should correctly re-export deleteMenuItem function', () => {
      const id = '123';
      deleteMenuItem(id);
      expect(menuServiceMock.deleteMenuItem).toHaveBeenCalledWith(id);
      expect(deleteMenuItem).toBe(menuServiceMock.deleteMenuItem);
    });
  });
  
  describe('category service re-exports', () => {
    it('should correctly re-export getCategories function', () => {
      getCategories();
      expect(categoryServiceMock.getCategories).toHaveBeenCalled();
      expect(getCategories).toBe(categoryServiceMock.getCategories);
    });
    
    it('should correctly re-export createCategory function', () => {
      const testCategory = { name: 'Desserts' };
      createCategory(testCategory);
      expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(testCategory);
      expect(createCategory).toBe(categoryServiceMock.createCategory);
    });
    
    it('should correctly re-export updateCategory function', () => {
      const id = '123';
      const testCategory = { name: 'Updated Desserts' };
      updateCategory(id, testCategory);
      expect(categoryServiceMock.updateCategory).toHaveBeenCalledWith(id, testCategory);
      expect(updateCategory).toBe(categoryServiceMock.updateCategory);
    });
    
    it('should correctly re-export deleteCategory function', () => {
      const id = '123';
      deleteCategory(id);
      expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(id);
      expect(deleteCategory).toBe(categoryServiceMock.deleteCategory);
    });
  });
  
  describe('topping service re-exports', () => {
    it('should correctly re-export getToppings function', () => {
      getToppings();
      expect(toppingServiceMock.getToppings).toHaveBeenCalled();
      expect(getToppings).toBe(toppingServiceMock.getToppings);
    });
    
    it('should correctly re-export createTopping function', () => {
      const testTopping = { name: 'Cheese' };
      createTopping(testTopping);
      expect(toppingServiceMock.createTopping).toHaveBeenCalledWith(testTopping);
      expect(createTopping).toBe(toppingServiceMock.createTopping);
    });
    
    it('should correctly re-export updateTopping function', () => {
      const id = '123';
      const testTopping = { name: 'Extra Cheese' };
      updateTopping(id, testTopping);
      expect(toppingServiceMock.updateTopping).toHaveBeenCalledWith(id, testTopping);
      expect(updateTopping).toBe(toppingServiceMock.updateTopping);
    });
    
    it('should correctly re-export deleteTopping function', () => {
      const id = '123';
      deleteTopping(id);
      expect(toppingServiceMock.deleteTopping).toHaveBeenCalledWith(id);
      expect(deleteTopping).toBe(toppingServiceMock.deleteTopping);
    });
  });
  
  describe('user service re-exports', () => {
    it('should correctly re-export sendUserToDB function', () => {
      const testUser = { name: 'John Doe' };
      sendUserToDB(testUser);
      expect(userServiceMock.sendUserToDB).toHaveBeenCalledWith(testUser);
      expect(sendUserToDB).toBe(userServiceMock.sendUserToDB);
    });
    
    it('should correctly re-export checkIsAdmin function', () => {
      const testUser = { name: 'John Doe' };
      checkIsAdmin(testUser);
      expect(userServiceMock.checkIsAdmin).toHaveBeenCalledWith(testUser);
      expect(checkIsAdmin).toBe(userServiceMock.checkIsAdmin);
    });
    
    it('should correctly re-export getUserOrders function', () => {
      const testUser = { name: 'John Doe' };
      getUserOrders(testUser);
      expect(userServiceMock.getUserOrders).toHaveBeenCalledWith(testUser);
      expect(getUserOrders).toBe(userServiceMock.getUserOrders);
    });
  });
});