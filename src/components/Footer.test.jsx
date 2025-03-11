import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it("renders company name in footer", () => {
    renderWithRouter(<Footer />);
    expect(
      screen.getByRole("heading", { name: /merry berry/i })
    ).toBeInTheDocument();
  });

  it("renders copyright information", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(/© 2025/i)).toBeInTheDocument();
  });
});
