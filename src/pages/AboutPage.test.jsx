import React from 'react';
import { render } from '@testing-library/react';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders without errors', () => {
    render(<AboutPage />);
  });

  it('renders "About Merry Berry" heading', () => {
    const { getByRole } = render(<AboutPage />);
    const headingElement = getByRole('heading', { name: /About Merry Berry/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the mission statement', () => {
    const { getByText } = render(<AboutPage />);
    const missionStatement = getByText(/At Merry Berry, we're dedicated to serving the finest smoothies and bowls/i);
    expect(missionStatement).toBeInTheDocument();
  });

  it('renders "Visit Us Today" section', () => {
    const { getByRole, getByText } = render(<AboutPage />);
    const headingElement = getByRole('heading', { name: /Visit Us Today/i });
    const visitHours = getByText(/Monday - Friday: 8am - 8pm/i);
    expect(headingElement).toBeInTheDocument();
    expect(visitHours).toBeInTheDocument();
  });
});
