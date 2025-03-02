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

    await waitFor(() =>
      expect(contextValue.error).toBe("Failed to load menu data")
    );
    expect(contextValue.loadingMenu).toBe(false);
  });
});
