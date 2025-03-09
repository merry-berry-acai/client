import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CartPage from "../pages/CartPage";
import { CartContext } from "../contexts/CartContext";

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

vi.mock("../components/DebugPanel", () => ({
  default: () => <div data-testid="debug-panel" />,
}));

vi.mock("../components/EducatorNote", () => ({
  default: ({ children }) => <div data-testid="educator-note">{children}</div>,
}));

vi.mock("../components/cart/CartItem", () => ({
  default: ({ item }) => (
    <div data-testid={`cart-item-${item._id}`}>
      {item.name} - ${item.basePrice} x {item.quantity}
    </div>
  ),
}));

describe("CartPage", () => {
  describe("when cart is empty", () => {
    const mockCartContext = {
      cartItems: [],
      clearCart: vi.fn(),
    };

    beforeEach(() => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={mockCartContext}>
            <CartPage />
          </CartContext.Provider>
        </BrowserRouter>
      );
    });

    it("displays the empty cart message", () => {
      expect(screen.getByText("Your Cart is Empty")).toBeInTheDocument();
    });

    it("shows a button to browse the menu", () => {
      const browseButton = screen.getByText("Browse Our Menu");
      expect(browseButton).toBeInTheDocument();
      expect(browseButton.closest("a")).toHaveAttribute("href", "/menu");
    });
  });

  describe("when cart has items", () => {
    const mockCartItems = [
      {
        _id: "item1",
        name: "Pizza",
        basePrice: 10.99,
        quantity: 2,
        customization: [{ name: "Extra Cheese", price: 1.5 }],
      },
      {
        _id: "item2",
        name: "Burger",
        basePrice: 8.99,
        quantity: 1,
        customization: [],
      },
    ];

    const mockCartContext = {
      cartItems: mockCartItems,
      clearCart: vi.fn(),
    };

    beforeEach(() => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={mockCartContext}>
            <CartPage />
          </CartContext.Provider>
        </BrowserRouter>
      );
    });

    it("displays the correct number of items in the cart", () => {
      expect(screen.getByText("(2 items)")).toBeInTheDocument();
    });

    it("renders all cart items", () => {
      expect(screen.getByTestId("cart-item-item1")).toBeInTheDocument();
      expect(screen.getByTestId("cart-item-item2")).toBeInTheDocument();
    });

    it("calculates and displays the subtotal", () => {
      const subtotalText = screen.getByText("Subtotal");
      const subtotalContainer = subtotalText.closest(".MuiBox-root");

      expect(subtotalContainer).toHaveTextContent(/\$\d+\.\d{2}/);
    });

    it("calculates and displays the tax", () => {
      const taxText = screen.getByText("Tax (10%)");
      const taxContainer = taxText.closest(".MuiBox-root");

      expect(taxContainer).toHaveTextContent(/\$\d+\.\d{2}/);
    });

    it("calculates and displays the total", () => {
      const totalText = screen.getByText("Total");
      const totalContainer = totalText.closest(".MuiBox-root");

      expect(totalContainer).toHaveTextContent(/\$\d+\.\d{2}/);
    });

    it("has a working clear cart button", () => {
      const clearButton = screen.getByText("Clear Cart");
      fireEvent.click(clearButton);
      expect(mockCartContext.clearCart).toHaveBeenCalledTimes(1);
    });

    it("has a continue shopping button that links to the menu", () => {
      const continueButton = screen.getByText("Continue Shopping");
      expect(continueButton.closest("a")).toHaveAttribute("href", "/menu");
    });

    it("has a proceed to checkout button that links to checkout", () => {
      const checkoutButton = screen.getByText("Proceed to Checkout");
      expect(checkoutButton.closest("a")).toHaveAttribute("href", "/checkout");
    });
  });

  describe("edge cases", () => {
    it("handles cart items with undefined values correctly", () => {
      const incompleteCartItems = [
        {
          _id: "item3",

          basePrice: undefined,
          quantity: undefined,
          customization: undefined,
        },
      ];

      const mockCartContext = {
        cartItems: incompleteCartItems,
        clearCart: vi.fn(),
      };

      render(
        <BrowserRouter>
          <CartContext.Provider value={mockCartContext}>
            <CartPage />
          </CartContext.Provider>
        </BrowserRouter>
      );

      expect(screen.getByText("Your Shopping Cart")).toBeInTheDocument();

      const subtotalSection = screen
        .getByText("Subtotal")
        .closest(".MuiBox-root");
      const taxSection = screen.getByText("Tax (10%)").closest(".MuiBox-root");
      const totalSection = screen.getByText("Total").closest(".MuiBox-root");

      expect(subtotalSection).toHaveTextContent("$0.00");
      expect(taxSection).toHaveTextContent("$0.00");
      expect(totalSection).toHaveTextContent("$0.00");
    });
  });
});
