import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategorySidebar from "./CategorySidebar";

describe("CategorySidebar", () => {
  const mockCategories = [
    { _id: "1", name: "Bowls" },
    { _id: "2", name: "Smoothies" },
  ];

  const mockMenuItems = [
    { _id: "1", name: "Item 1", category: "1" },
    { _id: "2", name: "Item 2", category: "1" },
    { _id: "3", name: "Item 3", category: "2" },
  ];

  const defaultProps = {
    selectedCategory: null,
    handleSelectCategory: vi.fn(),
    menuItems: mockMenuItems,
    categories: mockCategories,
    sortBy: "default",
    setSortBy: vi.fn(),
  };

  it('renders all categories including "All Items"', () => {
    render(<CategorySidebar {...defaultProps} />);

    expect(screen.getByText("All Items")).toBeInTheDocument();
    expect(screen.getByText("Bowls")).toBeInTheDocument();
    expect(screen.getByText("Smoothies")).toBeInTheDocument();
  });

  it("displays correct item counts for each category", () => {
    render(<CategorySidebar {...defaultProps} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls handleSelectCategory when clicking on a category", () => {
    render(<CategorySidebar {...defaultProps} />);

    fireEvent.click(screen.getByText("Bowls"));
    expect(defaultProps.handleSelectCategory).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByText("All Items"));
    expect(defaultProps.handleSelectCategory).toHaveBeenCalledWith(null);
  });

  it("highlights selected category", () => {
    const selectedProps = {
      ...defaultProps,
      selectedCategory: "1",
    };

    render(<CategorySidebar {...selectedProps} />);

    const selectedButton = screen
      .getByText("Bowls")
      .closest('div[role="button"]');
    expect(selectedButton).toHaveClass("Mui-selected");
  });

  it("renders sort control component", () => {
    render(<CategorySidebar {...defaultProps} />);

    expect(screen.getByText("Sort Options")).toBeInTheDocument();
  });

  it("renders footer text", () => {
    render(<CategorySidebar {...defaultProps} />);

    expect(
      screen.getByText(
        /This menu is part of a school project for Coder Academy./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/All items are for demonstration purposes only./i)
    ).toBeInTheDocument();
  });
});
