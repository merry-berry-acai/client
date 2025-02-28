import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortControl from "./SortControl";

describe("SortControl Component", () => {
  const mockSetSortBy = vi.fn();

  beforeEach(() => {
    mockSetSortBy.mockClear();
  });

  it("renders with correct heading", () => {
    render(<SortControl sortBy="default" setSortBy={mockSetSortBy} />);

    const heading = screen.getByText("Sort Options");
    expect(heading).toBeInTheDocument();
  });

  it("renders with the select component", () => {
    render(<SortControl sortBy="default" setSortBy={mockSetSortBy} />);

    const selectLabels = screen.getAllByText("Sort By");
    expect(selectLabels.length).toBeGreaterThan(0);

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
  });

  it("has the correct MaterialUI classes", () => {
    render(<SortControl sortBy="default" setSortBy={mockSetSortBy} />);

    const formControl = document.querySelector(".MuiFormControl-root");
    expect(formControl).toBeInTheDocument();

    const inputBase = document.querySelector(".MuiInputBase-root");
    expect(inputBase).toBeInTheDocument();
    expect(inputBase).toHaveClass("MuiOutlinedInput-root");
    expect(inputBase).toHaveClass("MuiInputBase-sizeSmall");
  });

  it("renders dropdown icon", () => {
    render(<SortControl sortBy="default" setSortBy={mockSetSortBy} />);

    const dropdownIcon = document.querySelector(
      '[data-testid="ArrowDropDownIcon"]'
    );
    expect(dropdownIcon).toBeInTheDocument();
  });

  it("displays the selected sort option", () => {
    render(<SortControl sortBy="price-high" setSortBy={mockSetSortBy} />);

    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveTextContent("Price: High to Low");
  });

  it("calls setSortBy when a new option is selected", () => {
    render(<SortControl sortBy="default" setSortBy={mockSetSortBy} />);

    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    const option = screen.getByText("Price: Low to High");
    fireEvent.click(option);

    expect(mockSetSortBy).toHaveBeenCalledWith("price-low");
  });
});
