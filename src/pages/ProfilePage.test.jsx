import React from 'react';
import { render } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SnackbarContext } from '../contexts/SnackbarContext';

describe('ProfilePage', () => {
  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: { uid: 'testUser' }, authToken: 'testToken' }}>
          <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
            <ProfilePage />
          </SnackbarContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  });

  it('renders "My Profile" heading', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: { uid: 'testUser' }, authToken: 'testToken' }}>
          <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
            <ProfilePage />
          </SnackbarContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const headingElement = getByRole('heading', { name: /My Profile/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders "Order History" section', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: { uid: 'testUser' }, authToken: 'testToken' }}>
          <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
            <ProfilePage />
          </SnackbarContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const orderHistorySection = getByRole('region', { name: /order-history-section/i });
    expect(orderHistorySection).toBeInTheDocument();
  });

  it('renders "Favorite Dishes" section', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: { uid: 'testUser' }, authToken: 'testToken' }}>
          <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
            <ProfilePage />
          </SnackbarContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const favoriteDishesSection = getByRole('region', { name: /favorite-dishes-section/i });
    expect(favoriteDishesSection).toBeInTheDocument();
  });

  it('renders "Support" section', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthContext.Provider value={{ currentUser: { uid: 'testUser' }, authToken: 'testToken' }}>
          <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
            <ProfilePage />
          </SnackbarContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const supportSection = getByRole('region', { name: /support-section/i });
    expect(supportSection).toBeInTheDocument();
  });
});
