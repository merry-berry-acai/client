import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { AuthContext } from "../contexts/AuthContext";
import StatusPage from "./StatusPage";

vi.mock("../hooks/useApiStatus", () => ({
  default: () => ({
    isUp: true,
    responseTime: 100,
    lastChecked: new Date().toISOString(),
    error: null,
    history: [
      {
        isUp: true,
        responseTime: 100,
        lastChecked: new Date().toISOString(),
      },
    ],
    isLoading: false,
    refresh: vi.fn(),
  }),
}));

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div data-testid="mock-layout">{children}</div>,
}));

const mockAuthContextValue = {
  isAuthenticated: true,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
};

const TestWrapper = ({ children }) => {
  const theme = createTheme();

  return (
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={mockAuthContextValue}>
          {children}
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe("StatusPage", () => {
  it("renders without errors", () => {
    render(<StatusPage />, { wrapper: TestWrapper });
  });

  it('renders "System Status" heading', () => {
    render(<StatusPage />, { wrapper: TestWrapper });
    const headingElement = screen.getByRole("heading", {
      name: /System Status/i,
    });
    expect(headingElement).toBeInTheDocument();
  });

  it("renders API status section", () => {
    render(<StatusPage />, { wrapper: TestWrapper });
    const apiStatusText = screen.getByText(/API Status:/i);
    expect(apiStatusText).toBeInTheDocument();
  });

  it("renders refresh button", () => {
    render(<StatusPage />, { wrapper: TestWrapper });
    const refreshButton = screen.getByRole("button", { name: /Refresh/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it("calls refresh function when refresh button is clicked", () => {
    render(<StatusPage />, { wrapper: TestWrapper });
    const refreshButton = screen.getByRole("button", { name: /Refresh/i });

    fireEvent.click(refreshButton);
  });
});
