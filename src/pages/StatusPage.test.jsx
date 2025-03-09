import React from 'react';
import { render } from '@testing-library/react';
import StatusPage from './StatusPage';

describe('StatusPage', () => {
  it('renders without errors', () => {
    render(<StatusPage />);
  });

  it('renders "System Status" heading', () => {
    const { getByRole } = render(<StatusPage />);
    const headingElement = getByRole('heading', { name: /System Status/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders API status section', () => {
    const { getByText } = render(<StatusPage />);
    const apiStatusText = getByText(/API Status:/i);
    expect(apiStatusText).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    const { getByRole } = render(<StatusPage />);
    const refreshButton = getByRole('button', { name: /Refresh/i });
    expect(refreshButton).toBeInTheDocument();
  });
});
