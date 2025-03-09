import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom");
  return {
    ...actual,
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props} data-testid="mock-link">
        {children}
      </a>
    ),
  };
});

vi.mock("react-icons/fa", () => ({
  FaHeart: () => <div data-testid="heart-icon">HeartIcon</div>,
  FaClock: () => <div data-testid="clock-icon">ClockIcon</div>,
  FaLeaf: () => <div data-testid="leaf-icon">LeafIcon</div>,
  FaArrowRight: () => <div data-testid="arrow-icon">ArrowIcon</div>,
  FaInfoCircle: () => <div data-testid="info-icon">InfoIcon</div>,
  FaMapMarkerAlt: () => <div data-testid="map-icon">MapIcon</div>,
}));

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div data-testid="mock-layout">{children}</div>,
}));

vi.mock("../components/menu-browsing/MenuItem", () => ({
  default: ({ item }) => (
    <div data-testid={`menu-item-${item?._id}`}>
      <h3>{item?.name}</h3>
      <p>{item?.description}</p>
      <p>${item?.price}</p>
    </div>
  ),
}));

vi.mock(
  new URL("../assets/logo.jpg", import.meta.url).href,
  () => "mocked-logo-path",
  { virtual: true }
);

import HomePage from "./HomePage";
import { MenuContext } from "../contexts/MenuContext";

const mockFeaturedItems = [
  {
    _id: "1",
    name: "Berry Blast",
    description: "Açai base with mixed berries and granola",
    price: 12.99,
    image: "berry-blast.jpg",
    category: "Signature Bowls",
  },
  {
    _id: "2",
    name: "Tropical Paradise",
    description: "Mango base with pineapple and coconut",
    price: 13.99,
    image: "tropical-paradise.jpg",
    category: "Signature Bowls",
  },
  {
    _id: "3",
    name: "Green Energy",
    description: "Spinach, kale, and avocado with spirulina",
    price: 14.99,
    image: "green-energy.jpg",
    category: "Signature Bowls",
  },
];

