import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AuthPage from "./AuthPage";
import * as firebaseUtils from "../utils/firebase";
import { ENV_CONFIG } from "../config";
import { act } from "react"; 

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../utils/firebase", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  handleGoogleSignIn: vi.fn(),
}));

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

vi.mock("../components/DebugPanel", () => ({
  default: () => <div data-testid="debug-panel"></div>,
}));

vi.mock("../components/EducatorNote", () => ({
  default: ({ children, ...props }) => (
    <div data-testid="educator-note" {...props}>
      {children}
    </div>
  ),
}));

vi.mock("react-google-button", () => ({
  default: (props) => (
    <button data-testid="google-button" onClick={props.onClick}>
      Sign in with Google
    </button>
  ),
}));

describe("AuthPage Component", () => {
  const mockAuthContext = {
    currentUser: null,
    loading: false,
  };

  const renderAuthPage = (variant = "signin") => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <AuthPage variant={variant} />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering Tests", () => {
    it("renders the signin variant correctly", () => {
      renderAuthPage("signin");

      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      const signInButton = screen.getByRole("button", { name: "Sign In" });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton.type).toBe("submit");

      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
      expect(screen.getByText("Forgot Password?")).toBeInTheDocument();

      expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Select your favorite items/i)
      ).not.toBeInTheDocument();
    });

    it("renders the signup variant correctly", () => {
      renderAuthPage("signup");


      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toHaveTextContent("Create Account");

      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      expect(screen.getByText("Sign In")).toBeInTheDocument();


      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Select your favorite items/i)
      ).toBeInTheDocument();


      expect(screen.queryByText("Forgot Password?")).not.toBeInTheDocument();
    });

    it("renders educator note in development environment", () => {

      const originalConfig = { ...ENV_CONFIG };
      ENV_CONFIG.isDevelopment = true;

      renderAuthPage("signin");

      expect(screen.getByTestId("educator-note")).toBeInTheDocument();
      expect(screen.getByText(/For testing purposes/i)).toBeInTheDocument();


      Object.assign(ENV_CONFIG, originalConfig);
    });

    it("does not render educator note in production environment", () => {

      const originalConfig = { ...ENV_CONFIG };
      ENV_CONFIG.isDevelopment = false;

      renderAuthPage("signin");

      expect(screen.queryByTestId("educator-note")).not.toBeInTheDocument();


      Object.assign(ENV_CONFIG, originalConfig);
    });
  });

  describe("Form Interaction Tests", () => {
    it("toggles password visibility when clicking the visibility icon", async () => {
      renderAuthPage("signin");


      const passwordField = screen
        .getAllByLabelText(/password/i)
        .find((el) => el.tagName === "INPUT");
      

      expect(passwordField.type).toBe("password");


      const visibilityToggle = screen.getByLabelText(
        /toggle password visibility/i
      );


      await act(async () => {
        fireEvent.click(visibilityToggle);
      });


      expect(passwordField.type).toBe("text");


      await act(async () => {
        fireEvent.click(visibilityToggle);
      });


      expect(passwordField.type).toBe("password");
    });

    it("handles favorite item selection in signup form", async () => {
      renderAuthPage("signup");


      const acaiBowlChip = screen.getByText("Classic Açaí Bowl");
      const berryBlastChip = screen.getByText("Berry Blast");


      await act(async () => {
        fireEvent.click(acaiBowlChip);
        fireEvent.click(berryBlastChip);
      });



    });
  });

  describe("Form Submission Tests", () => {
    it("calls signIn with correct credentials on signin form submission", async () => {

      firebaseUtils.signIn.mockResolvedValueOnce();
      
      renderAuthPage("signin");


      const emailField = screen.getByLabelText(/^Email Address/);
      const passwordField = screen
        .getAllByLabelText(/password/i)
        .find((el) => el.tagName === "INPUT");


      await act(async () => {
        fireEvent.change(emailField, { target: { value: "test@example.com" } });
        fireEvent.change(passwordField, { target: { value: "password123" } });
      });


      const form = document.querySelector('form');
      

      await act(async () => {
        fireEvent.submit(form);
      });
      

      await new Promise(resolve => setTimeout(resolve, 100));


      expect(firebaseUtils.signIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        expect.any(Function)
      );
    });

    it("calls signUp with correct data on signup form submission", async () => {

      firebaseUtils.signUp.mockResolvedValueOnce();
      
      renderAuthPage("signup");


      const nameField = screen.getByLabelText(/^Full Name/);
      const emailField = screen.getByLabelText(/^Email Address/);
      const passwordField = screen
        .getAllByLabelText(/password/i)
        .find((el) => el.tagName === "INPUT");


      await act(async () => {
        fireEvent.change(nameField, { target: { value: "Test User" } });
        fireEvent.change(emailField, { target: { value: "test@example.com" } });
        fireEvent.change(passwordField, { target: { value: "password123" } });
      });


      const berryBlastChip = screen.getByText("Berry Blast");


      await act(async () => {
        fireEvent.click(berryBlastChip);
      });


      const form = document.querySelector('form');
      

      await act(async () => {
        fireEvent.submit(form);
      });
      

      await new Promise(resolve => setTimeout(resolve, 100));


      expect(firebaseUtils.signUp).toHaveBeenCalled();
      

      expect(firebaseUtils.signUp.mock.calls[0][0]).toBe("test@example.com");
      expect(firebaseUtils.signUp.mock.calls[0][1]).toBe("password123");
      expect(firebaseUtils.signUp.mock.calls[0][3]).toBe("Test User");
      

      expect(firebaseUtils.signUp.mock.calls[0][4].favorites).toContain("Berry Blast");
    });

    it("handles Google sign-in button click", async () => {
      renderAuthPage("signin");

      const googleButton = screen.getByTestId("google-button");


      await act(async () => {
        fireEvent.click(googleButton);
      });


      expect(firebaseUtils.handleGoogleSignIn).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("displays error message when authentication fails", async () => {
      const errorMessage = "Invalid email or password";
      firebaseUtils.signIn.mockRejectedValueOnce({
        message: errorMessage,
      });

      renderAuthPage("signin");

      const emailField = screen.getByLabelText(/^Email Address/);
      const passwordField = screen
        .getAllByLabelText(/password/i)
        .find((el) => el.tagName === "INPUT");

      await act(async () => {
        fireEvent.change(emailField, { target: { value: "test@example.com" } });
        fireEvent.change(passwordField, {
          target: { value: "wrong-password" },
        });
      });

      const form = document.querySelector('form');
      
      await act(async () => {
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });
});