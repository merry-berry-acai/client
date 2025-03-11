import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import MobileCategorySelector from "./MobileCategorySelector";

vi.mock("./SearchBar", () => ({
  default: ({ searchTerm, setSearchTerm }) => (
    <div data-testid="search-bar">
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  ),
}));

vi.mock("./SortControl", () => ({
  default: ({ sortBy, setSortBy }) => (
    <div data-testid="sort-control">
      <select
        data-testid="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
    </div>
  ),
}));

const mockCategories = [
  { _id: "cat1", name: "Category 1" },
  { _id: "cat2", name: "Category 2" },
  { _id: "cat3", name: "Category 3" },
];

const mockMenuItems = [
  { _id: "item1", name: "Item 1", category: "cat1" },
  { _id: "item2", name: "Item 2", category: "cat1" },
  { _id: "item3", name: "Item 3", category: "cat2" },
  { _id: "item4", name: "Item 4", category: "cat2" },
  { _id: "item5", name: "Item 5", category: "cat3" },
];

describe("MobileCategorySelector Component", () => {
  const defaultProps = {
    selectedCategory: null,
    handleSelectCategory: vi.fn(),
    menuItems: mockMenuItems,
    categories: mockCategories,
    sortBy: "name",
    setSortBy: vi.fn(),
    searchTerm: "",
    setSearchTerm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<MobileCategorySelector {...defaultProps} />);
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  test("renders SearchBar component", () => {
    render(<MobileCategorySelector {...defaultProps} />);
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  test("renders SortControl component", () => {
    render(<MobileCategorySelector {...defaultProps} />);
    expect(screen.getByTestId("sort-control")).toBeInTheDocument();
  });

  test('renders "All Items" card with correct count', () => {
    render(<MobileCategorySelector {...defaultProps} />);
    expect(screen.getByText("All Items")).toBeInTheDocument();
    expect(
      screen.getByText(`${mockMenuItems.length} items`)
    ).toBeInTheDocument();
  });

  test("renders category cards with correct names and item counts", () => {
    render(<MobileCategorySelector {...defaultProps} />);

    const category1Card = screen
      .getByText("Category 1")
      .closest(".MuiCard-root");
    expect(category1Card).toBeInTheDocument();
    expect(within(category1Card).getByText("2 items")).toBeInTheDocument();

    const category2Card = screen
      .getByText("Category 2")
      .closest(".MuiCard-root");
    expect(category2Card).toBeInTheDocument();
    expect(within(category2Card).getByText("2 items")).toBeInTheDocument();

    const category3Card = screen
      .getByText("Category 3")
      .closest(".MuiCard-root");
    expect(category3Card).toBeInTheDocument();
    expect(within(category3Card).getByText("1 items")).toBeInTheDocument();
  });

  test('calls handleSelectCategory with null when "All Items" is clicked', () => {
    render(<MobileCategorySelector {...defaultProps} />);

    fireEvent.click(screen.getByText("All Items"));
    expect(defaultProps.handleSelectCategory).toHaveBeenCalledWith(null);
  });

  test("calls handleSelectCategory with category ID when a category card is clicked", () => {
    render(<MobileCategorySelector {...defaultProps} />);

    fireEvent.click(screen.getByText("Category 1"));
    expect(defaultProps.handleSelectCategory).toHaveBeenCalledWith("cat1");

    fireEvent.click(screen.getByText("Category 2"));
    expect(defaultProps.handleSelectCategory).toHaveBeenCalledWith("cat2");
  });

  test("applies correct styling to selected category", () => {
    const { rerender } = render(
      <MobileCategorySelector {...defaultProps} selectedCategory="cat2" />
    );

    const allItemsCard = screen
      .getByText("All Items")
      .closest("div.MuiCard-root");
    expect(allItemsCard).not.toHaveStyle("border-color: #8a2be2");

    const category2Card = screen
      .getByText("Category 2")
      .closest("div.MuiCard-root");
    expect(category2Card).toHaveStyle("border-color: #8a2be2");

    rerender(
      <MobileCategorySelector {...defaultProps} selectedCategory={null} />
    );

    expect(
      screen.getByText("All Items").closest("div.MuiCard-root")
    ).toHaveStyle("border-color: #8a2be2");
  });

  test("updates searchTerm when SearchBar input changes", () => {
    render(<MobileCategorySelector {...defaultProps} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(defaultProps.setSearchTerm).toHaveBeenCalledWith("test search");
  });

  test("updates sortBy when SortControl changes", () => {
    render(<MobileCategorySelector {...defaultProps} />);

    const sortSelect = screen.getByTestId("sort-select");
    fireEvent.change(sortSelect, { target: { value: "price" } });

    expect(defaultProps.setSortBy).toHaveBeenCalledWith("price");
  });

  test("handles empty categories array", () => {
    render(<MobileCategorySelector {...defaultProps} categories={[]} />);

    expect(screen.getByText("All Items")).toBeInTheDocument();
    expect(screen.queryByText("Category 1")).not.toBeInTheDocument();
  });

  test("handles empty menuItems array", () => {
    render(<MobileCategorySelector {...defaultProps} menuItems={[]} />);

    const allItemsCard = screen.getByText("All Items").closest(".MuiCard-root");
    expect(allItemsCard).toBeInTheDocument();
    expect(within(allItemsCard).getByText("0 items")).toBeInTheDocument();
  });
});
