import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import MenuPageHeader from "./MenuPageHeader";

vi.mock("./SearchBar", () => ({
  default: ({ searchTerm, setSearchTerm, variant }) => (
    <div data-testid="search-bar" data-variant={variant}>
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  ),
}));

vi.mock("./MenuQuickFilters", () => ({
  default: () => <div data-testid="menu-quick-filters">Quick Filters</div>,
}));

describe("MenuPageHeader Component", () => {
  const defaultProps = {
    searchTerm: "",
    setSearchTerm: vi.fn(),
    isDesktop: false,
  };

  test("renders component with correct title and subtitle", () => {
    render(<MenuPageHeader {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: "Our Menu" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Explore our delicious selection of freshly crafted items"
      )
    ).toBeInTheDocument();
  });

  test("does not render SearchBar when isDesktop is false", () => {
    render(<MenuPageHeader {...defaultProps} />);

    expect(screen.queryByTestId("search-bar")).not.toBeInTheDocument();
  });

  test("renders SearchBar when isDesktop is true", () => {
    render(<MenuPageHeader {...defaultProps} isDesktop={true} />);

    const searchBar = screen.getByTestId("search-bar");
    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toHaveAttribute("data-variant", "banner");
  });

  test("always renders MenuQuickFilters", () => {
    render(<MenuPageHeader {...defaultProps} />);
    expect(screen.getByTestId("menu-quick-filters")).toBeInTheDocument();
  });

  test("passes correct props to SearchBar", () => {
    const searchTerm = "test search";
    const setSearchTerm = vi.fn();

    render(
      <MenuPageHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isDesktop={true}
      />
    );

    const searchInput = screen.getByTestId("search-input");

    expect(searchInput).toHaveValue(searchTerm);
  });

  test("contains correct styling for mobile and desktop", () => {
    const { rerender } = render(<MenuPageHeader {...defaultProps} />);
    const header = screen
      .getByRole("heading", { name: "Our Menu" })
      .closest("div.MuiBox-root");

    expect(header).toBeInTheDocument();
    expect(header.parentElement.parentElement).toHaveClass("MuiBox-root");
    rerender(<MenuPageHeader {...defaultProps} isDesktop={true} />);
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });
});
