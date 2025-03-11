import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  const mockSetSearchTerm = vi.fn();

  beforeEach(() => {
    mockSetSearchTerm.mockClear();
  });

  it("renders with default variant correctly", () => {
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const searchInput = screen.getByPlaceholderText("Search menu items...");
    expect(searchInput).toBeInTheDocument();

    const searchIcon = document.querySelector("svg");
    expect(searchIcon).toBeInTheDocument();
  });

  it("renders with banner variant correctly", () => {
    render(
      <SearchBar
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        variant="banner"
      />
    );

    const searchInput = screen.getByPlaceholderText(
      "Search for items by name or ingredients..."
    );
    expect(searchInput).toBeInTheDocument();
  });

  it("displays the current search term", () => {
    const testSearchTerm = "pizza";
    render(
      <SearchBar
        searchTerm={testSearchTerm}
        setSearchTerm={mockSetSearchTerm}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search menu items...");
    expect(searchInput).toHaveValue(testSearchTerm);
  });

  it("calls setSearchTerm when input changes", () => {
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const searchInput = screen.getByPlaceholderText("Search menu items...");
    fireEvent.change(searchInput, { target: { value: "burger" } });

    expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
    expect(mockSetSearchTerm).toHaveBeenCalledWith("burger");
  });

  it("applies correct styling for default variant", () => {
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const inputElement = screen.getByPlaceholderText("Search menu items...");
    expect(inputElement.closest(".MuiInputBase-root")).toHaveClass(
      "MuiInputBase-sizeSmall"
    );

    expect(inputElement).toHaveAttribute("placeholder", "Search menu items...");
  });

  it("applies correct styling for banner variant", () => {
    render(
      <SearchBar
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        variant="banner"
      />
    );

    const inputElement = screen.getByPlaceholderText(
      "Search for items by name or ingredients..."
    );
    expect(inputElement.closest(".MuiInputBase-root")).not.toHaveClass(
      "MuiInputBase-sizeSmall"
    );

    expect(inputElement).toHaveAttribute(
      "placeholder",
      "Search for items by name or ingredients..."
    );
  });
});
