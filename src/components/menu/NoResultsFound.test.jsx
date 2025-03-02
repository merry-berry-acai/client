import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NoResultsFound from "./NoResultsFound";

describe("NoResultsFound", () => {
  it("renders no results message", () => {
    render(<NoResultsFound />);
    expect(screen.getByText(/no items found/i)).toBeInTheDocument();
  });

  it("calls clearFilters when button is clicked", () => {
    const mockClearFilters = vi.fn();
    render(<NoResultsFound clearFilters={mockClearFilters} />);

    const button = screen.getByRole("button", { name: /clear filters/i });
    fireEvent.click(button);

    expect(mockClearFilters).toHaveBeenCalled();
  });
});
