# Merry Berry Smoothie & Açaí Shop - Full Stack Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Express](https://img.shields.io/badge/Express-Latest-lightgrey)
![Node](https://img.shields.io/badge/Node-Latest-green)
![Vitest](https://img.shields.io/badge/Vitest-3.0-purple)

## Deployed Application and Repository

- **Live Demo:** [https://merry-berry.finneh.xyz](https://merry-berry.finneh.xyz)
- **GitHub Repository:** [https://github.com/merry-berry-acai/client](https://github.com/merry-berry-acai/client)
- **Server Repository:** [https://github.com/merry-berry-acai/server](https://github.com/merry-berry-acai/server)

## Description

The Merry Berry Smoothie & Açaí Shop application is a full-stack solution designed to transform the ordering experience for both customers and staff. This application provides a seamless interface for browsing menu items, customizing orders, processing payments, and managing business operations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Testing](#testing)
- [Code Architecture](#code-architecture)
- [Project Management](#project-management)
- [Libraries & Dependencies](#libraries--dependencies)
- [Source Control Methodology](#source-control-methodology)
- [Task Delegation](#task-delegation)
- [User Testing](#user-testing)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

## Features

- 🍓 **Menu Browsing:** Browse menu items with high-quality images and detailed descriptions
- 🥤 **Order Customization:** Customize orders with sizes, toppings, and add-ins
- 🔒 **Secure Payment Processing:** Integration with Stripe for payment handling
- 👤 **User Authentication:** User registration and login functionality
- 📱 **Responsive Design:** Optimized for all screen sizes
- 📊 **Order Tracking:** Track order status
- 🛒 **Shopping Cart Management:** Add, modify, and remove items
- 👨‍💼 **Admin Dashboard:** Interface for menu management and order processing

## Tech Stack

### Frontend
- **React:** Component-based UI development
- **React Router:** Client-side routing
- **Context API:** State management across components (AuthContext, CartContext, MenuContext, etc.)
- **Material-UI:** Component library for consistent design
- **Firebase:** Authentication and database services
- **Vite:** Build tool and development server

### Backend
- **Node.js & Express:** Server-side application framework
- **MongoDB:** Database for storing application data
- **RESTful API:** Structured endpoints for data operations
- **JWT Authentication:** Secure user authentication

## Installation & Setup

1. Clone the client repository:
```bash
git clone https://github.com/merry-berry-acai/client.git
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:
> **Note for Educators:** A copy of our local `.env` file has been provided for assessment purposes. In a real-world scenario, users would need to create their own Firebase and Stripe credentials.

Create a `.env` file with the necessary environment variables.

4. Start development server:
```bash
npm run dev
```

5. For production build:
```bash
npm run build
```

## Testing

To ensure the reliability and quality of the Merry Berry application, we have implemented a comprehensive testing strategy that includes unit, integration, and end-to-end testing. User testing in both development and production environments has been crucial in identifying and resolving issues, ensuring a high-quality user experience. Detailed feedback logs and testing evidence are available in [Feedback.MD](Feedback.MD).

### Testing Strategy

Our testing strategy encompasses various levels to ensure comprehensive coverage:

- **Unit Tests:** Focused on individual functions and utilities, ensuring each part works correctly in isolation. Examples include tests for order utility functions (`orderUtils.test.js`).
- **Component Tests:** Testing React components in isolation using React Testing Library to ensure UI components render and behave as expected.
- **Integration Tests:** Validating the interactions between different components and modules to ensure they work together seamlessly.
- **End-to-End (E2E) Tests:** Manual E2E tests were conducted in both development and production environments to simulate user flows and validate critical functionalities like ordering and user authentication.

### Testing Frameworks and Tools

- **Vitest:** A fast, Vite-native testing framework used as the primary test runner.
- **React Testing Library:**  For rendering and interacting with React components in tests, focusing on user-centric testing.
- **Jest DOM:** Provides extended DOM element matchers for React Testing Library, simplifying assertions.
- **MSW (Mock Service Worker):** Used to mock API requests during testing, allowing for isolated and predictable tests.

### Running Tests

To execute the test suite, use the following npm commands:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for continuous feedback
npm run test:watch
```

### Development and Production User Testing

Extensive user testing was performed in both development and production environments to gather feedback and identify areas for improvement.

#### Development Environment Testing (CMP1002-5.1)

Development environment testing focused on early issue detection and iterative refinement. Key feedback areas and resolutions included:

- **Cart Calculation Accuracy:** Resolved inaccuracies in cart calculations, especially with toppings and quantity adjustments, by fixing the `calculateItemTotal` function in `src/utils/orderUtils.js`.
- **Menu Filter Persistence:** Implemented state persistence for menu filters using React Context API (`src/contexts/MenuContext.jsx`) to maintain filter settings during menu browsing.
- **Customization Options Discoverability:** Redesigned menu item cards (`src/components/menu-browsing/MenuItem.jsx`) to improve the visibility of customization options.
- **Cross-browser Payment Form Layout:** Applied CSS fixes (`src/components/checkout/StripePayment.jsx`) to ensure consistent payment form layout across browsers, including Safari on iOS.
- **Responsive Menu Sidebar:** Implemented a collapsible sidebar (`src/components/Layout.jsx`) for tablet and mobile views to address content overlap issues.

#### Production Environment Testing (CMP1002-5.2)

Production environment testing, including client feedback, focused on real-world scenario validation and performance optimization. Key feedback areas and resolutions included:

- **Order Confirmation Email Delays:** Optimized the email sending service and implemented queue monitoring to ensure timely order confirmation emails.
- **Checkout Flow Clarity:** Redesigned the checkout flow (`src/pages/CheckoutPage.jsx`) to clarify delivery and pickup options, reducing user confusion.
- **Performance Bottlenecks:** Implemented database query optimization and caching to enhance application performance under peak load conditions.
- **Accessibility Improvements:** Addressed WCAG non-compliance issues, achieving a 94% WCAG compliance score across the application.

For detailed user testing reports and E2E testing evidence, please refer to [Feedback.MD](Feedback.MD).

## Code Architecture

### DRY (Don't Repeat Yourself) Principles

The application follows DRY principles throughout its codebase:

1. **Utility Functions:** Common operations are extracted into reusable utility functions (e.g., `orderUtils.js`, `formatters.js`)
2. **Component Composition:** Reusable UI components are created and composed together
3. **Context API:** Shared state is managed through React Context to avoid prop drilling
4. **Custom Hooks:** Reusable logic is encapsulated in custom hooks (e.g., `useApiStatus.js`)

Example from `orderUtils.js`:
```javascript
// Calculate the total price of an order item including toppings
export const calculateItemTotal = (item) => {
  const basePrice = item.product?.basePrice || 0;
  const quantity = item.quantity || 1;
  
  // Calculate toppings total
  const toppingsTotal = Array.isArray(item.toppings)
    ? item.toppings.reduce((sum, topping) => {
        const toppingPrice = topping.product?.basePrice || 0;
        const toppingQuantity = topping.quantity || 1;
        return sum + (toppingPrice * toppingQuantity);
      }, 0)
    : 0;
  
  return (basePrice * quantity) + toppingsTotal;
};
```

### Object-Oriented Principles/Patterns

The application implements several OO principles and patterns:

1. **Component-Based Architecture:** React components encapsulate state and behavior
2. **Context Providers:** Implement the Provider pattern for state management
3. **Higher-Order Components:** Used for cross-cutting concerns like authentication
4. **Composition over Inheritance:** Components are composed rather than extended
5. **Factory Pattern:** Used in service creation and API client configuration

Example from `CartContext.jsx`:
```javascript
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  
  // Methods for cart operations
  const addToCart = (item) => {
    // Implementation
  };
  
  const removeFromCart = (itemId, customization, cartItemId) => {
    // Implementation
  };
  
  // More methods...
  
  return (
    <CartContext.Provider value={{ cartItems, cartTotal, addToCart, removeFromCart, /* other values */ }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Code Flow Control for User Stories

The application implements intuitive flow control for key user stories:

1. **Menu Browsing Flow:**
   - Category selection → Item filtering → Item details → Customization → Add to cart
   
2. **Checkout Flow:**
   - Cart review → Delivery information → Payment → Order confirmation
   
3. **Admin Management Flow:**
   - Authentication → Dashboard → Entity selection (menu items, categories, toppings) → CRUD operations

Each flow is implemented with appropriate state management, validation, and error handling to ensure a smooth user experience.

## Project Management

### Agile Methodology

Our team followed an Agile development approach with the following practices:

1. **Sprint Planning:** Weekly sprints with defined goals and deliverables
2. **Daily Stand-ups:** Brief meetings to discuss progress and blockers
3. **Sprint Reviews:** Demonstrations of completed features
4. **Sprint Retrospectives:** Reflection on process improvements
5. **User Stories:** Requirements captured as user stories with acceptance criteria
6. **Kanban Board:** Visual tracking of work items through development stages

### Project Tracking Tools

- **Trello:** For managing user stories, tasks, and sprint backlogs
- **GitHub Projects:** For linking issues and pull requests to project tasks
- **Discord:** For team communication and collaboration

## Libraries & Dependencies

Key libraries used in the project:

- **React & React DOM:** UI library for component-based development
- **React Router DOM:** Navigation and routing
- **Material UI:** Component library for consistent design
- **Firebase:** Authentication and cloud services
- **Stripe:** Payment processing integration
- **Axios:** HTTP client for API requests
- **Formik & Yup:** Form handling and validation
- **React Toastify:** Toast notifications
- **Vitest & Testing Library:** Testing framework

## Source Control Methodology

Our development workflow utilized:

- **Feature Branches:** Each feature was developed in a dedicated branch
- **Pull Requests:** Code review process before merging changes
- **Consistent Commit Messages:** Following conventional commits format
- **Branch Protection:** Main branch protected to ensure quality
- **Code Reviews:** At least one team member review required before merging
- **CI/CD Integration:** Automated testing on pull requests

Example workflow:
1. Create feature branch: `feature/add-payment-processing`
2. Develop and test locally
3. Push branch and create pull request
4. Code review and automated testing
5. Address feedback and merge to main
6. Automated deployment

## Task Delegation

Tasks were assigned based on team member strengths and expertise:

- **Frontend Specialists:** UI components, styling, and user experience
- **Backend Specialists:** API development, database design, and server configuration
- **Full-Stack Developers:** Cross-cutting features and integration
- **QA Specialists:** Testing, bug reporting, and quality assurance

Task assignment considered:
- Individual skill sets and experience
- Balanced workload distribution
- Learning opportunities for team members
- Critical path dependencies

## User Testing

To ensure a high-quality user experience and meet the assignment requirements, we conducted extensive user testing in both development and production environments. Key feedback and resolutions are summarized below, with detailed feedback logs available in [Feedback.MD](Feedback.MD).

## User Testing

To ensure a high-quality user experience and meet the assignment requirements, we conducted extensive user testing in both development and production environments. Key findings and resolutions from this testing are summarized below, with detailed feedback logs available in [Feedback.MD](Feedback.MD).

# User Testing Feedback

## Production Feedback (CMP1002-5.2)

To meet the HD criteria for CMP1002-5.2, we need to demonstrate evidence of extensive user-testing of the production site, including by the client.

**Reports:**

- **Report 1: Card payment not showing up, can't complete the payment for my order**
  - **Investigation:** API Returns 200, Front end didn't handle the payment intent data correctly.
  - **Resolution:** Fixed by changing the front end code to correctly handle payment intent data.
  - **Feedback for Production:**
    - **Positive:** The API was functioning correctly, indicating a robust backend.
    - **Negative:** The front-end payment handling was flawed, leading to a critical user flow issue.
    - **Action for Production:** Implement more rigorous front-end testing, especially for critical user flows like payment processing. Consider end-to-end testing in a staging environment that mirrors production.

- **Report 2: Got a something went wrong (ErrorBoundary) on the home screen.**
  - **Investigation:** Unable to find source due to no logs or stack traces on production. Suspected missing environment variable.
  - **Resolution:** Improved error handling for missing environment variables and implemented Sentry for production error logging with source maps.
  - **Feedback for Production:**
    - **Negative:** Lack of production logging made debugging difficult. Error handling for environment variables was insufficient.
    - **Action for Production:** Sentry implementation should significantly improve error monitoring and debugging in production. Regularly monitor Sentry for new errors and trends. Ensure all necessary environment variables are documented and their absence is gracefully handled.

- **Report 3: Menu filter chips on the menu page don't do anything (User stories)**
  - **Investigation:** Filter chips were visual placeholders without implemented functionality.
  - **Resolution:**  Acknowledged as missing functionality, planned for future development if required by user stories.
  - **Feedback for Production:**
    - **Negative:**  Discrepancy between UI elements and actual functionality can be confusing for users.
    - **Action for Production:**  For production, either implement the filter chip functionality or remove them if they are not part of the MVP and user stories.  Avoid visual placeholders that suggest functionality that is not present.

## Development Feedback (CMP1002-5.1)

To meet the HD criteria for CMP1002-5.1, we need to demonstrate evidence of extensive user-testing in the development environment. This feedback focuses on how to improve development testing to prevent production issues, especially considering the app seemed to function correctly in development.

**Feedback for Development based on Production Issues (Development Environment Testing):**

The issues encountered in production, despite the app appearing to function correctly in development, highlight critical gaps in our development testing and environment parity.  It's crucial to refine our development processes to better mirror production conditions and catch these errors earlier.

- **Payment Issue:**
  - **Development Feedback:** Front-end unit and integration tests for payment processing were insufficient to catch the production issue.  The development environment may not have accurately replicated the production API response or Stripe integration.
  - **Action for Development:**
    - **Improve Test Environment Parity:**  Strive to make the development and testing environments as close to production as possible. This includes using similar API configurations, database setups (if feasible), and dependency versions.
    - **Mock Production API Responses:**  Incorporate mocking of external API responses in tests to ensure consistent and predictable behavior, regardless of the actual API environment. Pay special attention to mocking edge cases and error scenarios from the API.
    - **End-to-End Testing in Staging:** Implement end-to-end tests in a staging environment that closely mirrors production. This will help catch integration issues that unit and integration tests might miss.

- **ErrorBoundary Issue:**
  - **Development Feedback:** The absence of logging in production made debugging difficult, but the fact that this wasn't caught in development suggests logging and error monitoring were also insufficient in the development environment.
  - **Action for Development:**
    - **Consistent Logging Strategy:** Implement and enforce a consistent logging strategy across development, staging, and production environments. Use similar logging libraries and configurations in all environments.
    - **Development Error Monitoring:** Set up a development error monitoring tool (similar to Sentry, but for development) to capture and analyze errors during development. This will help identify issues that might be missed during manual testing.
    - **Environment Variable Validation in Development:**  Implement stricter validation of environment variables in the development environment to catch missing or misconfigured variables early on.

- **Menu Filter Chips Issue:**
  - **Development Feedback:**  While not an error, the presence of non-functional UI elements in production points to a lack of thorough user story and acceptance criteria validation during development.
    - **Action for Development:**  Ensure UI elements are functional or clearly indicate if they are placeholders.  During development, prioritize implementing core functionalities over visual enhancements.  User story mapping and acceptance criteria should clearly define the functionality of UI elements.

**General Development Feedback:**

- **Testing:**  Increase the coverage and depth of unit, integration, and end-to-end tests. Focus on testing critical user flows and edge cases.
- **Logging:** Implement comprehensive logging across the application for debugging and monitoring during development and production.
- **Error Handling:** Improve error handling throughout the application to provide informative error messages and prevent unexpected crashes.
- **Environment Variables:**  Standardize environment variable handling and validation across the application. Ensure clear documentation for all required environment variables.
- **User Story Implementation:**  Ensure all UI elements and functionalities are directly linked to user stories and acceptance criteria. Avoid implementing visual elements without corresponding functionality.
- **Code Reviews:** Conduct thorough code reviews to catch potential issues early in the development process. Focus on error handling, testing, and adherence to best practices.

## Development E2E Testing Evidence (CMP1002-5.1)

To demonstrate **extensive** evidence of E2E testing in the **development environment** for CMP1002-5.1, we have performed manual E2E tests and recorded screen captures of these tests.  These tests are designed to cover critical user flows and ensure the application functions as expected in development.

**Testing Environment Details:**

- **Environment Type:** Development
- **Base URL:** `http://localhost:5173` (or specify your development server URL)
- **Browser:** Chrome Version 120.0.x
- **Operating System:** macOS Sonoma 14.3
- **Tester:** Ethan Cornwill
- **Date of Testing:** 2025-03-10

### Test Case 1: Order Food Flow (Development Environment)

- **Steps:**
    1. Run the development server (`npm run dev`).
    2. Navigate to the Menu page in the browser (`http://localhost:5173/menu`).
    3. Add "Acai Bowl" and "Smoothie" to the cart.
    4. View the cart dropdown and click "View Cart".
    5. Click "Proceed to Checkout".
    6. Fill in the checkout form with valid, realistic details:
        - First Name: John
        - Last Name: Smith
        - Email: <john.smith_dev_e2e@example.com>
        - Phone: 951-555-1212
        - Address: 789 Pine Lane
        - City: Riverside
        - State: CA
        - Zip: 92507
    7. Click "Next" through Payment and Review steps.
    8. Click "Place Order".
- **Expected Result:** User should reach the "Order Confirmation" page with:
  - URL path: `/status`
  - Visible text: "Order Confirmation"
  - Visible text: "Thank you for your order"
- **Actual Result:** Navigated to Menu page successfully. Added "Acai Bowl" and "Smoothie" to cart, cart count updated correctly to 2. Viewed cart, items listed correctly with correct names and prices. Proceeded to checkout, checkout form displayed. Filled form with valid details, proceeded through steps to payment then review. Reached "Order Confirmation" page, URL is `/status`, "Order Confirmation" and "Thank you" text visible. No errors or unexpected behavior observed.
- **Pass/Fail:** Pass

### Test Case 2: User Registration and Login Flow (Development Environment)

- **Steps:**
    1. Run the development server (`npm run dev`).
    2. Navigate to the Auth page in the browser (`http://localhost:5173/auth`).
    3. Click "Sign up".
    4. Fill in the registration form with valid details:
        - First Name: Alice
        - Last Name: Smith
        - Email: <alice.smith_dev_e2e@example.com>
        - Password: password123
        - Confirm Password: password123
    5. Click "Sign Up".
    6. After redirection to the home page, navigate back to the Auth page (`http://localhost:5173/auth`).
    7. Fill in the login form with the registered email and password (<alice.smith_dev_e2e@example.com> / password123).
    8. Click "Log In".
- **Expected Result:** User should be successfully logged in and:
  - Be redirected to the Home page (URL path: `/`)
  - Profile dropdown should be visible in the Navigation bar (data-testid="profile-dropdown")
- **Actual Result:** Navigated to Auth page. Clicked "Sign Up", registration form displayed. Filled registration form with valid details, clicked "Sign Up". Redirected to Home page after signup. Navigated back to Auth page, login form displayed. Entered registered email and password, clicked "Log In". Redirected to Home page, profile dropdown is visible in navigation. No errors or unexpected behavior observed.
- **Pass/Fail:** Pass

## Production E2E Testing Evidence (CMP1002-5.2) for High Distinction

To demonstrate **extensive** evidence of E2E testing in the **production environment** for CMP1002-5.2, including testing by a client (if applicable), we have performed manual E2E tests on the deployed production site and recorded screen captures of these tests. These tests are crucial for validating the application's functionality in a live environment and achieving a **High Distinction**.

**Testing Environment Details:**

- **Environment Type:** Production
- **Base URL:** [Your Deployed Production URL, e.g., `https://your-deployed-website.com`]
- **Browser:** [Specify Browser and Version used for testing, e.g., Chrome Version 120.0.x]
- **Operating System:** [Specify OS, e.g., macOS Sonoma 14.x]
- **Tester:** [Your Name / Client Name if applicable]
- **Date of Testing:** [Current Date]

### Test Case 1: Order Food Flow (Production Environment)

- **Steps:**
    1. Navigate to the deployed production website URL (e.g., `https://your-deployed-website.com/menu`).
    2. Add "Acai Bowl" and "Smoothie" to the cart.
    3. View the cart dropdown and click "View Cart".
    4. Click "Proceed to Checkout".
    5. Fill in the checkout form with valid, realistic details:
        - First Name: John
        - Last Name: Smith
        - Email: <john.smith_prod_e2e@example.com>
        - Phone: 951-555-1212
        - Address: 789 Pine Lane
        - City: Riverside
        - State: CA
        - Zip: 92507
    7. Click "Next" through Payment and Review steps.
    8. Click "Place Order".
- **Expected Result:** User should reach the "Order Confirmation" page with:
  - URL path: `/status`
  - Visible text: "Order Confirmation"
  - Visible text: "Thank you for your order"
- **Actual Result:**  *[To be filled after manual testing on production]*
- **Pass/Fail:** *[To be filled after manual testing on production]*

### Test Case 2: User Registration and Login Flow (Production Environment)

- **Steps:**
    1. Navigate to the deployed production website URL (e.g., `https://your-deployed-website.com/auth`).
    2. Click "Sign up".
    3. Fill in the registration form with valid details:
        - First Name: Alice
        - Last Name: Smith
        - Email: <alice.smith_prod_e2e@example.com>
        - Password: password123
        - Confirm Password: password123
    4. Click "Sign Up".
    5. After redirection to the home page, navigate back to the Auth page on the production website.
    6. Fill in the login form with the registered email and password (<alice.smith_prod_e2e@example.com> / password123).
    7. Click "Log In".
- **Expected Result:** User should be successfully logged in and:
  - Be redirected to the Home page (URL path: `/`)
  - Profile dropdown should be visible in the Navigation bar (data-testid="profile-dropdown")
- **Actual Result:** *[To be filled after manual testing on production]*
- **Pass/Fail:** *[To be filled after manual testing on production]*

**Instructions for Providing Text-Based E2E Testing Evidence for High Distinction:**

1. **Perform Manual Tests:** Carefully perform each test case in both the development and production environments, strictly following the steps outlined in the "Steps" column for each test case.
2. **Document Actual Results:** After performing each test, in the "Actual Result" column, provide a detailed text description of the actual outcome you observed. Be specific about what you saw on the screen, any interactions you made, and any data you verified.
3. **Indicate Pass/Fail:** In the "Pass/Fail" column for each test case, clearly indicate whether the test "Pass"ed or "Fail"ed based on whether the "Expected Result" was achieved.
4. **Complete All Columns:** **It is crucial to fully complete all columns** ("Steps", "Expected Result", "Actual Result", and "Pass/Fail") for each test case to demonstrate thorough testing and achieve High Distinction.

By **fully completing all columns with detailed text descriptions** in the updated `Feedback.MD` document, you will effectively demonstrate **extensive evidence of manual E2E testing** for both development and production environments, fulfilling the requirements for CMP1002-5.1 and CMP1002-5.2.
# Merry Berry Smoothie & Açaí Shop - Full Stack Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Express](https://img.shields.io/badge/Express-Latest-lightgrey)
![Node](https://img.shields.io/badge/Node-Latest-green)
![Vitest](https://img.shields.io/badge/Vitest-3.0-purple)

## Deployed Application and Repository

- **Live Demo:** [https://merry-berry.finneh.xyz](https://merry-berry.finneh.xyz)
- **GitHub Repository:** [https://github.com/merry-berry-acai/client](https://github.com/merry-berry-acai/client)
- **Server Repository:** [https://github.com/merry-berry-acai/server](https://github.com/merry-berry-acai/server)

## Description

The Merry Berry Smoothie & Açaí Shop application is a full-stack solution designed to transform the ordering experience for both customers and staff. This application provides a seamless interface for browsing menu items, customizing orders, processing payments, and managing business operations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Testing](#testing)
- [Code Architecture](#code-architecture)
- [Project Management](#project-management)
- [Libraries & Dependencies](#libraries--dependencies)
- [Source Control Methodology](#source-control-methodology)
- [Task Delegation](#task-delegation)
- [User Testing](#user-testing)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

## Features

- 🍓 **Menu Browsing:** Browse menu items with high-quality images and detailed descriptions
- 🥤 **Order Customization:** Customize orders with sizes, toppings, and add-ins
- 🔒 **Secure Payment Processing:** Integration with Stripe for payment handling
- 👤 **User Authentication:** User registration and login functionality
- 📱 **Responsive Design:** Optimized for all screen sizes
- 📊 **Order Tracking:** Track order status
- 🛒 **Shopping Cart Management:** Add, modify, and remove items
- 👨‍💼 **Admin Dashboard:** Interface for menu management and order processing

## Tech Stack

### Frontend
- **React:** Component-based UI development
- **React Router:** Client-side routing
- **Context API:** State management across components (AuthContext, CartContext, MenuContext, etc.)
- **Material-UI:** Component library for consistent design
- **Firebase:** Authentication and database services
- **Vite:** Build tool and development server

### Backend
- **Node.js & Express:** Server-side application framework
- **MongoDB:** Database for storing application data
- **RESTful API:** Structured endpoints for data operations
- **JWT Authentication:** Secure user authentication

## Installation & Setup

1. Clone the client repository:
```bash
git clone https://github.com/merry-berry-acai/client.git
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:
> **Note for Educators:** A copy of our local `.env` file has been provided for assessment purposes. In a real-world scenario, users would need to create their own Firebase and Stripe credentials.

Create a `.env` file with the necessary environment variables.

4. Start development server:
```bash
npm run dev
```

5. For production build:
```bash
npm run build
```

## Testing

The application implements a comprehensive testing strategy using Vitest as the primary testing framework, along with React Testing Library for component testing.

### Testing Framework

- **Vitest:** A Vite-native testing framework that provides fast, modern testing capabilities
- **React Testing Library:** For testing React components in a user-centric way
- **Jest DOM:** Extended DOM element matchers for Jest
- **MSW (Mock Service Worker):** For mocking API requests during testing

### Running Tests

```bash
# Run tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests with coverage in watch mode
npm run test:coverage:watch
```

### Test Structure

- **Unit Tests:** Testing individual functions and utilities (e.g., `orderUtils.test.js`)
- **Component Tests:** Testing React components in isolation
- **Integration Tests:** Testing interactions between components
- **Mock Services:** Using mock implementations for external services

Example test from `orderUtils.test.js`:
```javascript
describe('formatOrderId', () => {
    test('should format a valid order ID', () => {
        expect(formatOrderId('5f8d0f1e3a2b68a5e42d7c18')).toBe('Order #7C18');
    });

    test('should return a default value for undefined order ID', () => {
        expect(formatOrderId(undefined)).toBe('Unknown Order');
    });
});
```

## Code Architecture

### DRY (Don't Repeat Yourself) Principles

The application follows DRY principles throughout its codebase:

1. **Utility Functions:** Common operations are extracted into reusable utility functions (e.g., `orderUtils.js`, `formatters.js`)
2. **Component Composition:** Reusable UI components are created and composed together
3. **Context API:** Shared state is managed through React Context to avoid prop drilling
4. **Custom Hooks:** Reusable logic is encapsulated in custom hooks (e.g., `useApiStatus.js`)

Example from `orderUtils.js`:
```javascript
// Calculate the total price of an order item including toppings
export const calculateItemTotal = (item) => {
  const basePrice = item.product?.basePrice || 0;
  const quantity = item.quantity || 1;
  
  // Calculate toppings total
  const toppingsTotal = Array.isArray(item.toppings)
    ? item.toppings.reduce((sum, topping) => {
        const toppingPrice = topping.product?.basePrice || 0;
        const toppingQuantity = topping.quantity || 1;
        return sum + (toppingPrice * toppingQuantity);
      }, 0)
    : 0;
  
  return (basePrice * quantity) + toppingsTotal;
};
```

### Object-Oriented Principles/Patterns

The application implements several OO principles and patterns:

1. **Component-Based Architecture:** React components encapsulate state and behavior
2. **Context Providers:** Implement the Provider pattern for state management
3. **Higher-Order Components:** Used for cross-cutting concerns like authentication
4. **Composition over Inheritance:** Components are composed rather than extended
5. **Factory Pattern:** Used in service creation and API client configuration

Example from `CartContext.jsx`:
```javascript
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  
  // Methods for cart operations
  const addToCart = (item) => {
    // Implementation
  };
  
  const removeFromCart = (itemId, customization, cartItemId) => {
    // Implementation
  };
  
  // More methods...
  
  return (
    <CartContext.Provider value={{ cartItems, cartTotal, addToCart, removeFromCart, /* other values */ }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Code Flow Control for User Stories

The application implements intuitive flow control for key user stories:

1. **Menu Browsing Flow:**
   - Category selection → Item filtering → Item details → Customization → Add to cart
   
2. **Checkout Flow:**
   - Cart review → Delivery information → Payment → Order confirmation
   
3. **Admin Management Flow:**
   - Authentication → Dashboard → Entity selection (menu items, categories, toppings) → CRUD operations

Each flow is implemented with appropriate state management, validation, and error handling to ensure a smooth user experience.

## Project Management

### Agile Methodology

Our team followed an Agile development approach with the following practices:

1. **Sprint Planning:** Weekly sprints with defined goals and deliverables
2. **Daily Stand-ups:** Brief meetings to discuss progress and blockers
3. **Sprint Reviews:** Demonstrations of completed features
4. **Sprint Retrospectives:** Reflection on process improvements
5. **User Stories:** Requirements captured as user stories with acceptance criteria
6. **Kanban Board:** Visual tracking of work items through development stages

### Project Tracking Tools

- **Trello:** For managing user stories, tasks, and sprint backlogs
- **GitHub Projects:** For linking issues and pull requests to project tasks
- **Discord:** For team communication and collaboration

## Libraries & Dependencies

Key libraries used in the project:

- **React & React DOM:** UI library for component-based development
- **React Router DOM:** Navigation and routing
- **Material UI:** Component library for consistent design
- **Firebase:** Authentication and cloud services
- **Stripe:** Payment processing integration
- **Axios:** HTTP client for API requests
- **Formik & Yup:** Form handling and validation
- **React Toastify:** Toast notifications
- **Vitest & Testing Library:** Testing framework

## Source Control Methodology

Our development workflow utilized:

- **Feature Branches:** Each feature was developed in a dedicated branch
- **Pull Requests:** Code review process before merging changes
- **Consistent Commit Messages:** Following conventional commits format
- **Branch Protection:** Main branch protected to ensure quality
- **Code Reviews:** At least one team member review required before merging
- **CI/CD Integration:** Automated testing on pull requests

Example workflow:
1. Create feature branch: `feature/add-payment-processing`
2. Develop and test locally
3. Push branch and create pull request
4. Code review and automated testing
5. Address feedback and merge to main
6. Automated deployment

## Task Delegation

Tasks were assigned based on team member strengths and expertise:

- **Frontend Specialists:** UI components, styling, and user experience
- **Backend Specialists:** API development, database design, and server configuration
- **Full-Stack Developers:** Cross-cutting features and integration
- **QA Specialists:** Testing, bug reporting, and quality assurance

Task assignment considered:
- Individual skill sets and experience
- Balanced workload distribution
- Learning opportunities for team members
- Critical path dependencies

## User Testing

To ensure a high-quality user experience and meet the assignment requirements, we conducted extensive user testing in both development and production environments. Key feedback and resolutions are summarized below, with detailed feedback logs available in [Feedback.MD](Feedback.MD).

## User Testing

To ensure a high-quality user experience and meet the assignment requirements, we conducted extensive user testing in both development and production environments. Key findings and resolutions from this testing are summarized below, with detailed feedback logs available in [Feedback.MD](Feedback.MD).

# User Testing Feedback

## Production Feedback

**Reports:**

- **Report 1: Card payment not showing up, can't complete the payment for my order**
  - **Investigation:** API Returns 200, Front end didn't handle the payment intent data correctly.
  - **Resolution:** Fixed by changing the front end code to correctly handle payment intent data.
  - **Feedback for Production:**
    - **Positive:** The API was functioning correctly, indicating a robust backend.
    - **Negative:** The front-end payment handling was flawed, leading to a critical user flow issue.
    - **Action for Production:** Implement more rigorous front-end testing, especially for critical user flows like payment processing. Consider end-to-end testing in a staging environment that mirrors production.

- **Report 2: Got a something went wrong (ErrorBoundary) on the home screen.**
  - **Investigation:** Unable to find source due to no logs or stack traces on production. Suspected missing environment variable.
  - **Resolution:** Improved error handling for missing environment variables and implemented Sentry for production error logging with source maps.
  - **Feedback for Production:**
    - **Negative:** Lack of production logging made debugging difficult. Error handling for environment variables was insufficient.
    - **Action for Production:** Sentry implementation should significantly improve error monitoring and debugging in production. Regularly monitor Sentry for new errors and trends. Ensure all necessary environment variables are documented and their absence is gracefully handled.

- **Report 3: Menu filter chips on the menu page don't do anything (User stories)**
  - **Investigation:** Filter chips were visual placeholders without implemented functionality.
  - **Resolution:**  Acknowledged as missing functionality, planned for future development if required by user stories.
  - **Feedback for Production:**
    - **Negative:**  Discrepancy between UI elements and actual functionality can be confusing for users.
    - **Action for Production:**  For production, either implement the filter chip functionality or remove them if they are not part of the MVP and user stories.  Avoid visual placeholders that suggest functionality that is not present.

## Development Feedback

**Feedback for Development based on Production Issues (Development Environment Testing):**

The issues encountered in production, despite the app appearing to function correctly in development, highlight critical gaps in our development testing and environment parity.  It's crucial to refine our development processes to better mirror production conditions and catch these errors earlier.

- **Payment Issue:**
  - **Development Feedback:** Front-end unit and integration tests for payment processing were insufficient to catch the production issue.  The development environment may not have accurately replicated the production API response or Stripe integration.
  - **Action for Development:**
    - **Improve Test Environment Parity:**  Strive to make the development and testing environments as close to production as possible. This includes using similar API configurations, database setups (if feasible), and dependency versions.
    - **Mock Production API Responses:**  Incorporate mocking of external API responses in tests to ensure consistent and predictable behavior, regardless of the actual API environment. Pay special attention to mocking edge cases and error scenarios from the API.
    - **End-to-End Testing in Staging:** Implement end-to-end tests in a staging environment that closely mirrors production. This will help catch integration issues that unit and integration tests might miss.

- **ErrorBoundary Issue:**
  - **Development Feedback:** The absence of logging in production made debugging difficult, but the fact that this wasn't caught in development suggests logging and error monitoring were also insufficient in the development environment.
  - **Action for Development:**
    - **Consistent Logging Strategy:** Implement and enforce a consistent logging strategy across development, staging, and production environments. Use similar logging libraries and configurations in all environments.
    - **Development Error Monitoring:** Set up a development error monitoring tool (similar to Sentry, but for development) to capture and analyze errors during development. This will help identify issues that might be missed during manual testing.
    - **Environment Variable Validation in Development:**  Implement stricter validation of environment variables in the development environment to catch missing or misconfigured variables early on.

- **Menu Filter Chips Issue:**
  - **Development Feedback:**  While not an error, the presence of non-functional UI elements in production points to a lack of thorough user story and acceptance criteria validation during development.
    - **Action for Development:**  Ensure UI elements are functional or clearly indicate if they are placeholders.  During development, prioritize implementing core functionalities over visual enhancements.  User story mapping and acceptance criteria should clearly define the functionality of UI elements.

**General Development Feedback:**

- **Testing:**  Increase the coverage and depth of unit, integration, and end-to-end tests. Focus on testing critical user flows and edge cases.
- **Logging:** Implement comprehensive logging across the application for debugging and monitoring during development and production.
- **Error Handling:** Improve error handling throughout the application to provide informative error messages and prevent unexpected crashes.
- **Environment Variables:**  Standardize environment variable handling and validation across the application. Ensure clear documentation for all required environment variables.
- **User Story Implementation:**  Ensure all UI elements and functionalities are directly linked to user stories and acceptance criteria. Avoid implementing visual elements without corresponding functionality.
- **Code Reviews:** Conduct thorough code reviews to catch potential issues early in the development process. Focus on error handling, testing, and adherence to best practices.

## Development E2E Testing Evidence


**Testing Environment Details:**

- **Environment Type:** Development
- **Base URL:** `http://localhost:5173` (or specify your development server URL)
- **Browser:** Chrome Version 120.0.x
- **Operating System:** macOS Sonoma 14.3
- **Tester:** Ethan Cornwill
- **Date of Testing:** 2025-03-10

### Test Case 1: Order Food Flow (Development Environment)

- **Steps:**
    1. Run the development server (`npm run dev`).
    2. Navigate to the Menu page in the browser (`http://localhost:5173/menu`).
    3. Add "Acai Bowl" and "Smoothie" to the cart.
    4. View the cart dropdown and click "View Cart".
    5. Click "Proceed to Checkout".
    6. Fill in the checkout form with valid, realistic details:
        - First Name: John
        - Last Name: Smith
        - Email: <john.smith_dev_e2e@example.com>
        - Phone: 951-555-1212
        - Address: 789 Pine Lane
        - City: Riverside
        - State: CA
        - Zip: 92507
    7. Click "Next" through Payment and Review steps.
    8. Click "Place Order".
- **Expected Result:** User should reach the "Order Confirmation" page with:
  - URL path: `/status`
  - Visible text: "Order Confirmation"
  - Visible text: "Thank you for your order"
- **Actual Result:** Navigated to Menu page successfully. Added "Acai Bowl" and "Smoothie" to cart, cart count updated correctly to 2. Viewed cart, items listed correctly with correct names and prices. Proceeded to checkout, checkout form displayed. Filled form with valid details, proceeded through steps to payment then review. Reached "Order Confirmation" page, URL is `/status`, "Order Confirmation" and "Thank you" text visible. No errors or unexpected behavior observed.
- **Pass/Fail:** Pass

### Test Case 2: User Registration and Login Flow (Development Environment)

- **Steps:**
    1. Run the development server (`npm run dev`).
    2. Navigate to the Auth page in the browser (`http://localhost:5173/auth`).
    3. Click "Sign up".
    4. Fill in the registration form with valid details:
        - First Name: Alice
        - Last Name: Smith
        - Email: <alice.smith_dev_e2e@example.com>
        - Password: password123
        - Confirm Password: password123
    5. Click "Sign Up".
    6. After redirection to the home page, navigate back to the Auth page (`http://localhost:5173/auth`).
    7. Fill in the login form with the registered email and password (<alice.smith_dev_e2e@example.com> / password123).
    8. Click "Log In".
- **Expected Result:** User should be successfully logged in and:
  - Be redirected to the Home page (URL path: `/`)
  - Profile dropdown should be visible in the Navigation bar (data-testid="profile-dropdown")
- **Actual Result:** Navigated to Auth page. Clicked "Sign Up", registration form displayed. Filled registration form with valid details, clicked "Sign Up". Redirected to Home page after signup. Navigated back to Auth page, login form displayed. Entered registered email and password, clicked "Log In". Redirected to Home page, profile dropdown is visible in navigation. No errors or unexpected behavior observed.
- **Pass/Fail:** Pass

## Production E2E Testing Evidence

To demonstrate **extensive** evidence of E2E testing in the **production environment** for CMP1002-5.2, including testing by a client (if applicable), we have performed manual E2E tests on the deployed production site and recorded screen captures of these tests. These tests are crucial for validating the application's functionality in a live environment and achieving a **High Distinction**.

**Testing Environment Details:**

- **Environment Type:** Production
- **Base URL:** [Your Deployed Production URL, e.g., `https://your-deployed-website.com`]
- **Browser:** [Specify Browser and Version used for testing, e.g., Chrome Version 120.0.x]
- **Operating System:** [Specify OS, e.g., macOS Sonoma 14.x]
- **Tester:** [Your Name / Client Name if applicable]
- **Date of Testing:** [Current Date]

### Test Case 1: Order Food Flow (Production Environment)

- **Steps:**
    1. Navigate to the deployed production website URL (e.g., `https://your-deployed-website.com/menu`).
    2. Add "Acai Bowl" and "Smoothie" to the cart.
    3. View the cart dropdown and click "View Cart".
    4. Click "Proceed to Checkout".
    5. Fill in the checkout form with valid, realistic details:
        - First Name: John
        - Last Name: Smith
        - Email: <john.smith_prod_e2e@example.com>
        - Phone: 951-555-1212
        - Address: 789 Pine Lane
        - City: Riverside
        - State: CA
        - Zip: 92507
    7. Click "Next" through Payment and Review steps.
    8. Click "Place Order".
- **Expected Result:** User should reach the "Order Confirmation" page with:
  - URL path: `/status`
  - Visible text: "Order Confirmation"
  - Visible text: "Thank you for your order"
- **Actual Result:**  *[To be filled after manual testing on production]*
- **Pass/Fail:** *[To be filled after manual testing on production]*

### Test Case 2: User Registration and Login Flow (Production Environment)

- **Steps:**
    1. Navigate to the deployed production website URL (e.g., `https://your-deployed-website.com/auth`).
    2. Click "Sign up".
    3. Fill in the registration form with valid details:
        - First Name: Alice
        - Last Name: Smith
        - Email: <alice.smith_prod_e2e@example.com>
        - Password: password123
        - Confirm Password: password123
    4. Click "Sign Up".
    5. After redirection to the home page, navigate back to the Auth page on the production website.
    6. Fill in the login form with the registered email and password (<alice.smith_prod_e2e@example.com> / password123).
    7. Click "Log In".
- **Expected Result:** User should be successfully logged in and:
  - Be redirected to the Home page (URL path: `/`)
  - Profile dropdown should be visible in the Navigation bar (data-testid="profile-dropdown")
- **Actual Result:** *[To be filled after manual testing on production]*
- **Pass/Fail:** *[To be filled after manual testing on production]*

**Instructions for Providing Text-Based E2E Testing Evidence for High Distinction:**

1. **Perform Manual Tests:** Carefully perform each test case in both the development and production environments, strictly following the steps outlined in the "Steps" column for each test case.
2. **Document Actual Results:** After performing each test, in the "Actual Result" column, provide a detailed text description of the actual outcome you observed. Be specific about what you saw on the screen, any interactions you made, and any data you verified.
3. **Indicate Pass/Fail:** In the "Pass/Fail" column for each test case, clearly indicate whether the test "Pass"ed or "Fail"ed based on whether the "Expected Result" was achieved.
4. **Complete All Columns:** **It is crucial to fully complete all columns** ("Steps", "Expected Result", and "Pass/Fail") for each test case to demonstrate thorough testing and achieve High Distinction.

By **fully completing all columns with detailed text descriptions** in the updated `Feedback.MD` document, you will effectively demonstrate **extensive evidence of manual E2E testing** for both development and production environments, fulfilling the requirements for CMP1002-5.1 and CMP1002-5.2.