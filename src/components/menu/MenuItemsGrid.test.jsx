import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import MenuItemsGrid from "./MenuItemsGrid";

vi.mock("../../components/menu-browsing/MenuItem", () => ({
  default: ({ item }) => (
    <div data-testid="menu-item" data-item-id={item._id}>
      {item.name}
    </div>
  ),
}));

vi.mock("./NoResultsFound", () => ({
  default: ({ clearFilters, isMobile }) => (
    <div data-testid="no-results-found" data-is-mobile={isMobile.toString()}>
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  ),
}));

describe("MenuItemsGrid Component", () => {
  const mockCategories = [
    { _id: "cat1", name: "Bowls" },
    { _id: "cat2", name: "Smoothies" },
  ];

  const mockItems = [
    { _id: "item1", name: "Acai Bowl", category: "cat1" },
    { _id: "item2", name: "Berry Smoothie", category: "cat2" },
    { _id: "item3", name: "Green Bowl", category: "cat1" },
  ];

  const defaultProps = {
    displayedItems: mockItems,
    selectedCategory: null,
    categories: mockCategories,
    searchTerm: "",
    setSearchTerm: vi.fn(),
    clearFilters: vi.fn(),
    isMobile: false,
  };

  test("renders correct heading when no category is selected", () => {
    render(<MenuItemsGrid {...defaultProps} />);

    expect(screen.getByText("All Menu Items")).toBeInTheDocument();
    expect(screen.getByText("(3 items)")).toBeInTheDocument();
  });

  test("renders correct heading when a category is selected", () => {
    render(<MenuItemsGrid {...defaultProps} selectedCategory="cat1" />);

    expect(screen.getByText("Bowls")).toBeInTheDocument();
    expect(screen.getByText("(3 items)")).toBeInTheDocument();
  });

  test("renders correct heading with mobile variant", () => {
    render(<MenuItemsGrid {...defaultProps} isMobile={true} />);

    expect(screen.getByText("All Menu Items")).toBeInTheDocument();
  });

  test("displays all menu items", () => {
    render(<MenuItemsGrid {...defaultProps} />);

    const menuItems = screen.getAllByTestId("menu-item");
    expect(menuItems).toHaveLength(3);

    expect(screen.getByText("Acai Bowl")).toBeInTheDocument();
    expect(screen.getByText("Berry Smoothie")).toBeInTheDocument();
    expect(screen.getByText("Green Bowl")).toBeInTheDocument();
  });

  test("shows search chip when searchTerm is provided", () => {
    const searchTerm = "bowl";
    render(<MenuItemsGrid {...defaultProps} searchTerm={searchTerm} />);

    expect(screen.getByText(`Search: "${searchTerm}"`)).toBeInTheDocument();
  });

  test("shows smaller search chip in mobile mode", () => {
    const searchTerm = "bowl";
    render(
      <MenuItemsGrid
        {...defaultProps}
        searchTerm={searchTerm}
        isMobile={true}
      />
    );

    expect(screen.getByText(`"${searchTerm}"`)).toBeInTheDocument();
  });

  test("calls setSearchTerm when search chip is deleted", () => {
    const searchTerm = "bowl";
    const setSearchTerm = vi.fn();

    render(
      <MenuItemsGrid
        {...defaultProps}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    );

    const closeButton = screen.getByTestId("CancelIcon");
    fireEvent.click(closeButton);

    expect(setSearchTerm).toHaveBeenCalledWith("");
  });

  test("does not render search chip when searchTerm is empty", () => {
    render(<MenuItemsGrid {...defaultProps} searchTerm="" />);

    expect(screen.queryByText(/Search:/)).not.toBeInTheDocument();
  });

  test("shows NoResultsFound component when no items are displayed", () => {
    render(<MenuItemsGrid {...defaultProps} displayedItems={[]} />);

    expect(screen.getByTestId("no-results-found")).toBeInTheDocument();
  });

  test("passes isMobile prop to NoResultsFound", () => {
    render(
      <MenuItemsGrid {...defaultProps} displayedItems={[]} isMobile={true} />
    );

    const noResults = screen.getByTestId("no-results-found");
    expect(noResults).toHaveAttribute("data-is-mobile", "true");
  });

  test("calls clearFilters when button in NoResultsFound is clicked", () => {
    const clearFilters = vi.fn();

    render(
      <MenuItemsGrid
        {...defaultProps}
        displayedItems={[]}
        clearFilters={clearFilters}
      />
    );

    const clearButton = screen.getByRole("button", { name: "Clear Filters" });
    fireEvent.click(clearButton);

    expect(clearFilters).toHaveBeenCalled();
  });

  test("displays fallback text when selectedCategory is invalid", () => {
    render(
      <MenuItemsGrid {...defaultProps} selectedCategory="non-existent-id" />
    );

    expect(screen.getByText("Category")).toBeInTheDocument();
  });
});
