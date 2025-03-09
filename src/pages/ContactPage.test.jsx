import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContactPage from "./ContactPage";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div data-testid="mock-layout">{children}</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/contact" }),
    useNavigate: () => vi.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

const AllTheProviders = ({ children, snackbarOverrides = {} }) => {
  const mockAuthContext = {
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    checkAuthStatus: vi.fn(),
  };

  const mockSnackbarContext = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
    ...snackbarOverrides,
  };

  return (
    <AuthContext.Provider value={mockAuthContext}>
      <SnackbarContext.Provider value={mockSnackbarContext}>
        <BrowserRouter>{children}</BrowserRouter>
      </SnackbarContext.Provider>
    </AuthContext.Provider>
  );
};

const customRender = (ui, options = {}) => {
  const { snackbarOverrides, ...restOptions } = options;
  return render(ui, {
    wrapper: (props) => AllTheProviders({ ...props, snackbarOverrides }),
    ...restOptions,
  });
};

describe("ContactPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    customRender(<ContactPage />);

    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });

  it('renders "Contact Us" heading', () => {
    customRender(<ContactPage />);
    const headingElement = screen.getByRole("heading", {
      name: /Contact Us/i,
      level: 1,
    });
    expect(headingElement).toBeInTheDocument();
  });

  it("renders contact information sections", () => {
    customRender(<ContactPage />);
    expect(screen.getByText(/Get In Touch/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Smoothie Lane/i)).toBeInTheDocument();
    expect(screen.getByText(/Monday - Friday: 8am - 8pm/i)).toBeInTheDocument();
    expect(screen.getByText(/hello@merryberry.example/i)).toBeInTheDocument();
    expect(screen.getByText(/\(07\) 1234 5678/i)).toBeInTheDocument();
  });

  it("renders contact form", () => {
    customRender(<ContactPage />);
    expect(screen.getByText(/Send Us a Message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send Message/i })
    ).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    customRender(<ContactPage />);

    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Message is required/i)).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    customRender(<ContactPage />);

    await user.type(screen.getByLabelText(/Your Name/i), "Test User");
    await user.type(screen.getByLabelText(/Your Email/i), "not-an-email");
    await user.type(screen.getByLabelText(/Your Message/i), "Test message");

    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it("submits the form when all fields are valid", async () => {
    const mockShowSuccess = vi.fn();
    const user = userEvent.setup();

    customRender(<ContactPage />, {
      snackbarOverrides: { showSuccess: mockShowSuccess },
    });

    await user.type(screen.getByLabelText(/Your Name/i), "Test User");
    await user.type(screen.getByLabelText(/Your Email/i), "test@example.com");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "This is a test message"
    );

    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "Message sent successfully!"
      );
    });
  });

  it("resets the form after successful submission", async () => {
    const user = userEvent.setup();
    customRender(<ContactPage />);

    await user.type(screen.getByLabelText(/Your Name/i), "Test User");
    await user.type(screen.getByLabelText(/Your Email/i), "test@example.com");
    await user.type(
      screen.getByLabelText(/Your Message/i),
      "This is a test message"
    );

    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Your Name/i)).toHaveValue("");
      expect(screen.getByLabelText(/Your Email/i)).toHaveValue("");
      expect(screen.getByLabelText(/Your Message/i)).toHaveValue("");
    });
  });
});
