import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PageNotFound from './404Page'; 

// Mock the Layout component
vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout-mock">{children}</div>
}));

describe('PageNotFound Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    // Check if the component renders within the Layout
    expect(screen.getByTestId('layout-mock')).toBeInTheDocument();
  });

  it('displays the correct error message and code', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    // Check for 404 text
    expect(screen.getByText('404')).toBeInTheDocument();
    
    // Check for "Page Not Found" heading
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    
    // Check for the explanation text
    expect(screen.getByText(/The page you're looking for doesn't exist or has been moved./i)).toBeInTheDocument();
  });

  it('renders the sad face icon', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    // Check for the SentimentDissatisfiedIcon by its testid
    const icon = screen.getByTestId('SentimentDissatisfiedIcon');
    expect(icon).toBeInTheDocument();
  });

  it('has a working "Back to Home" button with correct link', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    // Find the "Back to Home" link - MUI renders Button as an anchor when using Link
    const homeLink = screen.getByText(/back to home/i);
    expect(homeLink).toBeInTheDocument();
    
    // Check that it links to the home page - verify href attribute
    const linkElement = homeLink.closest('a');
    expect(linkElement).toHaveAttribute('href', '/');
    
    // Verify home icon is present
    const homeIcon = screen.getByTestId('HomeIcon');
    expect(homeIcon).toBeInTheDocument();
  });

  it('applies the correct styling', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    // Check for the paper component with elevation
    const paperElement = screen.getByText('404').closest('div');
    expect(paperElement).toBeInTheDocument();
    expect(paperElement).toHaveClass('MuiPaper-elevation3');
    
    // Check for heading styles
    const heading = screen.getByText('404');
    expect(heading).toHaveClass('MuiTypography-h1');
    
    const subheading = screen.getByText('Page Not Found');
    expect(subheading).toHaveClass('MuiTypography-h4');
    
    // Check for the link element with secondary color
    const linkElement = screen.getByText(/back to home/i).closest('a');
    expect(linkElement).toHaveClass('MuiButton-containedSecondary');
    expect(linkElement).toHaveClass('MuiButton-sizeLarge');
    
    // Check icon container
    const iconContainer = linkElement.querySelector('.MuiButton-startIcon');
    expect(iconContainer).toBeInTheDocument();
  });
});