import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CheckoutPage from "./CheckoutPage";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { makeRequest } from "../api/apiHandler";

vi.mock("../components/Navigation", () => ({
  default: ({ children }) => (
    <div data-testid="mocked-navigation">{children}</div>
  ),
}));

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div data-testid="mocked-layout">{children}</div>,
}));

vi.mock("../components/checkout", () => ({
  CheckoutStepReview: ({ onNextStep, onBackToCart }) => (
    <div data-testid="checkout-review">
      <button onClick={() => onNextStep({})}>Continue to Payment</button>
      <button onClick={onBackToCart}>Back to Cart</button>
    </div>
  ),
  CheckoutStepPayment: ({ onPaymentSuccess }) => (
    <div data-testid="checkout-payment">
      <button
        onClick={() =>
          onPaymentSuccess({ paymentIntent: "test", orderId: "test" })
        }
      >
        Complete Payment
      </button>
    </div>
  ),
  CheckoutStepConfirmation: ({ onContinueShopping }) => (
    <div data-testid="checkout-confirmation">
      <button onClick={onContinueShopping}>Continue Shopping</button>
    </div>
  ),
}));

vi.mock("../api/apiHandler", () => ({
  makeRequest: vi.fn(),
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

describe("CheckoutPage", () => {
  const mockCartItems = [
    {
      id: "1",
      name: "Acai Bowl",
      basePrice: 12.99,
      quantity: 2,
      customization: [{ name: "Extra Berries", price: 1.5 }],
    },
  ];

  const mockUser = { id: "user123", name: "Test User" };
  const mockToken = "test-auth-token";
  const mockClearCart = vi.fn();

  const defaultProps = {
    cartItems: mockCartItems,
    clearCart: mockClearCart,
    currentUser: mockUser,
    authToken: mockToken,
  };

  const renderCheckoutPage = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };

    return render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: mergedProps.currentUser,
            authToken: mergedProps.authToken,
          }}
        >
          <CartContext.Provider
            value={{
              cartItems: mergedProps.cartItems,
              clearCart: mergedProps.clearCart,
            }}
          >
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.resetAllMocks();
    navigateMock.mockClear();
  });

  it("renders without errors", () => {
    renderCheckoutPage();
    expect(screen.getByText(/Review order/i)).toBeDefined();
  });

  it("renders checkout stepper with correct steps", () => {
    renderCheckoutPage();

    expect(screen.getAllByText(/Review order/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Payment/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Confirmation/i)[0]).toBeDefined();
  });

  it("redirects to cart page if cart is empty", () => {
    renderCheckoutPage({ cartItems: [] });
    expect(navigateMock).toHaveBeenCalledWith("/cart");
  });

  it("moves to payment step when continue button is clicked", async () => {
    makeRequest
      .mockResolvedValueOnce({
        order: { _id: "order123" },
      })
      .mockResolvedValueOnce({
        clientSecret: "test-secret",
        paymentIntentId: "pi_123",
      });

    renderCheckoutPage();

    expect(screen.getByTestId("checkout-review")).toBeDefined();

    fireEvent.click(screen.getByText(/Continue to Payment/i));

    await waitFor(() => {
      expect(makeRequest).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId("checkout-payment")).toBeDefined();
    });
  });

  it("shows error when api call fails", async () => {
    makeRequest.mockRejectedValueOnce(new Error("API Error"));

    renderCheckoutPage();

    fireEvent.click(screen.getByText(/Continue to Payment/i));

    await waitFor(() => {
      expect(
        screen.getByText(/There was an error processing your order/i)
      ).toBeDefined();
    });
  });

  it("moves to confirmation step after payment success", async () => {
    makeRequest
      .mockResolvedValueOnce({
        order: { _id: "order123" },
      })
      .mockResolvedValueOnce({
        clientSecret: "test-secret",
        paymentIntentId: "pi_123",
      })
      .mockResolvedValueOnce({
        success: true,
      });

    renderCheckoutPage();

    fireEvent.click(screen.getByText(/Continue to Payment/i));

    await waitFor(() => {
      expect(screen.getByTestId("checkout-payment")).toBeDefined();
    });

    fireEvent.click(screen.getByText(/Complete Payment/i));

    await waitFor(() => {
      expect(screen.getByTestId("checkout-confirmation")).toBeDefined();
      expect(mockClearCart).toHaveBeenCalled();
    });
  });

  it("navigates to menu after clicking continue shopping", async () => {
    vi.clearAllMocks();

    makeRequest
      .mockResolvedValueOnce({
        order: { _id: "order123" },
      })
      .mockResolvedValueOnce({
        clientSecret: "test-secret",
        paymentIntentId: "pi_123",
      })
      .mockResolvedValueOnce({
        success: true,
      });

    renderCheckoutPage();

    const continueButton = screen.getByText(/Continue to Payment/i);
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByTestId("checkout-payment")).toBeDefined();
    });

    const completeButton = screen.getByText(/Complete Payment/i);
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByTestId("checkout-confirmation")).toBeDefined();
    });

    const continueShoppingButton = screen.getByText(/Continue Shopping/i);
    fireEvent.click(continueShoppingButton);

    expect(navigateMock).toHaveBeenCalledWith("/menu");
  });
});
