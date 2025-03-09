import React from 'react';
import { render } from '@testing-library/react';
import MenuPage from './MenuPage';
import { BrowserRouter } from 'react-router-dom';
import { MenuContext } from '../contexts/MenuContext';

describe('MenuPage', () => {
  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <MenuContext.Provider value={{ menuItems: [], categories: [] }}>
          <MenuPage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
  });

  it('renders "Our Menu" heading', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ menuItems: [], categories: [] }}>
          <MenuPage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const headingElement = getByRole('heading', { name: /Our Menu/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders search bar', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ menuItems: [], categories: [] }}>
          <MenuPage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const searchBarElement = getByRole('textbox', { name: /Search for items/i });
    expect(searchBarElement).toBeInTheDocument();
  });

  it('renders category sidebar', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ menuItems: [], categories: [] }}>
          <MenuPage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const categorySidebar = getByRole('navigation', { name: /category-sidebar/i });
    expect(categorySidebar).toBeInTheDocument();
  });

  it('renders menu items grid', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <MenuContext.Provider value={{ menuItems: [], categories: [] }}>
          <MenuPage />
        </MenuContext.Provider>
      </BrowserRouter>
    );
    const menuItemsGrid = getByRole('region', { name: /menu-items-grid/i });
    expect(menuItemsGrid).toBeInTheDocument();
  });
});
