import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartDropdown from "./CartDropdown";
import { CartContext } from "../../contexts/CartContext";

// Mock for react-router-dom with navigation capture
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

// Create a consistent mock for CustomizationModal that works for all tests
vi.mock("../menu-browsing/CustomisationModal", () => ({
  default: ({ onAdd, onClose, item }) => {
    // Function to simulate saving customizations
    const handleSave = () => {
      if (onAdd && item) {
        const updatedItem = { 
          ...item, 
          quantity: 3, 
          customization: [{ name: 'Extra Cheese', price: 2.00 }] 
        };
        onAdd(updatedItem);
      }
    };

    return (
      <div data-testid="customization-modal">
        <button data-testid="save-customization" onClick={handleSave}>
          Save Customization
        </button>
        <button data-testid="close-modal" onClick={onClose}>
          Cancel
        </button>
      </div>
    );
  }
}));

vi.mock("../common/AppImage", () => ({
  default: () => <div data-testid="product-image"></div>
}));

describe("CartDropdown", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Sample cart items
  const sampleCart = {
    cartItems: [
      {
        _id: "123",
        name: "Test Pizza",
        basePrice: 12.99,
        quantity: 2
      }
    ],
    cartTotal: 25.98,
    removeFromCart: vi.fn(),
    onUpdateCartItem: vi.fn(),
    getFullCartItem: vi.fn((item) => item)
  };

  it("renders cart icon with badge", () => {
    render(
      <CartContext.Provider value={sampleCart}>
        <CartDropdown />
      </CartContext.Provider>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", () => {
    render(
      <CartContext.Provider value={sampleCart}>
        <CartDropdown />
      </CartContext.Provider>
    );

    // Use a more reliable selector that likely exists in the component
    const cartIcon = screen.getByLabelText("shopping cart") || screen.getByRole("button");
    fireEvent.click(cartIcon);
    expect(screen.getByText(/My Cart/)).toBeInTheDocument();
  });

  it("navigates to cart page when View Cart button is clicked", () => {
    render(
      <CartContext.Provider value={sampleCart}>
        <CartDropdown />
      </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Find and click the View Cart button
    const viewCartButton = screen.getByText("View Cart");
    fireEvent.click(viewCartButton);
    
    // Verify navigation was called with correct route
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  it("closes dropdown when clicking outside", async () => {
    render(
      <CartContext.Provider value={sampleCart}>
        <CartDropdown />
      </CartContext.Provider>
    );
    
    // Open the dropdown first
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Verify dropdown is open by checking for content
    expect(screen.getByText(/My Cart/)).toBeInTheDocument();
    
    // Find and click the backdrop which is the proper way to trigger outside click for Material UI modals
    const backdrop = screen.getByRole('presentation').querySelector('.MuiBackdrop-root');
    fireEvent.click(backdrop);
    
    // Wait for dropdown to close before checking
    await waitFor(() => {
      expect(screen.queryByText(/My Cart/)).not.toBeInTheDocument();
    });
  });

  it("viewFullCart closes dropdown and navigates to cart page", async () => {
    // Reset the navigation mock to ensure clean tracking
    mockNavigate.mockReset();
    
    render(
      <CartContext.Provider value={sampleCart}>
        <CartDropdown />
      </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Verify dropdown is open
    expect(screen.getByText(/My Cart/)).toBeInTheDocument();
    
    // Find and click the View Cart button
    const viewCartButton = screen.getByText("View Cart");
    fireEvent.click(viewCartButton);
    
    // Test 1: Verify navigation was called with correct route
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
    
    // Test 2: Verify dropdown is closed (handleClose was called)
    await waitFor(() => {
      expect(screen.queryByText(/My Cart/)).not.toBeInTheDocument();
    });
  });

  it("goToCheckout closes dropdown and navigates to checkout page", async () => {
    // Reset the navigation mock to ensure clean tracking
    mockNavigate.mockReset();
    
    render(
      <CartContext.Provider value={sampleCart}>
        <CartDropdown />
      </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Verify dropdown is open
    expect(screen.getByText(/My Cart/)).toBeInTheDocument();
    
    // Find and click the Checkout button
    const checkoutButton = screen.getByText("Checkout");
    fireEvent.click(checkoutButton);
    
    // Test 1: Verify navigation was called with correct route
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    
    // Test 2: Verify dropdown is closed (handleClose was called)
    await waitFor(() => {
      expect(screen.queryByText(/My Cart/)).not.toBeInTheDocument();
    });
  });

  it("handleEditItem retrieves full item data and opens customization modal", () => {
    // Create a mock for getFullCartItem that we can track
    const mockGetFullItem = vi.fn((item) => ({...item, imageData: 'mocked-image-data'}));
    
    // Create cart context with our special mock
    const testCart = {
      ...sampleCart,
      getFullCartItem: mockGetFullItem
    };
    
    render(
      <CartContext.Provider value={testCart}>
        <CartDropdown />
      </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Find and click the edit button
    const editButton = screen.getByLabelText("edit");
    fireEvent.click(editButton);
    
    // Test 1: Verify getFullCartItem was called with the correct item
    expect(mockGetFullItem).toHaveBeenCalledWith(sampleCart.cartItems[0]);
    
    // Test 2: Verify the customization modal is displayed
    expect(screen.getByTestId("customization-modal")).toBeInTheDocument();
  });

it("handleCustomizationSave updates cart item and closes modal", async () => {
    // Create a mock for onUpdateCartItem that we can track
    const mockUpdateCartItem = vi.fn();
    
    // Create cart context with our special mock
    const testCart = {
        ...sampleCart,
        onUpdateCartItem: mockUpdateCartItem
    };
    
    render(
        <CartContext.Provider value={testCart}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Find and click the edit button to open the modal
    const editButton = screen.getByLabelText("edit");
    fireEvent.click(editButton);
    
    // Verify the modal is displayed
    const modal = screen.getByTestId("customization-modal");
    expect(modal).toBeInTheDocument();
    
    // Try different ways to find the save button
    const saveButton = screen.getByText(/Save Customization/) || 
                                         screen.getByRole("button", { name: /save/i }) || 
                                         screen.getByTestId("save-customization");
    fireEvent.click(saveButton);
    
    // Test 1: Verify onUpdateCartItem was called with the updated item
    expect(mockUpdateCartItem).toHaveBeenCalledWith(
        expect.objectContaining({
            quantity: 3,
            customization: [{ name: 'Extra Cheese', price: 2.00 }]
        })
    );
    
    // Test 2: Verify the modal is closed after saving
    await waitFor(() => {
        expect(screen.queryByTestId("customization-modal")).not.toBeInTheDocument();
    });
});

  it("handleRemoveItem removes the item from cart", () => {
    // Create a mock for removeFromCart that we can track
    const mockRemoveFromCart = vi.fn();
    
    // Create cart context with our special mock and an item with cartItemId
    const testCart = {
      ...sampleCart,
      cartItems: [
        {
          ...sampleCart.cartItems[0],
          cartItemId: "cart-item-123" // Add cartItemId to test item
        }
      ],
      removeFromCart: mockRemoveFromCart
    };
    
    render(
      <CartContext.Provider value={testCart}>
        <CartDropdown />
      </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Find and click the delete button
    const deleteButton = screen.getByLabelText("delete");
    fireEvent.click(deleteButton);
    
    // Verify removeFromCart was called with the correct cartItemId
    expect(mockRemoveFromCart).toHaveBeenCalledWith(null, null, "cart-item-123");
  });

it("displays empty cart message when cart has no items", () => {
    // Empty cart context
    const emptyCart = {
        cartItems: [],
        cartTotal: 0,
        removeFromCart: vi.fn(),
        onUpdateCartItem: vi.fn(),
        getFullCartItem: vi.fn()
    };
    
    render(
        <CartContext.Provider value={emptyCart}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Check for empty cart message
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Browse our menu")).toBeInTheDocument();
});

it("navigates to menu when Browse our menu is clicked in empty cart", () => {
    // Reset navigation mock
    mockNavigate.mockReset();
    
    // Empty cart context
    const emptyCart = {
        cartItems: [],
        cartTotal: 0,
        removeFromCart: vi.fn(),
        onUpdateCartItem: vi.fn(),
        getFullCartItem: vi.fn()
    };
    
    render(
        <CartContext.Provider value={emptyCart}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Click on Browse our menu
    const browseButton = screen.getByText("Browse our menu");
    fireEvent.click(browseButton);
    
    // Verify navigation and dropdown closure
    expect(mockNavigate).toHaveBeenCalledWith('/menu');
    waitFor(() => {
        expect(screen.queryByText(/My Cart/)).not.toBeInTheDocument();
    });
});

it("displays correct item count and total price", () => {
    const multiItemCart = {
        cartItems: [
            { _id: "123", name: "Pizza", basePrice: 10.99, quantity: 2 },
            { _id: "456", name: "Soda", basePrice: 2.50, quantity: 3 }
        ],
        cartTotal: 29.48,
        removeFromCart: vi.fn(),
        onUpdateCartItem: vi.fn(),
        getFullCartItem: vi.fn((item) => item)
    };
    
    render(
        <CartContext.Provider value={multiItemCart}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Check badge count (2 + 3 = 5)
    expect(screen.getByText("5")).toBeInTheDocument();
    
    // Open dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Check cart header and total
    expect(screen.getByText("My Cart (5 items)")).toBeInTheDocument();
    expect(screen.getByText("$29.48")).toBeInTheDocument();
});

it("displays customization details for items with toppings", () => {
    const cartWithCustomizations = {
        cartItems: [
            {
                _id: "123", 
                name: "Pizza", 
                basePrice: 10.99, 
                quantity: 1,
                customization: [
                    { name: "Extra Cheese", price: 1.50, quantity: 1 }
                ]
            }
        ],
        cartTotal: 12.49,
        removeFromCart: vi.fn(),
        onUpdateCartItem: vi.fn(),
        getFullCartItem: vi.fn((item) => item)
    };
    
    render(
        <CartContext.Provider value={cartWithCustomizations}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Open dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Check for customization text
    expect(screen.getByText("1× Extra Cheese")).toBeInTheDocument();
});

it("displays multiple customizations summary correctly", () => {
    const cartWithMultipleCustomizations = {
        cartItems: [
            {
                _id: "123", 
                name: "Pizza", 
                basePrice: 10.99, 
                quantity: 1,
                customization: [
                    { name: "Extra Cheese", price: 1.50, quantity: 1 },
                    { name: "Pepperoni", price: 2.00, quantity: 1 },
                    { name: "Mushrooms", price: 1.25, quantity: 1 }
                ]
            }
        ],
        cartTotal: 15.74,
        removeFromCart: vi.fn(),
        onUpdateCartItem: vi.fn(),
        getFullCartItem: vi.fn((item) => item)
    };
    
    render(
        <CartContext.Provider value={cartWithMultipleCustomizations}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Open dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Check for customization summary
    expect(screen.getByText("3 toppings")).toBeInTheDocument();
});

it("closes customization modal when cancel button is clicked", async () => {
    // Using the consistent CustomisationModal mock defined at the top
    render(
        <CartContext.Provider value={sampleCart}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Find and click the edit button to open the modal
    const editButton = screen.getByLabelText("edit");
    fireEvent.click(editButton);
    
    // Verify modal is opened
    expect(screen.getByTestId("customization-modal")).toBeInTheDocument();
    
    // Find and click the close button in our mock modal
    const closeButton = screen.getByTestId("close-modal");
    fireEvent.click(closeButton);
    
    // Verify the modal is closed (setEditingItem(null) was called)
    await waitFor(() => {
        expect(screen.queryByTestId("customization-modal")).not.toBeInTheDocument();
    });
});

it("closes customization modal when close button is clicked", async () => {
    // Using the consistent CustomisationModal mock defined at the top
    render(
        <CartContext.Provider value={sampleCart}>
            <CartDropdown />
        </CartContext.Provider>
    );
    
    // Open the dropdown
    const cartIcon = screen.getByLabelText("shopping cart");
    fireEvent.click(cartIcon);
    
    // Find and click the edit button to open the modal
    const editButton = screen.getByLabelText("edit");
    fireEvent.click(editButton);
    
    // Verify modal is opened
    expect(screen.getByTestId("customization-modal")).toBeInTheDocument();
    
    // Find and click the close button in our mock modal
    const closeButton = screen.getByTestId("close-modal");
    fireEvent.click(closeButton);
    
    // Verify the modal is closed
    await waitFor(() => {
        expect(screen.queryByTestId("customization-modal")).not.toBeInTheDocument();
    });
});
})
