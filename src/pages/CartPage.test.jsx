import React from 'react';
import { render } from '@testing-library/react';
import CartPage from './CartPage';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

describe('CartPage', () => {
  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <CartContext.Provider value={{ cartItems: [], clearCart: () => {} }}>
          <CartPage />
        </CartContext.Provider>
      </BrowserRouter>
    );
  });

  it('renders "Your Shopping Cart" heading', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <CartContext.Provider value={{ cartItems: [], clearCart: () => {} }}>
          <CartPage />
        </CartContext.Provider>
      </BrowserRouter>
    );
    const headingElement = getByRole('heading', { name: /Your Shopping Cart/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders "Your Cart is Empty" message when cart is empty', () => {
    const { getByText } = render(
      <BrowserRouter>
        <CartContext.Provider value={{ cartItems: [], clearCart: () => {} }}>
          <CartPage />
        </CartContext.Provider>
      </BrowserRouter>
    );
    const emptyCartMessage = getByText(/Your Cart is Empty/i);
    expect(emptyCartMessage).toBeInTheDocument();
  });

  it('renders "Browse Our Menu" button in empty cart state', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <CartContext.Provider value={{ cartItems: [], clearCart: () => {} }}>
          <CartPage />
        </CartContext.Provider>
      </BrowserRouter>
    );
    const browseMenuButton = getByRole('button', { name: /Browse Our Menu/i });
    expect(browseMenuButton).toBeInTheDocument();
  });
});
