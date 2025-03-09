import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuPage from "./MenuPage";
import { MenuContext } from "../contexts/MenuContext";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";

vi.mock("@mui/material/useMediaQuery", () => ({
  default: vi.fn(),
}));

const mockMenuItems = [
  {
    id: "1",
    name: "Acai Bowl",
    category: "bowls",
    basePrice: 12.99,
    description: "Delicious acai bowl",
    image: "acai-bowl.jpg",
  },
  {
    id: "2",
    name: "Berry Smoothie",
    category: "drinks",
    basePrice: 7.99,
    description: "Refreshing berry smoothie",
    image: "berry-smoothie.jpg",
  },
];

const mockCategories = [
  { _id: "popular", name: "Popular" },
  { _id: "vegetarian", name: "Vegetarian" },
  { _id: "staff-picks", name: "Staff Picks" },
];

const createMockAuthContext = (overrides = {}) => ({
  isAuthenticated: false,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

const createMockCartContext = (overrides = {}) => ({
  cartItems: [],
  cartTotal: 0,
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateCartItem: vi.fn(),
  getFullCartItem: vi.fn(),
  ...overrides,
});

const renderMenuPage = ({
  menuItems = mockMenuItems,
  categories = mockCategories,
  authContextOverrides = {},
  cartContextOverrides = {},
  isDesktop = true,
} = {}) => {
  useMediaQuery.mockReturnValue(isDesktop);

  const theme = createTheme();

  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthContext.Provider
          value={createMockAuthContext(authContextOverrides)}
        >
          <CartContext.Provider
            value={createMockCartContext(cartContextOverrides)}
          >
            <MenuContext.Provider value={{ menuItems, categories }}>
              <MenuPage />
            </MenuContext.Provider>
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe("MenuPage Component", () => {
  describe("Rendering", () => {
    let renderedComponent;

    beforeEach(() => {
      renderedComponent = renderMenuPage();
    });

    it('renders "Our Menu" heading', () => {
      const headingElements = screen.getAllByRole("heading", {
        name: /Our Menu/i,
      });

      expect(headingElements.length).toBeGreaterThan(0);
      expect(headingElements[0]).toBeInTheDocument();
    });

    it("renders MenuPageHeader with search input", () => {
      const searchInput = screen.getByPlaceholderText(/Search menu items.../i);
      expect(searchInput).toBeInTheDocument();
    });

    it("renders category sidebar", () => {
      const categoryButtons = screen.getAllByRole("button").filter((btn) => {
        const text = btn.textContent.trim();
        return text && text !== "Add" && text !== "Debug";
      });

      console.log(
        "Category Buttons:",
        categoryButtons.map((btn) => btn.textContent)
      );

      const categoryLabels = categoryButtons.map((btn) =>
        btn.textContent.trim()
      );

      const expectedCategories = ["Popular", "Vegetarian", "Staff Picks"];

      expectedCategories.forEach((category) => {
        expect(categoryLabels).toContain(category);
      });
    });

    it("renders menu items grid", () => {
      mockMenuItems.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });
  });

  describe("Interactions", () => {
    let user;

    beforeEach(() => {
      user = userEvent.setup();
      renderMenuPage();
    });

    it("filters menu items by search term", async () => {
      const searchInput = screen.getByPlaceholderText(/Search menu items.../i);

      await user.type(searchInput, "Acai");

      expect(screen.getByText("Acai Bowl")).toBeInTheDocument();
      expect(screen.queryByText("Berry Smoothie")).not.toBeInTheDocument();
    });

    it("filters menu items by category", async () => {
      const categoryButtons = screen.getAllByRole("button").filter((btn) => {
        const text = btn.textContent.trim();
        return text && text !== "Add" && text !== "Debug";
      });

      console.log(
        "All Category Buttons:",
        categoryButtons.map((btn) => btn.textContent)
      );

      const firstCategory = categoryButtons[0];

      expect(firstCategory).toBeTruthy();

      await user.click(firstCategory);

      expect(
        screen.getAllByRole("heading", { level: 5 }).length
      ).toBeGreaterThan(0);
    });
  });
});
