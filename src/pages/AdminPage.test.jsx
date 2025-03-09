import React from 'react';
import { render } from '@testing-library/react';
import AdminPage from './AdminPage';

describe('AdminPage', () => {
  it('renders without errors', () => {
    render(<AdminPage />);
  });

  it('renders "Admin Dashboard" heading', () => {
    const { getByRole } = render(<AdminPage />);
    const headingElement = getByRole('heading', { name: /Admin Dashboard/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders navigation links in sidebar', () => {
    const { getByRole } = render(<AdminPage />);
    const menuItemsLink = getByRole('button', { name: /Menu Items/i });
    const categoriesLink = getByRole('button', { name: /Categories/i });
    const toppingsLink = getByRole('button', { name: /Toppings/i });
    const usersLink = getByRole('button', { name: /Users/i });

    expect(menuItemsLink).toBeInTheDocument();
    expect(categoriesLink).toBeInTheDocument();
    expect(toppingsLink).toBeInTheDocument();
    expect(usersLink).toBeInTheDocument();
  });
});
