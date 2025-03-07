import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CartItem from "./CartItem";
import { CartContext } from "../../contexts/CartContext";
import { MenuContext } from "../../contexts/MenuContext";

// Simple mocks
vi.mock("../menu-browsing/CustomisationModal", () => ({
  default: () => <div data-testid="customization-modal"></div>
}));

vi.mock("../common/AppImage", () => ({
  default: () => <div data-testid="product-image"></div>
}));

describe("CartItem", () => {
  // Basic test item
  const testItem = {
    _id: "123",
    name: "Test Pizza",
    basePrice: 12.99,
    quantity: 2,
    customization: []
  };

  // Test contexts
  const contextValues = {
    cartContext: {
      onUpdateCartItem: vi.fn(),
      removeFromCart: vi.fn(),
      getFullCartItem: vi.fn((item) => item)
    },
    menuContext: {
      menuItems: []
    }
  };

  it("renders product name", () => {
    render(
      <MenuContext.Provider value={contextValues.menuContext}>
        <CartContext.Provider value={contextValues.cartContext}>
          <CartItem item={testItem} />
        </CartContext.Provider>
      </MenuContext.Provider>
    );
    
    expect(screen.getByText("Test Pizza")).toBeInTheDocument();
  });
});
