import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>
}));

vi.mock('../components/admin/ItemManager', () => ({
  default: () => <div data-testid="item-manager">Item Manager Component</div>
}));

vi.mock('../components/admin/CategoryManager', () => ({
  default: () => <div data-testid="category-manager">Category Manager Component</div>
}));

vi.mock('../components/admin/ToppingManager', () => ({
  default: () => <div data-testid="topping-manager">Topping Manager Component</div>
}));

vi.mock('../components/admin/UserManagement', () => ({
  UserManagement: () => <div data-testid="user-management">User Management Component</div>
}));

vi.mock('../components/EducatorNote', () => ({
  default: ({ children, sx }) => <div data-testid="educator-note">{children}</div>
}));

const mockUseApiDebug = vi.fn();
vi.mock('../components/admin/common/ApiDebugPanel', () => ({
  default: () => <div data-testid="api-debug-panel">API Debug Panel</div>,
  useApiDebug: () => mockUseApiDebug()
}));

vi.mock('../components/admin/common/ApiDebugProvider', () => ({
  default: ({ children }) => <div data-testid="api-debug-provider">{children}</div>
}));

import AdminPage from './AdminPage';

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApiDebug.mockReturnValue({ debugMode: false });
  });
  
  it('renders the admin dashboard with the item manager tab active by default', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    
    expect(screen.getByTestId('educator-note')).toBeInTheDocument();
    expect(screen.getByTestId('item-manager')).toBeInTheDocument();
    
    expect(screen.queryByTestId('category-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('topping-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-management')).not.toBeInTheDocument();
  });
  
  it('switches to category manager when Categories tab is clicked', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Categories'));
    
    expect(screen.getByTestId('category-manager')).toBeInTheDocument();
    
    expect(screen.queryByTestId('item-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('topping-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-management')).not.toBeInTheDocument();
  });
  
  it('switches to topping manager when Toppings tab is clicked', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Toppings'));
    
    expect(screen.getByTestId('topping-manager')).toBeInTheDocument();
    
    expect(screen.queryByTestId('item-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('category-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-management')).not.toBeInTheDocument();
  });
  
  it('switches to user management when Users tab is clicked', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Users'));
    
    expect(screen.getByTestId('user-management')).toBeInTheDocument();
    
    expect(screen.queryByTestId('item-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('category-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('topping-manager')).not.toBeInTheDocument();
  });
  
  it('renders API debug panel when debug mode is true', () => {
    mockUseApiDebug.mockReturnValue({ debugMode: true });
    
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    
    const debugPanels = screen.getAllByTestId('api-debug-panel');
    expect(debugPanels.length).toBeGreaterThan(1); 
  });
  
  it('does not render additional API debug panel when debug mode is false', () => {
    mockUseApiDebug.mockReturnValue({ debugMode: false });
    
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    
    const debugPanels = screen.getAllByTestId('api-debug-panel');
    expect(debugPanels.length).toBe(1);
  });
  
  it('wraps the main content with ApiDebugProvider', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('api-debug-provider')).toBeInTheDocument();
    
    const provider = screen.getByTestId('api-debug-provider');
    expect(within(provider).getByText('Admin Dashboard')).toBeInTheDocument();
  });
});