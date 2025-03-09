import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./AboutPage";
import Layout from "../components/Layout";

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div data-testid="mock-layout">{children}</div>,
}));

vi.mock("@mui/material", () => {
  const createComponent = (displayName, TestId = null) => {
    const Component = ({ children, ...props }) => {
      const testId = TestId || `mui-${displayName.toLowerCase()}`;
      return <div data-testid={testId}>{children}</div>;
    };
    Component.displayName = displayName;
    return Component;
  };

  const Typography = ({ children, variant, ...props }) => {
    return (
      <div data-testid={`mui-typography-${variant || "default"}`}>
        {children}
      </div>
    );
  };

  const Grid = ({ children, container, item, ...props }) => {
    return (
      <div
        data-testid="mui-grid"
        data-container={container ? "true" : "false"}
        data-item={item ? "true" : "false"}
      >
        {children}
      </div>
    );
  };

  return {
    Box: createComponent("Box"),
    Container: createComponent("Container"),
    Typography,
    Grid,
    Card: createComponent("Card"),
    CardContent: createComponent("CardContent"),
    CardMedia: createComponent("CardMedia"),
    Divider: () => <hr data-testid="mui-divider" />,
    Paper: createComponent("Paper"),
  };
});

describe("AboutPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<AboutPage />);
    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
  });

  it("displays the correct main heading", () => {
    render(<AboutPage />);

    const mainHeading = screen.getByText("About Merry Berry");
    expect(mainHeading).toBeInTheDocument();
  });

  it("displays the subheading with correct text", () => {
    render(<AboutPage />);

    const subheading = screen.getByText(
      "Fresh, healthy, and delicious smoothies & bowls made with love in Brisbane"
    );
    expect(subheading).toBeInTheDocument();
  });

  it("displays Our Story section", () => {
    render(<AboutPage />);

    const ourStoryHeading = screen.getByText("Our Story");
    expect(ourStoryHeading).toBeInTheDocument();

    const storyText = screen.getByText(/Founded in 2024 as a school project/);
    expect(storyText).toBeInTheDocument();
  });

  it("displays Our Mission section", () => {
    render(<AboutPage />);

    const missionHeading = screen.getByText("Our Mission");
    expect(missionHeading).toBeInTheDocument();

    const missionText = screen.getByText(
      /At Merry Berry, we're dedicated to serving the finest smoothies/
    );
    expect(missionText).toBeInTheDocument();
  });

  it("displays What Makes Us Different section with four cards", () => {
    render(<AboutPage />);

    const differenceHeading = screen.getByText("What Makes Us Different");
    expect(differenceHeading).toBeInTheDocument();

    const freshIngredients = screen.getByText("Fresh Ingredients");
    expect(freshIngredients).toBeInTheDocument();

    const customizableOptions = screen.getByText("Customizable Options");
    expect(customizableOptions).toBeInTheDocument();

    const sustainablePractices = screen.getByText("Sustainable Practices");
    expect(sustainablePractices).toBeInTheDocument();

    const communityFocus = screen.getByText("Community Focus");
    expect(communityFocus).toBeInTheDocument();
  });

  it("displays the Tech Stack section", () => {
    render(<AboutPage />);

    const projectHeading = screen.getByText("About This Project");
    expect(projectHeading).toBeInTheDocument();

    const techStackText = screen.getByText(
      /This website is a school project built with React 18.2/
    );
    expect(techStackText).toBeInTheDocument();
  });

  it("displays Visit Us section with correct hours and address", () => {
    render(<AboutPage />);

    const visitHeading = screen.getByText("Visit Us Today");
    expect(visitHeading).toBeInTheDocument();

    const hoursText = screen.getByText(/Monday - Friday: 8am - 8pm/);
    expect(hoursText).toBeInTheDocument();

    const addressText = screen.getByText(/123 Smoothie Lane/);
    expect(addressText).toBeInTheDocument();
  });
});
