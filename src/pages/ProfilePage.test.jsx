import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { AuthContext } from "../contexts/AuthContext";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { CartContext } from "../contexts/CartContext";
import { getUserOrders } from "../api/apiHandler";
import { prepareItemsForReorder } from "../utils/orderUtils";
import { getCartFromStorage, saveCartToStorage } from "../utils/localStorage";

vi.mock("../api/apiHandler");
vi.mock("../utils/orderUtils");
vi.mock("../utils/localStorage");

describe("ProfilePage", () => {
  const mockUser = {
    uid: "test-user-123",
    name: "Test User",
  };
  const mockAuthToken = "mock-auth-token";
  const mockOrders = [
    {
      _id: "order1",
      createdAt: new Date("2023-01-15").toISOString(),
      items: [{ id: "item1", name: "Product 1", quantity: 2, price: 10 }],
    },
    {
      _id: "order2",
      createdAt: new Date("2023-02-20").toISOString(),
      items: [{ id: "item2", name: "Product 2", quantity: 1, price: 15 }],
    },
  ];

  const mockCartContextValue = {
    cartItems: [],
    cartTotal: 0,
    removeFromCart: vi.fn(),
    onUpdateCartItem: vi.fn(),
    getFullCartItem: vi.fn(),
  };

  const mockSnackbarContext = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
  };

  const renderProfilePage = (overrideProps = {}) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: mockUser,
            authToken: mockAuthToken,
            ...overrideProps.authContext,
          }}
        >
          <SnackbarContext.Provider value={mockSnackbarContext}>
            <CartContext.Provider value={mockCartContextValue}>
              <ProfilePage />
            </CartContext.Provider>
          </SnackbarContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      getUserOrders.mockResolvedValue(mockOrders);
      const { container } = renderProfilePage();
      expect(container).toBeTruthy();
    });

    it("renders main profile sections", async () => {
      getUserOrders.mockResolvedValue(mockOrders);
      renderProfilePage();

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /my profile/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("region", { name: /order-history-section/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("region", { name: /favorite-dishes-section/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("region", { name: /support-section/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe("Order History", () => {
    it("fetches and displays user orders", async () => {
      getUserOrders.mockResolvedValue(mockOrders);
      renderProfilePage();

      await waitFor(() => {
        mockOrders.forEach((order) => {
          expect(screen.getByText(order.items[0].name)).toBeInTheDocument();
        });
      });
    });

    it("handles empty order history", async () => {
      getUserOrders.mockResolvedValue([]);
      renderProfilePage();

      await waitFor(() => {
        expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
      });
    });

    it("handles order fetch error", async () => {
      getUserOrders.mockRejectedValue(new Error("Failed to fetch orders"));
      renderProfilePage();

      await waitFor(() => {
        expect(
          screen.getByText(/failed to load order history/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Reorder Functionality", () => {
    it("successfully reorders items", async () => {
      getCartFromStorage.mockReturnValue([]);
      prepareItemsForReorder.mockReturnValue([{ id: "item1", quantity: 2 }]);

      getUserOrders.mockResolvedValue(mockOrders);
      renderProfilePage();

      await waitFor(() => {
        const reorderButtons = screen.getAllByText(/reorder/i);
        fireEvent.click(reorderButtons[0]);
      });

      expect(prepareItemsForReorder).toHaveBeenCalled();
      expect(saveCartToStorage).toHaveBeenCalled();
      expect(mockSnackbarContext.showSuccess).toHaveBeenCalledWith(
        "Items added to cart!"
      );
    });

    it("handles reorder error", async () => {
      prepareItemsForReorder.mockImplementation(() => {
        throw new Error("Reorder failed");
      });

      getUserOrders.mockResolvedValue(mockOrders);
      renderProfilePage();

      await waitFor(() => {
        const reorderButtons = screen.getAllByText(/reorder/i);
        fireEvent.click(reorderButtons[0]);
      });

      expect(mockSnackbarContext.showError).toHaveBeenCalledWith(
        "Failed to add items to cart"
      );
    });
  });

  describe("Favorite Dishes", () => {
    it("displays predefined favorite dishes", () => {
      renderProfilePage();

      const favoriteDishes = [
        "Classic Açaí Bowl",
        "Tropical Smoothie",
        "Green Energy Smoothie",
        "Protein Power Bowl",
      ];

      favoriteDishes.forEach((dish) => {
        expect(screen.getByText(dish)).toBeInTheDocument();
      });
    });
  });

  describe("Layout", () => {
    it("has responsive grid layout", () => {
      const { container } = renderProfilePage();
      const gridContainer = container.querySelector('[class*="grid"]');
      expect(gridContainer).toBeTruthy();

      const gridStyle = window.getComputedStyle(gridContainer);
      expect(gridStyle.gridTemplateColumns).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("gracefully handles context without user", () => {
      renderProfilePage({
        authContext: {
          currentUser: null,
          authToken: null,
        },
      });

      expect(screen.getByText(/please log in/i)).toBeInTheDocument();
    });
  });
});
