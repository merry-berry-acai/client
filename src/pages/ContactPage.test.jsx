import React from 'react';
import { render } from '@testing-library/react';
import ContactPage from './ContactPage';
import { SnackbarContext } from '../contexts/SnackbarContext';

describe('ContactPage', () => {
  it('renders without errors', () => {
    render(
      <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
        <ContactPage />
      </SnackbarContext.Provider>
    );
  });

  it('renders "Contact Us" heading', () => {
    const { getByRole } = render(
      <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
        <ContactPage />
      </SnackbarContext.Provider>
    );
    const headingElement = getByRole('heading', { name: /Contact Us/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders contact information sections', () => {
    const { getByRole, getByText } = render(
      <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
        <ContactPage />
      </SnackbarContext.Provider>
    );
    expect(getByRole('heading', { name: /Get In Touch/i })).toBeInTheDocument();
    expect(getByText(/123 Smoothie Lane/i)).toBeInTheDocument(); // Location
    expect(getByText(/Monday - Friday: 8am - 8pm/i)).toBeInTheDocument(); // Business Hours
    expect(getByText(/hello@merryberry.example/i)).toBeInTheDocument(); // Email
    expect(getByText(/\(07\) 1234 5678/i)).toBeInTheDocument(); // Phone
  });

  it('renders contact form', () => {
    const { getByRole } = render(
      <SnackbarContext.Provider value={{ showSuccess: () => {}, showError: () => {} }}>
        <ContactPage />
      </SnackbarContext.Provider>
    );
    expect(getByRole('heading', { name: /Send Us a Message/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /Your Name/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /Your Email/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /Subject/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /Your Message/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });
});
