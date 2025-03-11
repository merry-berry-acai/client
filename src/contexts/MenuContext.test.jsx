import React from "react";
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MenuProvider, MenuContext } from "./MenuContext";
import {
  getMenuItems,
  getCategories,
  getToppings,
  getFeaturedItems,
} from "../api/apiHandler";

vi.mock("../api/apiHandler", () => ({
  getMenuItems: vi.fn(),
  getCategories: vi.fn(),
  getToppings: vi.fn(),
  getFeaturedItems: vi.fn(),
}));

describe("MenuContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and provides menu data successfully", async () => {
    const mockMenuItems = [{ id: 1, name: "Pizza" }];
    const mockCategories = [{ id: 1, name: "Fast Food" }];
    const mockToppings = [{ id: 1, name: "Cheese" }];
    const mockFeaturedItems = [{ id: 1, name: "Burger" }];

    getMenuItems.mockResolvedValue(mockMenuItems);
    getCategories.mockResolvedValue(mockCategories);
    getToppings.mockResolvedValue(mockToppings);
    getFeaturedItems.mockResolvedValue(mockFeaturedItems);

    let contextValue;

    const TestComponent = () => (
      <MenuContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </MenuContext.Consumer>
    );

    render(
      <MenuProvider>
        <TestComponent />
      </MenuProvider>
    );

    await waitFor(() => expect(contextValue.menuItems).toEqual(mockMenuItems));
    await waitFor(() =>
      expect(contextValue.categories).toEqual(mockCategories)
    );
    await waitFor(() => expect(contextValue.toppings).toEqual(mockToppings));
    await waitFor(() =>
      expect(contextValue.featuredItems).toEqual(mockFeaturedItems)
    );
    expect(contextValue.loadingMenu).toBe(false);
    expect(contextValue.error).toBe(null);
  });

  it("handles errors during data fetching", async () => {
    getMenuItems.mockRejectedValue(new Error("Network Error"));
    getCategories.mockRejectedValue(new Error("Network Error"));
    getToppings.mockRejectedValue(new Error("Network Error"));
    getFeaturedItems.mockRejectedValue(new Error("Network Error"));

    let contextValue;

    const TestComponent = () => (
      <MenuContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </MenuContext.Consumer>
    );

    render(
      <MenuProvider>
        <TestComponent />
      </MenuProvider>
    );

    await waitFor(() => expect(contextValue.error).not.toBeNull());
    
    expect(contextValue.loadingMenu).toBe(false);
    expect(contextValue.menuItems).toEqual([]);
    expect(contextValue.categories).toEqual([]);
    expect(contextValue.toppings).toEqual([]);
    expect(contextValue.featuredItems).toEqual([]);
  });
  
  it("refreshMenuData refreshes all data", async () => {
    const mockMenuItems = [{ id: 1, name: "Pizza" }];
    const updatedMenuItems = [{ id: 1, name: "Pizza" }, { id: 2, name: "Burger" }];
    
    getMenuItems.mockResolvedValueOnce(mockMenuItems);
    getCategories.mockResolvedValue([]);
    getToppings.mockResolvedValue([]);
    getFeaturedItems.mockResolvedValue([]);
    
    let contextValue;
    const TestComponent = () => (
      <MenuContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </MenuContext.Consumer>
    );
    
    render(
      <MenuProvider>
        <TestComponent />
      </MenuProvider>
    );
    
    await waitFor(() => expect(contextValue.menuItems).toEqual(mockMenuItems));
    
    // Setup for refresh
    getMenuItems.mockResolvedValueOnce(updatedMenuItems);
    
    // Trigger manual refresh
    contextValue.refreshMenuData();
    
    // Check that data was refreshed
    await waitFor(() => expect(contextValue.menuItems).toEqual(updatedMenuItems));
    expect(getMenuItems).toHaveBeenCalledTimes(2);
  });
    
  it("refreshMenuDataByType refreshes specific data type", async () => {
    const mockMenuItems = [{ id: 1, name: "Pizza" }];
    const mockCategories = [{ id: 1, name: "Fast Food" }];
    const updatedCategories = [{ id: 1, name: "Fast Food" }, { id: 2, name: "Dessert" }];
    
    getMenuItems.mockResolvedValue(mockMenuItems);
    getCategories.mockResolvedValueOnce(mockCategories);
    getToppings.mockResolvedValue([]);
    getFeaturedItems.mockResolvedValue([]);
    
    let contextValue;
    const TestComponent = () => (
      <MenuContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </MenuContext.Consumer>
    );
    
    render(
      <MenuProvider>
        <TestComponent />
      </MenuProvider>
    );
    
    await waitFor(() => expect(contextValue.categories).toEqual(mockCategories));
    
    // Setup for partial refresh
    getCategories.mockResolvedValueOnce(updatedCategories);
    
    // Refresh only categories
    contextValue.refreshMenuDataByType('categories');
    
    // Check that only categories were refreshed
    await waitFor(() => expect(contextValue.categories).toEqual(updatedCategories));
    expect(getMenuItems).toHaveBeenCalledTimes(1); // Should not be called again
    expect(getCategories).toHaveBeenCalledTimes(2);
  });
    
  it("updates lastRefresh timestamp after fetching data", async () => {
    getMenuItems.mockResolvedValue([]);
    getCategories.mockResolvedValue([]);
    getToppings.mockResolvedValue([]);
    getFeaturedItems.mockResolvedValue([]);
    
    let contextValue;
    const TestComponent = () => (
      <MenuContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </MenuContext.Consumer>
    );
    
    render(
      <MenuProvider>
        <TestComponent />
      </MenuProvider>
    );
    
    await waitFor(() => expect(contextValue.loadingMenu).toBe(false));
    expect(contextValue.lastRefresh).not.toBeNull();
    
    const firstRefreshTime = contextValue.lastRefresh;
    
    // Trigger refresh and check timestamp is updated
    contextValue.refreshMenuData();
    
    await waitFor(() => {
      expect(contextValue.lastRefresh).not.toEqual(firstRefreshTime);
      expect(contextValue.lastRefresh).toBeGreaterThan(firstRefreshTime);
    });
  });
});