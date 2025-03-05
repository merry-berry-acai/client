# Merry Berry Smoothie & Açaí Shop - Full Stack Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18.2-blue)

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
- [Project Management](#project-management)
- [Libraries & Dependencies](#libraries--dependencies)
- [Source Control Methodology](#source-control-methodology)
- [Task Delegation](#task-delegation)
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

### Backend
- **Node.js & Express:** Server-side application framework
- **MongoDB:** Database for storing application data
- **RESTful API:** Structured endpoints for data operations

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

The application includes testing capabilities:

```bash
# Run tests
npm test
```

## Project Management

Our project utilized structured development practices:

- **Agile Methodology:** Iterative development with regular feedback
- **Task Tracking:** Organized task management and assignment
- **Regular Code Reviews:** Maintaining code quality through peer review

## Libraries & Dependencies

Based on the codebase imports:

- **react & react-dom:** UI library for component-based development
- **react-router-dom:** Navigation and routing
- **@mui/material:** Material Design components
- **firebase:** Authentication and cloud services
- **@stripe/react-stripe-js:** Payment processing integration

## Source Control Methodology

Our development workflow utilized:

- **Feature Branches:** Separate branches for different features
- **Pull Requests:** Code review process before merging changes
- **Consistent Commit Messages:** Clear descriptions of changes made

## Task Delegation

Tasks were assigned based on team member strengths and expertise:

- Frontend components and UI implementation
- Backend integration and API connectivity
- Testing and quality assurance
- Deployment and DevOps tasks

## Screenshots

Screenshots of the application are available in the `/docs/screenshots/` directory.

## Future Enhancements

Planned improvements and additions to the application:

- Enhanced user profile management
- Advanced order analytics
- Additional payment methods
- Mobile app development
- Loyalty program implementation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.