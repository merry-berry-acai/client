import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './HomePage';
import { BrowserRouter } from 'react-router-dom';
import { MenuContext } from '../contexts/MenuContext';

describe('HomePage', () => {
  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <MenuContext.Provider value={{ featuredItems: [] }}>
          <HomePage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
  });

  it('renders "Craft Your Perfect Bowl" heading', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ featuredItems: [] }}>
          <HomePage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const headingElement = getByRole('heading', { name: /Craft Your Perfect Bowl/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders hero section text', () => {
    const { getByText } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ featuredItems: [] }}>
          <HomePage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const heroText = getByText(/Fresh ingredients, endless combinations, made with love/i);
    expect(heroText).toBeInTheDocument();
  });

  it('renders "Start Your Order" button', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ featuredItems: [] }}>
          <HomePage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const startOrderButton = getByRole('button', { name: /Start Your Order/i });
    expect(startOrderButton).toBeInTheDocument();
  });

  it('renders "Most Popular Creations" heading', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ featuredItems: [] }}>
          <HomePage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const popularHeading = getByRole('heading', { name: /Most Popular Creations/i });
    expect(popularHeading).toBeInTheDocument();
  });

  it('renders "View Full Menu" button', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ featuredItems: [] }}>
          <HomePage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const fullMenuButton = getByRole('button', { name: /View Full Menu/i });
    expect(fullMenuButton).toBeInTheDocument();
  });
});
