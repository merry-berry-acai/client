import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CartItem from "./CartItem";
import { CartContext } from "../../contexts/CartContext";
import { MenuContext } from "../../contexts/MenuContext";

// Simple mocks
vi.mock("../menu-browsing/CustomizationModal", () => ({
  default: (props) => {
    if (props.open) {
      return <div data-testid="customization-modal"></div>;
    }
    return null;
  }
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

  describe("formatCustomizationSummary", () => {
    it("returns empty string for items with no customizations", () => {
      const itemWithoutCustomizations = {
        ...testItem,
        customization: []
      };

      render(
        <MenuContext.Provider value={contextValues.menuContext}>
          <CartContext.Provider value={contextValues.cartContext}>
            <CartItem item={itemWithoutCustomizations} />
          </CartContext.Provider>
        </MenuContext.Provider>
      );
      
      // The customization summary shouldn't be visible
      expect(screen.queryByText(/topping/)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /view details/i })).not.toBeInTheDocument();
    });

    it("formats single customization correctly", () => {
      const itemWithOneCustomization = {
        ...testItem,
        customization: [
          { name: "Extra Cheese", price: 1.50, quantity: 2 }
        ]
      };

      render(
        <MenuContext.Provider value={contextValues.menuContext}>
          <CartContext.Provider value={contextValues.cartContext}>
            <CartItem item={itemWithOneCustomization} />
          </CartContext.Provider>
        </MenuContext.Provider>
      );
      
      // Should show "2× Extra Cheese"
      expect(screen.getAllByText("2× Extra Cheese")[0]).toBeInTheDocument();
    });

    it("handles single customization with default quantity", () => {
      const itemWithDefaultQuantity = {
        ...testItem,
        customization: [
          { name: "Pepperoni", price: 1.00 } // No quantity specified
        ]
      };

      render(
        <MenuContext.Provider value={contextValues.menuContext}>
          <CartContext.Provider value={contextValues.cartContext}>
            <CartItem item={itemWithDefaultQuantity} />
          </CartContext.Provider>
        </MenuContext.Provider>
      );
      
      // Should default to "1× Pepperoni"
      expect(screen.getAllByText("1× Pepperoni")[0]).toBeInTheDocument();
    });

    it("shows correct count for multiple customizations", () => {
      const itemWithMultipleCustomizations = {
        ...testItem,
        customization: [
          { name: "Extra Cheese", price: 1.50 },
          { name: "Pepperoni", price: 1.00 },
          { name: "Mushrooms", price: 0.75 }
        ]
      };

      render(
        <MenuContext.Provider value={contextValues.menuContext}>
          <CartContext.Provider value={contextValues.cartContext}>
            <CartItem item={itemWithMultipleCustomizations} />
          </CartContext.Provider>
        </MenuContext.Provider>
      );
      
      // Should show "3 toppings"
      expect(screen.getByText("3 toppings")).toBeInTheDocument();
    });

    describe("quantity controls", () => {
      beforeEach(() => {
        // Reset mock function call history before each test
        vi.clearAllMocks();
      });
      
      it("increases quantity when plus button is clicked", async () => {
        const user = await import("@testing-library/user-event").then(module => module.default.setup());
        
        render(
          <MenuContext.Provider value={contextValues.menuContext}>
            <CartContext.Provider value={contextValues.cartContext}>
              <CartItem item={testItem} />
            </CartContext.Provider>
          </MenuContext.Provider>
        );
        
        // Find and click the plus icon
        const plusButton = screen.getByTestId("AddIcon").closest('button');
        await user.click(plusButton);
        
        // Check if onUpdateCartItem was called with updated quantity
        expect(contextValues.cartContext.onUpdateCartItem).toHaveBeenCalledWith({
          ...testItem,
          quantity: 3 // Initial was 2, should now be 3
        });
      });

      it("decreases quantity when minus button is clicked", async () => {
        const user = await import("@testing-library/user-event").then(module => module.default.setup());
        
        render(
          <MenuContext.Provider value={contextValues.menuContext}>
            <CartContext.Provider value={contextValues.cartContext}>
              <CartItem item={testItem} />
            </CartContext.Provider>
          </MenuContext.Provider>
        );
        
        // Find and click the minus icon
        const minusButton = screen.getByTestId("RemoveIcon").closest('button');
        await user.click(minusButton);
        
        // Check if onUpdateCartItem was called with updated quantity
        expect(contextValues.cartContext.onUpdateCartItem).toHaveBeenCalledWith({
          ...testItem,
          quantity: 1 // Initial was 2, should now be 1
        });
      });

      it("prevents quantity from going below 1", async () => {
        const user = await import("@testing-library/user-event").then(module => module.default.setup());
        
        const itemWithMinQuantity = {
          ...testItem,
          quantity: 1
        };
        
        render(
          <MenuContext.Provider value={contextValues.menuContext}>
            <CartContext.Provider value={contextValues.cartContext}>
              <CartItem item={itemWithMinQuantity} />
            </CartContext.Provider>
          </MenuContext.Provider>
        );
        
        // Find minus button, should be disabled
        const minusButton = screen.getByTestId("RemoveIcon").closest('button');
        expect(minusButton).toBeDisabled();
        
        
        
        // onUpdateCartItem should not have been called
        expect(contextValues.cartContext.onUpdateCartItem).not.toHaveBeenCalled();
      });

      describe("customization handling", () => {
        it("updates cart item and closes modal when customisation is changed", async () => {
          const user = await import("@testing-library/user-event").then(module => module.default.setup());
          
          // Initial render with modal closed
          render(
            <MenuContext.Provider value={contextValues.menuContext}>
              <CartContext.Provider value={contextValues.cartContext}>
                <CartItem item={testItem} />
              </CartContext.Provider>
            </MenuContext.Provider>
          );
          
          // Open modal
          const editButton = screen.getByText("Edit customization");
          await user.click(editButton);
          
          // Find modal (it should be open now)
          expect(screen.getByTestId("customization-modal")).toBeInTheDocument();
          
          // Get access to the component's props to simulate the onAdd callback
          // We're using the vi.mocked utility to get access to the mock
          const updatedItem = { ...testItem, customization: [{ name: "New Topping", price: 2.5 }] };
          
          // Find the component's props.onAdd function and call it directly
          const customizationModal = vi.mocked(require("../menu-browsing/CustomizationModal").default);
          const onAddProp = customizationModal.mock.calls[0][0].onAdd;
          onAddProp(updatedItem);
          
          // Verify onUpdateCartItem was called with the updated item
          expect(contextValues.cartContext.onUpdateCartItem).toHaveBeenCalledWith(updatedItem);
          
          // Re-render the component (the modal should be closed)
          expect(screen.queryByTestId("customization-modal")).not.toBeInTheDocument();
        });

        it("opens customization modal when edit button is clicked", async () => {
          const user = await import("@testing-library/user-event").then(module => module.default.setup());
          
          render(
            <MenuContext.Provider value={contextValues.menuContext}>
              <CartContext.Provider value={contextValues.cartContext}>
                <CartItem item={testItem} />
              </CartContext.Provider>
            </MenuContext.Provider>
          );
          
          // Modal should not be in document initially
          expect(screen.queryByTestId("customization-modal")).not.toBeInTheDocument();
          
          // Click edit customization button
          const editButton = screen.getByText("Edit customization");
          await user.click(editButton);
          
          // Modal should now be in document
          expect(screen.getByTestId("customization-modal")).toBeInTheDocument();
        });

        describe("remove item functionality", () => {
          beforeEach(() => {
            // Reset mock function call history before each test
            vi.clearAllMocks();
          });
          
          it("removes item when delete button is clicked (without cartItemId)", async () => {
            const user = await import("@testing-library/user-event").then(module => module.default.setup());
            
            render(
              <MenuContext.Provider value={contextValues.menuContext}>
                <CartContext.Provider value={contextValues.cartContext}>
                  <CartItem item={testItem} />
                </CartContext.Provider>
              </MenuContext.Provider>
            );
            
            // Find and click the delete button
            const deleteButton = screen.getByTestId("DeleteOutlineIcon").closest('button');
            await user.click(deleteButton);
            
            // Check if removeFromCart was called with correct parameters
            expect(contextValues.cartContext.removeFromCart).toHaveBeenCalledWith(
              testItem._id,
              testItem.customization
            );
          });

          it("removes item with cartItemId when delete button is clicked", async () => {
            const user = await import("@testing-library/user-event").then(module => module.default.setup());
            
            const itemWithCartItemId = {
              ...testItem,
              cartItemId: "cart-123"
            };
            
            render(
              <MenuContext.Provider value={contextValues.menuContext}>
                <CartContext.Provider value={contextValues.cartContext}>
                  <CartItem item={itemWithCartItemId} />
                </CartContext.Provider>
              </MenuContext.Provider>
            );
            
            // Find and click the delete button
            const deleteButton = screen.getByTestId("DeleteOutlineIcon").closest('button');
            await user.click(deleteButton);
            
            // Check if removeFromCart was called with correct parameters including cartItemId
            expect(contextValues.cartContext.removeFromCart).toHaveBeenCalledWith(
              itemWithCartItemId._id,
              itemWithCartItemId.customization,
              itemWithCartItemId.cartItemId
            );
          });
        });
      });
    });
  });
});
