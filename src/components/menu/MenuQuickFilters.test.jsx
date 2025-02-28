import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import MenuQuickFilters from "./MenuQuickFilters";

describe("MenuQuickFilters Component", () => {
  beforeEach(() => {
    render(<MenuQuickFilters />);
  });

  test("renders all three filter chips", () => {
    expect(screen.getByText("Popular")).toBeInTheDocument();
    expect(screen.getByText("Vegetarian")).toBeInTheDocument();
    expect(screen.getByText("Staff Picks")).toBeInTheDocument();
  });

  test("renders filter chips with correct tooltip information", () => {
    expect(screen.getByLabelText("Customer favorites")).toBeInTheDocument();
    expect(screen.getByLabelText("Vegetarian options")).toBeInTheDocument();
    expect(screen.getByLabelText("Staff recommendations")).toBeInTheDocument();
  });

  test("has clickable chips", () => {
    const chips = screen.getAllByRole("button");

    expect(chips).toHaveLength(3);

    chips.forEach((chip) => {
      expect(chip).toHaveAttribute("tabindex", "0");
    });
  });

  test("renders with correct icons", () => {
    const chips = screen.getAllByRole("button");

    chips.forEach((chip) => {
      const svg = chip.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  test("renders with correct layout styling", () => {
    const container = screen.getAllByRole("button")[0].parentElement;
    expect(container).toHaveClass("MuiBox-root");
    expect(container).toHaveClass("css-uxu2hh");
  });

  test("renders chips with correct initial styling", () => {
    const chips = screen.getAllByRole("button");

    chips.forEach((chip) => {
      expect(chip).toHaveClass("MuiChip-root");
      expect(chip).toHaveClass("MuiChip-filled");
      expect(chip).toHaveClass("MuiChip-clickable");
      expect(chip).toHaveStyle("color: rgb(255, 255, 255)");
      expect(chip).toHaveClass("css-wsocuf-MuiButtonBase-root-MuiChip-root");
    });
  });
});
