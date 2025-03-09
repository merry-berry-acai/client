import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PageNotFound from './404Page'; 

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout-mock">{children}</div>
}));

describe('PageNotFound Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('layout-mock')).toBeInTheDocument();
  });

  it('displays the correct error message and code', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    expect(screen.getByText('404')).toBeInTheDocument();
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    
    expect(screen.getByText(/The page you're looking for doesn't exist or has been moved./i)).toBeInTheDocument();
  });

  it('renders the sad face icon', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
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
    
    const homeLink = screen.getByText(/back to home/i);
    expect(homeLink).toBeInTheDocument();
    
    const linkElement = homeLink.closest('a');
    expect(linkElement).toHaveAttribute('href', '/');
    
    const homeIcon = screen.getByTestId('HomeIcon');
    expect(homeIcon).toBeInTheDocument();
  });

  it('applies the correct styling', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );
    
    const paperElement = screen.getByText('404').closest('div');
    expect(paperElement).toBeInTheDocument();
    expect(paperElement).toHaveClass('MuiPaper-elevation3');
    
    const heading = screen.getByText('404');
    expect(heading).toHaveClass('MuiTypography-h1');
    
    const subheading = screen.getByText('Page Not Found');
    expect(subheading).toHaveClass('MuiTypography-h4');
    
    const linkElement = screen.getByText(/back to home/i).closest('a');
    expect(linkElement).toHaveClass('MuiButton-containedSecondary');
    expect(linkElement).toHaveClass('MuiButton-sizeLarge');
    
    const iconContainer = linkElement.querySelector('.MuiButton-startIcon');
    expect(iconContainer).toBeInTheDocument();
  });
});