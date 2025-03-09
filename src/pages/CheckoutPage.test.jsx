import React from 'react';
import { render } from '@testing-library/react';
import CheckoutPage from './CheckoutPage';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

describe('CheckoutPage', () => {
  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: null, authToken: null }}>
          <CartContext.Provider value={{ cartItems: [], clearCart: () => {} }}>
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  });

  it('renders checkout stepper', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: null, authToken: null }}>
          <CartContext.Provider value={{ cartItems: [], clearCart: () => {} }}>
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const stepperElement = getByRole('progressbar');
    expect(stepperElement).toBeInTheDocument();
  });

  it('renders "Review order" step label', () => {
    const { getByText } = render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: null, authToken: null }}>
          <CartContext.Provider value={{ cartItems: [], clearCart: () => {} }}>
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const reviewOrderLabel = getByText(/Review order/i);
    expect(reviewOrderLabel).toBeInTheDocument();
  });
});