describe("HomePage Component", () => {
  const renderHomePage = (featuredItems = []) => {
    return render(
      <BrowserRouter>
        <MenuContext.Provider value={{ featuredItems }}>
          <HomePage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
  };

  describe("Hero Section", () => {
    beforeEach(() => {
      renderHomePage();
    });

    it("renders the site logo", () => {
      const logo = screen.getByAltText("Merry Berry Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", expect.stringContaining("logo"));
    });

    it("renders the main heading and subheading", () => {
      const mainHeading = screen.getByText("Craft Your Perfect Bowl");
      const subheading = screen.getByText(
        /Fresh ingredients, endless combinations/i
      );

      expect(mainHeading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
    });

    it('renders the "Start Your Order" button with correct link', () => {
      const startOrderButton = screen.getByText("Start Your Order");
      expect(startOrderButton).toBeInTheDocument();
      expect(startOrderButton.closest("a")).toHaveAttribute("href", "/menu");
    });

    it("renders the school project indicator", () => {
      const projectIndicator = screen.getByText("School Project");
      expect(projectIndicator).toBeInTheDocument();
    });
  });

  describe("Features Section", () => {
    beforeEach(() => {
      renderHomePage();
    });

    it("renders all three feature cards with correct headings", () => {
      const organicFeature = screen.getByText("100% Organic");
      const orderOnlineFeature = screen.getByText("Order Online");
      const customizableFeature = screen.getByText("Customizable");

      expect(organicFeature).toBeInTheDocument();
      expect(orderOnlineFeature).toBeInTheDocument();
      expect(customizableFeature).toBeInTheDocument();
    });

    it("renders feature descriptions accurately", () => {
      const organicDesc = screen.getByText(
        /locally sourced, fresh ingredients/i
      );
      const orderDesc = screen.getByText(/Skip the line by ordering ahead/i);
      const customDesc = screen.getByText(
        /Build your perfect bowl with our wide variety/i
      );

      expect(organicDesc).toBeInTheDocument();
      expect(orderDesc).toBeInTheDocument();
      expect(customDesc).toBeInTheDocument();
    });
  });

  describe("Featured Items Section", () => {
    it("renders section heading and description", () => {
      renderHomePage();

      const sectionHeading = screen.getByText("Most Popular Creations");
      const sectionDesc = screen.getByText(
        /Discover our customers' favorite bowls/i
      );

      expect(sectionHeading).toBeInTheDocument();
      expect(sectionDesc).toBeInTheDocument();
    });

    it("displays loading message when no featured items", () => {
      renderHomePage([]);

      const loadingMessage = screen.getByText("Loading featured items...");
      expect(loadingMessage).toBeInTheDocument();
    });

    it("renders menu items when featured items are provided", () => {
      renderHomePage(mockFeaturedItems);

      expect(
        screen.queryByText("Loading featured items...")
      ).not.toBeInTheDocument();

      mockFeaturedItems.forEach((item) => {
        const itemName = screen.getByText(item.name);
        expect(itemName).toBeInTheDocument();
      });
    });

    it('renders the "View Full Menu" button with correct link', () => {
      renderHomePage();

      const viewMenuButton = screen.getByText("View Full Menu");
      expect(viewMenuButton).toBeInTheDocument();
      expect(viewMenuButton.closest("a")).toHaveAttribute("href", "/menu");
    });
  });

  describe("Testimonials Section", () => {
    beforeEach(() => {
      renderHomePage();
    });

    it("renders the testimonials heading", () => {
      const testimonialHeading = screen.getByText("What Our Customers Say");
      expect(testimonialHeading).toBeInTheDocument();
    });

    it("displays all three customer testimonials", () => {
      const testimony1 = screen.getByText(/The açai bowl was incredible/i);
      const testimony2 = screen.getByText(
        /I love being able to customize my bowl/i
      );
      const testimony3 = screen.getByText(
        /The online ordering system is so convenient/i
      );

      expect(testimony1).toBeInTheDocument();
      expect(testimony2).toBeInTheDocument();
      expect(testimony3).toBeInTheDocument();
    });

    it("displays customer names with testimonials", () => {
      const customer1 = screen.getByText(/Sarah M/i);
      const customer2 = screen.getByText(/Michael T/i);
      const customer3 = screen.getByText(/Jessica L/i);

      expect(customer1).toBeInTheDocument();
      expect(customer2).toBeInTheDocument();
      expect(customer3).toBeInTheDocument();
    });
  });

  describe("Project Info Section", () => {
    beforeEach(() => {
      renderHomePage();
    });

    it("renders project information heading and content", () => {
      const projectHeading = screen.getByText("About This Project");
      const projectDesc = screen.getByText(
        /part of the Coder Academy curriculum/i
      );

      expect(projectHeading).toBeInTheDocument();
      expect(projectDesc).toBeInTheDocument();
    });

    it("displays demo location information", () => {
      const locationHeading = screen.getByText("Our Demo Location");
      const locationAddress = screen.getByText(/123 Smoothie Lane/i);
      const locationHours = screen.getByText(/Hours:/i);

      expect(locationHeading).toBeInTheDocument();
      expect(locationAddress).toBeInTheDocument();
      expect(locationHours).toBeInTheDocument();
    });
  });

  describe("Call to Action Section", () => {
    beforeEach(() => {
      renderHomePage();
    });

    it("renders CTA heading and description", () => {
      const ctaHeading = screen.getByText("Ready to Try Merry Berry?");
      const ctaDesc = screen.getByText(/Experience our demo ordering system/i);

      expect(ctaHeading).toBeInTheDocument();
      expect(ctaDesc).toBeInTheDocument();
    });

    it('renders the "Order Now" button with correct link', () => {
      const orderNowButton = screen.getByText("Order Now");
      expect(orderNowButton).toBeInTheDocument();
      expect(orderNowButton.closest("a")).toHaveAttribute("href", "/menu");
    });
  });
});
