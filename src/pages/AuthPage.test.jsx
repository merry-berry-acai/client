import React from 'react';
import { render } from '@testing-library/react';
import AuthPage from './AuthPage';
import { BrowserRouter } from 'react-router-dom';

describe('AuthPage', () => {
  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <AuthPage variant="signin" />
      </BrowserRouter>
    );
  });

  it('renders "Welcome Back" heading for signin variant', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthPage variant="signin" />
      </BrowserRouter>
    );
    const headingElement = getByRole('heading', { name: /Welcome Back/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders "Create Account" heading for signup variant', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthPage variant="signup" />
      </BrowserRouter>
    );
    const headingElement = getByRole('heading', { name: /Create Account/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders sign-in link', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthPage variant="signup" />
      </BrowserRouter>
    );
    const signInLink = getByRole('link', { name: /Sign In/i });
    expect(signInLink).toBeInTheDocument();
  });

  it('renders sign-up link', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthPage variant="signin" />
      </BrowserRouter>
    );
    const signUpLink = getByRole('link', { name: /Sign Up/i });
    expect(signUpLink).toBeInTheDocument();
  });

  it('renders Google Sign-in button', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <AuthPage variant="signin" />
      </BrowserRouter>
    );
    const googleSignInButton = getByRole('button', { name: /Sign in with Google/i });
    expect(googleSignInButton).toBeInTheDocument();
  });
});
