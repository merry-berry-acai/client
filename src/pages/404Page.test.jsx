import React from 'react';
import { render } from '@testing-library/react';
import PageNotFound from './404Page';

describe('404Page', () => {
  it('renders without errors', () => {
    render(<PageNotFound />);
  });

  it('renders 404 heading', () => {
    const { getByRole } = render(<PageNotFound />);
    const headingElement = getByRole('heading', { name: /404/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders "Page Not Found" text', () => {
    const { getByRole } = render(<PageNotFound />);
    const textElement = getByRole('heading', { name: /Page Not Found/i });
    expect(textElement).toBeInTheDocument();
  });

  it('renders "Back to Home" button', () => {
    const { getByRole } = render(<PageNotFound />);
    const buttonElement = getByRole('button', { name: /Back to Home/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
